import dotenv from 'dotenv';
import { connectDb } from './src/config/connectDb.js';
import app from "./src/app.js"
import express from "express"
dotenv.config();

const PORT = 3000;

connectDb()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})