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

router.get("/", auth, RestaurantController.getUserRestaurant)

router.post("/", auth, upload.single("imageFile"), validateRestaurantRequest, RestaurantController.createRestaurant)
router.put("/", auth, upload.single("imageFile"), validateRestaurantRequest, RestaurantController.updateRestaurant)

export default router
