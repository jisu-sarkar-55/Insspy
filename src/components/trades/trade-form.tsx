"use client";

import { useState } from "react";
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
import type { Trade, TradeFormData } from "@/types";

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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Trade Details</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter the basic information about your trade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-zinc-300">
                Symbol *
              </Label>
              <Input
                id="symbol"
                placeholder="EURUSD"
                value={formData.symbol}
                onChange={(e) => updateField("symbol", e.target.value.toUpperCase())}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Direction *</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => {
                  if (value === "buy" || value === "sell") {
                    updateField("direction", value);
                  }
                }}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="buy">Buy (Long)</SelectItem>
                  <SelectItem value="sell">Sell (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_price" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_price" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stop_loss" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="take_profit" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_size" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy" className="text-zinc-300">
                Strategy
              </Label>
              <Select
                value={formData.strategy}
                onValueChange={(value) => updateField("strategy", value)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
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

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Timing & Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_time" className="text-zinc-300">
                Entry Time *
              </Label>
              <Input
                id="entry_time"
                type="datetime-local"
                value={formData.entry_time}
                onChange={(e) => updateField("entry_time", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit_time" className="text-zinc-300">
                Exit Time
              </Label>
              <Input
                id="exit_time"
                type="datetime-local"
                value={formData.exit_time || ""}
                onChange={(e) => updateField("exit_time", e.target.value || undefined)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swap" className="text-zinc-300">
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
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="net_pnl" className="text-zinc-300">
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
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <p className="text-xs text-zinc-500">
              Copy the profit/loss value from MT5. Positive = profit, negative = loss.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Psychology</CardTitle>
          <CardDescription className="text-zinc-400">
            Rate your mental state before the trade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">
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
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">
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
                className="w-full accent-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">
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
                className="w-full accent-yellow-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-300">
              Trade Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Why did you take this trade? What did you observe? Any mistakes?"
              value={formData.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
