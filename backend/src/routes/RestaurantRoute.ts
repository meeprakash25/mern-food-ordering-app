import express from "express"
import { param } from "express-validator"
import RestaurantController from "../controllers/RestaurantController"

const router = express.Router()

router.get("/cities", RestaurantController.getCities)

router.get(
  "/search/:city",
  param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"),
  RestaurantController.searchRestaurant
)

router.get(
  "/:restaurantId",
  param("restaurantId").isString().trim().notEmpty().withMessage("Restaurant id parameter must be a valid string"),
  RestaurantController.getRestaurant,
)

export default router
