import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    
    // 🟢 NEW: Google ID field for OAuth users
    googleId: {
      type: String,
      required: false,
    },

    // 🟢 UPDATED: Password is now conditionally required
    password: {
      type: String,
      required: function() {
        // Password tabhi maango jab googleId nahi hai (matlab email/password login hai)
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, 
    },
    
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    tokenExpiry: Date,
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    }
  },
  {
    timestamps: true,
  }
);

// 🔒 Pre-Save Middleware: Hash the password
userSchema.pre('save', async function () {
  // 1. Agar password modify nahi hua ya password hai hi nahi (Google login), toh return kar jao
  if (!this.isModified('password') || !this.password) {
    return; 
  }

  // 2. Hash the password only if it's new or changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Method: Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎫 Method: Generate JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const User = mongoose.model('User', userSchema);

export default User;