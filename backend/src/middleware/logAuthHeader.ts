import { Request, Response, NextFunction } from "express"

export function logAuthHeader(req: Request, res: Response, next: NextFunction) {
  console.log("Authorization Header:", req.headers.authorization)
  next()
}
