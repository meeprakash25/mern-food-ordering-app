import express, { Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import { errorHandler } from "./middleware/errorHandler"
import UserRoute from "./routes/UserRoute"
import RestaurantRoute from "./routes/RestaurantRoute"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
})

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database:", process.env.MONGODB_CONNECTION_STRING))

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
)

app.use("/api/user", UserRoute)
app.use("/api/restaurant", RestaurantRoute)

app.use(errorHandler)

// not necessary for vercel
app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use((_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" })
})

// Export for serverless platforms (Vercel, Netlify, AWS Lambda)
export default app

// For local development
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
