import { computeStreaks } from "@/lib/streaks";
import { describe, expect, it } from "vitest";

describe("computeStreaks", () => {
  it("returns 0/0 for empty dates", () => {
    const result = computeStreaks([], "2026-03-12");
    expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  it("computes single day streak when checked in today", () => {
    const result = computeStreaks(["2026-03-12"], "2026-03-12");
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  it("computes current streak ending yesterday", () => {
    const result = computeStreaks(["2026-03-10", "2026-03-11"], "2026-03-12");
    expect(result).toEqual({ currentStreak: 2, longestStreak: 2 });
  });

  it("computes broken streak: current resets, longest preserved", () => {
    const dates = ["2026-03-08", "2026-03-09", "2026-03-10", "2026-03-12"];
    const result = computeStreaks(dates, "2026-03-12");
    expect(result).toEqual({ currentStreak: 1, longestStreak: 3 });
  });

  it("handles consecutive 3-day streak", () => {
    const dates = ["2026-03-10", "2026-03-11", "2026-03-12"];
    const result = computeStreaks(dates, "2026-03-12");
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  it("handles out-of-order dates", () => {
    const dates = ["2026-03-12", "2026-03-10", "2026-03-11"];
    const result = computeStreaks(dates, "2026-03-12");
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  it("handles duplicate dates", () => {
    const dates = ["2026-03-10", "2026-03-10", "2026-03-11"];
    const result = computeStreaks(dates, "2026-03-11");
    expect(result).toEqual({ currentStreak: 2, longestStreak: 2 });
  });

  it("current streak = 0 when last check-in is 2+ days ago", () => {
    const dates = ["2026-03-08", "2026-03-09"];
    const result = computeStreaks(dates, "2026-03-12");
    expect(result).toEqual({ currentStreak: 0, longestStreak: 2 });
  });

  it("handles the Asia/Kolkata worked example", () => {
    // Check-in A: 2026-03-10 -> local 2026-03-10
    // Check-in B: 2026-03-11 -> local 2026-03-11 (20h apart, different local days)
    // Check-in C: 2026-03-11T21:30Z -> local 2026-03-12 (11h after B, new local day)
    // Check-in D: 2026-03-12T17:30Z -> local 2026-03-12 (same local day as C - duplicate)
    const dates = ["2026-03-10", "2026-03-11", "2026-03-12"];
    const result = computeStreaks(dates, "2026-03-12");
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  it("longest streak is preserved even when current is broken", () => {
    const dates = [
      "2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04", "2026-03-05",
      "2026-03-07",
    ];
    const result = computeStreaks(dates, "2026-03-07");
    expect(result).toEqual({ currentStreak: 1, longestStreak: 5 });
  });

  it("UTC-5 user: checked in '2026-03-11', server midnight UTC is 2026-03-12 — streak is 1, not 0", () => {
    // The original bug: UTC says "2026-03-12" but user's local today is "2026-03-11"
    const dates = ["2026-03-11"];
    const todayLocal = "2026-03-11";
    const result = computeStreaks(dates, todayLocal);
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  it("UTC+8 user: checked in '2026-03-12', server time 2026-03-11T20:00Z — streak is 1", () => {
    // User is ahead of UTC: local today is "2026-03-12" while UTC is still "2026-03-11"
    const dates = ["2026-03-12"];
    const todayLocal = "2026-03-12";
    const result = computeStreaks(dates, todayLocal);
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  it("UTC-12 user: last check-in '2026-03-10', local today '2026-03-11' — current streak 1, longest 1", () => {
    // Server time is 2026-03-12T01:00Z, but UTC-12 is still 2026-03-11
    // Gap between check-in and local today is 1 day, so streak = 1
    const dates = ["2026-03-10"];
    const todayLocal = "2026-03-11";
    const result = computeStreaks(dates, todayLocal);
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });
});
