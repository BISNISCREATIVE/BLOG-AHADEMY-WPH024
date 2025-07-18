// Main components export index
// Import everything from essentials for cleaner imports throughout the app

export * from "./essentials";

// Re-export commonly used hooks
export { useAuth } from "../hooks/use-auth";
export { useIsMobile as useMobile } from "../hooks/use-mobile";
