import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');

      // ✅ Yahan return lagana zaroori hai taaki aage ka code na chale
      return next(); 
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      // ✅ Yahan return lagana zaroori hai
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    // ✅ Yahan bhi return add kiya hai
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};