"use client";

import { CheckInButton } from "@/components/check-in-button";
import { StreakBadge } from "@/components/streak-badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HabitWithStreaks {
  id: string;
  name: string;
  description: string | null;
  currentStreak: number;
  longestStreak: number;
  checkedInToday: boolean;
}

export function HabitCard({ habit, today }: { habit: HabitWithStreaks; today: string }) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/habits/${habit.id}`}
              className="group flex items-center gap-1.5"
            >
              <h3 className="font-medium text-[#1D1D1F] truncate group-hover:text-[#007AFF] transition-colors">
                {habit.name}
              </h3>
              <ArrowRight className="h-3.5 w-3.5 text-[#C7C7CC] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
            {habit.description && (
              <p className="text-sm text-[#86868B] mt-0.5 truncate">
                {habit.description}
              </p>
            )}
          </div>
          <CheckInButton
            habitId={habit.id}
            checkedInToday={habit.checkedInToday}
            today={today}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F5F5F7]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#86868B]">Current</span>
            <StreakBadge count={habit.currentStreak} size="sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#86868B]">Best</span>
            <StreakBadge count={habit.longestStreak} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}