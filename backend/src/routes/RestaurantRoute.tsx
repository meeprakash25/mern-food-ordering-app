import express from "express"
import multer from "multer"
import RestaurantController from "../controllers/RestaurantController"
import { auth } from "../middleware/auth"
import { validateRestaurantRequest } from "../middleware/validation"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
})

router.post("/", auth, validateRestaurantRequest, upload.single("imageFile"), RestaurantController.createRestaurant)

export default router
