import { createHabitSchema } from "@/lib/validation/habit";
import { describe, expect, it } from "vitest";

describe("createHabitSchema", () => {
  it("accepts valid habit name", () => {
    const result = createHabitSchema.safeParse({ name: "Drink Water" });
    expect(result.success).toBe(true);
  });

  it("accepts name with description", () => {
    const result = createHabitSchema.safeParse({
      name: "Read",
      description: "Read for 30 minutes",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createHabitSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 characters", () => {
    const result = createHabitSchema.safeParse({
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from name", () => {
    const result = createHabitSchema.safeParse({ name: "  Run  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Run");
    }
  });

  it("rejects description over 500 characters", () => {
    const result = createHabitSchema.safeParse({
      name: "Test",
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
