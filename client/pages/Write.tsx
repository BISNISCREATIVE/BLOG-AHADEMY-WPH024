import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Maximize,
  Upload,
  X,
} from "lucide-react";

interface EditorToolbarProps {
  onFormat: (command: string, value?: string) => void;
  activeFormats: Set<string>;
}

function EditorToolbar({ onFormat, activeFormats }: EditorToolbarProps) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  return (
    <div className="flex items-center flex-wrap gap-2 p-3 border-b border-[#D5D7DA]">
      {/* Heading Dropdown */}
      <Select
        onValueChange={(value) => onFormat("formatBlock", value)}
        defaultValue="div"
      >
        <SelectTrigger className="w-[120px] h-8 text-sm">
          <SelectValue placeholder="Heading 1" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="div">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="p">Paragraph</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-4 bg-[#919EAB33]" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 ${
            activeFormats.has("bold") ? "bg-muted" : ""
          }`}
          onClick={() => onFormat("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 ${
            activeFormats.has("italic") ? "bg-muted" : ""
          }`}
          onClick={() => onFormat("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 ${
            activeFormats.has("strikethrough") ? "bg-muted" : ""
          }`}
          onClick={() => onFormat("strikethrough")}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-[#919EAB33]" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-[#919EAB33]" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("justifyLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("justifyCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("justifyRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("justifyFull")}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-[#919EAB33]" />

      {/* Links and Media */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) onFormat("createLink", url);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("unlink")}
        >
          <Unlink className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) onFormat("insertImage", url);
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-[#919EAB33]" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("undo")}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onFormat("redo")}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-[#919EAB33]" />

      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  error?: string;
}

function TagInput({ tags, onTagsChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-1">
      <div
        className={`flex min-h-[48px] items-center gap-2 rounded-xl border bg-background px-3 py-2 flex-wrap ${
          error ? "border-red-500" : "border-[#D5D7DA]"
        }`}
      >
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="h-7 bg-white border border-[#D5D7DA] text-[#181D27] text-xs gap-1 px-2"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? "Enter your tags" : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploadedImage?: string;
  onRemoveImage?: () => void;
  error?: string;
}

function FileUpload({
  onFileSelect,
  uploadedImage,
  onRemoveImage,
  error,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (imageFile) {
        onFileSelect(imageFile);
      }
    },
    [onFileSelect],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  if (uploadedImage) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-xl border border-dashed border-[#A4A7AE] bg-[#FAFAFA] p-6">
          <img
            src={uploadedImage}
            alt="Cover"
            className="w-full h-[280px] object-cover rounded-lg"
          />
          <div className="flex gap-3 mt-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-3 gap-2"
            >
              <Upload className="h-4 w-4" />
              Change Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              className="h-10 px-3 gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Delete Image
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-[#414651]">
          PNG or JPG (max. 5mb)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className={`relative rounded-xl border border-dashed bg-[#FAFAFA] p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-[#0093DD] bg-blue-50"
            : error
              ? "border-red-500"
              : "border-[#A4A7AE]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D5D7DA]">
            <Upload className="h-5 w-5 text-[#0A0D12]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold text-[#0093DD] underline">
                Click to upload
              </span>
              <span className="text-sm text-[#414651]">or drag and drop</span>
            </div>
            <p className="text-xs text-[#414651]">PNG or JPG (max. 5mb)</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function Write() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const createMutation = useCreatePost();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    image: null as File | null,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tags: "",
    image: "",
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-4">
              Please log in to write a post.
            </p>
            <p className="text-sm text-muted-foreground">
              Demo credentials: john@example.com / any password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEditorFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("strikethrough"))
      formats.add("strikethrough");
    setActiveFormats(formats);
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "File size must be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: "" }));

    // Create preview URL
    const url = URL.createObjectURL(file);
    setUploadedImageUrl(url);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setUploadedImageUrl("");
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      content: "",
      tags: "",
      image: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    const editorContent = editorRef.current?.innerHTML || "";
    if (!editorContent.trim() || editorContent === "<br>") {
      newErrors.content = "Content is required";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const contentHtml = editorRef.current?.innerHTML || "";

      await createMutation.mutateAsync({
        title: formData.title,
        content: contentHtml,
        tags: formData.tags.join(", "),
        image: formData.image,
      });

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Desktop */}
      <div className="hidden md:flex h-20 items-center gap-4 border-b border-[#D5D7DA] bg-white px-4 lg:px-[120px]">
        <button
          onClick={() => navigate(-1)}
          className="flex h-6 w-6 items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-2xl font-bold text-[#181D27]">Write Post</h1>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#181D27]">
            {user?.name || "User"}
          </span>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="md:hidden flex h-16 items-center justify-between border-b border-[#D5D7DA] bg-white px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-base font-bold text-[#181D27]">Write Post</h1>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Main Content */}
      <div className="flex justify-center py-6 md:py-12">
        <div className="w-full max-w-[734px] space-y-5 px-4 md:px-6">
          {/* Title Field */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0A0D12]">
              Title
            </label>
            <Input
              placeholder="Enter your title"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`h-12 rounded-xl border text-sm ${
                errors.title ? "border-red-500" : "border-[#D5D7DA]"
              } focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Content Editor */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0A0D12]">
              Content
            </label>
            <div
              className={`rounded-lg border ${
                errors.content ? "border-red-500" : "border-[#D5D7DA]"
              } focus-within:border-[#0093DD] focus-within:ring-1 focus-within:ring-[#0093DD]`}
            >
              <div className="hidden md:block">
                <EditorToolbar
                  onFormat={handleEditorFormat}
                  activeFormats={activeFormats}
                />
              </div>
              {/* Mobile toolbar - simplified */}
              <div className="md:hidden flex items-center gap-2 p-2 border-b border-[#D5D7DA]">
                <Select
                  onValueChange={(value) =>
                    handleEditorFormat("formatBlock", value)
                  }
                  defaultValue="div"
                >
                  <SelectTrigger className="w-[120px] h-8 text-sm">
                    <SelectValue placeholder="Heading 1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="div">Normal</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => handleEditorFormat("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => handleEditorFormat("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => handleEditorFormat("insertUnorderedList")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => handleEditorFormat("insertOrderedList")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    const url = prompt("Enter image URL:");
                    if (url) handleEditorFormat("insertImage", url);
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[186px] p-4 text-sm text-[#0A0D12] focus:outline-none"
                style={{ lineHeight: "1.6" }}
                onInput={() => {
                  updateActiveFormats();
                  if (errors.content)
                    setErrors((prev) => ({ ...prev, content: "" }));
                }}
                onKeyUp={updateActiveFormats}
                onMouseUp={updateActiveFormats}
                suppressContentEditableWarning={true}
                data-placeholder="Enter your content"
              />
            </div>
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Cover Image */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0A0D12]">
              Cover Image
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              uploadedImage={uploadedImageUrl}
              onRemoveImage={handleRemoveImage}
              error={errors.image}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0A0D12]">Tags</label>
            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => {
                setFormData((prev) => ({ ...prev, tags }));
                if (errors.tags) setErrors((prev) => ({ ...prev, tags: "" }));
              }}
              error={errors.tags}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={createMutation.isPending}
                  className="h-11 rounded-full bg-[#0093DD] px-8 text-sm font-semibold text-white hover:bg-[#0093DD]/90 w-full md:w-auto"
                >
                  {createMutation.isPending ? "Publishing..." : "Finish"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Publish Post</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to publish this post? Once published,
                    it will be visible to all users.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" disabled={createMutation.isPending}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="bg-[#0093DD] hover:bg-[#0093DD]/90"
                  >
                    {createMutation.isPending ? "Publishing..." : "Publish"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Footer - Desktop */}
      <div className="hidden md:block border-t border-[#D5D7DA] bg-white py-6">
        <div className="text-center text-sm text-[#535862]">
          © 2025 Web Programming Hack Blog All rights reserved.
        </div>
      </div>

      {/* Footer - Mobile */}
      <div className="md:hidden border-t border-[#D5D7DA] bg-white py-4">
        <div className="text-center text-xs text-[#535862]">
          © 2025 Web Programming Hack Blog All rights reserved.
        </div>
      </div>
    </div>
  );
}
