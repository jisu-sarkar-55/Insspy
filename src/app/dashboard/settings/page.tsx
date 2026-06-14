"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, Copy, Trash2, CheckCircle, ExternalLink } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  last_used: string | null;
  created_at: string;
}

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }

      const { data: keys } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (keys) setApiKeys(keys);
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  async function generateKey() {
    setGenerating(true);
    const res = await fetch("/api/keys", { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      setApiKeys([data, ...apiKeys]);
    }
    setGenerating(false);
  }

  async function deleteKey(id: string) {
    if (!confirm("Delete this API key? MT5 sync will stop working.")) return;

    const res = await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId: id }),
    });

    if (res.ok) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    }
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">
          Manage your account and API keys
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Email</Label>
            <Input
              value={email}
              disabled
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald-400" />
            API Keys for MT5 Auto-Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-400 text-sm">
            Generate an API key to connect your MT5 account for automatic trade syncing.
          </p>

          <Button
            onClick={generateKey}
            disabled={generating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {generating ? "Generating..." : "+ Generate New Key"}
          </Button>

          {apiKeys.length === 0 ? (
            <div className="p-4 bg-zinc-800 rounded-lg text-center text-zinc-400">
              No API keys yet. Generate one to start MT5 auto-sync.
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{apiKey.name}</span>
                    <div className="flex items-center gap-2">
                      {apiKey.last_used && (
                        <span className="text-xs text-zinc-500">
                          Last used: {new Date(apiKey.last_used).toLocaleDateString()}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                        onClick={() => copyKey(apiKey.key)}
                      >
                        {copied === apiKey.key ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-red-400"
                        onClick={() => deleteKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <code className="block bg-zinc-900 p-2 rounded text-emerald-400 text-xs font-mono break-all">
                    {apiKey.key}
                  </code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">MT5 Connection Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">1.</span>
            <p>Generate an API key above</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">2.</span>
            <p>Copy the key</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">3.</span>
            <p>Open MT5 → File → Open Data Folder → MQL5 → Experts</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">4.</span>
            <p>Copy <code className="bg-zinc-800 px-1 rounded">TradingJournalSync.mq5</code> into the Experts folder</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">5.</span>
            <p>In MT5, drag the EA onto any chart and paste your API key in settings</p>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:underline"
            >
              View full setup guide <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
