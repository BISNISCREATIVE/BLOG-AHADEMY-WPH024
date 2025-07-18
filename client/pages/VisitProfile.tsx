import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard } from "@/components/post/BlogCard";
import { Footer } from "@/components/layout/Footer";
import { User, Post } from "@shared/types";
import apiClient from "@/lib/api";

export default function VisitProfile() {
  const { userId } = useParams<{ userId: string }>();

  // Fetch user data
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch user's posts
  const {
    data: userPosts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: async (): Promise<{ data: Post[]; total: number }> => {
      const response = await apiClient.get(`/posts/by-user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const renderNoPostsState = () => (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      {/* Document Icon */}
      <div className="mb-8">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#0093DD]"
        >
          <rect
            x="20"
            y="10"
            width="80"
            height="100"
            rx="4"
            fill="#E8F4FD"
            stroke="#0093DD"
            strokeWidth="2"
          />
          <rect
            x="10"
            y="20"
            width="80"
            height="100"
            rx="4"
            fill="#0093DD"
            opacity="0.1"
          />
          <line
            x1="30"
            y1="35"
            x2="70"
            y2="35"
            stroke="#0093DD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="45"
            x2="80"
            y2="45"
            stroke="#0093DD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="55"
            x2="75"
            y2="55"
            stroke="#0093DD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="65"
            x2="60"
            y2="65"
            stroke="#0093DD"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="text-lg font-semibold text-[#181D27] mb-2">
        No posts from this user yet
      </h2>
      <p className="text-sm text-[#535862]">Stay tuned for future posts</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-6">
      {/* User Profile Loading */}
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-muted rounded w-16 mb-6" />
      </div>

      {/* Posts Loading */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="flex gap-4">
            <div className="w-48 h-32 bg-muted rounded-lg shrink-0 hidden md:block" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-14" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
          {renderLoadingState()}
        </div>
        <Footer />
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Failed to load user profile. Please try again.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">User not found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const posts = userPosts?.data || [];
  const postCount = userPosts?.total || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
        {/* User Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16 md:w-20 md:h-20">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-[#F8F9FA] text-[#535862] text-xl md:text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#181D27]">
                {user.name}
              </h1>
              <p className="text-sm md:text-base text-[#535862]">
                {user.headline || "User"}
              </p>
            </div>
          </div>

          {/* Posts Count */}
          <div className="border-b border-[#D5D7DA] pb-4">
            <h2 className="text-lg font-semibold text-[#181D27]">
              {postCount} Post{postCount !== 1 ? "s" : ""}
            </h2>
          </div>
        </div>

        {/* Posts Section */}
        {posts.length === 0 ? (
          renderNoPostsState()
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id}>
                <BlogCard post={post} className="" />
                {index < posts.length - 1 && (
                  <div className="w-full h-px bg-[#D5D7DA] mt-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
