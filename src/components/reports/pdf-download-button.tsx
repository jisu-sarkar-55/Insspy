"use client";

import { useState, useEffect } from "react";
import type { Trade } from "@/types";
import { Download } from "lucide-react";

interface PdfDownloadProps {
  trades: Trade[];
  reportId: string;
  reportComponent: React.FC<{ trades: Trade[] }>;
}

export function PdfDownloadButton({ trades, reportId, reportComponent: ReportComponent }: PdfDownloadProps) {
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@react-pdf/renderer").then((mod) => {
      setPDFDownloadLink(() => mod.PDFDownloadLink);
      setLoading(false);
    });
  }, []);

  if (loading || !PDFDownloadLink) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium opacity-50 cursor-not-allowed"
        style={{ background: "var(--color-profit)", color: "var(--surface-page)" }}
      >
        Loading...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ReportComponent trades={trades} />}
      fileName={`${reportId}-report.pdf`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        borderRadius: "0.5rem",
        padding: "0.5rem 0.75rem",
        fontSize: "12px",
        fontWeight: 500,
        background: "var(--color-profit)",
        color: "var(--surface-page)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {({ loading: pdfLoading }: { loading: boolean }) =>
        pdfLoading ? (
          "Generating..."
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
