"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format: "sidebar" | "banner" | "native";
}

const AD_CLASSES: Record<string, string> = {
  sidebar: "min-h-[250px] min-w-[300px]",
  banner: "min-h-[90px] w-full",
  native: "min-h-[120px] w-full",
};

export function AdBanner({ slot, format }: AdBannerProps) {
  const adKey = process.env.NEXT_PUBLIC_ADSTERA_KEY;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adKey || !containerRef.current) return;

    if (typeof (window as any).__adstera__ === "undefined") {
      (window as any).__adstera__ = [];
    }
    (window as any).__adstera__.push({
      slot,
      container: containerRef.current,
    });
  }, [adKey, slot]);

  if (!adKey) return null;

  return (
    <>
      <Script
        src={`https://adstera.com/serve/${adKey}.js`}
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        id={`adstera-${slot}`}
        className={`flex items-center justify-center overflow-hidden ${AD_CLASSES[format] || ""}`}
        style={{ background: "transparent" }}
      />
    </>
  );
}
