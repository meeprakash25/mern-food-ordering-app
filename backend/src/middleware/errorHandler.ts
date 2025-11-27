import { Request, Response, NextFunction } from "express"

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name === "UnauthorizedError" || err.name === "InvalidTokenError" || err.name === "InvalidRequestError") {
    return res.status(401).json({ error: err.message })
  }
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
}
