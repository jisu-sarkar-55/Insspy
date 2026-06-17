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
import { Plus } from "lucide-react";
import type { GoalFormData } from "@/types";

interface CreateGoalDialogProps {
  onSubmit: (data: GoalFormData) => Promise<boolean>;
  loading?: boolean;
}

export function CreateGoalDialog({ onSubmit, loading }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const ok = await onSubmit({
      title: trimmed,
      type: "custom",
      target_value: 0,
      unit: "",
      period: "custom",
    });
    if (ok) {
      setTitle("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center justify-center text-[12px] font-semibold rounded-md px-3.5 py-1.5"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Add Goal
      </DialogTrigger>
      <DialogContent style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "var(--text-primary)" }}>New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              What do you want to achieve?
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reach $500 profit this month"
              className="mt-1"
              style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              autoFocus
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="w-full text-[12px] font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {loading ? "Adding..." : "Add Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
