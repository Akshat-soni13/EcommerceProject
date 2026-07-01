import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "./../config/config.js";

// ==========================================
// Helper: Sign JWT & send cookie + response
// ==========================================
async function sendTokenResponse(user, res, message, statusCode = 200, redirect = false) {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Secure cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };

  res.cookie("token", token, cookieOptions);

  if (!redirect) {
    return res.status(statusCode).json({
      success: true,
      message,
      user: user.toSafeObject(),
    });
  }
}

// ==========================================
// @route   POST /api/auth/register
// @desc    Register a new user (buyer or seller)
// @access  Public
// ==========================================
export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller, shopName } = req.body;

  try {
    // Check if user already exists by email OR contact
    const existingUser = await userModel.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { contact }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email.toLowerCase().trim() ? "email" : "contact number";
      return res.status(409).json({
        success: false,
        message: `An account with this ${conflictField} already exists. Please login instead.`,
      });
    }

    // Build user data
    const userData = {
      email: email.toLowerCase().trim(),
      contact,
      password,
      fullname: fullname.trim(),
      role: isSeller ? "seller" : "buyer",
    };

   

    // Create user — password is hashed in the pre-save hook
    const user = await userModel.create(userData);

    await sendTokenResponse(
      user,
      res,
      `Welcome to KrishnaFashion, ${user.fullname.split(" ")[0]}! Your account has been created successfully.`,
      201
    );
  } catch (err) {
    console.error("Register Controller Error:", err);

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later.",
    });
  }
};

// ==========================================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ==========================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    await sendTokenResponse(
      user,
      res,
      `Welcome back, ${user.fullname.split(" ")[0]}!`
    );
  } catch (err) {
    console.error("Login Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later.",
    });
  }
};

// ==========================================
// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
// ==========================================
export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};


export const googleAuthCallback = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const profilePic = photos && photos[0] ? photos[0].value : null;

    // Check if user already exists
    let user = await userModel.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new userModel({
        email,
        googleId: id, 
        fullname: displayName,
        avatar: profilePic, // Map avatar field
        role: "buyer",
      });
      await user.save();
    } else if (!user.googleId) {
      // If user exists but has no googleId, link it
      user.googleId = id;
      if (!user.avatar && profilePic) {
        user.avatar = profilePic;
      }
      await user.save();
    }

    await sendTokenResponse(
      user,
      res,
      `Welcome ${user.fullname.split(" ")[0]}! You have successfully logged in with Google.`,
      200,
      true
    );

    res.redirect("http://localhost:5173/"); // Redirect to frontend
  } catch (err) {
    console.error("Google Auth Callback Error:", err);
    res.redirect("http://localhost:5173/login?error=oauth_failed");
  }
};

// ==========================================
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
// ==========================================
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      message: "User profile fetched successfully.",
      success: true,
      user:{
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        contact: req.user.contact,
        role: req.user.role,
        avatar: req.user.avatar || null,
      }
    });
  } catch (err) {
    console.error("GetMe Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later.",
    });
  }
};

