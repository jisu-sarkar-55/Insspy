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
  Play,
  CheckCircle,
  ExternalLink,
  Copy,
} from "lucide-react";

export default function Mt5SetupPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">MT5 Auto-Sync Setup</h1>
        <p className="text-zinc-400 mt-1">
          Connect your MetaTrader 5 account for automatic trade syncing
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-300">
          <p>
            The MT5 Expert Advisor (EA) runs inside MetaTrader 5 and automatically
            sends your closed trades to this journal. No manual exports needed.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {/* Step 1 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <CardTitle className="text-white">Generate API Key</CardTitle>
                <CardDescription className="text-zinc-400">
                  Create a key to authenticate your MT5 connection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Go to Settings → Generate Key
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <CardTitle className="text-white">Download & Install EA</CardTitle>
                <CardDescription className="text-zinc-400">
                  Copy the EA file into your MT5 Experts folder
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg space-y-2 text-sm">
              <p className="text-zinc-300">1. Open <strong>MetaTrader 5</strong></p>
              <p className="text-zinc-300">2. Go to <strong>File → Open Data Folder</strong></p>
              <p className="text-zinc-300">3. Navigate to <code className="bg-zinc-900 px-1 rounded">MQL5 → Experts</code></p>
              <p className="text-zinc-300">4. Copy <code className="bg-zinc-900 px-1 rounded">TradingJournalSync.mq5</code> here</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Download className="h-4 w-4" />
              <span>The EA file is in your project: <code className="bg-zinc-800 px-1 rounded">mt5-ea/TradingJournalSync.mq5</code></span>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <CardTitle className="text-white">Compile the EA</CardTitle>
                <CardDescription className="text-zinc-400">
                  Build the EA in MetaEditor
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg space-y-2 text-sm">
              <p className="text-zinc-300">1. In MT5, press <strong>F4</strong> to open MetaEditor</p>
              <p className="text-zinc-300">2. Open <code className="bg-zinc-900 px-1 rounded">TradingJournalSync.mq5</code></p>
              <p className="text-zinc-300">3. Press <strong>F7</strong> to compile</p>
              <p className="text-zinc-300">4. Make sure there are <strong className="text-emerald-400">0 errors</strong></p>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <CardTitle className="text-white">Attach EA to Chart</CardTitle>
                <CardDescription className="text-zinc-400">
                  Configure and start the EA
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg space-y-2 text-sm">
              <p className="text-zinc-300">1. Open <strong>Navigator</strong> panel (Ctrl+N)</p>
              <p className="text-zinc-300">2. Find <strong>TradingJournalSync</strong> under Expert Advisors</p>
              <p className="text-zinc-300">3. Drag it onto any chart</p>
              <p className="text-zinc-300">4. In settings:</p>
              <ul className="list-disc list-inside ml-4 text-zinc-400">
                <li><strong>App URL</strong>: Your Vercel URL or <code className="bg-zinc-900 px-1 rounded">http://localhost:3000</code></li>
                <li><strong>API Key</strong>: Paste your key from Settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <div>
                <CardTitle className="text-white">Enable WebRequests</CardTitle>
                <CardDescription className="text-zinc-400">
                  Allow MT5 to connect to the internet
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg space-y-2 text-sm">
              <p className="text-zinc-300">1. Go to <strong>Tools → Options → Expert Advisors</strong></p>
              <p className="text-zinc-300">2. Check <strong>Allow WebRequest for listed URL</strong></p>
              <p className="text-zinc-300">3. Add these URLs:</p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <code className="bg-zinc-900 px-1 rounded text-emerald-400">http://localhost:3000</code>
                  <button
                    onClick={() => navigator.clipboard.writeText("http://localhost:3000")}
                    className="text-zinc-500 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                6
              </div>
              <div>
                <CardTitle className="text-white">Start Auto-Sync</CardTitle>
                <CardDescription className="text-zinc-400">
                  Enable AutoTrading and verify
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg space-y-2 text-sm">
              <p className="text-zinc-300">1. Make sure <strong>AutoTrading</strong> is enabled (toolbar button)</p>
              <p className="text-zinc-300">2. EA should show a <strong className="text-emerald-400">smiley face</strong> on the chart</p>
              <p className="text-zinc-300">3. Check the <strong>Experts</strong> tab for sync logs</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span>Done! Trades will sync automatically every 60 seconds.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Alternative: CSV Import</CardTitle>
          <CardDescription className="text-zinc-400">
            Don&apos;t want auto-sync? Import trades manually instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/import">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Go to CSV Import →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
