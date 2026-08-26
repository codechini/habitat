"use client";

import { createHabit } from "@/app/(protected)/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HabitForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    if (description) formData.set("description", description);

    const result = await createHabit(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="bg-white border-0 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-medium text-[#1D1D1F]">New Habit</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-[#1D1D1F]">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Drink Water"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] focus-visible:ring-[#007AFF]"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-[#1D1D1F]">
              Description{" "}
              <span className="text-[#86868B]">(optional)</span>
            </Label>
            <Input
              id="description"
              placeholder="e.g. Drink 8 glasses of water"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] focus-visible:ring-[#007AFF]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="flex-1 h-11 rounded-xl text-[#86868B] hover:bg-[#F5F5F7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 h-11 rounded-xl bg-[#007AFF] hover:bg-[#0066CC] text-white font-medium"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}