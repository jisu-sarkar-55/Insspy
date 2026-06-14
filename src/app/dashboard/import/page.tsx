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
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Import Trades</h1>
        <p className="text-zinc-400 mt-1">
          Import your MT5 trading history
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">How to Export from MT5</CardTitle>
          <CardDescription className="text-zinc-400">
            Follow these steps to export your trade history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">1.</span>
            <p>Open <strong>MetaTrader 5</strong> and go to the <strong>Toolbox</strong> panel (Ctrl+T)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">2.</span>
            <p>Click the <strong>&quot;History&quot;</strong> tab at the bottom</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">3.</span>
            <p>Right-click anywhere in the history table and select <strong>&quot;Export All&quot;</strong> or select specific trades</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">4.</span>
            <p>Choose <strong>&quot;CSV&quot;</strong> as the format and save the file</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-emerald-400">5.</span>
            <p>Upload the CSV file below</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Upload File</CardTitle>
          <CardDescription className="text-zinc-400">
            Drag and drop your MT5 CSV file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
              ${file
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
              }`}
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
                <FileText className="h-12 w-12 text-emerald-400 mx-auto" />
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-zinc-400 text-sm">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-zinc-600 mx-auto" />
                <p className="text-zinc-400">
                  Drop your MT5 export file here
                </p>
                <p className="text-zinc-500 text-sm">
                  Supports .csv, .htm, .html files
                </p>
              </div>
            )}
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                result.success
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                View Trades
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Supported MT5 Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-300 space-y-2">
            <p>The import supports standard MT5 CSV exports with columns like:</p>
            <code className="block bg-zinc-800 p-3 rounded text-zinc-400 text-xs">
              #, Symbol, Type, Volume, Open Time, Close Time, Open Price, Close Price, Commission, Swap, Profit
            </code>
            <p className="text-zinc-400">
              Column names are auto-detected. The importer looks for: ticket, symbol, type, volume/size/lots, time, price, profit/pnl.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
