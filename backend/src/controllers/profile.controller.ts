import { Request, Response } from 'express';
import User from '../models/user.model';
import { uploadToS3, deleteFromS3 } from '../config/aws.config';

export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Delete old profile picture if exists
    if (user.profilePictureKey) {
      try {
        await deleteFromS3(user.profilePictureKey);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }

    // Upload new profile picture to S3
    const { url, key } = await uploadToS3(req.file, 'profile-pictures');

    // Update user with new profile picture
    user.profilePicture = url;
    user.profilePictureKey = key;
    await user.save();

    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.profilePictureKey;

    res.json({
      message: 'Profile picture uploaded successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};

export const deleteProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.profilePictureKey) {
      await deleteFromS3(user.profilePictureKey);
    }

    user.profilePicture = '';
    user.profilePictureKey = '';
    await user.save();

    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.profilePictureKey;

    res.json({
      message: 'Profile picture deleted successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ message: 'Error deleting profile picture' });
  }
};