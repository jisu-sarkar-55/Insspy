"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Download,
  Settings,
  CheckCircle,
  Copy,
} from "lucide-react";
import { AdBanner } from "@/components/ads/ad-banner";

export default function Mt5SetupPage() {
  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>MT5 Auto-Sync Setup</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Connect your MetaTrader 5 account for automatic trade syncing
        </p>
      </div>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          <p>
            The MT5 Expert Advisor (EA) runs inside MetaTrader 5 and automatically
            sends your closed trades to this journal. No manual exports needed.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center py-4">
        <AdBanner slot="mt5-setup-mid" />
      </div>

      <div className="grid gap-6">
        {/* Step 1 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                1
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Generate API Key</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Create a key to authenticate your MT5 connection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings">
              <Button style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Settings className="h-4 w-4 mr-2" />
                Go to Settings → Generate Key
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                2
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Download & Install EA</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Copy the EA file into your MT5 Experts folder
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: "var(--surface-raised)" }}>
              <p style={{ color: "var(--text-secondary)" }}>1. Open <strong>MetaTrader 5</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>2. Go to <strong>File → Open Data Folder</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>3. Navigate to <code className="px-1 rounded" style={{ background: "var(--surface-card)" }}>MQL5 → Experts</code></p>
              <p style={{ color: "var(--text-secondary)" }}>4. Copy <code className="px-1 rounded" style={{ background: "var(--surface-card)" }}>TradingJournalSync.mq5</code> here</p>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <Download className="h-4 w-4" />
              <span>The EA file is in your project: <code className="px-1 rounded" style={{ background: "var(--surface-raised)" }}>mt5-ea/TradingJournalSync.mq5</code></span>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                3
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Compile the EA</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Build the EA in MetaEditor
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: "var(--surface-raised)" }}>
              <p style={{ color: "var(--text-secondary)" }}>1. In MT5, press <strong>F4</strong> to open MetaEditor</p>
              <p style={{ color: "var(--text-secondary)" }}>2. Open <code className="px-1 rounded" style={{ background: "var(--surface-card)" }}>TradingJournalSync.mq5</code></p>
              <p style={{ color: "var(--text-secondary)" }}>3. Press <strong>F7</strong> to compile</p>
              <p style={{ color: "var(--text-secondary)" }}>4. Make sure there are <strong style={{ color: "var(--color-profit)" }}>0 errors</strong></p>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                4
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Attach EA to Chart</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Configure and start the EA
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: "var(--surface-raised)" }}>
              <p style={{ color: "var(--text-secondary)" }}>1. Open <strong>Navigator</strong> panel (Ctrl+N)</p>
              <p style={{ color: "var(--text-secondary)" }}>2. Find <strong>TradingJournalSync</strong> under Expert Advisors</p>
              <p style={{ color: "var(--text-secondary)" }}>3. Drag it onto any chart</p>
              <p style={{ color: "var(--text-secondary)" }}>4. In settings:</p>
              <ul className="list-disc list-inside ml-4" style={{ color: "var(--text-muted)" }}>
                <li><strong>App URL</strong>: Your Vercel URL or <code className="px-1 rounded" style={{ background: "var(--surface-card)" }}>http://localhost:3000</code></li>
                <li><strong>API Key</strong>: Paste your key from Settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                5
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Enable WebRequests</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Allow MT5 to connect to the internet
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: "var(--surface-raised)" }}>
              <p style={{ color: "var(--text-secondary)" }}>1. Go to <strong>Tools → Options → Expert Advisors</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>2. Check <strong>Allow WebRequest for listed URL</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>3. Add these URLs:</p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <code className="px-1 rounded text-xs" style={{ background: "var(--surface-card)", color: "var(--color-profit)" }}>http://localhost:3000</code>
                  <button
                    onClick={() => navigator.clipboard.writeText("http://localhost:3000")}
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                6
              </div>
              <div>
                <CardTitle style={{ color: "var(--text-primary)" }}>Start Auto-Sync</CardTitle>
                <CardDescription style={{ color: "var(--text-muted)" }}>
                  Enable AutoTrading and verify
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: "var(--surface-raised)" }}>
              <p style={{ color: "var(--text-secondary)" }}>1. Make sure <strong>AutoTrading</strong> is enabled (toolbar button)</p>
              <p style={{ color: "var(--text-secondary)" }}>2. EA should show a <strong style={{ color: "var(--color-profit)" }}>smiley face</strong> on the chart</p>
              <p style={{ color: "var(--text-secondary)" }}>3. Check the <strong>Experts</strong> tab for sync logs</p>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--color-profit)" }}>
              <CheckCircle className="h-5 w-5" />
              <span>Done! Trades will sync automatically every 60 seconds.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Alternative: CSV Import</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Don&apos;t want auto-sync? Import trades manually instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/import">
            <Button variant="outline" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              Go to CSV Import →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
