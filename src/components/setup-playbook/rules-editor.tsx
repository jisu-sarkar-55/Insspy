"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";

interface RulesEditorProps {
  label: string;
  rules: string[];
  onChange: (rules: string[]) => void;
  placeholder?: string;
  accentColor?: string;
}

export function RulesEditor({
  label,
  rules,
  onChange,
  placeholder = "Add a rule...",
  accentColor = "var(--color-profit)",
}: RulesEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const addRule = () => {
    if (inputValue.trim()) {
      onChange([...rules, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRule();
    }
  };

  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>

      {rules.length === 0 && (
        <div
          className="mb-3 rounded-lg border border-dashed px-4 py-6 text-center"
          style={{ borderColor: "var(--border-subtle)", background: "var(--surface-raised)" }}
        >
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            No rules yet. Add your first rule below.
          </p>
        </div>
      )}

      {rules.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:brightness-110"
              style={{ background: "var(--surface-raised)" }}
            >
              <GripVertical
                className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: "var(--text-muted)" }}
              />
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: accentColor, color: "var(--surface-page)" }}
              >
                {index + 1}
              </span>
              <span className="flex-1 text-[12px]" style={{ color: "var(--text-primary)" }}>
                {rule}
              </span>
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-lg border px-3 py-2 text-[12px] outline-none transition-colors focus:ring-1"
          style={{
            background: "var(--surface-card)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
            "--tw-ring-color": accentColor,
          } as React.CSSProperties}
        />
        <button
          type="button"
          onClick={addRule}
          disabled={!inputValue.trim()}
          className="shrink-0 rounded-lg px-3 py-2 text-[11px] font-medium transition-all disabled:opacity-30"
          style={{
            background: inputValue.trim() ? accentColor : "var(--surface-raised)",
            color: inputValue.trim() ? "var(--surface-page)" : "var(--text-muted)",
          }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
        Press Enter to add
      </p>
    </div>
  );
}
