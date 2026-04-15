import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // 🆔 Hamara simple tracking ID (Customer ko yahi dikhega)
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    // 🚦 Final Status: 'pending', 'captured', ya 'failed'
    status: {
      type: String,
      enum: ['pending', 'captured', 'failed'],
      default: 'pending',
    },
    // 🚀 Konsa gateway end mein kaam kar gaya
    gatewayUsed: {
      type: String,
      enum: ['razorpay', 'stripe', 'cashfree', 'none'],
      default: 'none',
    },
    // 🆔 Successful transaction ki unique ID
    paymentId: {
      type: String,
    },
    // 🔄 Navigator History: Multiple gateways ko ek hi order ke andar track karega
    attempts: [
      {
        gateway: {
          type: String,
          enum: ['razorpay', 'stripe', 'cashfree'],
        },
        externalOrderId: String, // Gateway ki ID (e.g. pay_...)
        status: {
          type: String,
          enum: ['initiated', 'failed', 'timed_out', 'success'],
          default: 'initiated',
        },
        errorReason: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;