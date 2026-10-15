"use client";

import Link from "next/link";
import {
  BookOpen,
  Upload,
  Library,
  Target,
  Trophy,
  ShieldCheck,
  Play,
  Users,
  FileText,
  Settings,
} from "lucide-react";

interface MoreItem {
  name: string;
  href: string;
  icon: typeof BookOpen;
  desc: string;
}

const groups: { label: string; items: MoreItem[] }[] = [
  {
    label: "Trading",
    items: [
      { name: "Journal", href: "/dashboard/journal", icon: BookOpen, desc: "Record detailed trade notes with screenshots and psychology" },
      { name: "Import", href: "/dashboard/import", icon: Upload, desc: "Import trades from MT5 or other platforms" },
    ],
  },
  {
    label: "Strategy",
    items: [
      { name: "Setup Playbook", href: "/dashboard/setup-playbook", icon: Library, desc: "Define and track your trading setups" },
    ],
  },
  {
    label: "Performance",
    items: [
      { name: "Goals", href: "/dashboard/goals", icon: Target, desc: "Set and track your trading goals" },
      { name: "Challenges", href: "/dashboard/challenges", icon: Trophy, desc: "Complete trading challenges and earn badges" },
      { name: "Scorecard", href: "/dashboard/scorecard", icon: ShieldCheck, desc: "Get scored on your trading performance" },
    ],
  },
  {
    label: "Elite Features",
    items: [
      { name: "Trade Replay", href: "/dashboard/trade-replay", icon: Play, desc: "Replay your trades to analyze decisions" },
      { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Users, desc: "Compare your performance with other traders" },
      { name: "Reports", href: "/dashboard/reports", icon: FileText, desc: "Generate detailed PDF reports of your trading" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings, desc: "Manage your account and preferences" },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="max-w-lg mx-auto space-y-6 pb-4">
      <div>
        <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>
          More Features
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          All the tools Insspy has to offer
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2 px-1"
            style={{ color: "var(--text-muted)" }}
          >
            {group.label}
          </div>
          <div className="space-y-2">
            {group.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--surface-raised)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--surface-sidebar)" }}
                >
                  <item.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {item.name}
                  </div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
