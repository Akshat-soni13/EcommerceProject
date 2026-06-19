import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGODB_URI)
{
    throw Error("MOngoDb uri is not exist")
}


export const config ={
    MONGO_URI: process.env.MONGODB_URI
}