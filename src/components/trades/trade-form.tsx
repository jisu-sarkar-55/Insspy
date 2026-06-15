"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Trade, TradeFormData, SetupPlaybook } from "@/types";

interface TradeFormProps {
  initialData?: Trade;
  isEditing?: boolean;
}

const strategies = [
  "Breakout",
  "ICT",
  "SMC",
  "Scalping",
  "Swing",
  "Trend Following",
  "Mean Reversion",
  "Gap Fill",
  "Other",
];

export function TradeForm({ initialData, isEditing = false }: TradeFormProps) {
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: initialData?.symbol || "",
    direction: initialData?.direction || "buy",
    entry_price: initialData?.entry_price || 0,
    exit_price: initialData?.exit_price || undefined,
    stop_loss: initialData?.stop_loss || undefined,
    take_profit: initialData?.take_profit || undefined,
    lot_size: initialData?.lot_size || 0.01,
    entry_time: initialData?.entry_time
      ? new Date(initialData.entry_time).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    exit_time: initialData?.exit_time
      ? new Date(initialData.exit_time).toISOString().slice(0, 16)
      : undefined,
    commission: initialData?.commission || 0,
    swap: initialData?.swap || 0,
    net_pnl: initialData?.net_pnl ?? undefined,
    strategy: initialData?.strategy || "",
    notes: initialData?.notes || "",
    confidence_before: initialData?.confidence_before || 5,
    fear_level: initialData?.fear_level || 3,
    greed_level: initialData?.greed_level || 3,
    followed_plan: initialData?.followed_plan ?? true,
    setup_playbook_id: initialData?.setup_playbook_id || undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbooks, setPlaybooks] = useState<SetupPlaybook[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPlaybooks() {
      const { data } = await supabase
        .from("setup_playbooks")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (data) setPlaybooks(data);
    }
    fetchPlaybooks();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const netPnl = formData.net_pnl ?? 0;
    const commission = formData.commission || 0;
    const swap = formData.swap || 0;
    const pnl = netPnl + commission + swap;

    const payload = {
      symbol: formData.symbol,
      direction: formData.direction,
      entry_price: formData.entry_price,
      exit_price: formData.exit_price,
      stop_loss: formData.stop_loss,
      take_profit: formData.take_profit,
      lot_size: formData.lot_size,
      entry_time: new Date(formData.entry_time).toISOString(),
      exit_time: formData.exit_time
        ? new Date(formData.exit_time).toISOString()
        : null,
      commission,
      swap,
      pnl,
      net_pnl: netPnl,
      strategy: formData.strategy,
      notes: formData.notes,
      confidence_before: formData.confidence_before,
      fear_level: formData.fear_level,
      greed_level: formData.greed_level,
      followed_plan: formData.followed_plan,
      setup_playbook_id: formData.setup_playbook_id || null,
    };

    let result;
    if (isEditing && initialData) {
      result = await supabase
        .from("trades")
        .update(payload)
        .eq("id", initialData.id);
    } else {
      result = await supabase.from("trades").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/trades");
    router.refresh();
  };

  const updateField = (field: keyof TradeFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    background: "var(--surface-raised)",
    borderColor: "var(--border-subtle)",
    color: "var(--text-primary)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div
          className="p-3 rounded-md text-sm"
          style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.2)", color: "var(--color-loss)" }}
        >
          {error}
        </div>
      )}

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Trade Details</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Enter the basic information about your trade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" style={{ color: "var(--text-secondary)" }}>
                Symbol *
              </Label>
              <Input
                id="symbol"
                placeholder="EURUSD"
                value={formData.symbol}
                onChange={(e) => updateField("symbol", e.target.value.toUpperCase())}
                style={inputStyle}
                required
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "var(--text-secondary)" }}>Direction *</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => {
                  if (value === "buy" || value === "sell") {
                    updateField("direction", value);
                  }
                }}
              >
                <SelectTrigger style={inputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
                  <SelectItem value="buy">Buy (Long)</SelectItem>
                  <SelectItem value="sell">Sell (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_price" style={{ color: "var(--text-secondary)" }}>
                Entry Price *
              </Label>
              <Input
                id="entry_price"
                type="number"
                step="any"
                value={formData.entry_price || ""}
                onChange={(e) =>
                  updateField("entry_price", parseFloat(e.target.value) || 0)
                }
                style={inputStyle}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_price" style={{ color: "var(--text-secondary)" }}>
                Exit Price
              </Label>
              <Input
                id="exit_price"
                type="number"
                step="any"
                value={formData.exit_price || ""}
                onChange={(e) =>
                  updateField(
                    "exit_price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stop_loss" style={{ color: "var(--text-secondary)" }}>
                Stop Loss
              </Label>
              <Input
                id="stop_loss"
                type="number"
                step="any"
                value={formData.stop_loss || ""}
                onChange={(e) =>
                  updateField(
                    "stop_loss",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="take_profit" style={{ color: "var(--text-secondary)" }}>
                Take Profit
              </Label>
              <Input
                id="take_profit"
                type="number"
                step="any"
                value={formData.take_profit || ""}
                onChange={(e) =>
                  updateField(
                    "take_profit",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_size" style={{ color: "var(--text-secondary)" }}>
                Lot Size *
              </Label>
              <Input
                id="lot_size"
                type="number"
                step="0.01"
                value={formData.lot_size}
                onChange={(e) =>
                  updateField("lot_size", parseFloat(e.target.value) || 0.01)
                }
                style={inputStyle}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy" style={{ color: "var(--text-secondary)" }}>
                Strategy
              </Label>
              <Select
                value={formData.strategy}
                onValueChange={(value) => updateField("strategy", value)}
              >
                <SelectTrigger style={inputStyle}>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
                  {strategies.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Setup Playbook</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Link this trade to a setup playbook for performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="setup_playbook_id" style={{ color: "var(--text-secondary)" }}>
              Playbook (Optional)
            </Label>
            <Select
              value={formData.setup_playbook_id || "none"}
              onValueChange={(value) =>
                updateField("setup_playbook_id", value === "none" ? undefined : value)
              }
            >
              <SelectTrigger style={inputStyle}>
                <SelectValue placeholder="Select a playbook" />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
                <SelectItem value="none">No playbook</SelectItem>
                {playbooks.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Timing & Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_time" style={{ color: "var(--text-secondary)" }}>
                Entry Time *
              </Label>
              <Input
                id="entry_time"
                type="datetime-local"
                value={formData.entry_time}
                onChange={(e) => updateField("entry_time", e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_time" style={{ color: "var(--text-secondary)" }}>
                Exit Time
              </Label>
              <Input
                id="exit_time"
                type="datetime-local"
                value={formData.exit_time || ""}
                onChange={(e) => updateField("exit_time", e.target.value || undefined)}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission" style={{ color: "var(--text-secondary)" }}>
                Commission
              </Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                value={formData.commission}
                onChange={(e) =>
                  updateField("commission", parseFloat(e.target.value) || 0)
                }
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swap" style={{ color: "var(--text-secondary)" }}>
                Swap
              </Label>
              <Input
                id="swap"
                type="number"
                step="0.01"
                value={formData.swap}
                onChange={(e) =>
                  updateField("swap", parseFloat(e.target.value) || 0)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="net_pnl" style={{ color: "var(--text-secondary)" }}>
              Net P&L ($) *
            </Label>
            <Input
              id="net_pnl"
              type="number"
              step="0.01"
              placeholder="Enter the exact P&L from your broker"
              value={formData.net_pnl ?? ""}
              onChange={(e) =>
                updateField(
                  "net_pnl",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              style={inputStyle}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Copy the profit/loss value from MT5. Positive = profit, negative = loss.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Psychology</CardTitle>
          <CardDescription style={{ color: "var(--text-muted)" }}>
            Rate your mental state before the trade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label style={{ color: "var(--text-secondary)" }}>
                Confidence: {formData.confidence_before}/10
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.confidence_before}
                onChange={(e) =>
                  updateField("confidence_before", parseInt(e.target.value))
                }
                className="w-full"
                style={{ accentColor: "var(--color-profit)" }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "var(--text-secondary)" }}>
                Fear: {formData.fear_level}/10
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.fear_level}
                onChange={(e) =>
                  updateField("fear_level", parseInt(e.target.value))
                }
                className="w-full"
                style={{ accentColor: "var(--color-loss)" }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: "var(--text-secondary)" }}>
                Greed: {formData.greed_level}/10
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.greed_level}
                onChange={(e) =>
                  updateField("greed_level", parseInt(e.target.value))
                }
                className="w-full"
                style={{ accentColor: "var(--color-warning)" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes" style={{ color: "var(--text-secondary)" }}>
              Trade Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Why did you take this trade? What did you observe? Any mistakes?"
              value={formData.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              className="min-h-[120px]"
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Trade"
            : "Save Trade"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
