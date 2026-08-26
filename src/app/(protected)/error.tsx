"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="text-lg font-medium text-[#1D1D1F] mb-1">
        Something went wrong
      </h2>
      <p className="text-sm text-[#86868B] mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button
        onClick={reset}
        className="bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl"
      >
        Try again
      </Button>
    </div>
  );
}