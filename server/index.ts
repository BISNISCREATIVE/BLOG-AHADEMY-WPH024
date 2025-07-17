import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllPosts,
  getRecommendedPosts,
  getMostLikedPosts,
  getMyPosts,
  searchPosts,
  getPostsByUser,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "./routes/posts";
import { login, register, getCurrentUser, logout } from "./routes/auth";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "./routes/comments";
import { getUserById, getAllUsers } from "./routes/users";
import { authenticateToken, optionalAuth } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/me", authenticateToken, getCurrentUser);
  app.post("/api/auth/logout", logout);

  // Posts routes
  app.get("/api/posts", getAllPosts);
  app.get("/api/posts/recommended", authenticateToken, getRecommendedPosts);
  app.get("/api/posts/most-liked", getMostLikedPosts);
  app.get("/api/posts/my-posts", authenticateToken, getMyPosts);
  app.get("/api/posts/search", searchPosts);
  app.get("/api/posts/by-user/:userId", getPostsByUser);
  app.get("/api/posts/:id", getPost);
  app.post("/api/posts", authenticateToken, createPost);
  app.patch("/api/posts/:id", authenticateToken, updatePost);
  app.delete("/api/posts/:id", authenticateToken, deletePost);
  app.post("/api/posts/:id/like", optionalAuth, likePost);

  // Comments routes
  app.get("/api/posts/:postId/comments", getPostComments);
  app.post("/api/posts/:postId/comments", authenticateToken, createComment);
  app.delete("/api/comments/:id", authenticateToken, deleteComment);

  // Users routes
  app.get("/api/users", getAllUsers);
  app.get("/api/users/:id", getUserById);

  return app;
}
