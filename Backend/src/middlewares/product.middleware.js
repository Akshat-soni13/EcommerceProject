import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const ProductMiddleware = async (req, res, next) => {
  // Read token from cookies
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. No token provided.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Fetch user and exclude password
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this id.",
      });
    }

    if (user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only sellers are allowed to perform this action.",
        });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Invalid or expired token.",
    });
  }
};
