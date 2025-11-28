import { Request, Response } from "express"
import User from "../models/User"

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body
    const existingUser = await User.findOne({ auth0Id })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }
    const newUser = new User(req.body)
    await newUser.save()

    return res.status(201).json({ message: "User created successfully", data: newUser.toObject() })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error creating user" })
  }
}

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine, country, city } = req.body
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    user.name = name
    user.addressLine = addressLine
    user.country = country
    user.city = city
    await user.save()

    return res.status(201).json({ message: "User updated successfully", data: user.toObject() })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error updating user" })
  }
}

const fetchCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    return res.status(201).json({ message: "User fetched successfully", data: user.toObject() })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error fetching user" })
  }
}

export default {
  createCurrentUser,
  updateCurrentUser,
  fetchCurrentUser,
}
