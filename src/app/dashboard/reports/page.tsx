"use client";

import { useEffect, useState, useMemo, type ComponentType } from "react";
import { FileText, Calendar, Building2, Download, AlertCircle, AlertTriangle } from "lucide-react";
import type { Trade } from "@/types";

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: typeof Calendar;
  component: ComponentType<{ trades: Trade[] }>;
  featured?: boolean;
}

function CardSkeleton() {
  return (
    <div
      className="rounded-lg border p-4 animate-pulse"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg p-2 h-9 w-9" style={{ background: "var(--surface-raised)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 rounded" style={{ background: "var(--surface-raised)" }} />
          <div className="h-3 w-40 rounded" style={{ background: "var(--surface-raised)" }} />
        </div>
      </div>
      <div className="flex gap-4 mt-3">
        <div className="h-6 w-16 rounded" style={{ background: "var(--surface-raised)" }} />
        <div className="h-6 w-20 rounded" style={{ background: "var(--surface-raised)" }} />
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="h-4 w-20 rounded mb-3" style={{ background: "var(--surface-raised)" }} />
      <div className="h-[300px] rounded-lg" style={{ background: "var(--surface-raised)" }} />
    </div>
  );
}

export default function ReportsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState("weekly");
  const [WeeklyReport, setWeeklyReport] = useState<ComponentType<{ trades: Trade[] }> | null>(null);
  const [MonthlyReport, setMonthlyReport] = useState<ComponentType<{ trades: Trade[] }> | null>(null);
  const [PropFirmReport, setPropFirmReport] = useState<ComponentType<{ trades: Trade[] }> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [PDFViewer, setPDFViewer] = useState<ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfGenerate, setPdfGenerate] = useState<((doc: any) => { toBlob: () => Promise<Blob> }) | null>(null);
  const [pdfEngineLoading, setPdfEngineLoading] = useState(true);
  const [reportUsage, setReportUsage] = useState<{ current: number; limit: number } | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@react-pdf/renderer").then((mod) => {
      if (cancelled) return;
      setPDFViewer(() => mod.PDFViewer);
      setPdfGenerate(() => mod.pdf);
      setPdfEngineLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    Promise.all([
      import("@/components/reports/weekly-report").then((m) => m.WeeklyReport),
      import("@/components/reports/monthly-report").then((m) => m.MonthlyReport),
      import("@/components/reports/prop-firm-report").then((m) => m.PropFirmReport),
    ]).then(([weekly, monthly, propfirm]) => {
      setWeeklyReport(() => weekly);
      setMonthlyReport(() => monthly);
      setPropFirmReport(() => propfirm);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [tradesRes, usageRes] = await Promise.all([
          fetch("/api/trades"),
          fetch("/api/user/usage"),
        ]);
        if (cancelled) return;
        const tradesData = await tradesRes.json();
        if (cancelled) return;
        if (Array.isArray(tradesData)) setTrades(tradesData);
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          if (usageData.report_downloads) setReportUsage(usageData.report_downloads);
        }
      } catch (err: unknown) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const closed = useMemo(() => trades.filter((t) => t.net_pnl !== null), [trades]);

  const reportTypes: ReportType[] = useMemo(
    () =>
      [
        {
          id: "weekly",
          name: "Weekly Report",
          description: "Performance summary for the past 7 days",
          icon: Calendar,
          component: WeeklyReport,
        },
        {
          id: "monthly",
          name: "Monthly Report",
          description: "Comprehensive monthly trading analysis",
          icon: FileText,
          component: MonthlyReport,
        },
        {
          id: "propfirm",
          name: "Prop Firm Report",
          description: "Report formatted for prop firm evaluations",
          icon: Building2,
          component: PropFirmReport,
          featured: true,
        },
      ].filter((r): r is ReportType => r.component !== null),
    [WeeklyReport, MonthlyReport, PropFirmReport]
  );

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport) || reportTypes[0];

  const downloadsRemaining = reportUsage ? (reportUsage.limit - reportUsage.current) : null;

  async function handleDownload(pdfDoc: React.ReactElement, fileName: string) {
    if (!pdfGenerate) return;
    if (reportUsage && reportUsage.current >= reportUsage.limit) return;

    const res = await fetch("/api/reports/download", { method: "POST" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDownloadMsg(data?.error || "Download limit reached");
      setTimeout(() => setDownloadMsg(null), 3000);
      return;
    }

    setReportUsage((prev) => prev ? { ...prev, current: prev.current + 1 } : prev);

    try {
      const blob = await pdfGenerate(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setDownloadMsg("Failed to generate PDF");
      setTimeout(() => setDownloadMsg(null), 3000);
    }
  }

  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const dateRange =
    closed.length > 0
      ? `${closed[closed.length - 1].entry_time.split("T")[0]} — ${closed[0].entry_time.split("T")[0]}`
      : "No trades";

  if (loading || pdfEngineLoading) {
    return (
        <div className="space-y-6 animate-fade-in">
          <div>
            <div className="h-7 w-24 rounded mb-2" style={{ background: "var(--surface-raised)" }} />
            <div className="h-4 w-48 rounded" style={{ background: "var(--surface-raised)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <PreviewSkeleton />
        </div>
    );
  }

  if (fetchError) {
    return (
        <div className="py-12 text-center animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8" style={{ color: "var(--color-loss)" }} />
            <h2 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              Failed to Load Data
            </h2>
            <p className="text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
              {fetchError}
            </p>
          </div>
        </div>
    );
  }

  if (closed.length === 0) {
    return (
        <div className="py-12 text-center animate-fade-in">
          <h2 className="mb-2 text-2xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            No Trade Data
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Add or import trades to generate reports.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            Reports
          </h1>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Generate PDF reports of your trading performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {downloadsRemaining !== null && (
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium"
              style={{
                background: downloadsRemaining > 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: downloadsRemaining > 0 ? "var(--color-profit)" : "var(--color-loss)",
              }}
            >
              <Download className="h-3 w-3" />
              {downloadsRemaining} / {reportUsage?.limit} downloads left
            </div>
          )}
          {downloadMsg && (
            <div className="text-[11px] px-2 py-1 rounded" style={{ background: "var(--surface-raised)", color: "var(--color-loss)" }}>
              {downloadMsg}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-4 text-[11px] px-1"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{reportTypes.length} reports</span>
        <span style={{ color: "var(--border-medium)" }}>|</span>
        <span>{closed.length} trades analyzed</span>
        <span style={{ color: "var(--border-medium)" }}>|</span>
        <span>{dateRange}</span>
      </div>

      <div>
        <div
          className="text-xs font-semibold mb-3 flex items-center gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Report Types</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;

            return (
              <div
                key={report.id}
                className="rounded-lg border p-4 cursor-pointer transition-all hover-lift"
                style={{
                  background: "var(--surface-card)",
                  borderColor: isSelected
                    ? report.featured
                      ? "var(--color-premium, #8b5cf6)"
                      : "var(--color-profit)"
                    : "var(--border-subtle)",
                  ...(report.featured && isSelected
                    ? { boxShadow: "0 0 0 1px rgba(139,92,246,0.3)" }
                    : {}),
                }}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="rounded-lg p-2"
                    style={{
                      background: report.featured
                        ? "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))"
                        : "var(--surface-raised)",
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{
                        color: report.featured ? "var(--color-premium, #8b5cf6)" : "var(--color-profit)",
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        {report.name}
                      </div>
                      {report.featured && (
                        <span
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))",
                            color: "var(--color-premium, #8b5cf6)",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {report.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  <span>{closed.length} trades</span>
                  <span style={totalPnl >= 0 ? { color: "var(--color-profit)" } : { color: "var(--color-loss)" }}>
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}
                  </span>
                </div>

                {pdfGenerate && (downloadsRemaining === null || downloadsRemaining > 0) ? (
                  <div
                    className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80"
                    style={{ background: "var(--color-profit)", color: "var(--surface-page)" }}
                    onClick={(e) => { e.stopPropagation(); handleDownload(<report.component trades={closed} />, `${report.id}-report.pdf`); }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </div>
                ) : pdfGenerate && downloadsRemaining !== null ? (
                  <div
                    className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium"
                    style={{ background: "var(--surface-raised)", color: "var(--text-muted)", cursor: "not-allowed" }}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Downloads used
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {selectedReportData && PDFViewer && (
        <div>
          <div
            className="text-xs font-semibold mb-3 flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>Preview &amp; Download</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          </div>

          <div
            className="rounded-lg border overflow-hidden"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-raised)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  {selectedReportData.name}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {closed.length} trades
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {dateRange}
                </span>
              </div>
              {pdfGenerate && (downloadsRemaining === null || downloadsRemaining > 0) ? (
                <div
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80"
                  style={{ background: "var(--color-profit)", color: "var(--surface-page)" }}
                  onClick={() => handleDownload(<selectedReportData.component trades={closed} />, `${selectedReportData.id}-report.pdf`)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </div>
              ) : pdfGenerate && downloadsRemaining !== null ? (
                <div
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium"
                  style={{ background: "var(--surface-raised)", color: "var(--text-muted)", cursor: "not-allowed" }}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Downloads used
                </div>
              ) : null}
            </div>
            <div
              className="min-h-[400px] h-[70vh] rounded-b-lg overflow-hidden"
              style={{ background: "var(--surface-raised)" }}
            >
              <PDFViewer width="100%" height="100%">
                <selectedReportData.component trades={closed} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
