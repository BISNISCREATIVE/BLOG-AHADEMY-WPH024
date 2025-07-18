import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { User, UpdateUserData } from "@shared/types";

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

  return useMutation({
    mutationFn: async (data: UpdateUserData): Promise<User> => {
      const response = await apiClient.patch("/users/profile", data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({
        queryKey: ["user", updatedUser.id.toString()],
      });
      // Update the user data in auth context
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    },
  });
}
