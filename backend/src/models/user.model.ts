import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: number | null;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | null;
  birthDate?: string | null;
  role: 'admin' | 'user';
  profilePicture?: string;
  profilePictureKey?: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Unified user schema with all fields for authentication and profile
const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, required: false, min: 1, max: 120 },
  phone: { type: String, required: false, trim: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: false },
  birthDate: { type: String, required: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  profilePicture: { type: String, default: '' },
  profilePictureKey: { type: String, default: '' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function(): string {
  const payload = {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Add virtual 'id' field that maps to '_id'
userSchema.virtual('id').get(function(this: IUser) {
  return this._id.toHexString();
});

export default mongoose.model<IUser>('User', userSchema);
