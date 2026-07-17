import { pgTable, serial, text, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customOrdersTable = pgTable("custom_orders", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  description: text("description").notNull(),
  intendedUse: text("intended_use"),
  lengthMm: decimal("length_mm", { precision: 10, scale: 2 }),
  widthMm: decimal("width_mm", { precision: 10, scale: 2 }),
  heightMm: decimal("height_mm", { precision: 10, scale: 2 }),
  dimensionUnit: text("dimension_unit").notNull().default("mm"),
  quantity: integer("quantity").notNull().default(1),
  preferredMaterial: text("preferred_material").notNull().default("Not Sure"),
  preferredColor: text("preferred_color"),
  desiredFinish: text("desired_finish").notNull().default("Not Sure"),
  budgetRange: text("budget_range"),
  desiredDeliveryDate: text("desired_delivery_date"),
  additionalNotes: text("additional_notes"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContact: text("preferred_contact").notNull().default("email"),
  fileUrls: jsonb("file_urls").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default("pending"),
  // Admin-only fields
  internalNotes: text("internal_notes"),
  quotationPrice: text("quotation_price"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomOrderSchema = createInsertSchema(customOrdersTable).omit({ id: true, createdAt: true, status: true });
export type InsertCustomOrder = z.infer<typeof insertCustomOrderSchema>;
export type CustomOrder = typeof customOrdersTable.$inferSelect;
