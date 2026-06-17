"use client";

import { TradeForm } from "@/components/trades/trade-form";

export default function NewTradePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Add New Trade</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Record the details of your trade
        </p>
      </div>
      <TradeForm />
    </div>
  );
}
