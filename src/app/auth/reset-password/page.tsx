"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password/update`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--surface-page)" }}
      >
        <Card className="w-full max-w-md animate-fade-in" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <img src="/Ilogo.png" alt="Insspy" className="h-10 w-auto" />
            </div>
            <CardTitle
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Check Your Email
            </CardTitle>
            <CardDescription style={{ color: "var(--text-secondary)" }}>
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full text-[11px] uppercase tracking-wider font-semibold">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--surface-page)" }}
    >
      <Card className="w-full max-w-md animate-fade-in" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <img src="/Ilogo.png" alt="Insspy" className="h-10 w-auto" />
          </div>
          <CardTitle
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reset Password
          </CardTitle>
          <CardDescription style={{ color: "var(--text-secondary)" }}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            {error && (
              <div
                className="text-sm p-3 rounded-lg"
                style={{
                  background: "rgba(248, 113, 113, 0.08)",
                  borderColor: "rgba(248, 113, 113, 0.2)",
                  color: "var(--color-loss)",
                }}
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full text-[11px] uppercase tracking-wider font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Remember your password?{" "}
              <Link href="/auth/login" className="hover:underline" style={{ color: "var(--primary)" }}>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
