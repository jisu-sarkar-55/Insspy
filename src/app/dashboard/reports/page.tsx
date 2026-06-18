"use client";

import { useEffect, useState, useMemo, type ComponentType } from "react";
import { FileText, Calendar, Building2, Download, AlertCircle } from "lucide-react";
import type { Trade } from "@/types";
import { PremiumGate } from "@/components/premium";

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
  const [PDFDownloadLink, setPDFDownloadLink] = useState<ComponentType<any> | null>(null);
  const [pdfEngineLoading, setPdfEngineLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    import("@react-pdf/renderer").then((mod) => {
      if (cancelled) return;
      setPDFViewer(() => mod.PDFViewer);
      setPDFDownloadLink(() => mod.PDFDownloadLink);
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
    async function fetchTrades() {
      try {
        const res = await fetch("/api/trades");
        if (cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) setTrades(data);
      } catch (err: unknown) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load trades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTrades();
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

  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const dateRange =
    closed.length > 0
      ? `${closed[closed.length - 1].entry_time.split("T")[0]} — ${closed[0].entry_time.split("T")[0]}`
      : "No trades";

  if (loading || pdfEngineLoading) {
    return (
      <PremiumGate>
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
      </PremiumGate>
    );
  }

  if (fetchError) {
    return (
      <PremiumGate>
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
      </PremiumGate>
    );
  }

  if (closed.length === 0) {
    return (
      <PremiumGate>
        <div className="py-12 text-center animate-fade-in">
          <h2 className="mb-2 text-2xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            No Trade Data
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Add or import trades to generate reports.
          </p>
        </div>
      </PremiumGate>
    );
  }

  return (
    <PremiumGate>
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
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))", color: "var(--color-premium, #8b5cf6)" }}
        >
          <span className="text-[10px]">✦</span> Premium
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

                {PDFDownloadLink && (
                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <PDFDownloadLink
                      document={<report.component trades={closed} />}
                      fileName={`${report.id}-report.pdf`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderRadius: "0.5rem",
                        padding: "0.375rem 0.75rem",
                        fontSize: "11px",
                        fontWeight: 500,
                        background: "var(--color-profit)",
                        color: "var(--surface-page)",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      {({ loading: pdfLoading }: { loading: boolean }) =>
                        pdfLoading ? "Generating..." : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            Download PDF
                          </>
                        )
                      }
                    </PDFDownloadLink>
                  </div>
                )}
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
              {PDFDownloadLink && (
                <PDFDownloadLink
                  document={<selectedReportData.component trades={closed} />}
                  fileName={`${selectedReportData.id}-report.pdf`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "0.5rem",
                    padding: "0.375rem 0.75rem",
                    fontSize: "11px",
                    fontWeight: 500,
                    background: "var(--color-profit)",
                    color: "var(--surface-page)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {({ loading: pdfLoading }: { loading: boolean }) =>
                    pdfLoading ? "Generating..." : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
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
    </PremiumGate>
  );
}
