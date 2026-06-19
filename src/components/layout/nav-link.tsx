"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    if (isActive) {
      e.preventDefault();
      return;
    }
    setNavigating(true);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] transition-all duration-150",
      )}
      style={{
        background: isActive
          ? "rgba(251, 191, 36, 0.08)"
          : navigating
            ? "rgba(251, 191, 36, 0.05)"
            : "transparent",
        color: isActive
          ? "var(--primary)"
          : navigating
            ? "var(--primary)"
            : "var(--text-secondary)",
        borderLeft: isActive
          ? "2px solid var(--primary)"
          : "2px solid transparent",
        marginLeft: "-2px",
        paddingLeft: "10px",
      }}
    >
      {navigating ? (
        <Loader2
          className="h-4 w-4 animate-spin"
          style={{ color: "var(--primary)" }}
        />
      ) : (
        <Icon
          className="h-4 w-4 shrink-0"
          style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}
        />
      )}
      <span className="flex-1">{label}</span>
    </Link>
  );
}
