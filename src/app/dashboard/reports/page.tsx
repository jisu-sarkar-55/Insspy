"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PdfDownloadButton } from "@/components/reports/pdf-download-button";
import { PdfPreview } from "@/components/reports/pdf-preview";
import { FileText, Calendar, Building2 } from "lucide-react";
import type { Trade } from "@/types";

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: typeof Calendar;
  component: React.FC<{ trades: Trade[] }>;
}

export default function ReportsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [WeeklyReport, setWeeklyReport] = useState<any>(null);
  const [MonthlyReport, setMonthlyReport] = useState<any>(null);
  const [PropFirmReport, setPropFirmReport] = useState<any>(null);
  const supabase = createClient();

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
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });
      if (data) setTrades(data);
      setLoading(false);
    }
    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border-medium)", borderTopColor: "transparent" }}
          />
          <div style={{ color: "var(--text-muted)" }} className="text-sm">Loading reports...</div>
        </div>
      </div>
    );
  }

  const closed = trades.filter((t) => t.net_pnl !== null);

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

  if (!WeeklyReport || !MonthlyReport || !PropFirmReport) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border-medium)", borderTopColor: "transparent" }}
          />
          <div style={{ color: "var(--text-muted)" }} className="text-sm">Loading PDF engine...</div>
        </div>
      </div>
    );
  }

  const reportTypes: ReportType[] = [
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
    },
  ];

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Reports
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Generate PDF reports of your trading performance
        </p>
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
                borderColor: isSelected ? "var(--color-profit)" : "var(--border-subtle)",
              }}
              onClick={() => setSelectedReport(isSelected ? null : report.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="rounded-lg p-2"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "var(--color-profit)" }} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {report.name}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {report.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4">
                  <PdfDownloadButton
                    trades={closed}
                    reportId={report.id}
                    reportComponent={report.component}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedReportData && (
        <div
          className="rounded-lg border p-4"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="mb-3 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Preview
          </div>
          <div className="h-[600px] rounded-lg overflow-hidden" style={{ background: "var(--surface-raised)" }}>
            <PdfPreview
              trades={closed}
              reportComponent={selectedReportData.component}
            />
          </div>
        </div>
      )}
    </div>
  );
}
