/* eslint-disable react-refresh/only-export-components */
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from './table-columns-dropdown';

export const ProductSchema = z.object({
  id: z.number().min(1, 'ID must be greater than 0'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().min(0, 'Stock must be greater than or equal to 0'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
});

export type Product = z.infer<typeof ProductSchema>;

function ViewOnlyActionsCell({ product }: { product: Product }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {product.id}</p>
              <p><strong>Title:</strong> {product.title}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Discount:</strong> {product.discountPercentage}%</p>
              <p><strong>Rating:</strong> {product.rating}/5</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded" />
            </div>
            <Button 
              onClick={() => setShowDialog(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'thumbnail',
    header: 'Image',
    cell: ({ row }) => (
      <img 
        src={row.getValue('thumbnail')} 
        alt={row.original.title}
        className="h-12 w-12 rounded object-cover"
      />
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue('title')}>
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        ${row.getValue('price')}
      </div>
    ),
  },
  {
    accessorKey: 'discountPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue('discountPercentage')}%
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue('rating')}/5
      </div>
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ViewOnlyActionsCell product={row.original} />,
  },
];