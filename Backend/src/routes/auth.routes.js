import { Router } from "express";
import { validateRegisteredUser } from "./../validator/auth.validator.js";
import { register, login, logout, googleAuthCallback, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

// POST /api/auth/register
router.post("/register", validateRegisteredUser, register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me - Get current logged-in user profile
router.get("/me", protect, getMe);

// below line is used to initiate Google OAuth authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// below line is use to verify auth ccode from user and send it to the controller for further processing 
router.get("/google/callback", passport.authenticate("google",{
    session:false,
    failureRedirect: "http://localhost:5173/login",
}),googleAuthCallback)

export default router;