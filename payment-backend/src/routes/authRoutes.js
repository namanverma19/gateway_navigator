import express from "express";
import passport from "passport";
import { googleAuthSuccess, getMe } from "../controllers/authController.js";

const router = express.Router();
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // 🪄 YAHI HAI WO MAGIC WORD! Isse har baar popup aayega.
  })
);

// 2. Google Callback: Google wapas yahan bhejega
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
  googleAuthSuccess // 👈 Controller function call ho raha hai
);

// 3. Check Current User
router.get("/me", getMe);

export default router;