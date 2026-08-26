"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardHeader({ email }: { email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
            Habits
          </h1>
          <span className="text-xs text-[#86868B] hidden sm:inline">
            {email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Sign out
        </Button>
      </div>
    </header>
  );
}