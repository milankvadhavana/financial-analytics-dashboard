import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret is not configured' });
    }

    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
