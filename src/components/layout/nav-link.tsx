"use client";

import { useState } from "react";
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

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavigating(false);
  }

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
        "group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px] font-medium transition-all duration-150",
      )}
      style={{
        background: isActive
          ? "rgba(255, 61, 139, 0.12)"
          : navigating
            ? "rgba(255, 61, 139, 0.06)"
            : "transparent",
        color: isActive
          ? "var(--primary)"
          : navigating
            ? "var(--primary)"
            : "var(--text-secondary)",
        border: isActive
          ? "1px solid rgba(255, 61, 139, 0.25)"
          : "1px solid transparent",
        boxShadow: isActive ? "inset 3px 0 0 var(--primary)" : "none",
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
