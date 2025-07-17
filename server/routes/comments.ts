import { RequestHandler } from "express";
import { MockDataService } from "../data/mock-data";
import { AuthRequest, authenticateToken } from "../middleware/auth";
import { z } from "zod";

// Validation schemas
const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment too long"),
});

// GET /api/posts/:postId/comments - Get comments for a specific post
export const getPostComments: RequestHandler = (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const comments = MockDataService.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/posts/:postId/comments - Create new comment (auth required)
export const createComment: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists
    const post = MockDataService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const validatedData = createCommentSchema.parse(req.body);

    const newComment = MockDataService.createComment({
      content: validatedData.content,
      authorId: req.user.id,
      postId: postId,
    });

    res.status(201).json(newComment);
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

// DELETE /api/comments/:id - Delete comment (auth required, owner only)
export const deleteComment: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // Check if comment exists and user owns it
    const comments = MockDataService.getCommentsByPostId(0); // Get all comments
    const existingComment = comments.find((c) => c.id === id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.author.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    const deleted = MockDataService.deleteComment(id);
    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
