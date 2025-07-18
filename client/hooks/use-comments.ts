import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { Comment, CreateCommentData } from "@shared/types";

export function useComments(postId: number) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data;
    },
    enabled: !!postId,
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData): Promise<Comment> => {
      const response = await apiClient.post(`/posts/${postId}/comments`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // Also invalidate the post to update comment count
      queryClient.invalidateQueries({ queryKey: ["posts", postId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number): Promise<{ success: boolean }> => {
      const response = await apiClient.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // Also invalidate the post to update comment count
      queryClient.invalidateQueries({ queryKey: ["posts", postId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
