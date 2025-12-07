import { Request, Response } from 'express';
import User from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, age, gender, birthDate, role } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Please provide email, password, first name, and last name'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    const userRole = (role === 'admin' || role === 'user') ? role : 'user';

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone: phone || undefined,
      age: age || undefined,
      gender: gender || undefined,
      birthDate: birthDate || undefined,
      role: userRole
    });

    const token = user.generateAuthToken();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    };
    
    res.cookie('auth_token', token, cookieOptions);

    const responseData = {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        birthDate: user.birthDate,
        role: user.role,
      }
    };

    res.status(201).json(responseData);
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const token = user.generateAuthToken();

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    };
    
    res.cookie('auth_token', token, cookieOptions);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        birthDate: user.birthDate,
        role: user.role,
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('auth_token', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      birthDate: user.birthDate,
      role: user.role,
      profilePicture: user.profilePicture || '',
      createdAt: user.createdAt
    };

    console.log('✅ Returning user data:', userData);

    res.json({
      success: true,
      user: userData
    });
  } catch (error: any) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    await User.findByIdAndDelete(userId);

    console.log('🗑️ Account deleted:', user.email);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};
