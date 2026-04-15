import express from "express";
import { 
  createOrder,           // 👈 generic name (Navigator logic handle karega)
  verifyPayment,         // 👈 Generic verification
  getTransactionHistory 
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Order Create karna (Isme Navigator switching logic hai)
router.post("/create-order", protect, createOrder);

// 2. Payment Verify karna (Signature check aur DB update)
router.post("/verify-payment", protect, verifyPayment);

// 3. Transaction History (Frontend Dashboard ke liye)
// Iska use hum tab karenge jab user profile ya history page pe jayega
router.get("/history", protect, getTransactionHistory);

export default router;