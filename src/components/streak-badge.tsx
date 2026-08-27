import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function StreakBadge({
  count,
  size = "md",
}: {
  count: number;
  size?: "sm" | "md" | "lg";
}) {
  const isActive = count > 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-medium tabular-nums",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-2xl font-semibold",
        isActive ? "text-[#FF9500]" : "text-[#C7C7CC]"
      )}
    >
      <Flame
        className={cn(
          "shrink-0",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-6 w-6",
          isActive ? "fill-[#FF9500]" : "fill-none"
        )}
      />
      <span>{count}</span>
    </div>
  );
}