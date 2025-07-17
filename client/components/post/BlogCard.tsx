import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@shared/types";
import { useLikePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { useComments } from "@/hooks/use-comments";
import { CommentsModal } from "@/components/post/CommentsModal";
import { LikeIcon, CommentIcon, ViewsIcon } from "@/components/ui/custom-icons";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const { isAuthenticated } = useAuth();
  const likeMutation = useLikePost();
  const [showComments, setShowComments] = useState(false);
  const { data: comments = [] } = useComments(post.id);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    likeMutation.mutate(post.id.toString());
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComments(true);
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: false,
  });

  return (
    <article className={cn("flex flex-col gap-4 bg-white", className)}>
      <div className="md:flex md:gap-4">
        {/* Left Column - Image (Desktop and Mobile) */}
        {post.imageUrl && (
          <Link to={`/post/${post.id}`} className="block md:w-48 md:shrink-0">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-40 md:h-32 object-cover rounded-lg"
            />
          </Link>
        )}

        {/* Right Column - Content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h2 className="text-base font-bold text-[#181D27] leading-7 line-clamp-2 hover:text-[#0093DD] transition-colors md:text-lg md:leading-8">
              {post.title}
            </h2>
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-start gap-2 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="h-6 px-2 text-xs font-normal border-[#D5D7DA] text-[#535862] bg-[#F8F9FA] rounded-lg"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <Link to={`/post/${post.id}`}>
            <p className="text-sm font-normal text-[#181D27] leading-6 line-clamp-2">
              {post.content.length > 150
                ? `${post.content.slice(0, 150)}...`
                : post.content}
            </p>
          </Link>
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link to={`/user/${post.author.id}`}>
            <Avatar className="h-[30px] w-[30px] hover:opacity-80 transition-opacity">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link
            to={`/user/${post.author.id}`}
            className="text-xs font-normal text-[#181D27] leading-6 hover:text-[#0093DD] transition-colors"
          >
            {post.author.name}
          </Link>
        </div>

        {/* Dot separator */}
        <div className="w-1 h-1 bg-[#A4A7AE] rounded-full" />

        {/* Date */}
        <span className="text-xs font-normal text-[#535862] leading-6">
          {timeAgo}
        </span>
      </div>

      {/* Interaction Bar */}
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={handleLike}
          disabled={!isAuthenticated || likeMutation.isPending}
        >
          <LikeIcon count={post.likes} isLiked={false} />
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={handleComment}
        >
          <CommentIcon count={post.comments} />
        </Button>

        {/* Views Count */}
        <ViewsIcon count={Math.floor(Math.random() * 1000) + 100} />
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        comments={comments}
        commentsCount={post.comments}
      />
    </article>
  );
}
