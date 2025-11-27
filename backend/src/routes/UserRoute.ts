import express from "express"
import UserController from "../controllers/UserController"
import { logAuthHeader } from "../middleware/logAuthHeader"
import { auth } from "../middleware/auth"

const router = express.Router()

router.post("/", auth, UserController.createCurrentUser)

export default router
