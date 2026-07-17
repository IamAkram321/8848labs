import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "custom-studio");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".stl", ".3mf", ".obj"]);
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      cb(new Error(`Unsupported file type: ${ext || "unknown"}`));
      return;
    }
    cb(null, true);
  },
});

const router: IRouter = Router();

/** POST /api/uploads — accepts up to 10 files, returns their public URLs */
router.post("/uploads", (req: Request, res: Response) => {
  const handler = upload.array("files", 10);

  handler(req, res, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      res.status(400).json({ error: message });
      return;
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0) {
      res.status(400).json({ error: "No files were uploaded" });
      return;
    }

    const urls = files.map((f) => `/api/uploads/custom-studio/${f.filename}`);
    res.status(201).json({ urls });
  });
});

export default router;