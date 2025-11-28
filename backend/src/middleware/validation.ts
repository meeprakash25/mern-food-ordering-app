import { Request, Response, NextFunction } from "express"
import { body, validationResult } from "express-validator"

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const validateUserRequest = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("addressLine").isString().notEmpty().withMessage("Address is required"),
  body("city").isString().notEmpty().withMessage("City is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  handleValidationErrors,
]
