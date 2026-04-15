import Razorpay from "razorpay";
import Stripe from "stripe";
import { Cashfree } from "cashfree-pg";
import Payment from "../models/Payment.js";
import crypto from "crypto";

// 1. Gateway Initializations
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = "SANDBOX";

// 🕒 Timeout Helper (Switching Logic ke liye)
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("GATEWAY_TIMEOUT")), ms))
  ]);
};

// --- 🚀 CREATE ORDER (NAVIGATOR ENGINE) ---
export const createOrder = async (req, res) => {
  const { amount } = req.body;
  const internalOrderId = `NAV-${Date.now()}`;

  // 🛠️ FIX: Use 'new Payment()' instead of 'Payment.create()' to sync with push logic
  const paymentRecord = new Payment({
    user: req.user._id,
    orderId: internalOrderId,
    amount: amount,
    status: 'pending',
    attempts: []
  });

  console.log(`🚀 Navigator Engine Active: ${internalOrderId}`);

  // --- STEP 1: TRY RAZORPAY ---
  try {
    console.log("🔍 Checking Razorpay (1s)...");
    const rzpOrder = await withTimeout(
      razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: internalOrderId }),
      1
    );

    paymentRecord.gatewayUsed = 'razorpay';
    paymentRecord.attempts.push({ gateway: 'razorpay', externalOrderId: rzpOrder.id, status: 'success' });
    await paymentRecord.save(); // 💾 Compass mein yahan dikhega
    return res.status(200).json({ success: true, gateway: "razorpay", order: rzpOrder, navId: internalOrderId });

  } catch (error) {
    console.log("⚠️ Razorpay Bypass: Trying Cashfree...");
    paymentRecord.attempts.push({ 
        gateway: 'razorpay', 
        status: error.message === "GATEWAY_TIMEOUT" ? 'timed_out' : 'failed',
        errorReason: error.message 
    });
  }

  // --- STEP 2: TRY CASHFREE ---
  try {
    console.log("🔍 Checking Cashfree...");
    const cfRequest = {
      order_amount: amount,
      order_currency: "INR",
      order_id: internalOrderId,
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_email: req.user.email,
        customer_phone: "9999999999", 
      },
      };

      order_meta: {
        // User payment ke baad is frontend page pe aayega
        return_url: `${process.env.FRONTEND_URL}/payment-status?navId=${internalOrderId}&cf_order_id=${internalOrderId}`
      }

      const cfResponse = await withTimeout(Cashfree.PGCreateOrder("2023-08-01", cfRequest), 1);

    paymentRecord.gatewayUsed = 'cashfree';
    paymentRecord.attempts.push({ gateway: 'cashfree', externalOrderId: cfResponse.data.order_id, status: 'success' });
    await paymentRecord.save(); // 💾 Compass mein yahan dikhega
    return res.status(200).json({ success: true, gateway: "cashfree", order: cfResponse.data, navId: internalOrderId });

  } catch (error) {// 🚨 Ye line tumhe asli error batayegi terminal mein!

    console.log("⚠️ Cashfree Bypass: Trying Stripe...");
    paymentRecord.attempts.push({ gateway: 'cashfree', status: 'failed', errorReason: error.message });
  }

  // --- STEP 3: TRY STRIPE ---
  try {
    console.log("🔍 Checking Stripe...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: { currency: 'inr', product_data: { name: 'Payment' }, unit_amount: amount * 100 },
        quantity: 1,
      }],
      mode: 'payment',
      client_reference_id: internalOrderId,
     success_url: `${process.env.FRONTEND_URL}/payment-status?navId=${internalOrderId}&gateway=stripe&session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${process.env.FRONTEND_URL}/checkout?status=cancelled`, });

    paymentRecord.gatewayUsed = 'stripe';
    paymentRecord.attempts.push({ gateway: 'stripe', externalOrderId: session.id, status: 'success' });
    await paymentRecord.save(); // 💾 Compass mein yahan dikhega
    return res.status(200).json({ success: true, gateway: "stripe", url: session.url, navId: internalOrderId });

  } catch (error) {
    paymentRecord.status = 'failed';
    paymentRecord.attempts.push({ gateway: 'stripe', status: 'failed', errorReason: error.message });
    await paymentRecord.save();
    res.status(500).json({ success: false, message: "All gateways failed!" });
  }
};

// --- 🛡️ VERIFY PAYMENT (DYNAMIC FOR ALL GATEWAYS) ---
export const verifyPayment = async (req, res) => {
  const { 
    navId, 
    razorpay_order_id, razorpay_payment_id, razorpay_signature, // Razorpay inputs
    cf_order_id, // Cashfree input
    stripe_session_id // Stripe input
  } = req.body;

  try {
    const payment = await Payment.findOne({ orderId: navId });
    if (!payment) return res.status(404).json({ success: false, message: "Order not found" });

    const gateway = payment.gatewayUsed;
    let isVerified = false;
    let finalPaymentId = "";

    // 1️⃣ RAZORPAY VERIFICATION
    if (gateway === 'razorpay') {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");
      if (razorpay_signature === expectedSign) {
        isVerified = true;
        finalPaymentId = razorpay_payment_id;
      }
    } 
    // 2️⃣ CASHFREE VERIFICATION
    else if (gateway === 'cashfree') {
      const cfResponse = await Cashfree.PGOrderFetchPayments("2023-08-01", cf_order_id);
      const successfulPayment = cfResponse.data.find(p => p.payment_status === "SUCCESS");
      if (successfulPayment) {
        isVerified = true;
        finalPaymentId = successfulPayment.cf_payment_id;
      }
    }
    // 3️⃣ STRIPE VERIFICATION
    else if (gateway === 'stripe') {
      const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
      if (session.payment_status === 'paid') {
        isVerified = true;
        finalPaymentId = session.payment_intent;
      }
    }

    // 💾 UPDATE DATABASE
    if (isVerified) {
      payment.status = 'captured';
      payment.paymentId = finalPaymentId;
      await payment.save();
      return res.status(200).json({ success: true, message: "Payment Verified Successfully", paymentId: finalPaymentId });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 📜 TRANSACTION HISTORY ---
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "History fetch failed" });
  }
};