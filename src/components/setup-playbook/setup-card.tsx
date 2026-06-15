"use client";

import Link from "next/link";
import { Clock, Target, Trash2, TrendingUp, ImageIcon } from "lucide-react";
import type { SetupPlaybook } from "@/types";

interface SetupCardProps {
  playbook: SetupPlaybook;
  onDelete: (id: string) => void;
}

function StatusBadge({ playbook }: { playbook: SetupPlaybook }) {
  const entryCount = playbook.entry_rules.length;
  const exitCount = playbook.exit_rules.length;
  const screenshotCount = playbook.screenshot_urls.length;
  const completeness = Math.min(
    100,
    (entryCount > 0 ? 33 : 0) + (exitCount > 0 ? 33 : 0) + (screenshotCount > 0 ? 34 : 0)
  );

  let color = "var(--text-muted)";
  let label = "Empty";
  if (completeness >= 80) {
    color = "var(--color-profit)";
    label = "Complete";
  } else if (completeness >= 40) {
    color = "var(--color-warning)";
    label = "In Progress";
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold"
      style={{ background: `${color}20`, color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

export function SetupCard({ playbook, onDelete }: SetupCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${playbook.name}"? This won't delete linked trades.`)) {
      onDelete(playbook.id);
    }
  };

  const hasScreenshot = playbook.screenshot_urls.length > 0;

  return (
    <Link
      href={`/dashboard/setup-playbook/${playbook.id}`}
      className="group block overflow-hidden rounded-lg border transition-all hover:scale-[1.01] hover:shadow-lg"
      style={{
        background: "var(--surface-card)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {hasScreenshot && (
        <div className="relative h-28 overflow-hidden" style={{ background: "var(--surface-raised)" }}>
          <img
            src={playbook.screenshot_urls[0]}
            alt={playbook.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {playbook.screenshot_urls.length > 1 && (
            <span
              className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium"
              style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}
            >
              <ImageIcon className="h-2.5 w-2.5" />
              +{playbook.screenshot_urls.length - 1}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3
                className="truncate text-[13px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {playbook.name}
              </h3>
              {!playbook.is_active && (
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase"
                  style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
                >
                  Off
                </span>
              )}
            </div>
            {playbook.description && (
              <p
                className="text-[11px] leading-relaxed line-clamp-2"
                style={{ color: "var(--text-muted)" }}
              >
                {playbook.description}
              </p>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="shrink-0 rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {playbook.timeframe && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--color-info-bg)", color: "var(--color-info)" }}
            >
              <Clock className="h-3 w-3" />
              {playbook.timeframe}
            </span>
          )}
          {playbook.market_conditions.slice(0, 3).map((condition) => (
            <span
              key={condition}
              className="rounded-md px-2 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--color-profit-bg)", color: "var(--color-profit)" }}
            >
              {condition}
            </span>
          ))}
          {playbook.market_conditions.length > 3 && (
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
            >
              +{playbook.market_conditions.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" style={{ color: "var(--color-profit)" }} />
              {playbook.entry_rules.length} in
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" style={{ color: "var(--color-loss)" }} />
              {playbook.exit_rules.length} out
            </div>
          </div>
          <StatusBadge playbook={playbook} />
        </div>
      </div>
    </Link>
  );
}
