"use client";

import { useState, useEffect } from "react";
import type { Trade } from "@/types";

interface PdfPreviewProps {
  trades: Trade[];
  reportComponent: React.FC<{ trades: Trade[] }>;
}

export function PdfPreview({ trades, reportComponent: ReportComponent }: PdfPreviewProps) {
  const [PDFViewer, setPDFViewer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@react-pdf/renderer").then((mod) => {
      setPDFViewer(() => mod.PDFViewer);
      setLoading(false);
    });
  }, []);

  if (loading || !PDFViewer) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "var(--text-muted)" }}>
        Loading PDF viewer...
      </div>
    );
  }

  return (
    <PDFViewer width="100%" height="100%">
      <ReportComponent trades={trades} />
    </PDFViewer>
  );
}
