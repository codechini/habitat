import { HabitCard } from "@/components/habit-card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { getHabitsWithStreaks } from "./actions";

export default async function DashboardPage() {
  const { habits, error, today = "" } = await getHabitsWithStreaks();

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            Today
          </h2>
          <p className="text-sm text-[#86868B] mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link href="/dashboard/habits/new">
          <Button className="bg-[#ffee32] hover:bg-[#ffd100] text-[#333533] shadow rounded-xl h-10 px-4">
            <Plus className="h-4 w-4 mr-1.5" />
            New
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      {habits && habits.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5F5F7] mb-4">
            <Sparkles className="h-8 w-8 text-[#C7C7CC]" />
          </div>
          <h3 className="text-lg font-medium text-[#1D1D1F] mb-1">
            No habits yet
          </h3>
          <p className="text-sm text-[#86868B] mb-6">
            Start building streaks that last
          </p>
          <Link href="/dashboard/habits/new">
            <Button className="bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl h-10 px-6">
              <Plus className="h-4 w-4 mr-1.5" />
              Create your first habit
            </Button>
          </Link>
        </div>
      )}

      {habits && habits.length > 0 && (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} today={today} />
          ))}
        </div>
      )}
    </div>
  );
}