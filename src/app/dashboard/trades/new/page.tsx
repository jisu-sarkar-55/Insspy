"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TradeForm } from "@/components/trades/trade-form";

export default function NewTradePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Add New Trade</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Record the details of your trade
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/trades")}
          style={{ color: "var(--text-muted)" }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <TradeForm />
    </div>
  );
}
