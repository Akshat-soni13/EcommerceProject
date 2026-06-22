import { Router } from "express";
import { validateRegisteredUser } from "./../validator/auth.validator.js";
import { register, login, logout } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validateRegisteredUser, register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;