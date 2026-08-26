import { DashboardHeader } from "@/components/dashboard-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <DashboardHeader email={user.email ?? ""} />
      <main className="max-w-2xl mx-auto px-4 pb-12">{children}</main>
    </div>
  );
}