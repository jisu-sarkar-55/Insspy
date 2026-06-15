"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SetupCard } from "@/components/setup-playbook/setup-card";
import { CreateSetupDialog } from "@/components/setup-playbook/create-setup-dialog";
import { Library, Target, TrendingUp, Image, BarChart3 } from "lucide-react";
import type { SetupPlaybook, SetupPlaybookFormData } from "@/types";

export default function SetupPlaybookPage() {
  const [playbooks, setPlaybooks] = useState<SetupPlaybook[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function fetchPlaybooks() {
      const { data } = await supabase
        .from("setup_playbooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cancelled && data) setPlaybooks(data);
      if (!cancelled) setLoading(false);
    }
    fetchPlaybooks();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleCreate = async (formData: SetupPlaybookFormData) => {
    setCreating(true);
    const res = await fetch("/api/setup-playbooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setPlaybooks([data, ...playbooks]);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/setup-playbooks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlaybooks(playbooks.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
          <div
            className="h-4 w-4 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--border-subtle)", borderTopColor: "var(--color-profit)" }}
          />
          Loading playbooks...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            Setup Playbook
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Your library of trading setups with rules, screenshots, and performance stats
          </p>
        </div>
        {playbooks.length > 0 && (
          <CreateSetupDialog onSubmit={handleCreate} loading={creating} />
        )}
      </div>

      {playbooks.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--color-profit-bg)" }}
          >
            <Library className="h-8 w-8" style={{ color: "var(--color-profit)" }} />
          </div>

          <h2 className="mb-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Build Your Trading System
          </h2>
          <p
            className="mx-auto mb-8 max-w-md text-[13px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Create playbooks for each setup you trade. Define entry and exit rules,
            attach chart screenshots, and track performance stats over time.
          </p>

          <div className="mx-auto mb-8 grid max-w-lg grid-cols-2 gap-3">
            {[
              { icon: Target, label: "Entry & Exit Rules", desc: "Define clear criteria" },
              { icon: Image, label: "Chart Screenshots", desc: "Visual reference library" },
              { icon: TrendingUp, label: "Performance Stats", desc: "Win rate & P&L per setup" },
              { icon: BarChart3, label: "Track Consistency", desc: "Know your edge" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-2.5 rounded-lg p-3 text-left"
                style={{ background: "var(--surface-raised)" }}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--color-profit)" }} />
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {label}
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CreateSetupDialog onSubmit={handleCreate} loading={creating} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {playbooks.map((playbook) => (
            <SetupCard key={playbook.id} playbook={playbook} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
