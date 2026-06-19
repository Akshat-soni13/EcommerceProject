import mongoose from "mongoose"
import { config } from "../config/config.js"


export const connectDb = async()=>{
  await mongoose.connect(config.MONGO_URI)
}