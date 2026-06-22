import express from "express";
import authRouter from "../src/routes/auth.routes.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// JSON body parser
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth", authRouter);

export default app;