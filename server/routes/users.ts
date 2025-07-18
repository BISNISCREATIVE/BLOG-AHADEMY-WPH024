import { RequestHandler } from "express";
import { MockDataService } from "../data/mock-data";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

// GET /api/users/:id - Get user by ID
export const getUserById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = MockDataService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/users - Get all users
export const getAllUsers: RequestHandler = (req, res) => {
  try {
    const users = MockDataService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  headline: z.string().max(200, "Headline too long").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

// PATCH /api/users/profile - Update current user's profile
export const updateProfile: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = MockDataService.updateUser(req.user.id, validatedData);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
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

// GET /api/users/profile - Get current user's profile
export const getProfile: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = MockDataService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
