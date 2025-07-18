import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import {
  PostsResponse,
  Post,
  CreatePostData,
  UpdatePostData,
} from "@shared/types";

export function useRecommendedPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", "recommended", page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await apiClient.get(`/posts/recommended`, {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

export function useMostLikedPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", "most-liked", page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await apiClient.get(`/posts/most-liked`, {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

export function useMyPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", "my-posts", page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await apiClient.get(`/posts/my-posts`, {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async (): Promise<Post> => {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSearchPosts(query: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", "search", query, page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await apiClient.get(`/posts/search`, {
        params: { query, page, limit },
      });
      return response.data;
    },
    enabled: !!query,
  });
}

export function useUserPosts(userId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["posts", "user", userId, page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await apiClient.get(`/posts/by-user/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("tags", data.tags);
      if (data.published !== undefined) {
        formData.append("published", data.published.toString());
      }
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await apiClient.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (newPost) => {
      // Invalidate all post-related queries to show new post everywhere
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "recommended"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "most-liked"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "my-posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePostData;
    }): Promise<Post> => {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.content) formData.append("content", data.content);
      if (data.tags) formData.append("tags", data.tags);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.patch(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (updatedPost, { id }) => {
      // Invalidate all post-related queries to ensure fresh data everywhere
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts", "recommended"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "most-liked"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "user"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "search"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean }> => {
      const response = await apiClient.delete(`/posts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all post-related queries after deletion
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "recommended"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "most-liked"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "my-posts"] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Post> => {
      const response = await apiClient.post(`/posts/${id}/like`);
      return response.data;
    },
    onSuccess: (updatedPost, id) => {
      // Invalidate all post-related queries after like
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts", "recommended"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "most-liked"] });
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      published,
    }: {
      id: string;
      published: boolean;
    }): Promise<Post> => {
      const response = await apiClient.post(`/posts/${id}/publish`, {
        published,
      });
      return response.data;
    },
    onSuccess: (updatedPost, { id }) => {
      // Invalidate all post-related queries after publish status change
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts", "recommended"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "most-liked"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "my-posts"] });
    },
  });
}
