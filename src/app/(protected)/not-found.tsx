"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="pt-16 text-center">
      <h2 className="text-lg font-medium text-[#1D1D1F] mb-1">
        Habit not found
      </h2>
      <p className="text-sm text-[#86868B] mb-6">
        This habit may have been deleted.
      </p>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl"
      >
        Back to dashboard
      </Button>
    </div>
  );
}