import { useState } from "react";
import { BlogCard } from "@/components/post/BlogCard";
import { Pagination } from "@/components/ui/pagination";
import { Footer } from "@/components/layout/Footer";
import { useRecommendedPosts, useMostLikedPosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";

// Simple BlogCard for Most Liked (text only, no images)
function SimpleBlogCard({ post }: { post: any }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#181D27] leading-6 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-sm text-[#535862] leading-5 line-clamp-3">
        {post.content}
      </p>
      <div className="flex items-center gap-4 text-xs text-[#535862]">
        <div className="flex items-center gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2L9.09 6.26L12 6.26L9.91 8.87L11 13.13L8 10.52L5 13.13L6.09 8.87L4 6.26L6.91 6.26L8 2Z"
              fill="currentColor"
            />
          </svg>
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 10.5V3.5C14 2.95 13.55 2.5 13 2.5H3C2.45 2.5 2 2.95 2 3.5V10.5C2 11.05 2.45 11.5 3 11.5H12L14 13.5V10.5Z"
              fill="currentColor"
            />
          </svg>
          <span>{post.comments}</span>
        </div>
      </div>
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

  const renderSkeletonCards = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-6 bg-muted rounded w-16" />
            <div className="h-6 bg-muted rounded w-14" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-muted rounded-full" />
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-1 w-1 bg-muted rounded-full" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 bg-muted rounded w-8" />
            <div className="h-3 bg-muted rounded w-8" />
            <div className="h-3 bg-muted rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonSimpleCards = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="h-5 bg-muted rounded w-4/5" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded w-8" />
            <div className="h-3 bg-muted rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecommendedPosts = (
    posts: any[] | undefined,
    isLoading: boolean,
    error: any,
  ) => {
    if (isLoading) return renderSkeletonCards();

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Failed to load posts. Please try again.
          </p>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No posts available</p>
        </div>
      );
    }

    return (
      <>
        {posts.map((post, index) => (
          <div key={post.id}>
            <BlogCard post={post} className="" />
            {/* Divider between posts */}
            {index < posts.length - 1 && (
              <div className="w-full h-px bg-[#D5D7DA] mt-6" />
            )}
          </div>
        ))}
      </>
    );
  };

  const renderMostLikedPosts = (
    posts: any[] | undefined,
    isLoading: boolean,
    error: any,
  ) => {
    if (isLoading) return renderSkeletonSimpleCards();

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Failed to load posts. Please try again.
          </p>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No posts available</p>
        </div>
      );
    }

    return (
      <>
        {posts.map((post, index) => (
          <div key={post.id}>
            <SimpleBlogCard post={post} />
            {/* Divider between posts */}
            {index < posts.length - 1 && (
              <div className="w-full h-px bg-[#D5D7DA] mt-6" />
            )}
          </div>
        ))}
      </>
    );
  };

  const calculateTotalPages = (totalItems: number) =>
    Math.ceil(totalItems / postsPerPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content - Always show before login layout by default */}
      <div className="w-full max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        <section className="px-4 py-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Recommend For You (with images and carousel) */}
            <div>
              <h1 className="text-xl font-bold text-[#181D27] leading-9 mb-6">
                Recommend For You
              </h1>
              <div className="space-y-6">
                {renderRecommendedPosts(
                  recommendedPosts?.data,
                  loadingRecommended,
                  errorRecommended,
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

            {/* Right Column - Most Liked (text only, no images) */}
            <div className="md:border-l md:border-[#D5D7DA] md:pl-8 lg:pl-12">
              {/* Mobile Divider */}
              <div className="w-full h-1.5 bg-[#D5D7DA] mb-6 md:hidden" />

              <h2 className="text-xl font-bold text-[#181D27] leading-9 mb-6">
                Most Liked
              </h2>
              <div className="space-y-6">
                {renderMostLikedPosts(
                  mostLikedPosts?.data,
                  loadingMostLiked,
                  errorMostLiked,
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
