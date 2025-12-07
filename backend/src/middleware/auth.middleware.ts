import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id?: string; // Some tokens use 'id'
  userId?: string; // Some tokens use 'userId'
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    // Check for token in cookie FIRST, then Authorization header
    let token = req.cookies?.auth_token;
    
    // Fallback to Authorization header if no cookie
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    
    // Map the JWT payload to req.user with correct field name
    req.user = {
      userId: decoded.id || decoded.userId, // Support both 'id' and 'userId'
      email: decoded.email,
      role: decoded.role
    };
    
    return next();
  } catch (error: any) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  return next();
};