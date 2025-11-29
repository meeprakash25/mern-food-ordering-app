import { Request, Response, NextFunction } from "express"
import { auth as jwtAuth } from "express-oauth2-jwt-bearer"
import jwt from "jsonwebtoken"
import User from "../models/User"

declare global {
  namespace Express {
    interface Request {
      userId: string
      auth0Id: string
    }
  }
}

const audience = process.env.AUTH0_AUDIENCE as string
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL as string

export async function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" })
  }

  // Skip user lookup and decoding for POST /api/user
  if (req.method === "POST" && req.path === "/" && req.baseUrl.endsWith("/api/user")) {
    return jwtCheck(req, res, next)
  }
  
  const token = authorization.split(" ")[1]

  try {
    const decoded = jwt.decode(token as string) as jwt.JwtPayload
    const auth0Id = decoded?.sub
    if (!auth0Id) {
      return res.status(401).json({ message: "Invalid token" })
    }
    const user = await User.findOne({ auth0Id })
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }
    req.auth0Id = auth0Id as string
    req.userId = user._id.toString()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  jwtCheck(req, res, next)
}

export const jwtCheck = jwtAuth({
  audience,
  issuerBaseURL,
  tokenSigningAlg: "RS256",
})
