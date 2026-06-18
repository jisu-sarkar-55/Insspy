"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Clock, Target, TrendingUp, Trash2 } from "lucide-react";
import { ScreenshotGallery } from "@/components/setup-playbook/screenshot-gallery";
import { CreateSetupDialog } from "@/components/setup-playbook/create-setup-dialog";
import { ConfirmDialog } from "@/components/premium/confirm-dialog";
import type { SetupPlaybook, SetupPlaybookFormData, Trade } from "@/types";

interface PlaybookStats {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  averageRR: number;
}

export default function SetupPlaybookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [playbook, setPlaybook] = useState<SetupPlaybook | null>(null);
  const [stats, setStats] = useState<PlaybookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function fetchPlaybook() {
      await supabase.auth.getUser();
      const res = await fetch(`/api/setup-playbooks/${params.id}`);
      const data = await res.json();

      if (!cancelled && data) {
        setPlaybook(data);
        await fetchStats(data.id);
      }
      if (!cancelled) setLoading(false);
    }

    async function fetchStats(playbookId: string) {
      const res = await fetch("/api/trades");
      const allTrades: Trade[] = await res.json();
      const trades = allTrades.filter(
        (t) => t.setup_playbook_id === playbookId && t.net_pnl != null
      );

      if (trades.length > 0) {
        const totalTrades = trades.length;
        const winTrades = trades.filter((t: Trade) => (t.net_pnl || 0) > 0);
        const winRate = (winTrades.length / totalTrades) * 100;
        const netPnl = trades.reduce((sum: number, t: Trade) => sum + (t.net_pnl || 0), 0);

        const rrTrades = trades.filter((t: Trade) => t.stop_loss && t.net_pnl);
        const averageRR =
          rrTrades.length > 0
            ? rrTrades.reduce((sum: number, t: Trade) => {
                const risk = Math.abs(t.entry_price - t.stop_loss!);
                return risk > 0 ? sum + (t.net_pnl || 0) / risk : sum;
              }, 0) / rrTrades.length
            : 0;

        setStats({ totalTrades, winRate, netPnl, averageRR });
      }
    }

    fetchPlaybook();
    return () => {
      cancelled = true;
    };
  }, [params.id, supabase]);

  const handleUpdate = async (formData: SetupPlaybookFormData) => {
    setUpdating(true);
    const res = await fetch(`/api/setup-playbooks/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setPlaybook(data);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/setup-playbooks/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/setup-playbook");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading playbook...</div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Playbook Not Found
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          This playbook may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/setup-playbook")}
          className="rounded-lg p-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {playbook.name}
            </h1>
            {!playbook.is_active && (
              <span
                className="rounded px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
              >
                Inactive
              </span>
            )}
          </div>
          {playbook.description && (
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {playbook.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CreateSetupDialog
            onSubmit={handleUpdate}
            loading={updating}
            initialData={playbook}
            mode="edit"
          />
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg p-2 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Playbook"
        description={`Delete "${playbook?.name}"? This will not delete linked trades.`}
        onConfirm={handleDelete}
      />

      <div className="flex flex-wrap gap-2">
        {playbook.timeframe && (
          <span
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px]"
            style={{ background: "var(--surface-card)", color: "var(--text-secondary)" }}
          >
            <Clock className="h-3.5 w-3.5" />
            {playbook.timeframe}
          </span>
        )}
        {playbook.market_conditions.map((condition) => (
          <span
            key={condition}
            className="rounded-lg px-3 py-1.5 text-[11px]"
            style={{ background: "var(--color-profit-bg)", color: "var(--color-profit)" }}
          >
            {condition}
          </span>
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div
            className="rounded-lg border p-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Total Trades
            </div>
            <div className="text-xl font-bold mt-1 font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {stats.totalTrades}
            </div>
          </div>
          <div
            className="rounded-lg border p-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Win Rate
            </div>
            <div
              className="text-xl font-bold mt-1 font-[var(--font-playfair)]"
              style={{
                color:
                  stats.winRate >= 60
                    ? "var(--color-profit)"
                    : stats.winRate >= 50
                    ? "var(--color-warning)"
                    : "var(--color-loss)",
              }}
            >
              {stats.winRate.toFixed(1)}%
            </div>
          </div>
          <div
            className="rounded-lg border p-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Net P&L
            </div>
            <div
              className="text-xl font-bold mt-1 font-[var(--font-playfair)]"
              style={{ color: stats.netPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}
            >
              ${stats.netPnl.toFixed(2)}
            </div>
          </div>
          <div
            className="rounded-lg border p-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Avg R:R
            </div>
            <div className="text-xl font-bold mt-1 font-[var(--font-playfair)]" style={{ color: "var(--color-info)" }}>
              {stats.averageRR.toFixed(2)}R
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className="rounded-lg border p-4"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: "var(--color-profit)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Entry Rules
            </h2>
          </div>
          {playbook.entry_rules.length === 0 ? (
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              No entry rules defined
            </div>
          ) : (
            <ul className="space-y-2">
              {playbook.entry_rules.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-lg px-3 py-2 text-[12px]"
                  style={{ background: "var(--surface-raised)", color: "var(--text-primary)" }}
                >
                  <span className="font-medium" style={{ color: "var(--color-profit)" }}>
                    {index + 1}.
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: "var(--color-loss)" }} />
            <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Exit Rules
            </h2>
          </div>
          {playbook.exit_rules.length === 0 ? (
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              No exit rules defined
            </div>
          ) : (
            <ul className="space-y-2">
              {playbook.exit_rules.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-lg px-3 py-2 text-[12px]"
                  style={{ background: "var(--surface-raised)", color: "var(--text-primary)" }}
                >
                  <span className="font-medium" style={{ color: "var(--color-loss)" }}>
                    {index + 1}.
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {playbook.screenshot_urls.length > 0 && (
        <div
          className="rounded-lg border p-4"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <h2 className="mb-3 text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Screenshots & Examples
          </h2>
          <ScreenshotGallery screenshots={playbook.screenshot_urls} />
        </div>
      )}

      {playbook.examples && (
        <div
          className="rounded-lg border p-4"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <h2 className="mb-3 text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Examples & Notes
          </h2>
          <div
            className="whitespace-pre-wrap text-[12px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {playbook.examples}
          </div>
        </div>
      )}
    </div>
  );
}
