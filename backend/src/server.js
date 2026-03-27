import express from "express"
import "dotenv/config"
import path from "path"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./lib/db.js"
import { ENV } from "./lib/env.js"

const app = express();
const __dirname = path.resolve()
const PORT = ENV.PORT || 3000
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get(/.*/,(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

const startServer = async ()=>{
    await connectDB()
    app.listen(PORT,()=>{
        console.log("Server running on port ",PORT)
    })
}

startServer()
