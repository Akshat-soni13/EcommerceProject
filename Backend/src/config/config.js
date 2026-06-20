import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGODB_URI && !process.env.JWT_SECRET)
{
    throw Error("MOngoDb uri and JWT SECRET is not exist")
}



export const config ={
    MONGO_URI: process.env.MONGODB_URI,
    JWT_SECRET:process.env.JWT_SECRET
}