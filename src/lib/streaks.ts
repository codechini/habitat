export function computeStreaks(
  sortedDates: string[],
  today: string
): { currentStreak: number; longestStreak: number } {
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  const unique = [...new Set(sortedDates)].sort();
  const dateSet = new Set(unique);

  // Longest streak: forward walk
  let longestStreak = 1;
  let currentRun = 1;
  for (let i = 1; i < unique.length; i++) {
    if (isConsecutiveDay(unique[i - 1], unique[i])) {
      currentRun++;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentRun);

  // Current streak: backward walk from today (or yesterday)
  let anchor = today;
  if (!dateSet.has(anchor)) {
    anchor = subtractDays(anchor, 1);
  }
  let currentStreak = 0;
  let checkDate = anchor;
  while (dateSet.has(checkDate)) {
    currentStreak++;
    checkDate = subtractDays(checkDate, 1);
  }

  return { currentStreak, longestStreak };
}

function isConsecutiveDay(a: string, b: string): boolean {
  const dateA = new Date(a + "T00:00:00Z");
  const dateB = new Date(b + "T00:00:00Z");
  const diffMs = dateB.getTime() - dateA.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

function subtractDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().split("T")[0];
}