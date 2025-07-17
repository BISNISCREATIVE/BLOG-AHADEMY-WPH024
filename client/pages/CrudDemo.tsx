import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreatePost,
  useMyPosts,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { Post } from "@shared/types";

export default function CrudDemo() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  // Hooks
  const { data: myPosts, isLoading } = useMyPosts(1, 20);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please log in to access the CRUD demo.
            </p>
            <p className="text-sm text-muted-foreground">
              Demo credentials: john@example.com / any password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreatePost = async () => {
    try {
      await createMutation.mutateAsync({
        title: createForm.title,
        content: createForm.content,
        tags: createForm.tags,
      });

      setCreateForm({ title: "", content: "", tags: "" });
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.join(", ") : "",
    });
  };

  const handleUpdatePost = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id: id.toString(),
        data: {
          title: editForm.title,
          content: editForm.content,
          tags: editForm.tags,
        },
      });

      setEditingPost(null);
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CRUD Demo</h1>
            <p className="text-muted-foreground">
              Welcome {user?.name}! Test Create, Read, Update, Delete operations
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            disabled={showCreateForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Post content"
                value={createForm.content}
                onChange={(e) =>
                  setCreateForm({ ...createForm, content: e.target.value })
                }
                rows={4}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={createForm.tags}
                onChange={(e) =>
                  setCreateForm({ ...createForm, tags: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={
                    !createForm.title ||
                    !createForm.content ||
                    createMutation.isPending
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Posts</h2>

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
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No posts yet. Create your first post!
                </p>
              </CardContent>
            </Card>
          ) : (
            myPosts?.data.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {editingPost === post.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                      <Textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        rows={4}
                      />
                      <Input
                        placeholder="Tags (comma separated)"
                        value={editForm.tags}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tags: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdatePost(post.id)}
                          disabled={updateMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingPost(null)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {post.content}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {post.likes} likes • {post.comments} comments •{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
