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
          ? "bg-[#34C759] border-[#34C759] text-white hover:bg-[#34C759] hover:text-white rounded-xl"
          : "border-[#D2D2D7] text-[#007AFF] hover:bg-[#F0F0FF] rounded-xl"
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