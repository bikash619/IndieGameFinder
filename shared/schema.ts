import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game types to be used with the RAWG API
export const gameSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  background_image: z.string().nullable(),
  released: z.string().nullable(),
  metacritic: z.number().nullable(),
  rating: z.number().nullable(),
  ratings_count: z.number(),
  description: z.string().nullable(),
  description_raw: z.string().nullable(),
  genres: z.array(z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  })),
  platforms: z.array(z.object({
    platform: z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    })
  })).nullable(),
  developers: z.array(z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  })).nullable(),
  publishers: z.array(z.object({
    id: z.number(), 
    name: z.string(),
    slug: z.string(),
  })).nullable(),
  parent_platforms: z.array(z.object({
    platform: z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    })
  })).nullable(),
});

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  games_count: z.number(),
  image_background: z.string().nullable(),
});

export const rawgResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(gameSchema),
});

export type Game = z.infer<typeof gameSchema>;
export type Genre = z.infer<typeof genreSchema>;
export type RawgResponse = z.infer<typeof rawgResponseSchema>;

// Filter type
export const filterSchema = z.object({
  genres: z.array(z.string()).optional(),
  minRating: z.number().min(0).max(100).optional(),
  minReviews: z.number().min(0).optional(),
  yearStart: z.number().min(1980).max(2030).optional(),
  yearEnd: z.number().min(1980).max(2030).optional(),
  platforms: z.array(z.number()).optional(),
  ordering: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  page_size: z.number().min(1).max(40).default(20),
});

export type Filter = z.infer<typeof filterSchema>;
