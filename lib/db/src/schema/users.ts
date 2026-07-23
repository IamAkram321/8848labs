import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  // Nullable: a user can exist via Google OAuth only, password only, or both.
  googleId: text("google_id").unique(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  // Null for Google-only accounts that have never set a password.
  passwordHash: text("password_hash"),
  // Google's own email is already verified by Google; set true at insert time
  // for Google sign-ins. Password signups start false until they click the
  // verification link.
  emailVerified: boolean("email_verified").notNull().default(false),
  // Account lockout bookkeeping (per-account, in addition to per-IP rate
  // limiting) — see middleware/authLimiter.ts.
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  // Roles: CUSTOMER | ADMIN
  // Never assign ADMIN via any public API — set directly in the database.
  role: text("role").notNull().default("CUSTOMER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;