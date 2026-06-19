"use client";

import { useState } from "react";
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


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

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
              Success! Check your email
            </CardTitle>
            <CardDescription style={{ color: "var(--text-secondary)" }}>
              We&apos;ve sent a confirmation link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              Click the link in your email to verify your account and start
              journaling your trades.
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
              className="text-[11px] uppercase tracking-wider font-semibold"
            >
              Go to Login
            </Button>
          </CardContent>
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
              Create your account
            </CardTitle>
            <CardDescription style={{ color: "var(--text-muted)" }}>
              Enter your details to get started
            </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-md text-sm border"
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                Password
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
                Confirm Password
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
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border shrink-0"
                style={{ accentColor: "var(--primary)" }}
                required
              />
              <label htmlFor="terms" className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="hover:underline font-medium" style={{ color: "var(--primary)" }}>
                  Terms &amp; Conditions
                </Link>
                {" "}and{" "}
                <Link href="/privacy" target="_blank" className="hover:underline font-medium" style={{ color: "var(--primary)" }}>
                  Privacy Policy
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full text-[11px] uppercase tracking-wider font-semibold"
              disabled={loading || !acceptedTerms}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
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
