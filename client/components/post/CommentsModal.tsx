import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Loader2 } from "lucide-react";
import { Comment } from "@shared/types";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  comments: Comment[];
  commentsCount: number;
}

export function CommentsModal({
  isOpen,
  onClose,
  postId,
  comments,
  commentsCount,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post(`/posts/${postId}/comments`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId.toString()] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    createCommentMutation.mutate(newComment.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg md:max-w-2xl max-h-[80vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 space-y-0">
          <DialogTitle className="text-lg font-semibold text-[#181D27]">
            Comments({commentsCount})
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[60vh] px-6">
          {/* New Comment Form */}
          {isAuthenticated && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#181D27] mb-3">
                Give your Comments
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Enter your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none border-[#D5D7DA] focus:border-[#0093DD] focus:ring-[#0093DD]"
                />
                <Button
                  type="submit"
                  disabled={
                    !newComment.trim() || createCommentMutation.isPending
                  }
                  className="w-full bg-[#0093DD] hover:bg-[#0093DD]/90 text-white font-medium py-3"
                >
                  {createCommentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#535862]">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Link to={`/user/${comment.author.id}`}>
                    <Avatar className="h-10 w-10 shrink-0 hover:opacity-80 transition-opacity">
                      <AvatarImage
                        src={comment.author.avatarUrl}
                        alt={comment.author.name}
                      />
                      <AvatarFallback className="bg-[#F8F9FA] text-[#535862]">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        to={`/user/${comment.author.id}`}
                        className="font-medium text-sm text-[#181D27] hover:text-[#0093DD] transition-colors"
                      >
                        {comment.author.name}
                      </Link>
                      <span className="text-xs text-[#535862]">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: false,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-[#181D27] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
