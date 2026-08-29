"use client";

import { checkIn } from "@/app/(protected)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CheckInButton({
  habitId,
  checkedInToday,
  today,
}: {
  habitId: string;
  checkedInToday: boolean;
  today: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(checkedInToday);
  const router = useRouter();

  async function handleCheckIn() {
    if (optimistic || isPending) return;

    setOptimistic(true);

    const formData = new FormData();
    formData.set("habit_id", habitId);
    formData.set("local_date", today);

    startTransition(async () => {
      const result = await checkIn(formData);
      if (result.error) {
        setOptimistic(false);
      }
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCheckIn}
      disabled={optimistic || isPending}
      className={
        optimistic
          ? "bg-[#eeef20] border-[#d6d6d6] text-[#202020] disabled:opacity-100 hover:bg-[#34C759] hover:text-white rounded-xl"
          : "border-[#ffd100] text-[#202020] hover:bg-[#eeef20] rounded-xl"
      }
    >
      {optimistic ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Done
        </>
      ) : isPending ? (
        "Checking in..."
      ) : (
        "Check in"
      )}
    </Button>
  );
}