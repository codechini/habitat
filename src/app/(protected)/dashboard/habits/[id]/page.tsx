import { BackfillDialog } from "@/components/backfill-dialog";
import { CalendarGrid } from "@/components/calendar-grid";
import { DeleteHabitButton } from "@/components/delete-habit-button";
import { StreakBadge } from "@/components/streak-badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHabitDetail } from "../../actions";
// import { getHabitDetail } from "../../../actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { habit } = await getHabitDetail(id);
  return {
    title: habit ? `${habit.name} — Habits` : "Habit not found",
  };
}

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getHabitDetail(id);

  if (result.error || !result.habit) {
    notFound();
  }

  const { habit, checkIns = [], currentStreak = 0, longestStreak = 0, today = "" } = result;

  const checkedDates = checkIns.map((c) => c.local_date);

  // Compute current month for calendar
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Get habit created_date for backfill min
  const createdDate = habit.created_date as string;

  return (
    <div className="pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">
            {habit.name}
          </h2>
          {habit.description && (
            <p className="text-sm text-[#86868B] mt-0.5">
              {habit.description}
            </p>
          )}
        </div>
        <BackfillDialog
          habitId={habit.id}
          habitName={habit.name}
          minDate={createdDate}
          today={today}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-[#86868B] mb-1">Current Streak</p>
            <StreakBadge count={currentStreak ?? 0} size="lg" />
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-[#86868B] mb-1">Best Streak</p>
            <StreakBadge count={longestStreak ?? 0} size="lg" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">
            {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <CalendarGrid checkedDates={checkedDates} currentMonth={currentMonth} today={today} />
        </CardContent>
      </Card>

      <Card className="bg-white border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">
            Total check-ins
          </h3>
          <p className="text-3xl font-semibold text-[#1D1D1F] tabular-nums">
            {checkIns.length}
          </p>
          <p className="text-xs text-[#86868B] mt-1">
            Since{" "}
            {new Date(createdDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>

      <DeleteHabitButton habitId={habit.id} />
    </div>
  );
}
