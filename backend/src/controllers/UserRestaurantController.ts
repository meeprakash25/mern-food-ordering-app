import { Request, Response } from "express"
import Restaurant from "../models/Restaurant"
import cloudinary from "cloudinary"
import mongoose from "mongoose"
import Order from "../models/Order"

const getUserRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId })
    if (!restaurant) {
      return res.status(404).json({ message: "Please add your restaurant" })
    }
    return res.status(200).json({ message: "Restaurant fetched successfully", data: restaurant })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

const createRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId })
    if (existingRestaurant) {
      return res.status(409).json({ message: "User restaurant already exists" })
    }

    // const image = req.file as Express.Multer.File
    // const base64Image = Buffer.from(image.buffer).toString("base64")
    // const dataUri = `data:${image.mimetype};base64,${base64Image}`

    // const uploadResponse = await cloudinary.v2.uploader.upload(dataUri)

    const imageUrl = await uploadImage(req.file as Express.Multer.File)

    const restaurant = new Restaurant(req.body)
    restaurant.imageUrl = imageUrl
    restaurant.user = new mongoose.Types.ObjectId(req.userId)
    restaurant.lastUpdated = new Date()
    await restaurant.save()

    return res.status(201).json({ message: "Restaurant created successfully", data: restaurant })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId })
    if (!restaurant) {
      return res.status(404).json({ message: "User restaurant not found" })
    }

    restaurant.restaurantName = req.body.restaurantName
    restaurant.city = req.body.city
    restaurant.country = req.body.country
    restaurant.deliveryPrice = req.body.deliveryPrice
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime
    restaurant.cuisines = req.body.cuisines
    restaurant.menuItems = req.body.menuItems
    restaurant.lastUpdated = new Date()

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File)
      restaurant.imageUrl = imageUrl
    }

    await restaurant.save()

    return res.status(200).json({ message: "Restaurant updated successfully", data: restaurant })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

const uploadImage = async (file:Express.Multer.File) => {
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataUri = `data:${image.mimetype};base64,${base64Image}`

  const uploadResponse = await cloudinary.v2.uploader.upload(dataUri)
  return uploadResponse.url
}

const getUserRestaurantOrders = async (req: Request, res: Response) => {
  try {
    // const restaurant = await Restaurant.findOne({ user: req.userId })
    // if (!restaurant) {
    //   return res.status(404).json({ message: "Restaurant not found" })
    // }
    // const orders = await Order.find({ restaurant: restaurant._id }).populate("restaurant").populate("user")

    const userId = new mongoose.Types.ObjectId(req.userId)

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      { $match: { "restaurant.user": userId } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          orderStatus: 1,
          paymentType: 1,
          paymentStatus: 1,
          totalAmount: 1,
          deliveryDetails: 1,
          cartItems: 1,
          createdAt: 1,
          updatedAt: 1,

          restaurant: "$restaurant",

          user: "$user",
        },
      },
      {
        $unset: "user.password",
      },
      {
        $unset: "user.auth0Id",
      },
    ])

    return res.status(200).json({ message: "Restaurant orders fetched successfully", data: orders })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wring" })
  }
}

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const { type, status } = req.body
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const restaurant = await Restaurant.findById(order.restaurant)
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send()
    }

    if (type === "order") {
      order.orderStatus = status
    } else {
      order.paymentStatus = status
    }
    await order.save()

    res.status(200).json({ message: "Status updated", data: order })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Unable to update order status" })
  }
}

export default {
  updateOrderStatus,
  getUserRestaurant,
  getUserRestaurantOrders,
  createRestaurant,
  updateRestaurant,
}
