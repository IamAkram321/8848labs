import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    "[cloudinary] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET not set. " +
      "File uploads will fail until these are configured."
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** Extensions Cloudinary can treat as images (transformable, auto-optimized). */
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

/**
 * Everything else supported by the app: 3D models and general documents.
 * These upload to Cloudinary as "raw" resources — stored and served as-is,
 * with no image processing applied.
 */
const RAW_DOCUMENT_EXTENSIONS = new Set([
  ".pdf",
  ".stl",
  ".3mf",
  ".obj",
  ".glb",
  ".step",
  ".stp",
  ".zip",
  ".doc",
  ".docx",
]);

export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  ...IMAGE_EXTENSIONS,
  ...RAW_DOCUMENT_EXTENSIONS,
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

/**
 * Builds a ready-to-use multer instance that uploads directly to Cloudinary.
 *
 * Every upload route in the app should use this instead of configuring its
 * own storage engine, so there's exactly one place that decides how files
 * are validated, sized, and organized in Cloudinary.
 *
 * @param folder - Cloudinary folder to store files under (supports nested
 *   paths, e.g. "8848labs/uploads").
 */
export function createCloudinaryUploader(folder: string) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const ext = getExtension(file.originalname);
      const isImage = IMAGE_EXTENSIONS.has(ext);
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      return {
        folder,
        resource_type: isImage ? "image" : "raw",
        // Images: let Cloudinary auto-append the correct extension based on
        // detected format. Raw files (3D models, PDFs, zips, etc.): Cloudinary
        // does NOT auto-append an extension for raw resources, so we bake it
        // into the public_id ourselves — several parts of the app detect
        // "is this an image" by checking the URL's file extension.
        public_id: isImage ? uniqueId : `${uniqueId}${ext}`,
        use_filename: false,
        unique_filename: false,
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      const ext = getExtension(file.originalname);
      if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
        cb(new Error(`Unsupported file type: ${ext || "unknown"}`));
        return;
      }
      cb(null, true);
    },
  });
}