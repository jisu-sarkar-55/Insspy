"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-[2px] w-full"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-full transition-all duration-700 ease-out"
        style={{
          width: "90%",
          background: "var(--primary)",
          boxShadow: "0 0 8px var(--primary)",
        }}
      />
    </div>
  );
}
