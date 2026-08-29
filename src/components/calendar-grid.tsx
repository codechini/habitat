"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";


interface CalendarGridProps {
  checkedDates: string[];
  currentMonth: string; // YYYY-MM
  today: string; // YYYY-MM-DD
}

export function CalendarGrid({ checkedDates, currentMonth, today }: CalendarGridProps) {
  const checkedSet = useMemo(() => new Set(checkedDates), [checkedDates]);

  const { year, month, days } = useMemo(() => {
    const [y, m] = currentMonth.split("-").map(Number);
    const firstDay = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();
    return { year: y, month: m, days: { startPad, total: totalDays } };
  }, [currentMonth]);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const cells: (number | null)[] = [];
  for (let i = 0; i < days.startPad; i++) cells.push(null);
  for (let d = 1; d <= days.total; d++) cells.push(d);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((label, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-medium text-[#86868B] py-1"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`pad-${i}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isChecked = checkedSet.has(dateStr);
          const isToday = dateStr === today;
          const isFuture = dateStr > today;

          return (
            <div
              key={dateStr}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                isFuture && "text-[#D2D2D7]",
                !isFuture && !isChecked && !isToday && "text-[#1D1D1F]",
                isChecked && "bg-[#eeef20] text-[#1D1D1F]",
                isToday &&
                !isChecked &&
                "ring-2 ring-[#007AFF]/30 text-[#007AFF]"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
