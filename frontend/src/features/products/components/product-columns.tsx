import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MongoProduct } from '@/api/product.api';
import { useUpdateMongoProduct, useDeleteMongoProduct } from '@/features/products/hooks/useMongoProducts';
import { DataTableColumnHeader } from '@/components/data-table/table-columns-dropdown';
import { ProductForm } from './ProductForm';
import { ProductDetailsDialog } from './ProductDetailsDialog';

function ActionsCell({ product }: { product: MongoProduct }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const updateMutation = useUpdateMongoProduct();
  const deleteMutation = useDeleteMongoProduct();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        if (product._id) {
          await deleteMutation.mutateAsync(product._id);
          toast.success(`Product "${product.name}" deleted!`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to delete product: ${errorMessage}`);
      }
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      if (product._id) {
        await updateMutation.mutateAsync({ id: product._id, formData });
        toast.success(`Product "${product.name}" updated!`);
      }
      setShowEditDialog(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update product: ${errorMessage}`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShowDialog(true)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <ProductDetailsDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        product={product}
      />
      
      <ProductForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdate}
        initialData={product}
        title="Edit Product"
      />
    </>
  );
}

export const productColumns: ColumnDef<MongoProduct>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => (
      <img 
        src={row.original.imageUrl} 
        alt={row.original.name}
        className="h-12 w-12 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row }) => row.original.brand || 'N/A',
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
];
