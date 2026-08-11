import { Request, Response, NextFunction } from "express";

/** Requires a valid logged-in session. Returns 401 otherwise. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

/** Requires ADMIN role. Must be used after requireAuth.
 *  Role is validated server-side from the session — never trust client input. */
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
