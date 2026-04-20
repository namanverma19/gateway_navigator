import jwt from "jsonwebtoken";

// @desc    Handle Google Auth Success & Generate JWT
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    // Agar authentication fail ho gayi toh frontend ke login page par wapas bhej do
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }

  // 1. JWT Sign karna
  const token = jwt.sign(
    { id: req.user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
  );

  // 2. Frontend par Token ke saath redirect karna
  // Yahan humne "http://localhost:5173" ko process.env.FRONTEND_URL se replace kiya hai
  const redirectURL = `${process.env.FRONTEND_URL}/login-success?token=${token}`;
  
  res.redirect(redirectURL);
};

// @desc    Get Current Logged-in User
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
