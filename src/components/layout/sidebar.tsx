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
  Link as LinkIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trades", href: "/dashboard/trades", icon: TrendingUp },
  { name: "Import", href: "/dashboard/import", icon: Upload },
  { name: "MT5 Auto-Sync", href: "/dashboard/mt5-setup", icon: LinkIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
    <div className="flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-500" />
          Trading Journal
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600/10 text-emerald-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
