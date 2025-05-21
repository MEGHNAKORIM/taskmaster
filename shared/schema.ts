import { pgTable, text, serial, integer, numeric, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  firebaseUid: text("firebase_uid").unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  firebaseUid: true,
});

// Project items schema
export const projectItems = pgTable("project_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectItemSchema = createInsertSchema(projectItems).pick({
  userId: true,
  name: true,
  cost: true,
});

// Other costs schema
export const otherCosts = pgTable("other_costs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOtherCostSchema = createInsertSchema(otherCosts).pick({
  userId: true,
  description: true,
  amount: true,
});

// Types for app usage
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ProjectItem = typeof projectItems.$inferSelect;
export type InsertProjectItem = z.infer<typeof insertProjectItemSchema>;

export type OtherCost = typeof otherCosts.$inferSelect;
export type InsertOtherCost = z.infer<typeof insertOtherCostSchema>;

// Firebase types for frontend
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface FirebaseProjectItem {
  id: string;
  name: string;
  cost: number;
  createdAt: Date;
}

export interface FirebaseOtherCost {
  id: string;
  description: string;
  amount: number;
  createdAt: Date;
}
