import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface AdminPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export interface UserPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
      user?: UserPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;

    const db = getDb();
    const admin = db.prepare('SELECT id, email, role FROM admins WHERE id = ?').get(decoded.id) as
      | { id: number; email: string; role: string }
      | undefined;

    if (!admin) {
      res.status(401).json({ message: 'Admin not found' });
      return;
    }

    req.admin = { id: admin.id, email: admin.email, role: admin.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function roleMiddleware(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.admin.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

export function userAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    const db = getDb();
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(decoded.id) as
      | { id: number; email: string }
      | undefined;

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
