"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { Crown, Sparkles } from "lucide-react";

interface PremiumGateProps {
  children: ReactNode;
}

export function PremiumGate({ children }: PremiumGateProps) {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      setIsPremium(data?.user?.user_metadata?.tier === "premium");
    }
    check();
    return () => { cancelled = true; };
  }, []);

  if (isPremium === null) {
    return <>{children}</>;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>
      <div
        className="fixed inset-0 md:left-[180px] z-[9999] flex items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            maxWidth: "380px",
            width: "100%",
            margin: "1.5rem",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(251,191,36,0.1))" }}
          >
            <Crown className="h-7 w-7" style={{ color: "var(--color-ai)" }} />
          </div>
          <h2
            className="text-lg font-bold font-[var(--font-playfair)] mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Premium Feature
          </h2>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>
            Upgrade to premium to unlock this feature and get the most out of your trading journal.
          </p>
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all hover:scale-105 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--color-ai), #7c3aed)",
              color: "white",
            }}
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Premium
          </div>
          <div
            className="flex items-center justify-center gap-4 text-[11px] mt-4 flex-wrap"
            style={{ color: "var(--text-muted)" }}
          >
            <span>✦ AI Coaching</span>
            <span>✦ Reports</span>
            <span>✦ Scorecard</span>
            <span>✦ Trade Replay</span>
            <span>✦ Playbooks</span>
          </div>
        </div>
      </div>
    </>
  );
}
