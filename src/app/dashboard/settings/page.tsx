"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsageSummary } from "@/components/usage/usage-summary";
import { AdBanner } from "@/components/ads";
import { User } from "lucide-react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
           Manage your account
        </p>
      </div>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <User className="h-5 w-5" style={{ color: "var(--color-profit)" }} />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Email</Label>
            <Input
              value={email}
              disabled
              style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            />
          </div>
        </CardContent>
      </Card>

      <UsageSummary />

      <div className="pb-8">
        <AdBanner slot="settings-banner" />
      </div>
    </div>
  );
}
