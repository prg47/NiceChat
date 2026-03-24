import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"

const app = express();
const PORT = process.env.PORT || 3000


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

app.listen(PORT,()=> console.log("server running on port ",PORT))