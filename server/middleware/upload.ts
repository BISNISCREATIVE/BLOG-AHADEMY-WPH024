import multer from "multer";
import path from "path";

// Configure storage for file uploads
const storage = multer.memoryStorage(); // Store files in memory for now

// File filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for handling single file upload
export const uploadSingle = upload.single("image");

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  req: any,
  res: any,
  next: any,
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field." });
    }
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ message: "Only image files are allowed." });
  }

  next(error);
};
