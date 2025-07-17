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
    const result = MockDataService.getPostsByAuthor(req.user.id, page, limit);

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
    const result = MockDataService.getPostsByAuthor(userId, page, limit);

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

    const validatedData = createPostSchema.parse(req.body);

    const newPost = MockDataService.createPost({
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      imageUrl: req.body.imageUrl, // Optional image URL
      authorId: req.user.id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
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

    const validatedData = updatePostSchema.parse(req.body);

    const updatedPost = MockDataService.updatePost(id, {
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      imageUrl: req.body.imageUrl,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
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

// GET /api/posts - Get all posts with optional filtering
export const getAllPosts: RequestHandler = (req, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const sortBy = req.query.sort === "likes" ? "likes" : "latest";

    const result = MockDataService.getAllPosts(page, limit, sortBy);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};
