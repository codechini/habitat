"use client";

import { deleteHabit } from "@/app/(protected)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteHabitButton({ habitId }: { habitId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this habit? This cannot be undone.")) return;
    const result = await deleteHabit(habitId);
    if (!result.error) {
      router.push("/dashboard");
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      className="w-full text-[#FF3B30] hover:bg-red-50 hover:text-[#FF3B30] rounded-xl"
    >
      <Trash2 className="h-4 w-4 mr-1.5" />
      Delete habit
    </Button>
  );
}
