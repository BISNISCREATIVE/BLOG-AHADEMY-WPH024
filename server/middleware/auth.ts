import { Request, Response, NextFunction } from "express";
import { MockDataService } from "../data/mock-data";
import jwt from "jsonwebtoken";

// JWT secret for simulation - In production, use environment variable
const JWT_SECRET = "demo-jwt-secret-key-for-blog-app";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

// JWT token validation
function validateToken(
  token: string,
): { id: number; email: string; name: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if user exists
    const user = MockDataService.getUserById(decoded.id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

export function createToken(user: {
  id: number;
  email: string;
  name: string;
}): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth header:", authHeader);
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const user = validateToken(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = user;
  next();
}

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const user = validateToken(token);
    if (user) {
      req.user = user;
    }
  }

  next();
}
