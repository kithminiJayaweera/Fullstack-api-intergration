import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMongoUsers, createMongoUser, updateMongoUser, deleteMongoUser, MongoUser } from '@/api/user.api';

export function useMongoUsers(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['mongo-users', pageNumber, pageSize],
    queryFn: () => fetchMongoUsers(pageNumber, pageSize),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}

export function useCreateMongoUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMongoUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-users'] });
    }
  });
}

export function useUpdateMongoUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MongoUser> }) => 
      updateMongoUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-users'] });
    }
  });
}

export function useDeleteMongoUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMongoUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-users'] });
    }
  });
}

