import rateLimit from "express-rate-limit";

/**
 * Per-IP rate limits on auth endpoints. These are a DIFFERENT layer of
 * defense from the per-account lockout in routes/auth.ts:
 *   - This file: stops one IP from hammering ANY/ALL accounts
 *     (credential stuffing, distributed guessing across many emails).
 *   - Per-account lockout: stops repeated guesses against ONE specific
 *     account, even if the attacker rotates IPs.
 * You need both — either alone leaves a gap.
 *
 * NOTE: this is in-memory (express-rate-limit's default store), which is
 * fine for a single server instance. If this ever runs across multiple
 * instances/processes (e.g. horizontal scaling on Render), swap the store
 * for a shared one (e.g. rate-limit-redis) or these limits reset per-instance.
 */

const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const signupLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 8,
  message: { error: "Too many signup attempts. Please try again later." },
});

export const loginLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: { error: "Too many login attempts. Please try again later." },
});

export const forgotPasswordLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: { error: "Too many requests. Please try again later." },
});

export const resetPasswordLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,
  message: { error: "Too many requests. Please try again later." },
});