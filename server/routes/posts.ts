import { RequestHandler } from "express";
import { MockDataService } from "../data/mock-data";
import {
  AuthRequest,
  authenticateToken,
  optionalAuth,
} from "../middleware/auth";
import { z } from "zod";

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().transform((str) => {
    if (!str || str.trim() === "") return [];
    return str
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }),
});

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z
    .string()
    .transform((str) => {
      if (!str || str.trim() === "") return [];
      return str
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    })
    .optional(),
});

const paginationSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
});

// GET /api/posts/recommended - Get recommended posts (carousel posts with images)
export const getRecommendedPosts: RequestHandler = (req, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = MockDataService.getRecommendedPosts(page, limit);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

// GET /api/posts/most-liked - Get most liked posts (text only, no images)
export const getMostLikedPosts: RequestHandler = (req, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = MockDataService.getMostLikedPosts(page, limit);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

// GET /api/posts/my-posts - Get current user's posts (auth required)
export const getMyPosts: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page, limit } = paginationSchema.parse(req.query);
    const includeUnpublished = req.query.includeUnpublished === "true";
    const result = MockDataService.getPostsByAuthor(
      req.user.id,
      page,
      limit,
      includeUnpublished,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

// GET /api/posts/search - Search posts
export const searchPosts: RequestHandler = (req, res) => {
  try {
    const query = req.query.query as string;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const { page, limit } = paginationSchema.parse(req.query);
    const result = MockDataService.searchPosts(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

// GET /api/posts/by-user/:userId - Get posts by specific user
export const getPostsByUser: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { page, limit } = paginationSchema.parse(req.query);
    const includeUnpublished = req.query.includeUnpublished === "true";
    const result = MockDataService.getPostsByAuthor(
      userId,
      page,
      limit,
      includeUnpublished,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

// GET /api/posts/:id - Get single post
export const getPost: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = MockDataService.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/posts - Create new post (auth required)
export const createPost: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("Create post request body:", req.body);
    console.log("Create post file:", req.file);

    // Handle both JSON and FormData requests
    const requestData = {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || "",
      published: req.body.published === "true" || req.body.published === true,
    };

    const validatedData = createPostSchema.parse(requestData);

    // Handle image file if uploaded
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      // In a real app, you would upload to cloud storage here
      // For now, we'll create a mock URL
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const newPost = MockDataService.createPost({
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      imageUrl,
      authorId: req.user.id,
      published: requestData.published,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// PATCH /api/posts/:id - Update post (auth required, owner only)
export const updatePost: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists and user owns it
    const existingPost = MockDataService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.author.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own posts" });
    }

    console.log("Update post request body:", req.body);
    console.log("Update post file:", req.file);

    // Handle both JSON and FormData requests
    const requestData = {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      published: req.body.published === "true" || req.body.published === true,
    };

    const validatedData = updatePostSchema.parse(requestData);

    // Handle image file if uploaded
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      // In a real app, you would upload to cloud storage here
      // For now, we'll create a mock URL
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const updatedPost = MockDataService.updatePost(id, {
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      imageUrl,
      published: requestData.published,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// DELETE /api/posts/:id - Delete post (auth required, owner only)
export const deletePost: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists and user owns it
    const existingPost = MockDataService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.author.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    const deleted = MockDataService.deletePost(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/posts/:id/like - Like/unlike post
export const likePost: RequestHandler = (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const likedPost = MockDataService.likePost(id);
    if (!likedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(likedPost);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/posts/:id/publish - Publish/unpublish post
export const publishPost: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists and user owns it
    const existingPost = MockDataService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.author.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only publish your own posts" });
    }

    const published = req.body.published ?? true;
    const updatedPost = MockDataService.updatePost(id, { published });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/posts - Get all posts with optional filtering
export const getAllPosts: RequestHandler = (req, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const sortBy = req.query.sort === "likes" ? "likes" : "latest";
    const includeUnpublished = req.query.includeUnpublished === "true";

    const result = MockDataService.getAllPosts(
      page,
      limit,
      sortBy,
      includeUnpublished,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};
