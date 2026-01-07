import { Request, Response } from "express"
import Restaurant from "../models/Restaurant"
import cloudinary from "cloudinary"
import mongoose from "mongoose"

const createRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId })
    if (existingRestaurant) {
      return res.status(409).json({ message: "User restaurant already exists" })
    }

    const image = req.file as Express.Multer.File
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataUri = `data:${image.mimetype};base64,${base64Image}`

    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri)

    const restaurant = new Restaurant(req.body)
    restaurant.imageUrl = uploadResponse.url
    restaurant.user = new mongoose.Types.ObjectId(req.userId)
    restaurant.lastUpdated = new Date()
    await restaurant.save()

    return res.status(201).json({ message: "Restaurant created successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export default {
  createRestaurant
}
