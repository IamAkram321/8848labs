import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function getCallbackURL(): string {
  if (process.env.APP_BASE_URL) return `${process.env.APP_BASE_URL}/api/auth/google/callback`;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`;
  return "http://localhost:8080/api/auth/google/callback";
}

function getFrontendURL(): string {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return "http://localhost:5173";
}

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
            const inserted = await db
              .insert(usersTable)
              .values({
                googleId: profile.id,
                email,
                name: profile.displayName ?? email,
                avatar: profile.photos?.[0]?.value ?? null,
                role: "CUSTOMER", // ADMIN role is ONLY assigned via direct DB access
              })
              .returning();
            user = inserted[0];
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

/** GET /api/auth/google */
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

/** GET /api/auth/google/callback */
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
