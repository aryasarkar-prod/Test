import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
  user?: { id: string; email: string; name: string }
}

const JWT_SECRET = process.env.JWT_SECRET || 'noteflow-dev-secret-change-in-production'

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string }
    req.userId = payload.userId
    req.user = { id: payload.userId, email: payload.email, name: payload.name }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function generateToken(payload: { userId: string; email: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}
