/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchProductById } from '@/api/product.api'

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useProduct(id: number | undefined | null) {
  return useQuery({
    queryKey: productKeys.detail(Number(id ?? 0)),
    queryFn: async () => {
      if (!id) throw new Error('Invalid id')
      return fetchProductById(Number(id))
    },
    enabled: !!id,
  })
}
