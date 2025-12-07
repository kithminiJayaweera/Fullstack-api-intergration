import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export async function uploadProfilePicture(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
  }
}

export async function deleteProfilePicture(): Promise<any> {
  try {
    const response = await api.delete('/profile/picture');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting profile picture:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete profile picture');
  }
}
