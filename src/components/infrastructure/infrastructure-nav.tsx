"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Activity,
  Building2,
  Wallet,
  RefreshCw,
  Upload,
  Key,
  Database,
  ShieldCheck,
} from "lucide-react"

const navItems = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "brokers", label: "Brokers", icon: Building2 },
  { id: "accounts", label: "Accounts", icon: Wallet },
  { id: "mt5-sync", label: "MT5 Sync", icon: RefreshCw },
  { id: "imports", label: "Imports", icon: Upload },
  { id: "api-hub", label: "API Hub", icon: Key },
  { id: "backup", label: "Backup", icon: Database },
  { id: "validation", label: "Validation", icon: ShieldCheck },
]

export function InfrastructureNav() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isScrolled, setIsScrolled] = useState(false)

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="infra-nav sticky top-0 z-40 transition-all duration-300"
      style={{
        background: isScrolled
          ? "rgba(20, 18, 16, 0.92)"
          : "rgba(20, 18, 16, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${isScrolled ? "var(--border-subtle)" : "transparent"}`,
        boxShadow: isScrolled
          ? "0 4px 24px rgba(0, 0, 0, 0.4)"
          : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-5">
        <div className="infra-nav-scroll flex items-center gap-1 overflow-x-auto hide-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="group relative flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200"
                style={{
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  background: isActive
                    ? "rgba(251, 191, 36, 0.08)"
                    : "transparent",
                }}
              >
                <item.icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                  }}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, var(--primary), transparent)",
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
