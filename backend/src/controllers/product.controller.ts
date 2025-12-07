import { Request, Response } from 'express';
import Product from '../models/product.model';
import cloudinary from '../config/cloudinary.config';

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      data: products,
      pagination: {
        total,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, brand, stock } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400).json({ 
        message: 'Name, description, price, and category are required' 
      });
      return;
    }

    let imageUrl = null;
    let cloudinaryPublicId = null;

    if ((req as any).file) {
      const result = await uploadToCloudinary((req as any).file.buffer);
      imageUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand: brand || undefined,
      stock: parseInt(stock) || 0,
      imageUrl,
      cloudinaryPublicId,
    });

    await product.save();
    res.status(201).json({ data: product, message: 'Product created successfully' });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (brand !== undefined) product.brand = brand || undefined;
    if (stock !== undefined) product.stock = parseInt(stock);

    if ((req as any).file) {
      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId);
      }

      const result = await uploadToCloudinary((req as any).file.buffer);
      product.imageUrl = result.secure_url;
      product.cloudinaryPublicId = result.public_id;
    }

    await product.save();
    res.json({ data: product, message: 'Product updated successfully' });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(product.cloudinaryPublicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
