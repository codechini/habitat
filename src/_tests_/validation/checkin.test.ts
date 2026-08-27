import { checkInSchema } from "@/lib/validation/checkin";
import { describe, expect, it } from "vitest";

describe("checkInSchema", () => {
  it("accepts valid check-in input", () => {
    const result = checkInSchema.safeParse({
      habit_id: "550e8400-e29b-41d4-a716-446655440000",
      local_date: "2026-03-12",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = checkInSchema.safeParse({
      habit_id: "not-a-uuid",
      local_date: "2026-03-12",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = checkInSchema.safeParse({
      habit_id: "550e8400-e29b-41d4-a716-446655440000",
      local_date: "03-12-2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = checkInSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
