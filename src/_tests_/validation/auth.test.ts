import { loginSchema, signupSchema } from "@/lib/validation/auth";
import { describe, expect, it } from "vitest";

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      timezone: "Asia/Kolkata",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password456",
      timezone: "Asia/Kolkata",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword");
    }
  });

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "short",
      confirmPassword: "short",
      timezone: "Asia/Kolkata",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      email: "not-an-email",
      password: "password123",
      confirmPassword: "password123",
      timezone: "Asia/Kolkata",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing timezone", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      timezone: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
