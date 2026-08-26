import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less").trim(),
  description: z.string().max(500, "Description must be 500 characters or less").trim().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;