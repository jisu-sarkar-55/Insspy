"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavLink } from "@/components/layout/nav-link";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  BookOpen,
  Brain,
  Upload,
  Settings,
  LogOut,
  Target,
  Trophy,
  ShieldCheck,
  Play,
  Users,
  FileText,
  Library,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  premium?: boolean;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      {
        name: "AI Coaching",
        href: "/dashboard/ai-insights",
        icon: Brain,
        premium: true,
      },
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
      {
        name: "Setup Playbook",
        href: "/dashboard/setup-playbook",
        icon: Library,
        premium: true,
      },
    ],
  },
  {
    label: "Performance",
    items: [
      { name: "Goals", href: "/dashboard/goals", icon: Target },
      { name: "Challenges", href: "/dashboard/challenges", icon: Trophy },
      {
        name: "Scorecard",
        href: "/dashboard/scorecard",
        icon: ShieldCheck,
        premium: true,
      },
    ],
  },
  {
    label: "Elite Features",
    items: [
      {
        name: "Trade Replay",
        href: "/dashboard/trade-replay",
        icon: Play,
        premium: true,
      },
      {
        name: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Users,
        premium: true,
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        icon: FileText,
        premium: true,
      },
    ],
  },
  {
    label: "Account",
    items: [{ name: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function checkPremium() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsPremium(true);
        return;
      }

      const res = await fetch("/api/user/subscription");
      const sub = res.ok ? await res.json() : null;

      setIsPremium(!!sub);
    }
    checkPremium();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div
      className="hidden md:flex fixed top-0 left-0 bottom-0 w-[180px] flex-col overflow-y-auto border-r hide-scrollbar z-40"
      style={{
        background: "var(--surface-sidebar)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="border-b px-4 py-4"
        style={{ borderColor: "var(--border-subtle)", padding: 10 }}
      >
        <Link href="/dashboard" className="block">
          <Image
            src="/logo1.png"
            alt="Insspy"
            width={120}
            height={16}
            priority
          />
        </Link>
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
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  label={item.name}
                  isActive={isActive}
                  premium={item.premium && !isPremium}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="mt-auto border-t p-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
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
