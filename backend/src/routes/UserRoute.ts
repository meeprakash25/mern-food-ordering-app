import express from "express"
import UserController from "../controllers/UserController"
import { auth } from "../middleware/auth"
import { validateUserRequest } from "../middleware/validation"

const router = express.Router()

router.post("/", auth, UserController.createCurrentUser)
router.put("/update", auth, validateUserRequest, UserController.updateCurrentUser)
router.get("/fetch", auth, UserController.fetchCurrentUser)

export default router
