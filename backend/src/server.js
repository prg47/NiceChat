import express from "express"
import "dotenv/config"
import path from "path"


import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"

const app = express();
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

app.listen(PORT,()=> console.log("server running on port ",PORT))