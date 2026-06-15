"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  BookOpen,
  Brain,
  Upload,
  Settings,
  LogOut,
  CandlestickChart,
  Target,
  Trophy,
  ShieldCheck,
  Play,
  Users,
  FileText,
  Library,
  Server,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "AI Coaching", href: "/dashboard/ai-insights", icon: Brain },
    ],
  },
  {
    label: "Trading",
    items: [
      { name: "Trades", href: "/dashboard/trades", icon: TrendingUp },
      { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
      { name: "Import", href: "/dashboard/import", icon: Upload },
    ],
  },
  {
    label: "Strategy",
    items: [
      { name: "Setup Playbook", href: "/dashboard/setup-playbook", icon: Library },
    ],
  },
  {
    label: "Performance",
    items: [
      { name: "Goals", href: "/dashboard/goals", icon: Target },
      { name: "Challenges", href: "/dashboard/challenges", icon: Trophy },
      { name: "Scorecard", href: "/dashboard/scorecard", icon: ShieldCheck },
    ],
  },
  {
    label: "Elite Features",
    items: [
      { name: "Trade Replay", href: "/dashboard/trade-replay", icon: Play },
      { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Users },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Infrastructure", href: "/dashboard/infrastructure", icon: Server },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div
      className="hidden md:flex h-screen w-[220px] flex-col overflow-y-auto border-r hide-scrollbar sticky top-0 flex-shrink-0"
      style={{
        background: "var(--surface-sidebar)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="border-b px-4 py-5" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "rgba(251, 191, 36, 0.12)" }}>
            <CandlestickChart className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </div>
          <span className="font-[var(--font-playfair)] text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            Insspy
          </span>
        </div>
      </div>

      <div className="flex-1 px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mt-3">
            <div
              className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)" }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] transition-all duration-150",
                  )}
                  style={{
                    background: isActive ? "rgba(251, 191, 36, 0.08)" : "transparent",
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                    marginLeft: "-2px",
                    paddingLeft: isActive ? "10px" : "10px",
                  }}
                >
                  <item.icon className="h-4 w-4" style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto border-t p-3" style={{ borderColor: "var(--border-subtle)" }}>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-[12px]"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
