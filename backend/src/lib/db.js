import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async ()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log("DB connected")
    } catch (error) {
        console.error("Error connecting to database ", error)
        process.exit(1)
    }
}