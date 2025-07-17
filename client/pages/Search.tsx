import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { BlogCard } from "@/components/post/BlogCard";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/types";
import apiClient from "@/lib/api";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", searchParams.get("q")],
    queryFn: async (): Promise<{ data: Post[]; total: number }> => {
      const query = searchParams.get("q");
      if (!query) {
        return { data: [], total: 0 };
      }

      const response = await apiClient.get(
        `/posts/search?query=${encodeURIComponent(query)}`,
      );
      return response.data;
    },
    enabled: !!searchParams.get("q"),
  });

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const currentQuery = searchParams.get("q");
  const hasSearched = !!currentQuery;
  const hasResults = searchResults && searchResults.data.length > 0;

  const renderNoResults = () => (
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
        No results found
      </h2>
      <p className="text-sm text-[#535862] mb-8">
        Try using different keywords
      </p>

      <Button
        onClick={handleBackToHome}
        className="bg-[#0093DD] hover:bg-[#0093DD]/90 text-white px-8 py-3 rounded-full"
      >
        Back to Home
      </Button>
    </div>
  );

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="flex gap-4">
                <div className="w-48 h-32 bg-muted rounded-lg shrink-0" />
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
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Failed to search posts. Please try again.
          </p>
        </div>
      );
    }

    if (!hasResults) {
      return renderNoResults();
    }

    return (
      <div className="space-y-6">
        {searchResults.data.map((post, index) => (
          <div key={post.id}>
            <BlogCard post={post} className="" />
            {index < searchResults.data.length - 1 && (
              <div className="w-full h-px bg-[#D5D7DA] mt-6" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 py-6 md:px-8 lg:px-12">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#D5D7DA] focus:border-[#0093DD] focus:ring-[#0093DD]"
              />
            </div>
          </form>
        </div>

        {/* Desktop Search Results Header */}
        {hasSearched && hasResults && (
          <div className="hidden md:block mb-8">
            <h1 className="text-2xl font-bold text-[#181D27]">
              Result for "{currentQuery}"
            </h1>
          </div>
        )}

        {/* Mobile Search Results Header */}
        {hasSearched && (
          <div className="md:hidden mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#D5D7DA] focus:border-[#0093DD] focus:ring-[#0093DD]"
                />
              </div>
            </form>
          </div>
        )}

        {/* Search Results or Empty State */}
        {hasSearched ? (
          renderSearchResults()
        ) : (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#D5D7DA] focus:border-[#0093DD] focus:ring-[#0093DD] h-12"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
