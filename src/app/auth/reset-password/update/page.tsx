"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error: err }) => {
      if (err || !data.user) {
        router.push("/auth/login");
        return;
      }
      setChecking(false);
    });
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--surface-page)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--border-medium)", borderTopColor: "transparent" }}
          />
        </div>
      </div>
    );
  }

  if (success) {
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
              Password Updated
            </CardTitle>
            <CardDescription style={{ color: "var(--text-secondary)" }}>
              Your password has been successfully changed.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full text-[11px] uppercase tracking-wider font-semibold">
                Go to Dashboard
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
            Set New Password
          </CardTitle>
          <CardDescription style={{ color: "var(--text-secondary)" }}>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
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
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
