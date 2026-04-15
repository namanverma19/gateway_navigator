import express from 'express';
import { check } from 'express-validator';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyEmail // 👈 Naya controller function import kiya
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🟢 REGISTER ROUTE: POST /api/users/register
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

// 🔵 VERIFY EMAIL ROUTE: GET /api/users/verify-email
// Ye link user ke email mein jayega (e.g., /api/users/verify-email?token=...)
router.post('/verify-email', verifyEmail);

// 🟢 LOGIN ROUTE: POST /api/users/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  authUser
);

// 🔴 PRIVATE ROUTE: GET /api/users/profile
router.get('/profile', protect, getUserProfile);

export default router;