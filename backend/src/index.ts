import express, { Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import { errorHandler } from "./middleware/errorHandler"
import UserRoute from "./routes/UserRoute"

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database:", process.env.MONGODB_CONNECTION_STRING))

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/user", UserRoute)

app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
