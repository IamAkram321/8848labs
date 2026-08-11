import { Request, Response, NextFunction } from "express";

// Ensures request is authenticated via active session
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// Restricts route access to admin users
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (req.session?.userRole !== "ADMIN") {
    res.status(403).json({ error: "Access denied. Admin only." });
    return;
  }
  next();
}