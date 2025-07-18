import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MobileAuthModal } from "@/components/auth/MobileAuthModal";
import { useAuth } from "@/hooks/use-auth";
import { Search, Menu, User, LogOut, Edit3 } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search after navigation
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB]">
        <div className="w-full max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {/* Logo Symbol - matching Figma design */}
              <div className="relative w-8 h-8">
                {/* Main blue squares */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-[#0093DD] transform rotate-45"></div>
                <div className="absolute top-1 left-3 w-4 h-4 bg-[#0093DD] transform rotate-45"></div>
              </div>
              <span className="font-semibold text-lg text-[#181D27]">
                Your Logo
              </span>
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-sm mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A4A7AE] h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg h-10 text-sm placeholder:text-[#A4A7AE] focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Desktop Write Post Button and Profile Menu */}
                  <div className="hidden md:flex items-center gap-3">
                    <Button
                      asChild
                      variant="ghost"
                      className="h-auto px-0 text-[#0093DD] hover:text-[#0093DD]/80 hover:bg-transparent flex items-center gap-2"
                    >
                      <Link to="/write" className="flex items-center gap-2">
                        <Edit3 className="h-5 w-5" />
                        <span className="underline font-medium text-sm">
                          Write Post
                        </span>
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user?.avatarUrl}
                              alt={user?.name}
                            />
                            <AvatarFallback className="bg-[#F3F4F6] text-[#374151] font-medium">
                              {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 bg-white border border-[#E5E7EB] shadow-lg rounded-lg"
                        align="end"
                        sideOffset={8}
                      >
                        <DropdownMenuItem
                          asChild
                          className="px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          <Link
                            to="/profile"
                            className="flex items-center w-full"
                          >
                            <User className="mr-3 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#E5E7EB]" />
                        <DropdownMenuItem
                          onClick={logout}
                          className="px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Avatar */}
                  <div className="md:hidden">
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback className="bg-[#F3F4F6] text-[#374151] font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop Auth Buttons */}
                  <div className="hidden md:flex items-center gap-3">
                    <Button
                      asChild
                      variant="ghost"
                      className="text-sm text-[#0093DD] hover:text-[#0093DD]/80 hover:bg-transparent font-medium"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="text-sm bg-[#0093DD] hover:bg-[#0074B7] text-white px-6 py-2 rounded-lg font-medium"
                    >
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>

                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden p-2 hover:bg-transparent"
                    onClick={() => setShowMobileAuth(true)}
                  >
                    <Menu className="h-6 w-6 text-[#374151]" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-[#E5E7EB] bg-white">
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A4A7AE] h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg h-10 text-sm placeholder:text-[#A4A7AE]"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                {isAuthenticated && (
                  <div className="space-y-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      <Link
                        to="/write"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Edit3 className="h-4 w-4 mr-3" />
                        Write Post
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#374151] hover:bg-[#F9FAFB]"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Auth Modal */}
      <MobileAuthModal
        isOpen={showMobileAuth}
        onClose={() => setShowMobileAuth(false)}
      />
    </>
  );
}
