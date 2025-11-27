import { Request, Response } from "express"
import User from "../models/User"

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body
    const existingUser = await User.findOne({ auth0Id })
    if (existingUser) {
      return res.status(400).json({message:"User already exists"})
    }
    const newUser = new User(req.body)
    await newUser.save()

    return res.status(201).json({message:"User created successfully", data: newUser.toObject()})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Error creating user"})
  }
}

export default {
  createCurrentUser,
}
