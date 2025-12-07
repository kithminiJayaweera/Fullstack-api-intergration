/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface MongoProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  stock: number;
  imageUrl: string;
  cloudinaryPublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedProductsResponse {
  products: MongoProduct[];
  pagination: PaginationInfo;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true,
});

// GET all products with pagination
export async function fetchMongoProducts(
  pageNumber = 1,
  pageSize = 10
): Promise<PaginatedProductsResponse> {
  try {
    const response = await api.get('/products', {
      params: { pageNumber, pageSize },
    });
    return {
      products: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// POST create new product with image
export async function createMongoProduct(formData: FormData): Promise<MongoProduct> {
  try {
    const response = await api.post('/products', formData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
}

// PUT update product
export async function updateMongoProduct(id: string, formData: FormData): Promise<MongoProduct> {
  try {
    const response = await api.put(`/products/${id}`, formData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating product:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
}

// DELETE product
export async function deleteMongoProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    console.error('Error deleting product:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
}

// Keep dummy API for existing ProductsTable
export async function fetchProducts() {
  const res = await axios.get('https://dummyjson.com/products');
  return res.data.products;
}

export async function fetchProductById(id: number) {
  const res = await axios.get(`https://dummyjson.com/products/${id}`);
  return res.data;
}