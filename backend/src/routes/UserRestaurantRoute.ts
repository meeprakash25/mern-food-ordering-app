import express from "express"
import multer from "multer"
import UserRestaurantController from "../controllers/UserRestaurantController"
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

router.get("/", auth, UserRestaurantController.getUserRestaurant)
router.get("/order", auth, UserRestaurantController.getUserRestaurantOrders)
router.patch("/order/:orderId/status", auth, UserRestaurantController.updateOrderStatus)

router.post("/", auth, upload.single("imageFile"), validateRestaurantRequest, UserRestaurantController.createRestaurant)
router.put("/", auth, upload.single("imageFile"), validateRestaurantRequest, UserRestaurantController.updateRestaurant)


export default router
