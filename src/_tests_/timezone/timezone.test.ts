import { todayInTimezone } from "@/lib/timezone";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("todayInTimezone", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns YYYY-MM-DD format", () => {
    const result = todayInTimezone("UTC");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("UTC matches toISOString().split('T')[0]", () => {
    const result = todayInTimezone("UTC");
    const expected = new Date().toISOString().split("T")[0];
    expect(result).toBe(expected);
  });

  it("America/New_York matchestoLocaleDateString with timeZone", () => {
    const result = todayInTimezone("America/New_York");
    const expected = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
    expect(result).toBe(expected);
  });

  it("Asia/Kolkata matches toLocaleDateString with timeZone", () => {
    const result = todayInTimezone("Asia/Kolkata");
    const expected = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    expect(result).toBe(expected);
  });

  it("Pacific/Auckland matches toLocaleDateString with timeZone", () => {
    const result = todayInTimezone("Pacific/Auckland");
    const expected = new Date().toLocaleDateString("en-CA", {
      timeZone: "Pacific/Auckland",
    });
    expect(result).toBe(expected);
  });

  it("UTC midnight → New York is previous day (the original bug)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-12T00:00:00Z"));

    expect(todayInTimezone("America/New_York")).toBe("2026-03-11");
  });

  it("UTC 07:00 → Los Angeles is same day (midnight PDT)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-12T07:00:00Z"));

    expect(todayInTimezone("America/Los_Angeles")).toBe("2026-03-12");
  });
});
