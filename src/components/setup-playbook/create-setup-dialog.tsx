"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RulesEditor } from "./rules-editor";
import { Target, ImagePlus, FileText, Layers, X } from "lucide-react";
import type { SetupPlaybook, SetupPlaybookFormData } from "@/types";

interface CreateSetupDialogProps {
  onSubmit: (data: SetupPlaybookFormData) => Promise<void>;
  loading?: boolean;
  initialData?: SetupPlaybook;
  mode?: "create" | "edit";
}

const TIMEFRAMES = ["1M", "5M", "15M", "30M", "1H", "4H", "Daily", "Weekly"];
const MARKET_CONDITIONS = [
  { value: "Trending", color: "var(--color-profit)" },
  { value: "Ranging", color: "var(--color-info)" },
  { value: "Breakout", color: "var(--color-warning)" },
  { value: "Pullback", color: "var(--color-ai)" },
  { value: "Reversal", color: "var(--color-loss)" },
  { value: "Volatility", color: "#9B8AB8" },
];

function SectionHeader({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 rounded-lg p-1.5"
        style={{ background: `${color}15` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {description}
        </div>
      </div>
    </div>
  );
}

export function CreateSetupDialog({
  onSubmit,
  loading = false,
  initialData,
  mode = "create",
}: CreateSetupDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SetupPlaybookFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    entry_rules: initialData?.entry_rules || [],
    exit_rules: initialData?.exit_rules || [],
    timeframe: initialData?.timeframe || "",
    market_conditions: initialData?.market_conditions || [],
    screenshot_urls: initialData?.screenshot_urls || [],
    examples: initialData?.examples || "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      entry_rules: [],
      exit_rules: [],
      timeframe: "",
      market_conditions: [],
      screenshot_urls: [],
      examples: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await onSubmit(formData);
    if (mode === "create") resetForm();
    setOpen(false);
  };

  const toggleMarketCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      market_conditions: prev.market_conditions.includes(condition)
        ? prev.market_conditions.filter((c) => c !== condition)
        : [...prev.market_conditions, condition],
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && mode === "create") resetForm();
      }}
    >
      <DialogTrigger
        className="inline-flex items-center justify-center text-[12px] font-semibold rounded-md px-3.5 py-1.5"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        {mode === "create" ? "+ New Playbook" : "Edit"}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--text-primary)" }}>
            {mode === "create" ? "Create New Playbook" : "Edit Playbook"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* ── Basic Info ── */}
          <div className="space-y-4">
            <SectionHeader
              icon={FileText}
              title="Basic Info"
              description="Name and describe your setup"
              color="var(--color-profit)"
            />
            <div className="space-y-3 pl-9">
              <div>
                <Label className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Setup Name *
                </Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., ICT Breaker Block"
                  className="mt-1"
                  style={{
                    background: "var(--surface-raised)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <Label className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this setup looks for..."
                  rows={2}
                  className="mt-1 resize-none"
                  style={{
                    background: "var(--surface-raised)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Market Context ── */}
          <div className="space-y-4">
            <SectionHeader
              icon={Layers}
              title="Market Context"
              description="When does this setup work best?"
              color="var(--color-info)"
            />
            <div className="space-y-4 pl-9">
              <div>
                <Label className="mb-2 block text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Timeframe
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {TIMEFRAMES.map((tf) => {
                    const active = formData.timeframe === tf;
                    return (
                      <button
                        key={tf}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, timeframe: active ? "" : tf })
                        }
                        className="rounded-md px-3 py-1.5 text-[11px] font-medium transition-all"
                        style={{
                          background: active ? "var(--color-info)" : "var(--surface-raised)",
                          color: active ? "#fff" : "var(--text-secondary)",
                          boxShadow: active ? "0 0 8px var(--color-info)" : "none",
                        }}
                      >
                        {tf}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Market Conditions
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_CONDITIONS.map(({ value, color }) => {
                    const active = formData.market_conditions.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleMarketCondition(value)}
                        className="rounded-md px-3 py-1.5 text-[11px] font-medium transition-all"
                        style={{
                          background: active ? color : "var(--surface-raised)",
                          color: active ? "#fff" : "var(--text-secondary)",
                          boxShadow: active ? `0 0 8px ${color}` : "none",
                        }}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Rules ── */}
          <div className="space-y-4">
            <SectionHeader
              icon={Target}
              title="Trading Rules"
              description="Define clear entry and exit criteria"
              color="var(--color-profit)"
            />
            <div className="pl-9 space-y-5">
              <RulesEditor
                label="Entry Rules"
                rules={formData.entry_rules}
                onChange={(entry_rules) => setFormData({ ...formData, entry_rules })}
                placeholder="e.g., Price must be above 200 EMA"
                accentColor="var(--color-profit)"
              />
              <RulesEditor
                label="Exit Rules"
                rules={formData.exit_rules}
                onChange={(exit_rules) => setFormData({ ...formData, exit_rules })}
                placeholder="e.g., Trail stop to 1R after 2R profit"
                accentColor="var(--color-loss)"
              />
            </div>
          </div>

          {/* ── Screenshots ── */}
          <div className="space-y-4">
            <SectionHeader
              icon={ImagePlus}
              title="Screenshots"
              description="Paste chart image URLs to build a visual reference"
              color="var(--color-ai)"
            />
            <div className="pl-9 space-y-2">
              {formData.screenshot_urls.map((url, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...formData.screenshot_urls];
                        newUrls[index] = e.target.value;
                        setFormData({ ...formData, screenshot_urls: newUrls });
                      }}
                      placeholder="https://example.com/chart.png"
                      style={{
                        background: "var(--surface-raised)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {url && (
                      <div
                        className="overflow-hidden rounded-md border"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = formData.screenshot_urls.filter((_, i) => i !== index);
                      setFormData({ ...formData, screenshot_urls: newUrls });
                    }}
                    className="mt-1 shrink-0 rounded-md p-1.5 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    screenshot_urls: [...formData.screenshot_urls, ""],
                  })
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-[11px] font-medium transition-colors hover:brightness-110"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-muted)",
                  background: "var(--surface-raised)",
                }}
              >
                <ImagePlus className="h-4 w-4" />
                Add Screenshot URL
              </button>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="space-y-4">
            <SectionHeader
              icon={FileText}
              title="Examples & Notes"
              description="Add chart patterns, examples, or any additional context"
              color="var(--color-warning)"
            />
            <div className="pl-9">
              <Textarea
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                placeholder="e.g., Works best during London session open. Look for order block on 15M after sweep of Asian high..."
                rows={3}
                className="resize-none"
                style={{
                  background: "var(--surface-raised)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div
            className="flex items-center justify-end gap-3 border-t pt-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-[12px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="text-[12px] font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? "Saving..." : mode === "create" ? "Create Playbook" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
