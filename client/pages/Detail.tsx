import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost, useDeletePost } from "@/hooks/use-posts";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { CommentsModal } from "@/components/post/CommentsModal";
import apiClient from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { data: post, isLoading, error } = usePost(id!);
  const { data: comments = [] } = useComments(parseInt(id!));
  const deleteMutation = useDeletePost();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post(`/posts/${id}/comments`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", parseInt(id!)] });
      queryClient.invalidateQueries({ queryKey: ["post", id!] });
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    createCommentMutation.mutate(newComment.trim());
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The post you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === post.author.id;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#D5D7DA] bg-white px-4 py-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#535862] hover:text-[#181D27]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden md:inline">Back</span>
          </button>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/edit/${post.id}`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your post and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
        {/* Post Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#181D27] mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#F8F9FA] text-[#535862] border border-[#D5D7DA]"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <Link to={`/user/${post.author.id}`}>
              <Avatar className="h-12 w-12 hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                />
                <AvatarFallback>
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                to={`/user/${post.author.id}`}
                className="font-semibold text-[#181D27] hover:text-[#0093DD] transition-colors"
              >
                {post.author.name}
              </Link>
              <p className="text-sm text-[#535862]">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Cover Image */}
          {post.imageUrl && (
            <div className="mb-6 md:mb-8">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-[250px] md:h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="max-w-none mb-6 md:mb-8">
          <div className="text-[#181D27] leading-relaxed text-sm md:text-base whitespace-pre-line">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Post Stats & Actions */}
        <div className="flex items-center gap-6 py-6 border-t border-[#D5D7DA]">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-[#535862] hover:text-[#0093DD] p-0"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0093DD]"
            >
              <path
                d="M6.2334 15.2916L8.81673 17.2916C9.15006 17.6249 9.90006 17.7916 10.4001 17.7916H13.5667C14.5667 17.7916 15.6501 17.0416 15.9001 16.0416L17.9001 9.95823C18.3167 8.79156 17.5667 7.79156 16.3167 7.79156H12.9834C12.4834 7.79156 12.0667 7.37489 12.1501 6.79156L12.5667 4.12489C12.7334 3.37489 12.2334 2.54156 11.4834 2.29156C10.8167 2.04156 9.9834 2.37489 9.65006 2.87489L6.2334 7.95823"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeMiterlimit="10"
              />
              <path
                d="M1.9834 15.2915V7.12484C1.9834 5.95817 2.4834 5.5415 3.65007 5.5415H4.4834C5.65006 5.5415 6.15007 5.95817 6.15007 7.12484V15.2915C6.15007 16.4582 5.65006 16.8748 4.4834 16.8748H3.65007C2.4834 16.8748 1.9834 16.4582 1.9834 15.2915Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#0093DD] font-medium">{post.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-[#535862] hover:text-[#0093DD] p-0"
            onClick={() => setShowCommentsModal(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#535862]"
            >
              <path
                d="M2.5 6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V11C17.5 12.4001 17.5 13.1002 17.2275 13.635C16.9878 14.1054 16.6054 14.4878 16.135 14.7275C15.6002 15 14.9001 15 13.5 15H11.4031C10.8831 15 10.6231 15 10.3743 15.051C10.1537 15.0963 9.94017 15.1712 9.73957 15.2737C9.51347 15.3892 9.31043 15.5517 8.90434 15.8765L6.91646 17.4668C6.56973 17.7442 6.39636 17.8829 6.25045 17.8831C6.12356 17.8832 6.00352 17.8255 5.92436 17.7263C5.83333 17.6123 5.83333 17.3903 5.83333 16.9463V15C5.05836 15 4.67087 15 4.35295 14.9148C3.49022 14.6836 2.81635 14.0098 2.58519 13.147C2.5 12.8291 2.5 12.4416 2.5 11.6667V6.5Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#535862] font-medium">{post.comments}</span>
          </Button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#181D27]">
              Comments({post.comments})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommentsModal(true)}
              className="text-[#0093DD] hover:text-[#0093DD]/80"
            >
              See All Comments
            </Button>
          </div>

          {/* New Comment Form */}
          {isAuthenticated && (
            <div className="mb-6 md:mb-8">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="bg-[#F8F9FA] text-[#535862]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#181D27] mb-2">
                    Give your Comments
                  </p>
                  <Textarea
                    placeholder="Enter your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] md:min-h-[100px] resize-none border-[#D5D7DA] focus:border-[#0093DD] focus:ring-[#0093DD]"
                  />
                  <Button
                    className="mt-3 bg-[#0093DD] hover:bg-[#0093DD]/90 text-white px-6 md:px-8 text-sm rounded-full"
                    disabled={
                      !newComment.trim() || createCommentMutation.isPending
                    }
                    onClick={handleCommentSubmit}
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
                </div>
              </div>
            </div>
          )}

          {/* Recent Comments Preview */}
          <div className="space-y-6">
            {comments.slice(0, 3).map((comment) => (
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
                <div className="flex-1">
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
            ))}
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postId={parseInt(id!)}
        comments={comments}
        commentsCount={post.comments}
      />
    </div>
  );
}
