import express, { Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import { errorHandler } from "./middleware/errorHandler"
import UserRoute from "./routes/UserRoute"
import path from "path"

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

app.use(errorHandler)

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
