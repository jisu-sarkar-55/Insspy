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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { GoalFormData } from "@/types";

interface CreateGoalDialogProps {
  onSubmit: (data: GoalFormData) => void;
  loading?: boolean;
}

const goalTypes = [
  { value: "monthly_profit", label: "Monthly Profit Target", unit: "$" },
  { value: "drawdown_limit", label: "Drawdown Limit", unit: "%" },
  { value: "consistency", label: "Consistency Goal", unit: "%" },
  { value: "custom", label: "Custom Goal", unit: "" },
];

export function CreateGoalDialog({ onSubmit, loading }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<GoalFormData>({
    title: "",
    type: "monthly_profit",
    target_value: 0,
    unit: "$",
    period: "monthly",
  });

  const handleTypeChange = (type: GoalFormData["type"]) => {
    const gt = goalTypes.find((g) => g.value === type);
    setForm({ ...form, type, unit: gt?.unit || "" });
  };

  const handleSubmit = () => {
    if (!form.title || form.target_value <= 0) return;
    onSubmit({
      ...form,
      start_date: new Date().toISOString(),
    });
    setForm({ title: "", type: "monthly_profit", target_value: 0, unit: "$", period: "monthly" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center justify-center text-[12px] font-semibold rounded-md px-3.5 py-1.5"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        New Goal
      </DialogTrigger>
      <DialogContent style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "var(--text-primary)" }}>Create New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Goal Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Monthly profit target"
              className="mt-1"
              style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Goal Type</Label>
            <Select value={form.type} onValueChange={(v) => handleTypeChange(v as GoalFormData["type"])}>
              <SelectTrigger className="mt-1" style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
                {goalTypes.map((gt) => (
                  <SelectItem key={gt.value} value={gt.value}>
                    {gt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Target Value</Label>
              <Input
                type="number"
                value={form.target_value || ""}
                onChange={(e) => setForm({ ...form, target_value: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="mt-1"
                style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Unit</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="$, %, trades"
                className="mt-1"
                style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Period</Label>
            <Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v as GoalFormData["period"] })}>
              <SelectTrigger className="mt-1" style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !form.title || form.target_value <= 0}
            className="w-full text-[12px] font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {loading ? "Creating..." : "Create Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
