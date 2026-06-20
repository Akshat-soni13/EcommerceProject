import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDb } from './src/config/connectDb.js';
import app from "./src/app.js"
import express from "express"
dotenv.config();



const PORT =  3000 ;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

connectDb()


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})