import rateLimit from "express-rate-limit";

/**
 * Per-IP rate limits for public write endpoints that aren't part of the auth
 * flow but are still real abuse targets:
 *   - uploads hit Cloudinary, which has real cost and account-level quotas
 *   - custom order submissions each trigger a database write and, in
 *     practice, someone on your team eventually reading and responding to it
 *
 * Same in-memory-store caveat as authLimiter.ts: fine for a single server
 * instance, would need a shared store (e.g. Redis) if this ever scales
 * horizontally.
 */

const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const uploadLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 30,
  message: { error: "Too many uploads. Please try again later." },
});

export const customOrderLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: { error: "Too many requests submitted. Please try again later, or contact us directly." },
});