import { Request, Response, NextFunction } from "express";
import { MockDataService } from "../data/mock-data";

// Simple JWT simulation - In production, use a proper JWT library
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

// Mock token validation - In production, use proper JWT validation
function validateToken(
  token: string,
): { id: number; email: string; name: string } | null {
  try {
    // Simple base64 decode for simulation
    const payload = JSON.parse(atob(token.split(".")[1] || ""));

    // Check if user exists
    const user = MockDataService.getUserById(payload.id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
}

export function createMockToken(user: {
  id: number;
  email: string;
  name: string;
}): string {
  // Simple base64 encoding for simulation - In production, use proper JWT
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify(user));
  const signature = btoa("mock-signature");

  return `${header}.${payload}.${signature}`;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const user = validateToken(token);
  if (!user) {
    return res.status(403).json({ message: "Invalid or expired token" });
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
