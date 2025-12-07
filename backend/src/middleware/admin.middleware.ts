import { Request, Response, NextFunction } from 'express';

// Middleware to check if user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get user from auth middleware (assumes auth middleware runs first)
    const user = (req as any).user;

    console.log('👮 Admin check - User from auth:', user);

    if (!user) {
      console.log('❌ No user found - authentication failed');
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    console.log('🔍 Checking admin role. User role:', user.role);

    if (user.role !== 'admin') {
      console.log('❌ Access denied - user is not admin');
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
      return;
    }

    console.log('✅ Admin verified - proceeding');
    // User is admin, proceed
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};
