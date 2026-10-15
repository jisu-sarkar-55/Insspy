"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--surface-page)" }}>
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
              <CheckCircle2 className="h-8 w-8" style={{ color: "var(--color-profit)" }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Check your email
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            We&apos;ve sent a confirmation link to <span style={{ color: "var(--primary)" }}>{email}</span>
          </p>
          <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
            Click the link to verify your account and start journaling your trades.
          </p>
          <Button onClick={() => router.push("/auth/login")} variant="outline" className="text-xs uppercase tracking-wider">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "var(--surface-page)" }}>
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden border-r" style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(40rem_30rem_at_20%_10%,rgba(255,61,139,0.12),transparent_65%)]" />
        <Link href="/" className="relative">
          <img src="/Ilogo.png" alt="Insspy" className="h-10 w-auto" />
        </Link>
        <div className="relative">
          <h2 className="text-5xl font-bold uppercase tracking-tight leading-[0.95]" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Start<br />compounding<br />your <span className="gradient-text">edge.</span>
          </h2>
          <ul className="mt-8 space-y-3">
            {["Unlimited trades & AI insights", "Personalized coaching", "Free forever, no card"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--color-profit)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <TrendingUp className="h-4 w-4" style={{ color: "var(--primary)" }} />
          We count runs, not luck.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-80 lg:hidden" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--primary)" }}>
              Create account
            </span>
          </div>

          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Get started
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Enter your details to start journaling
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-xl text-sm border"
                style={{
                  background: "rgba(255, 77, 77, 0.08)",
                  borderColor: "rgba(255, 77, 77, 0.25)",
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

            <Button
              type="submit"
              className="w-full text-xs uppercase tracking-wider h-12 mt-2"
              disabled={loading || !acceptedTerms}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-sm text-center pt-2" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link href="/auth/login" className="hover:underline font-semibold" style={{ color: "var(--primary)" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
