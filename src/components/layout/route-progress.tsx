"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setProgress(10);
      setVisible(true);
      const t1 = setTimeout(() => setProgress(70), 200);
      const t2 = setTimeout(() => setProgress(100), 500);
      const t3 = setTimeout(() => setVisible(false), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-[2px] w-full"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: "var(--primary)",
          boxShadow: "0 0 8px var(--primary)",
        }}
      />
    </div>
  );
}
