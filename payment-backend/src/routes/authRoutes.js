import express from "express";
import passport from "passport";
import { googleAuthSuccess, getMe } from "../controllers/authController.js";

const router = express.Router();

// 1. Google Login Start: User ko Google Consent screen par bhejta hai
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })
);

// 2. Google Callback: Google auth code ke saath yahan wapas bhejega
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false, 
    // Hardcoded URL ki jagah environment variable use kiya
    failureRedirect: `${process.env.FRONTEND_URL}/login` 
  }),
  googleAuthSuccess // Auth success hone par ye controller JWT generate karke redirect karega
);

// 3. Check Current User
router.get("/me", getMe);

export default router;
