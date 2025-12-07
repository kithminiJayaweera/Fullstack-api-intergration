import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { productColumns } from '../components/product-columns';
import { useMongoProducts, useCreateMongoProduct } from '../hooks/useMongoProducts';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

export default function MongoProductsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const { data, isLoading, error } = useMongoProducts(1, 100);
  const createMutation = useCreateMongoProduct();

  const productSearchFields = [
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'description', label: 'Description' }
  ];

  const handleAddProduct = async (formData: FormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowAddDialog(false);
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Add product error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">MongoDB Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">MongoDB Products</h1>
        </div>
        <div className="border border-red-200 bg-red-50 p-4 rounded">
          <p className="text-red-800">Error loading products: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">MongoDB Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      <DataTable 
        columns={productColumns} 
        data={data?.products || []} 
        searchFields={productSearchFields}
        defaultSearchField="name"
      />

      <ProductForm 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
