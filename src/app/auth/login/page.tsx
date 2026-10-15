"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — check your connection");
      setLoading(false);
    }
  };

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
            Welcome<br />back to the<br /><span className="gradient-text">edge.</span>
          </h2>
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="hud-chip"><span className="hud-label">Trades</span><span className="hud-value">50K+</span></span>
            <span className="hud-chip"><span className="hud-label">Traders</span><span className="hud-value">500+</span></span>
          </div>
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
              Sign in
            </span>
          </div>

          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Sign in to your trading journal
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Password
                </Label>
                <Link href="/auth/reset-password" className="text-xs hover:opacity-80" style={{ color: "var(--primary)" }}>
                  Forgot password?
                </Link>
              </div>
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

            <Button
              type="submit"
              className="w-full text-xs uppercase tracking-wider h-12 mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-center pt-2" style={{ color: "var(--text-secondary)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="hover:underline font-semibold" style={{ color: "var(--primary)" }}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
