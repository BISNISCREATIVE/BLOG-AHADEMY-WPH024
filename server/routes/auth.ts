import { RequestHandler } from "express";
import { MockDataService } from "../data/mock-data";
import { createMockToken, AuthRequest } from "../middleware/auth";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation does not match",
    path: ["password_confirmation"],
  });

// POST /api/auth/login - User login
export const login: RequestHandler = (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = MockDataService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // In a real app, you'd verify the hashed password
    // For demo purposes, we'll accept any password for existing users
    // You can also add specific demo passwords if needed

    // Generate token
    const token = createMockToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
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

// POST /api/auth/register - User registration
export const register: RequestHandler = (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = MockDataService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = MockDataService.createUser({
      name,
      email,
      headline: "New User",
      avatarUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    });

    // Generate token
    const token = createMockToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        headline: newUser.headline,
        avatarUrl: newUser.avatarUrl,
      },
      token,
    });
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

// GET /api/auth/me - Get current user (auth required)
export const getCurrentUser: RequestHandler = (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = MockDataService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      headline: user.headline,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/logout - User logout
export const logout: RequestHandler = (req, res) => {
  // In a real JWT implementation, you might maintain a blacklist
  // For this demo, logout is handled client-side by removing the token
  res.json({ message: "Logged out successfully" });
};
