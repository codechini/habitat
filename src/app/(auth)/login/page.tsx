"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
// import { signupSchema, type SignupInput } from "@/lib/validation/auth";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-0 shadow-none bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-[#1D1D1F]">Sign in</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {serverError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-[#1D1D1F]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] focus-visible:ring-[#007AFF]"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-[#1D1D1F]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="h-11 rounded-xl border-[#D2D2D7] bg-[#F5F5F7] focus-visible:ring-[#007AFF]"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#ffd100] hover:bg-[#ffee32] text-[#202020] font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-[#86868B]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#007AFF] hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}