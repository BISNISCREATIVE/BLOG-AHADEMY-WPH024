import { RequestHandler } from "express";
import { MockDataService } from "../data/mock-data";

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
