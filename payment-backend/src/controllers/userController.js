import User from '../models/User.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// --- 1. REGISTER USER (Email Send Hoga) ---
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    // 🟢 Frontend yahan password mein "temp_password_123" bhej raha hai jo dummy hai
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); 

    const user = await User.create({
      name, email, password, role: role || 'customer',
      verificationToken, tokenExpiry: expiryTime, 
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const message = `<div style="font-family: Arial;"><h2>Gateway Navigator</h2><p>Link expires in 10 minutes.</p><a href="${verifyUrl}">Verify My Email & Set Password</a></div>`;

    try {
      await sendEmail({ email: user.email, subject: 'Verify your Account', message });
      res.status(201).json({ success: true, message: 'Verification link sent.' });
    } catch (err) {
      user.verificationToken = undefined;
      user.tokenExpiry = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Email could not be sent.' });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// --- 2. VERIFY EMAIL & SET PASSWORD (UPDATED LOGIC) ---
export const verifyEmail = async (req, res) => {
  // 🟢 Ab data req.body se aayega kyunki Frontend se POST request hit ho rahi hai
  const { token, newPassword } = req.body;
  
  // 📝 YE LOGS TERMINAL MEIN DIKHENGE
  console.log("-----------------------------------------");
  console.log("🔍 [DEBUG] Token received:", token);
  console.log("🔐 [DEBUG] New Password received:", newPassword ? "YES" : "NO");

  try {
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide a new password.' });
    }

    // Check 1: Kya token match ho raha hai?
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.log("❌ [DEBUG] Token mismatch! DB mein ye token nahi mila.");
      return res.status(400).json({ success: false, message: 'Link invalid or user not found.' });
    }

    console.log("✅ [DEBUG] User Found:", user.email);

    // Check 2: Kya time expire ho gaya?
    if (user.tokenExpiry < new Date()) {
      console.log("❌ [DEBUG] Time Expired! Verification failed.");
      return res.status(400).json({ success: false, message: 'Link expired.' });
    }

    // 🟢 Sab sahi hai toh PASSWORD SET karo aur Verify karo
    user.password = newPassword; // User.js model ka pre-save isko hash kar dega
    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    console.log("🎉 [DEBUG] Verification & Password Set Successful!");
    console.log("-----------------------------------------");

    res.status(200).json({ success: true, message: 'Account verified and password set!' });
  } catch (error) {
    console.error("🔥 [DEBUG] Server Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- 3. AUTH USER (NO CHANGE) ---
export const authUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (!user.isVerified) return res.status(401).json({ success: false, message: 'Email not verified.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    res.status(200).json({
      success: true,
      token: user.getSignedJwtToken(),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// --- 4. GET PROFILE (NO CHANGE) ---
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};