import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { uploadProfilePicture, deleteProfilePicture } from '../controllers/profile.controller';

const router = express.Router();

// Upload profile picture
router.post('/upload', authenticate, upload.single('profilePicture'), uploadProfilePicture);

// Delete profile picture
router.delete('/picture', authenticate, deleteProfilePicture);

export default router;