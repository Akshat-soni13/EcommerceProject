import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGODB_URI && !process.env.JWT_SECRET)
{
    throw Error("MOngoDb uri and JWT SECRET is not exist")
}


export const config ={
    MONGO_URI: process.env.MONGODB_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:"/api/auth/google/callback",
    IMAGE_KIT_PRIVATE_KEY:process.env.IMAGE_KIT_PRIVATE_KEY,
    IMAGE_KIT_PUBLIC_KEY:process.env.IMAGE_KIT_PUBLIC_KEY,
    IMAGE_KIT_URL_ENDPOINT:process.env.IMAGE_KIT_URL_ENDPOINT
}