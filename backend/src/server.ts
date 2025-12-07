import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.config';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import profileRoutes from './routes/profile.routes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Allow multiple frontend origins (development). Prefer FRONTEND_URL env var if set.
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true // Enable cookies and authorization headers with credentials
}));
app.use(cookieParser()); // Parse cookies for authentication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to User Management API',
    endpoints: {
      users: '/api/users',
      auth: '/api/auth'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api/users`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log('🖼️  Profile: http://localhost:5000/api/profile');
});