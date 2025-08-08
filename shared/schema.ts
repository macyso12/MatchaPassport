import { z } from "zod";

// Matcha Spot Schema
export const spotSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  averageRating: z.number().min(0).max(5),
  totalRatings: z.number().min(0),
});

export const insertSpotSchema = spotSchema.omit({ id: true });

export type Spot = z.infer<typeof spotSchema>;
export type InsertSpot = z.infer<typeof insertSpotSchema>;

// Check-in Schema
export const checkInSchema = z.object({
  id: z.string(),
  userId: z.string(),
  spotId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
});

export const insertCheckInSchema = checkInSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type CheckIn = z.infer<typeof checkInSchema>;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;

// Saved Spot Schema
export const savedSpotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  spotId: z.string(),
  createdAt: z.date(),
});

export const insertSavedSpotSchema = savedSpotSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type SavedSpot = z.infer<typeof savedSpotSchema>;
export type InsertSavedSpot = z.infer<typeof insertSavedSpotSchema>;

// Comment Schema
export const commentSchema = z.object({
  id: z.string(),
  spotId: z.string(),
  userId: z.string(),
  userName: z.string(),
  text: z.string(),
  createdAt: z.date(),
});

export const insertCommentSchema = commentSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type Comment = z.infer<typeof commentSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// User Schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
