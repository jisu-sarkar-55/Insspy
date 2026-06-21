"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "sarkar55jisu@gmail.com";

type AdFormat = "banner" | "native";

interface AdConfig {
  key: string;
  format: AdFormat;
  width: number;
  height: number;
}

const AD_CONFIGS: Record<string, AdConfig> = {
  "sidebar":           { key: "06d37e6630bce1a6b028459d9d388d3a", format: "banner", width: 300, height: 250 },
  "dashboard-native":  { key: "aca90d7633290e587008ac6faaa66187", format: "native", width: 300, height: 250 },
  "dashboard-banner":  { key: "1c185aef1bffe84028bbc244fc0c4bff", format: "banner", width: 728, height: 90  },
  "trades-banner":     { key: "1c185aef1bffe84028bbc244fc0c4bff", format: "banner", width: 728, height: 90  },
  "settings-banner":   { key: "1c185aef1bffe84028bbc244fc0c4bff", format: "banner", width: 728, height: 90  },
  "landing-features-sep":      { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "landing-dashboard-sep":     { key: "be1d4cc7d4b5cf6a986eed8de4a7872f", format: "banner", width: 160, height: 300 },
  "landing-how-sep":           { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "analytics-sep":             { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "ai-insights-sep":           { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "journal-sidebar":           { key: "be1d4cc7d4b5cf6a986eed8de4a7872f", format: "banner", width: 160, height: 300 },
  "reports-top":               { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "reports-mid":               { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "reports-bottom":            { key: "be1d4cc7d4b5cf6a986eed8de4a7872f", format: "banner", width: 160, height: 300 },
  "scorecard-top":             { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "scorecard-mid":             { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "scorecard-bottom":          { key: "be1d4cc7d4b5cf6a986eed8de4a7872f", format: "banner", width: 160, height: 300 },
  "challenges-mid":            { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "challenges-bottom":         { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "setup-playbook-top":        { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "setup-playbook-bottom":     { key: "be1d4cc7d4b5cf6a986eed8de4a7872f", format: "banner", width: 160, height: 300 },
  "trade-replay-mid":          { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "trade-replay-bottom":       { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "import-mid":                { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "import-bottom":             { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "mt5-setup-mid":             { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "mt5-setup-bottom":          { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "goals-top":                 { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "goals-bottom":              { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "leaderboard-mid":           { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "trade-detail-bottom":       { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "trade-new-bottom":          { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "analytics-top":             { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "analytics-bottom":          { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "ai-insights-top":           { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "ai-insights-bottom":        { key: "4416f0700aaf9f32bc13f6060ba0bbad", format: "banner", width: 468, height: 60  },
  "dashboard-grid-sep":        { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "dashboard-bottom":          { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "analytics-extra-1":         { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "analytics-extra-2":         { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "ai-insights-extra-1":       { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
  "ai-insights-extra-2":       { key: "df975961ae6e3171ee49dc2cfde58916", format: "banner", width: 320, height: 50  },
};

interface AdBannerProps {
  slot: string;
}

function bannerHTML(key: string, width: number, height: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><style>body{margin:0;padding:0;overflow:hidden}</style></head>
    <body>
      <script>
        atOptions = {
          'key': '${key}',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
      <\/script>
      <script src="https://thorpejoy.com/${key}/invoke.js"><\/script>
    </body>
    </html>
  `;
}

function nativeHTML(key: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><style>body{margin:0;padding:0}</style></head>
    <body>
      <script async="async" data-cfasync="false" src="https://thorpejoy.com/${key}/invoke.js"><\/script>
      <div id="container-${key}"></div>
    </body>
    </html>
  `;
}

export function AdBanner({ slot }: AdBannerProps) {
  const config = AD_CONFIGS[slot];
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createClient().auth.getUser().then(({ data }) => {
      if (!cancelled && data.user?.email !== ADMIN_EMAIL) {
        setShowAd(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (!config) return null;
  if (!showAd) return null;

  const adHTML = config.format === "native"
    ? nativeHTML(config.key)
    : bannerHTML(config.key, config.width, config.height);

  return (
    <div className="w-full overflow-hidden mx-auto" style={{ maxWidth: config.width }}>
      <div
        className="flex items-center justify-center"
        style={{ minWidth: config.width, minHeight: config.height }}
      >
        <iframe
          srcDoc={adHTML}
          width={config.width}
          height={config.height}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          title={`ad-${slot}`}
        />
      </div>
    </div>
  );
}
