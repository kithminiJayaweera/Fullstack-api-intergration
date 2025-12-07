/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface MongoUser {
  _id?: string;
  id?: number;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  email: string;
  password?: string; // Optional - only for creation, never returned
  phone?: string;
  birthDate?: string;
  role: 'admin' | 'user';
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  users: MongoUser[];
  pagination: PaginationInfo;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // CRITICAL: Send cookies with every request
});

export async function fetchMongoUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedUsersResponse> {
  try {
    const response = await api.get('/users', {
      params: { pageNumber, pageSize }
    });
    
    const users = response.data.data.map((user: any, index: number) => ({
      ...user,
      id: user._id || index + 1
    }));
    
    return {
      users,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
}

export async function createMongoUser(userData: Omit<MongoUser, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<MongoUser> {
  try {
    const response = await api.post('/users', userData);
    return { ...response.data.data, id: response.data.data._id };
  } catch (error: any) {
    console.error('❌ Error creating user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
}

export async function updateMongoUser(id: string, userData: Partial<MongoUser>): Promise<MongoUser> {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return { ...response.data.data, id: response.data.data._id };
  } catch (error: any) {
    console.error('❌ Error updating user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

export async function deleteMongoUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: any) {
    console.error('❌ Error deleting user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
}

