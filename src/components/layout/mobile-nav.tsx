"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Brain,
  MoreHorizontal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const mobileNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trades", href: "/dashboard/trades", icon: TrendingUp },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "AI", href: "/dashboard/ai-insights", icon: Brain },
  { name: "More", href: "/dashboard/more", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [navigating, setNavigating] = useState<string | null>(null);

  useEffect(() => {
    setNavigating(null);
  }, [pathname]);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: "var(--surface-sidebar)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <nav className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isLoading = navigating === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => { if (!isActive) setNavigating(item.href); }}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-0.5 w-14 h-14 transition-colors"
              style={{
                color: isActive ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              <span className="text-[9px] font-medium uppercase tracking-wider">
                {item.name}
              </span>
            </Link>
          );
        })}
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/auth/login");
            router.refresh();
          }}
          className="flex flex-col items-center justify-center gap-0.5 w-14 h-14 transition-colors"
          style={{ color: "var(--text-muted)" }}
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Logout</span>
        </button>
      </nav>
    </div>
  );
}
