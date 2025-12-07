import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MongoProduct } from '@/api/product.api';

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: MongoProduct;
}

export function ProductDetailsDialog({ open, onOpenChange, product }: ProductDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-64 object-contain rounded-lg"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{product.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-medium">{product.brand || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">${product.price.toFixed(2)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="font-medium">{product.stock}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{product.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
