import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useRecommendedPosts, useMostLikedPosts } from "@/hooks/use-posts";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Enhanced BlogCard for Recommended Posts (with images)
function RecommendedBlogCard({ post }: { post: any }) {
  return (
    <article className="space-y-4">
      {/* Image */}
      <Link to={`/post/${post.id}`} className="block">
        <img
          src={
            post.imageUrl ||
            "https://via.placeholder.com/400x240?text=Blog+Image"
          }
          alt={post.title}
          className="w-full h-[240px] object-cover rounded-lg hover:opacity-90 transition-opacity"
        />
      </Link>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <Link to={`/post/${post.id}`}>
          <h2 className="text-xl font-bold text-[#181D27] leading-8 line-clamp-2 hover:text-[#0093DD] transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="h-6 px-2 text-xs font-normal border-[#D5D7DA] text-[#535862] bg-[#F8F9FA] rounded"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        <Link to={`/post/${post.id}`}>
          <p className="text-sm text-[#181D27] leading-6 line-clamp-3">
            {post.content.length > 200
              ? `${post.content.slice(0, 200)}...`
              : post.content}
          </p>
        </Link>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link to={`/user/${post.author?.id}`}>
              <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={post.author?.avatarUrl}
                  alt={post.author?.name}
                />
                <AvatarFallback className="text-xs bg-[#F3F4F6] text-[#374151]">
                  {post.author?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              to={`/user/${post.author?.id}`}
              className="text-xs font-medium text-[#181D27] hover:text-[#0093DD] transition-colors"
            >
              {post.author?.name || "Unknown Author"}
            </Link>
          </div>

          <div className="w-1 h-1 bg-[#A4A7AE] rounded-full" />

          <span className="text-xs text-[#535862]">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#535862]">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-[#535862]">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// Simple BlogCard for Most Liked (text only)
function SimpleBlogCard({ post }: { post: any }) {
  return (
    <article className="space-y-3">
      <Link to={`/post/${post.id}`}>
        <h3 className="text-lg font-semibold text-[#181D27] leading-6 line-clamp-2 hover:text-[#0093DD] transition-colors">
          {post.title}
        </h3>
      </Link>

      <p className="text-sm text-[#535862] leading-5 line-clamp-3">
        {post.content.length > 150
          ? `${post.content.slice(0, 150)}...`
          : post.content}
      </p>

      <div className="flex items-center gap-4 text-xs text-[#535862]">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{post.likes || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments || 0}</span>
        </div>
      </div>
    </article>
  );
}

// Custom Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push(-1); // ellipsis

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push(-2); // ellipsis
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 hover:bg-[#F9FAFB]"
      >
        <ChevronLeft className="h-4 w-4 text-[#535862]" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === -1 || page === -2 ? (
            <span className="px-3 py-1 text-[#535862]">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={
                currentPage === page
                  ? "w-8 h-8 bg-[#0093DD] text-white hover:bg-[#0074B7]"
                  : "w-8 h-8 text-[#535862] hover:bg-[#F9FAFB]"
              }
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <span className="mx-2 text-[#535862]">Next</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 hover:bg-[#F9FAFB]"
      >
        <ChevronRight className="h-4 w-4 text-[#535862]" />
      </Button>
    </div>
  );
}

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [mostLikedPage, setMostLikedPage] = useState(1);
  const postsPerPage = 5;

  const {
    data: recommendedPosts,
    isLoading: loadingRecommended,
    error: errorRecommended,
  } = useRecommendedPosts(recommendedPage, postsPerPage);

  const {
    data: mostLikedPosts,
    isLoading: loadingMostLiked,
    error: errorMostLiked,
  } = useMostLikedPosts(mostLikedPage, postsPerPage);

  // Loading skeleton for recommended posts
  const renderRecommendedSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-4 animate-pulse">
          <div className="h-60 bg-[#F3F4F6] rounded-lg" />
          <div className="space-y-3">
            <div className="h-6 bg-[#F3F4F6] rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-[#F3F4F6] rounded w-20" />
              <div className="h-6 bg-[#F3F4F6] rounded w-16" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-[#F3F4F6] rounded w-full" />
              <div className="h-4 bg-[#F3F4F6] rounded w-2/3" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[#F3F4F6] rounded-full" />
              <div className="h-4 bg-[#F3F4F6] rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading skeleton for most liked posts
  const renderMostLikedSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="h-5 bg-[#F3F4F6] rounded w-4/5" />
          <div className="space-y-2">
            <div className="h-4 bg-[#F3F4F6] rounded w-full" />
            <div className="h-4 bg-[#F3F4F6] rounded w-3/4" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 bg-[#F3F4F6] rounded w-8" />
            <div className="h-4 bg-[#F3F4F6] rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  const calculateTotalPages = (totalItems: number) =>
    Math.ceil(totalItems / postsPerPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        <section className="px-4 py-8 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Recommend For You */}
            <div>
              <h1 className="text-2xl font-bold text-[#181D27] mb-6">
                Recommend For You
              </h1>

              <div className="space-y-8">
                {loadingRecommended ? (
                  renderRecommendedSkeleton()
                ) : errorRecommended ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#535862]">
                      Failed to load posts. Please try again.
                    </p>
                  </div>
                ) : !recommendedPosts?.data ||
                  recommendedPosts.data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#535862]">No posts available</p>
                  </div>
                ) : (
                  recommendedPosts.data.map((post, index) => (
                    <div key={post.id}>
                      <RecommendedBlogCard post={post} />
                      {index < recommendedPosts.data.length - 1 && (
                        <div className="w-full h-px bg-[#E5E7EB] mt-8" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination for Recommended */}
              {recommendedPosts?.data && recommendedPosts.data.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={recommendedPage}
                    totalPages={calculateTotalPages(
                      recommendedPosts.total || recommendedPosts.data.length,
                    )}
                    onPageChange={setRecommendedPage}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Most Liked */}
            <div className="md:border-l md:border-[#E5E7EB] md:pl-8 lg:pl-12">
              {/* Mobile Divider */}
              <div className="w-full h-1.5 bg-[#E5E7EB] mb-6 md:hidden" />

              <h2 className="text-2xl font-bold text-[#181D27] mb-6">
                Most Liked
              </h2>

              <div className="space-y-6">
                {loadingMostLiked ? (
                  renderMostLikedSkeleton()
                ) : errorMostLiked ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#535862]">
                      Failed to load posts. Please try again.
                    </p>
                  </div>
                ) : !mostLikedPosts?.data ||
                  mostLikedPosts.data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#535862]">No posts available</p>
                  </div>
                ) : (
                  mostLikedPosts.data.map((post, index) => (
                    <div key={post.id}>
                      <SimpleBlogCard post={post} />
                      {index < mostLikedPosts.data.length - 1 && (
                        <div className="w-full h-px bg-[#E5E7EB] mt-6" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
