import jwt from "jsonwebtoken";

// @desc    Handle Google Auth Success & Generate JWT
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication Failed" });
  }

  // 1. JWT Sign karna (Wahi secret use karenge jo manual login mein hai)
  const token = jwt.sign(
    { id: req.user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
  );

  // 2. Frontend par Token ke saath redirect karna
  // User ko query string mein token bhej rahe hain taaki Frontend use localStorage mein save kar sake
  const frontendURL = `http://localhost:5173/login-success?token=${token}`;
  
  res.redirect(frontendURL);
};

// @desc    Get Current Logged-in User (Optional but useful)
export const getMe = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};