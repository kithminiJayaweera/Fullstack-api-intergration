import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProfilePicture, deleteProfilePicture } from '@/api/profile.api';

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      // Update the user in auth context
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Refresh users table to show updated profile picture
      queryClient.invalidateQueries({ queryKey: ['mongo-users'] });
    }
  });
}

export function useDeleteProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Refresh users table to show updated profile picture
      queryClient.invalidateQueries({ queryKey: ['mongo-users'] });
    }
  });
}
