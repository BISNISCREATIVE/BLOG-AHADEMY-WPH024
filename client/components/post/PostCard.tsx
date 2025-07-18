import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Post } from "@shared/types";
import { Calendar } from "lucide-react";
import { LikeIcon, CommentIcon } from "@/components/ui/custom-icons";
import { useLikePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const { isAuthenticated } = useAuth();
  const likeMutation = useLikePost();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    likeMutation.mutate(post.id.toString());
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow",
        className,
      )}
    >
      <Link to={`/post/${post.id}`}>
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}

        <CardContent className="p-6">
          <div className="space-y-3">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h3 className="text-xl font-semibold line-clamp-2 leading-tight">
              {post.title}
            </h3>

            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {post.content}
            </p>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <Link
            to={`/user/${post.author.id}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{post.author.name}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {timeAgo}
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-0 hover:bg-transparent"
              onClick={handleLike}
              disabled={!isAuthenticated || likeMutation.isPending}
            >
              <LikeIcon count={post.likes} isLiked={false} />
            </Button>

            <Link to={`/post/${post.id}#comments`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-0 hover:bg-transparent"
              >
                <CommentIcon count={post.comments} />
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
