import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { User, UpdateUserData } from "@shared/types";
import { useAuth } from "@/hooks/use-auth";

export function useProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get(`/users/profile`);
      return response.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateUserData): Promise<User> => {
      const response = await apiClient.patch("/users/profile", data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Update auth context first for immediate UI updates
      updateUser(updatedUser);

      // Invalidate queries to refresh any cached data
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({
        queryKey: ["user", updatedUser.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh posts to update author info
    },
  });
}
