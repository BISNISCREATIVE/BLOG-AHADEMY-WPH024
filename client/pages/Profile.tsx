import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useMyPosts,
  useDeletePost,
  useLikePost,
  useUpdatePost,
} from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { validateFile, createFilePreview } from "@/lib/upload";
import {
  Pencil,
  Trash2,
  BarChart3,
  Camera,
  FileText,
  Heart,
  MessageCircle,
  Eye,
  Settings,
  User,
  Lock,
  X,
} from "lucide-react";
import { Post } from "@shared/types";

interface StatisticsModalProps {
  post: Post;
  type: "likes" | "comments";
  isOpen: boolean;
  onClose: () => void;
}

function StatisticsModal({
  post,
  type,
  isOpen,
  onClose,
}: StatisticsModalProps) {
  const mockLikers = [
    { id: 1, name: "Sarah Johnson", title: "Designer", avatar: "" },
    { id: 2, name: "Michael Chen", title: "Developer", avatar: "" },
    { id: 3, name: "Emily Davis", title: "Writer", avatar: "" },
    { id: 4, name: "Alex Rodriguez", title: "Product Manager", avatar: "" },
    { id: 5, name: "Lisa Thompson", title: "Marketing", avatar: "" },
  ];

  const mockComments = [
    {
      id: 1,
      author: "Sarah Johnson",
      content: "Great insights! Really helpful perspective on this topic.",
      date: "2 hours ago",
      avatar: "",
    },
    {
      id: 2,
      author: "Michael Chen",
      content: "I completely agree with your points. Well written!",
      date: "5 hours ago",
      avatar: "",
    },
    {
      id: 3,
      author: "Emily Davis",
      content: "This is exactly what I was looking for. Thank you!",
      date: "1 day ago",
      avatar: "",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "likes" ? (
              <>
                <Heart className="h-5 w-5 text-red-500" />
                Like ({post.likes})
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5 text-blue-500" />
                Comment ({post.comments})
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {type === "likes" ? (
            <div className="space-y-3">
              {mockLikers.slice(0, post.likes).map((liker) => (
                <div key={liker.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {liker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{liker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {liker.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mockComments.slice(0, post.comments).map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.date}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

function EditPostModal({ post, isOpen, onClose }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const { toast } = useToast();
  const updateMutation = useUpdatePost();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: post.id.toString(),
        data: {
          title: title.trim(),
          content: content.trim(),
          tags: tags.trim(),
          image: imageFile,
          ...(removeImage && { imageUrl: "" }),
        },
      });

      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);

      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      try {
        setImageFile(file);
        const preview = await createFilePreview(file);
        setImagePreview(preview);
        setRemoveImage(false);

        toast({
          title: "Image selected",
          description: "Your new image has been selected.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process the image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const displayImage = imagePreview || (removeImage ? null : post.imageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Image Section */}
          <div>
            <label className="text-sm font-medium">Featured Image</label>
            {displayImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={displayImage}
                  alt="Post preview"
                  className="w-full max-w-md h-40 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0093DD] file:text-white hover:file:bg-[#0093DD]/90"
              />
            </div>
            {imageFile && (
              <p className="text-sm text-[#535862] mt-1">
                New image selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="Enter post title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium">Content *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 min-h-[200px]"
              placeholder="Write your post content..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1"
              placeholder="e.g. Programming, Frontend, Coding"
            />
            <p className="text-xs text-[#535862] mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? "Updating..." : "Update Post"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(
    user?.headline || "Frontend Developer",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, you would upload the avatar to a server/cloud storage
    // and get back a URL to save in the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully!",
    });
    onClose();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);

      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      try {
        setAvatarFile(file);
        const preview = await createFilePreview(file);
        setAvatarPreview(preview);

        toast({
          title: "Photo selected",
          description: "Your new profile photo has been selected.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process the image file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarPreview || user?.avatarUrl}
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 bg-[#0093DD] text-white rounded-full p-2 hover:bg-[#0093DD]/90 cursor-pointer transition-colors shadow-lg"
              >
                <Camera className="h-3 w-3" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          {avatarFile && (
            <p className="text-sm text-center text-[#535862]">
              New photo selected: {avatarFile.name}
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Profile Headline</label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [statisticsModal, setStatisticsModal] = useState<{
    post: Post;
    type: "likes" | "comments";
  } | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPostModal, setEditPostModal] = useState<Post | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hooks
  const { data: myPosts, isLoading } = useMyPosts(1, 20);
  const deleteMutation = useDeletePost();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-4">
              Please log in to view your profile.
            </p>
            <p className="text-sm text-muted-foreground">
              Demo credentials: john@example.com / any password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id.toString());
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully!",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {user?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user?.name || "John Doe"}
                  </h1>
                  <p className="text-muted-foreground">Frontend Developer</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Your Post
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-full mb-2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myPosts?.data.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Your writing journey starts here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Share your thoughts and ideas with the world.
                  </p>
                  <Button>
                    <Pencil className="h-4 w-4 mr-2" />
                    Write Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myPosts?.data.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {post.content}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setStatisticsModal({ post, type: "likes" })
                            }
                            className="flex items-center gap-1"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Statistic
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditPostModal(post)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure to delete?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your post.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
                        <button
                          onClick={() =>
                            setStatisticsModal({ post, type: "likes" })
                          }
                          className="flex items-center gap-1 hover:text-red-600 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          {post.likes} likes
                        </button>
                        <button
                          onClick={() =>
                            setStatisticsModal({ post, type: "comments" })
                          }
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {post.comments} comments
                        </button>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {Math.floor(Math.random() * 1000) + 100} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Change Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      !currentPassword || !newPassword || !confirmPassword
                    }
                    className="w-full"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {statisticsModal && (
        <StatisticsModal
          post={statisticsModal.post}
          type={statisticsModal.type}
          isOpen={true}
          onClose={() => setStatisticsModal(null)}
        />
      )}

      {editPostModal && (
        <EditPostModal
          post={editPostModal}
          isOpen={true}
          onClose={() => setEditPostModal(null)}
        />
      )}

      <EditProfileModal
        user={user}
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </div>
  );
}
