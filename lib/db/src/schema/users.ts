import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").unique().notNull(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  // Roles: CUSTOMER | ADMIN
  // Never assign ADMIN via any public API — set directly in the database.
  role: text("role").notNull().default("CUSTOMER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
