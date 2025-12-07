import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMongoProducts, createMongoProduct, updateMongoProduct, deleteMongoProduct } from '@/api/product.api';

export function useMongoProducts(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ['mongo-products', pageNumber, pageSize],
    queryFn: () => fetchMongoProducts(pageNumber, pageSize),
  });
}

export function useCreateMongoProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMongoProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-products'] });
    },
  });
}

export function useUpdateMongoProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      updateMongoProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-products'] });
    },
  });
}

export function useDeleteMongoProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMongoProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-products'] });
    },
  });
}
