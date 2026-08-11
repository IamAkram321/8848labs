import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db, usersTable, emailVerificationTokensTable, passwordResetTokensTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, verifyPassword, DUMMY_HASH_FOR_TIMING_SAFETY, isPasswordStrongEnough } from "../lib/password";
import { generateRawToken, hashToken, tokenExpiryDate } from "../lib/tokens";
import { verifyCaptcha } from "../lib/recaptcha";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendAccountAlreadyExistsEmail,
} from "../lib/email";
import { signupLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter } from "../middleware/authLimiter";

const router = Router();

function getBackendURL(): string {
  return process.env.BACKEND_URL || "http://localhost:8080";
}

function getFrontendURL(): string {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}

function getCallbackURL(): string {
  return `${getBackendURL()}/api/auth/google/callback`;
}

// ---------------------------------------------------------------------------
// Google-verified accounts are
// email-verified from the moment they're created, since Google already
// confirmed ownership of that inbox.
// ---------------------------------------------------------------------------

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getCallbackURL(),
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google profile"));

          const existing = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.googleId, profile.id))
            .limit(1);

          let user = existing[0];

          if (!user) {
            // If an account with this email already exists (e.g. they signed
            // up with a password first), link this Google identity to it
            // instead of creating a duplicate account for the same person.
            const byEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

            if (byEmail[0]) {
              const updated = await db
                .update(usersTable)
                .set({
                  googleId: profile.id,
                  avatar: profile.photos?.[0]?.value ?? byEmail[0].avatar,
                  emailVerified: true,
                })
                .where(eq(usersTable.id, byEmail[0].id))
                .returning();
              user = updated[0];
            } else {
              const inserted = await db
                .insert(usersTable)
                .values({
                  googleId: profile.id,
                  email,
                  name: profile.displayName ?? email,
                  avatar: profile.photos?.[0]?.value ?? null,
                  emailVerified: true,
                  role: "CUSTOMER", // ADMIN role is ONLY assigned via direct DB access
                })
                .returning();
              user = inserted[0];
            }
          } else {
            await db
              .update(usersTable)
              .set({
                name: profile.displayName ?? user.name,
                avatar: profile.photos?.[0]?.value ?? user.avatar,
                // Never update role via OAuth
              })
              .where(eq(usersTable.id, user.id));
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
} else {
  console.warn("[auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth disabled.");
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: number }).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    done(null, users[0] ?? null);
  } catch (err) {
    done(err);
  }
});

router.get(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction): void => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(503).json({ error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET." });
      return;
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${getFrontendURL()}/?auth=failed` }),
  (req: Request, res: Response): void => {
    const user = req.user as { id: number; role: string } | undefined;
    if (!user) { res.redirect(`${getFrontendURL()}/?auth=failed`); return; }

    req.session.userId = user.id;
    req.session.userRole = user.role;

    const dest = user.role === "ADMIN" ? `${getFrontendURL()}/admin` : `${getFrontendURL()}/`;
    res.redirect(dest);
  }
);

// ---------------------------------------------------------------------------
// Email/password auth
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-account thresholds (separate from the per-IP limiters in authLimiter.ts).
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const CAPTCHA_REQUIRED_AFTER_ATTEMPTS = 3;

// Single, constant response for every "credentials were wrong" case — a
// nonexistent email, a wrong password, an unverified-but-otherwise-correct
// login... all get this exact string. See routes below for exactly which
// cases share it and why.
const GENERIC_LOGIN_ERROR = "Invalid email or password.";

/** POST /api/auth/signup */
router.post("/auth/signup", signupLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : undefined;

    if (!name || !email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Please provide a valid name and email address." });
      return;
    }
    if (!isPasswordStrongEnough(password)) {
      res.status(400).json({ error: "Password must be at least 8 characters." });
      return;
    }

    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
      return;
    }

    // Always hash the password, on every branch, before checking whether the
    // account exists. This keeps the "new account" and "already exists"
    // branches equal in wall-clock time — the hash is the slow, deliberately
    // expensive step, and skipping it on one branch only would create a
    // measurable timing side-channel an attacker could use to detect which
    // emails already have accounts.
    const passwordHash = await hashPassword(password);

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (existing[0]) {
      // SECURITY: do NOT tell the caller this email is taken. Notify the
      // real account owner instead, and return the exact same response as
      // the success path below.
      void sendAccountAlreadyExistsEmail(existing[0].email, existing[0].name);
    } else {
      const inserted = await db
        .insert(usersTable)
        .values({ email, name, passwordHash, emailVerified: false, role: "CUSTOMER" })
        .returning();
      const user = inserted[0];

      const rawToken = generateRawToken();
      await db.insert(emailVerificationTokensTable).values({
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: tokenExpiryDate(24),
      });

      void sendVerificationEmail(user.email, user.name, rawToken);
    }

    // Identical response, identical wording, regardless of which branch ran.
    res.status(200).json({
      message: "If that email address is available, we've sent instructions to confirm your account.",
    });
  } catch (err) {
    console.error("[auth/signup]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/auth/verify-email?token=... */
router.get("/auth/verify-email", async (req: Request, res: Response): Promise<void> => {
  const rawToken = typeof req.query.token === "string" ? req.query.token : "";

  if (!rawToken) {
    res.redirect(`${getFrontendURL()}/verify-email?status=invalid`);
    return;
  }

  try {
    const tokenHash = hashToken(rawToken);

    const [row] = await db
      .select()
      .from(emailVerificationTokensTable)
      .where(
        and(
          eq(emailVerificationTokensTable.tokenHash, tokenHash),
          gt(emailVerificationTokensTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!row) {
      res.redirect(`${getFrontendURL()}/verify-email?status=invalid`);
      return;
    }

    await db.update(usersTable).set({ emailVerified: true }).where(eq(usersTable.id, row.userId));

    // Single-use: delete immediately so this exact link can never work again.
    await db.delete(emailVerificationTokensTable).where(eq(emailVerificationTokensTable.id, row.id));

    res.redirect(`${getFrontendURL()}/verify-email?status=success`);
  } catch (err) {
    console.error("[auth/verify-email]", err);
    res.redirect(`${getFrontendURL()}/verify-email?status=invalid`);
  }
});

/** POST /api/auth/login */
router.post("/auth/login", loginLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : undefined;

    if (!email || !password) {
      res.status(400).json({ error: GENERIC_LOGIN_ERROR });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    // SECURITY: no such user, OR a Google-only account with no password set —
    // both dummy-compare against a fixed hash and return the exact same
    // generic error as a real wrong-password attempt. Never reveal which of
    // "no account", "no password set", or "wrong password" actually happened.
    if (!user || !user.passwordHash) {
      await verifyPassword(password, DUMMY_HASH_FOR_TIMING_SAFETY);
      res.status(401).json({ error: GENERIC_LOGIN_ERROR });
      return;
    }

    const isLocked = user.lockedUntil && user.lockedUntil.getTime() > Date.now();
    if (isLocked) {
      // Same generic message — do not reveal that lockout is the specific
      // reason, only that the attempt failed.
      res.status(401).json({ error: GENERIC_LOGIN_ERROR });
      return;
    }

    // Once an account has racked up enough recent failures, require a valid
    // CAPTCHA to even attempt the password check. Failing the CAPTCHA gets
    // the exact same generic response as a wrong password — an attacker
    // never learns that CAPTCHA-gating is what's blocking them.
    if (user.failedLoginAttempts >= CAPTCHA_REQUIRED_AFTER_ATTEMPTS) {
      const captchaOk = await verifyCaptcha(captchaToken);
      if (!captchaOk) {
        res.status(401).json({ error: GENERIC_LOGIN_ERROR });
        return;
      }
    }

    const passwordOk = await verifyPassword(password, user.passwordHash);

    if (!passwordOk) {
      const nextAttempts = user.failedLoginAttempts + 1;
      const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;

      await db
        .update(usersTable)
        .set({
          failedLoginAttempts: shouldLock ? 0 : nextAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
        })
        .where(eq(usersTable.id, user.id));

      res.status(401).json({ error: GENERIC_LOGIN_ERROR });
      return;
    }

    if (!user.emailVerified) {
      // This is a deliberate, narrow exception to "identical responses":
      // the password WAS correct, so the caller has already proven they
      // control these credentials — telling them "verify your email" here
      // doesn't hand an attacker anything they don't already have (a
      // correct password for this exact account). Blocking this message
      // entirely would make it impossible for legitimate users to
      // understand why login isn't working.
      res.status(403).json({ error: "Please verify your email before logging in. Check your inbox for the link." });
      return;
    }

    // Success: reset lockout counters and establish the session.
    await db
      .update(usersTable)
      .set({ failedLoginAttempts: 0, lockedUntil: null })
      .where(eq(usersTable.id, user.id));

    req.session.userId = user.id;
    req.session.userRole = user.role;

    res.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/forgot-password */
router.post("/auth/forgot-password", forgotPasswordLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : undefined;

    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
      return;
    }

    if (email && EMAIL_RE.test(email)) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

      if (user) {
        const rawToken = generateRawToken();
        await db.insert(passwordResetTokensTable).values({
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: tokenExpiryDate(1), // 1 hour, as required
        });

        void sendPasswordResetEmail(user.email, user.name, rawToken);
      }
      // No else branch that reveals anything — whether or not a user was
      // found, we fall through to the exact same response below.
    }

    // SECURITY: identical response whether or not the email exists.
    res.status(200).json({
      message: "If an account exists for that email, we've sent password reset instructions.",
    });
  } catch (err) {
    console.error("[auth/forgot-password]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/reset-password */
router.post("/auth/reset-password", resetPasswordLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const rawToken = typeof body.token === "string" ? body.token : "";
    const newPassword = typeof body.password === "string" ? body.password : "";

    if (!rawToken || !isPasswordStrongEnough(newPassword)) {
      res.status(400).json({ error: "Invalid request. Password must be at least 8 characters." });
      return;
    }

    const tokenHash = hashToken(rawToken);

    const [row] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.tokenHash, tokenHash),
          eq(passwordResetTokensTable.used, false),
          gt(passwordResetTokensTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!row) {
      res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, row.userId)).limit(1);
    if (!user) {
      res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
      return;
    }

    const passwordHash = await hashPassword(newPassword);

    await db
      .update(usersTable)
      .set({ passwordHash, failedLoginAttempts: 0, lockedUntil: null })
      .where(eq(usersTable.id, user.id));

    // Single-use: mark used immediately so this exact token can never be
    // replayed, even within its expiry window.
    await db.update(passwordResetTokensTable).set({ used: true }).where(eq(passwordResetTokensTable.id, row.id));

    void sendPasswordChangedEmail(user.email, user.name);

    res.json({ message: "Your password has been reset. You can now log in." });
  } catch (err) {
    console.error("[auth/reset-password]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/auth/me */
router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  if (!req.session?.userId) { res.status(401).json({ user: null }); return; }
  try {
    const users = await db
      .select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, avatar: usersTable.avatar, role: usersTable.role, createdAt: usersTable.createdAt })
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId))
      .limit(1);

    const user = users[0];
    if (!user) { req.session.destroy(() => {}); res.status(401).json({ user: null }); return; }
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/logout */
router.post("/auth/logout", (req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

export default router;