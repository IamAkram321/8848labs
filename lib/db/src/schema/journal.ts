import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalPostsTable = pgTable("journal_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content"),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category"),
  readTime: text("read_time"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const insertJournalPostSchema = createInsertSchema(journalPostsTable).omit({ id: true });
export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;
export type JournalPost = typeof journalPostsTable.$inferSelect;
