import { useQuery } from "@tanstack/react-query";
import { Comment } from "@shared/types";

export function useComments(postId: number) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json();
    },
    enabled: !!postId,
  });
}
