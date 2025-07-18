/**
 * Utility functions for file uploads
 */

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export const defaultUploadOptions: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

export function validateFile(
  file: File,
  options: UploadOptions = defaultUploadOptions,
): { valid: boolean; error?: string } {
  if (options.maxSize && file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size should be less than ${Math.round(options.maxSize / (1024 * 1024))}MB`,
    };
  }

  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
    };
  }

  return { valid: true };
}

export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadAvatar(file: File): Promise<string> {
  // This is a mock function. In a real application, you would:
  // 1. Upload the file to your server or cloud storage (AWS S3, Cloudinary, etc.)
  // 2. Return the URL of the uploaded file

  // For now, we'll just return a data URL for demonstration
  return createFilePreview(file);
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
