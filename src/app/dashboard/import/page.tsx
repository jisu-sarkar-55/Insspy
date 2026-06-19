"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/ads/ad-banner";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    imported?: number;
  } | null>(null);
  const router = useRouter();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["Time", "Deal", "Symbol", "Type", "Direction", "Volume", "Price", "Order", "Commission", "Fee", "Swap", "Profit", "Balance"];
    const exampleRows = [
      ["2026.06.15 17:19:29", "8722896376", "EURUSD", "buy", "in", "0.71", "1.16119", "9089905397", "0.00", "0.00", "0.00", "0.00", "3000.00"],
      ["2026.06.15 17:20:01", "8722913386", "EURUSD", "sell", "out", "0.71", "1.16123", "9089921355", "0.00", "0.00", "0.00", "2.84", "3002.84"],
    ];

    const csvContent = [
      headers.join(","),
      ...exampleRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mt5-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Import failed",
        });
      } else {
        setResult({
          success: true,
          message: `Successfully imported ${data.imported} trades!`,
          imported: data.imported,
        });
        setFile(null);
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Import Trades</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Import your MT5 trading history
        </p>
      </div>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>How to Export from MT5</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Follow these steps to export your trade history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <div className="flex items-start gap-3">
            <span className="font-bold" style={{ color: "var(--color-profit)" }}>1.</span>
            <p>Open <strong>MetaTrader 5</strong> and go to the <strong>Toolbox</strong> panel (Ctrl+T)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold" style={{ color: "var(--color-profit)" }}>2.</span>
            <p>Click the <strong>&quot;History&quot;</strong> tab at the bottom</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold" style={{ color: "var(--color-profit)" }}>3.</span>
            <p>Right-click anywhere in the history table and select <strong>&quot;Export All&quot;</strong> or select specific trades</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold" style={{ color: "var(--color-profit)" }}>4.</span>
            <p>Choose <strong>&quot;CSV&quot;</strong> as the format and save the file</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold" style={{ color: "var(--color-profit)" }}>5.</span>
            <p>Upload the CSV file below</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center py-4">
        <AdBanner slot="import-mid" />
      </div>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Upload File</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Drag and drop your MT5 CSV file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg" style={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Prefer to paste from an MT5 HTML report? Download our template, copy trade rows from your report, and paste them in.
            </p>
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") document.getElementById("file-input")?.click(); }}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-12 text-center transition-colors cursor-pointer`}
            style={{
              borderColor: file ? "var(--color-profit)" : "var(--border-subtle)",
              background: file ? "var(--color-profit-bg)" : "var(--surface-raised)",
            }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv,.htm,.html"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto" style={{ color: "var(--color-profit)" }} />
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{file.name}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto" style={{ color: "var(--text-muted)" }} />
                <p style={{ color: "var(--text-muted)" }}>
                  Drop your MT5 export file here
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Supports .csv, .htm, .html files
                </p>
              </div>
            )}
          </div>

          {result && (
            <div
              className="p-4 rounded-lg flex items-center gap-3"
              style={{
                background: result.success ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                border: `1px solid ${result.success ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
                color: result.success ? "var(--color-profit)" : "var(--color-loss)",
              }}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full sm:w-auto"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Trades
                </>
              )}
            </Button>

            {result?.success && (
              <Button
                onClick={() => router.push("/dashboard/trades")}
                variant="outline"
                className="w-full sm:w-auto"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                View Trades
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Supported Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3" style={{ color: "var(--text-secondary)" }}>
            <p><strong>1. MT5 Deal Export (recommended)</strong> — export from MT5 History tab → right-click → &ldquo;Save as Report&rdquo; or copy the deal table:</p>
            <code className="block p-3 rounded text-xs" style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}>
              Time, Deal, Symbol, Type, Direction, Volume, Price, Order, Commission, Fee, Swap, Profit, Balance
            </code>
            <p><strong>2. MT5 Trade Export</strong> — standard MT5 CSV with one row per trade:</p>
            <code className="block p-3 rounded text-xs" style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}>
              #, Symbol, Type, Volume, Open Time, Close Time, Open Price, Close Price, Commission, Swap, Profit
            </code>
            <p style={{ color: "var(--text-muted)" }}>
              The importer auto-detects the format. Deal-level exports are matched using FIFO (first-in, first-out) to reconstruct complete trades.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center py-4">
        <AdBanner slot="import-bottom" />
      </div>
    </div>
  );
}
