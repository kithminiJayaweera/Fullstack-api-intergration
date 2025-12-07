import { Request, Response } from 'express';
import User from '../models/user.model';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    
    const skip = (pageNumber - 1) * pageSize;
    
    const result = await User.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          password: 0,
          profilePictureKey: 0
        }
      },
      {
        $facet: {
          edges: [
            { $skip: skip },
            { $limit: pageSize }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      },
      {
        $project: {
          edges: 1,
          total: { $arrayElemAt: ['$totalCount.count', 0] }
        }
      }
    ]);
    
    const data = result[0];
    const total = data.total || 0;
    const edges = data.edges || [];
    
    res.json({ 
      success: true, 
      data: edges,
      pagination: {
        total,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error fetching users:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    
    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.profilePictureKey;
    
    res.status(201).json({ success: true, data: userResponse });
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -profilePictureKey');
    if (!user) {
      console.log('❌ User not found:', req.params.id);
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error updating user:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error deleting user:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
