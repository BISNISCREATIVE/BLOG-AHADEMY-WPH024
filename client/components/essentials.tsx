// Essential UI Components Bundle
// This file combines the most frequently used UI components for simpler imports

export { Button } from "./ui/button";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";
export {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
export { Badge } from "./ui/badge";
export { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export { Label } from "./ui/label";
export { Pagination } from "./ui/pagination";

// Dialog components
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

// Select components
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Dropdown components
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Tabs components
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Toast components
export { useToast } from "../hooks/use-toast";
export { Toaster } from "./ui/toaster";
export { Toaster as Sonner } from "./ui/sonner";

// Tooltip components
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Custom icons
export * from "./ui/custom-icons";

// Layout components
export { Footer } from "./layout/Footer";
export { Header } from "./layout/Header";
export { Layout } from "./layout/Layout";

// Post components
export { BlogCard } from "./post/BlogCard";
export { PostCard } from "./post/PostCard";
export { CommentsModal } from "./post/CommentsModal";

// Auth components
export { MobileAuthModal } from "./auth/MobileAuthModal";
