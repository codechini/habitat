"use server";

import { computeStreaks } from "@/lib/streaks";
import { createClient } from "@/lib/supabase/server";
import { todayInTimezone } from "@/lib/timezone";
import { checkInSchema } from "@/lib/validation/checkin";
import { createHabitSchema } from "@/lib/validation/habit";
import { revalidatePath } from "next/cache";

function getTimezone(user: { user_metadata?: Record<string, unknown> }) {
  return (user.user_metadata?.timezone as string) ?? "UTC";
}

export async function getHabitsWithStreaks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", habits: [] };
  }

  const timezone = getTimezone(user);

  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (habitsError) {
    return { error: habitsError.message, habits: [] };
  }

  if (!habits || habits.length === 0) {
    return { habits: [], error: null, timezone, today: todayInTimezone(timezone) };
  }

  const habitIds = habits.map((h) => h.id);
  const today = todayInTimezone(timezone);

  const { data: allCheckIns } = await supabase
    .from("check_ins")
    .select("habit_id, local_date")
    .in("habit_id", habitIds);

  const checkInsByHabit = new Map<string, string[]>();
  for (const ci of allCheckIns ?? []) {
    const arr = checkInsByHabit.get(ci.habit_id) ?? [];
    arr.push(ci.local_date);
    checkInsByHabit.set(ci.habit_id, arr);
  }

  const habitsWithStreaks = habits.map((habit) => {
    const dates = (checkInsByHabit.get(habit.id) ?? []).sort();
    const { currentStreak, longestStreak } = computeStreaks(dates, today);
    const checkedInToday = dates.includes(today);

    return {
      ...habit,
      currentStreak,
      longestStreak,
      checkedInToday,
    };
  });

  return { habits: habitsWithStreaks, error: null, timezone, today };
}

export async function createHabit(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const validated = createHabitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const [{ data: existing }, timezone] = await Promise.all([
    supabase
      .from("habits")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", validated.data.name)
      .eq("description", validated.data.description || null)
      .maybeSingle(),
    Promise.resolve(getTimezone(user)),
  ]);

  if (existing) {
    return { error: "A habit with this name and description already exists" };
  }

  const createdDate = todayInTimezone(timezone);

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name: validated.data.name,
    description: validated.data.description || null,
    created_date: createdDate,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function checkIn(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const validated = checkInSchema.safeParse({
    habit_id: formData.get("habit_id"),
    local_date: formData.get("local_date"),
  });

  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { habit_id, local_date } = validated.data;

  const { data: habit } = await supabase
    .from("habits")
    .select("id, created_date")
    .eq("id", habit_id)
    .eq("user_id", user.id)
    .single();

  if (!habit) {
    return { error: "Habit not found" };
  }

  const timezone = getTimezone(user);
  const today = todayInTimezone(timezone);

  if (local_date > today) {
    return { error: "Cannot check in for a future date" };
  }

  if (local_date < habit.created_date) {
    return { error: "Cannot check in before the habit was created" };
  }

  const { error } = await supabase.from("check_ins").insert({
    habit_id,
    local_date,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Already checked in for this date" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/habits/${habit_id}`);
  return { success: true };
}

export async function getHabitDetail(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const timezone = getTimezone(user);

  const [{ data: habit }, { data: streaks }, { data: checkIns }] =
    await Promise.all([
      supabase
        .from("habits")
        .select("*")
        .eq("id", habitId)
        .eq("user_id", user.id)
        .single(),
      supabase.rpc("compute_streaks", {
        p_habit_id: habitId,
        p_user_timezone: timezone,
      }),
      supabase
        .from("check_ins")
        .select("local_date, created_at")
        .eq("habit_id", habitId)
        .order("local_date", { ascending: true }),
    ]);

  if (!habit) {
    return { error: "Habit not found" };
  }

  const today = todayInTimezone(timezone);

  return {
    habit,
    checkIns: checkIns ?? [],
    currentStreak: streaks?.[0]?.current_streak ?? 0,
    longestStreak: streaks?.[0]?.longest_streak ?? 0,
    timezone,
    today,
  };
}