import { Request, Response, NextFunction } from "express"
import { auth as jwtAuth } from "express-oauth2-jwt-bearer"

const audience = process.env.AUTH0_AUDIENCE as string
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL as string

export function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing Authorization header" })
  }
  jwtCheck(req, res, next)
}

export const jwtCheck = jwtAuth({
  audience,
  issuerBaseURL,
  tokenSigningAlg: "RS256",
})
