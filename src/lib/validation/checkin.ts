import { z } from "zod";

export const checkInSchema = z.object({
  habit_id: z.string().uuid("Invalid habit ID"),
  local_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
