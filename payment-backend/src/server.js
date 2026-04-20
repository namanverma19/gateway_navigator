import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";     
import connectDB from "./config/db.js";

// 🚦 Strategy Load
import "./config/passport.js"; 

// 🚦 Routes Import
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();

// 1. Database Connection
connectDB();

const app = express();

// 2. Global Middleware
// CORS ko update kiya hai taaki frontend se credentials aur headers allow ho sakein
app.use(cors({
  origin: process.env.FRONTEND_URL ;
  credentials: true
})); 

app.use(express.json()); 

// 3. Passport Initialize
app.use(passport.initialize());

// 4. API Routes
app.use("/api/users", userRoutes);    // Login, Register, Verify-Email isme hain
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);      // Google Auth

// 5. Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Gateway Navigator API is Live 🚀" });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Debugging ke liye log zaroori hai
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Kingdom Server is running on port ${PORT} with JWT & Email Verification`);
});
