"use client";

import { checkIn } from "@/app/(protected)/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BackfillDialog({
  habitId,
  habitName,
  minDate,
  today,
}: {
  habitId: string;
  habitName: string;
  minDate: string;
  today: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("habit_id", habitId);
    formData.set("local_date", date);

    const result = await checkIn(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    setDate("");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-[#D2D2D7] text-[#007AFF] hover:bg-[#F0F0FF] rounded-xl"
          />
        }
      >
        <CalendarDays className="h-4 w-4 mr-1.5" />
        Backfill
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-white max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-[#1D1D1F]">
            Backfill for {habitName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="backfill-date" className="text-sm text-[#1D1D1F]">
              Date
            </Label>
            <Input
              id="backfill-date"
              type="date"
              min={minDate}
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] focus-visible:ring-[#007AFF]"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!date || loading}
              className="bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
