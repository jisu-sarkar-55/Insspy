"use client"

import { useState } from "react"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Wand2,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const validationChecks = [
  { name: "Duplicate Trades", count: 0, status: "pass" as const, total: 2526 },
  { name: "Missing Fields", count: 2, status: "warning" as const, total: 2526 },
  { name: "Invalid Prices", count: 0, status: "pass" as const, total: 2526 },
  { name: "Timestamp Errors", count: 1, status: "warning" as const, total: 2526 },
  { name: "Corrupted Records", count: 0, status: "pass" as const, total: 2526 },
]

const errors = [
  {
    id: "1",
    description: "Trade #1847 missing entry price value",
    affectedField: "entry_price",
    suggestedFix: "Import from broker statement or enter manually",
    severity: "warning" as const,
  },
  {
    id: "2",
    description: "Trade #2103 has null exit timestamp",
    affectedField: "exit_time",
    suggestedFix: "Set to order close time from MT5 data",
    severity: "warning" as const,
  },
  {
    id: "3",
    description: "Trade #958 timestamp is 2 hours ahead of broker time",
    affectedField: "open_time",
    suggestedFix: "Adjust timezone offset to UTC+0",
    severity: "info" as const,
  },
]

function StatusIcon({ status }: { status: "pass" | "warning" | "fail" }) {
  if (status === "pass")
    return <CheckCircle2 size={18} style={{ color: "var(--color-profit)" }} />
  if (status === "warning")
    return <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
  return <XCircle size={18} style={{ color: "var(--color-loss)" }} />
}

function ProgressBar({ passed, total }: { passed: number; total: number }) {
  const pct = total > 0 ? (passed / total) * 100 : 100
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full"
        style={{ background: "var(--surface-raised)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background:
              pct >= 99
                ? "var(--color-profit)"
                : pct >= 95
                  ? "var(--color-warning)"
                  : "var(--color-loss)",
          }}
        />
      </div>
      <span
        className="mono-data text-[11px] font-medium"
        style={{
          color:
            pct >= 99
              ? "var(--color-profit)"
              : pct >= 95
                ? "var(--color-warning)"
                : "var(--color-loss)",
        }}
      >
        {passed.toLocaleString()}/{total.toLocaleString()}
      </span>
    </div>
  )
}

export function DataValidation() {
  const [showErrors, setShowErrors] = useState(false)
  const integrityScore = 99
  const totalChecks = validationChecks.length
  const passedChecks = validationChecks.filter((c) => c.status === "pass").length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--text-primary)",
            }}
          >
            Data Validation
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Ensure clean, accurate, and consistent trading data
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="btn-gold-glow gap-1.5"
            size="sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "#000",
              fontWeight: 600,
            }}
          >
            <Play size={14} />
            Run Validation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--color-ai)",
            }}
          >
            <Wand2 size={14} />
            Auto-Fix
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Integrity Score */}
        <Card
          className="card-surface"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <CardContent
            style={{
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "160px",
                height: "160px",
              }}
            >
              {/* Background circle */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `conic-gradient(
                    var(--primary) ${(integrityScore / 100) * 360}deg,
                    var(--surface-raised) ${(integrityScore / 100) * 360}deg
                  )`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Inner circle */}
                <div
                  style={{
                    width: "136px",
                    height: "136px",
                    borderRadius: "50%",
                    backgroundColor: "var(--surface-card)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "48px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      lineHeight: 1,
                    }}
                  >
                    {integrityScore}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      marginTop: "-2px",
                    }}
                  >
                    /100
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "16px",
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-profit)",
              }}
            >
              Excellent
            </div>
            <div
              style={{
                marginTop: "4px",
                fontFamily: "var(--font-inter)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              {passedChecks}/{totalChecks} checks passed
            </div>
          </CardContent>
        </Card>

        {/* Validation Checks + Errors */}
        <div className="flex flex-col gap-4">
          {/* Validation Checks */}
          <Card
            className="card-surface"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <CardHeader style={{ padding: "16px 16px 0 16px" }}>
              <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Shield size={16} style={{ color: "var(--primary)" }} />
                Validation Checks
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: "16px" }}>
              <div className="flex flex-col gap-0">
                {validationChecks.map((check, i) => (
                  <div key={check.name}>
                    <div
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon status={check.status} />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {check.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <ProgressBar passed={check.total - check.count} total={check.total} />
                        <Badge
                          variant="outline"
                          className="w-16 justify-center text-[10px]"
                          style={{
                            backgroundColor:
                              check.status === "pass"
                                ? "rgba(74, 222, 128, 0.1)"
                                : "rgba(251, 191, 36, 0.1)",
                            color:
                              check.status === "pass"
                                ? "var(--color-profit)"
                                : "var(--color-warning)",
                            borderColor:
                              check.status === "pass"
                                ? "rgba(74, 222, 128, 0.3)"
                                : "rgba(251, 191, 36, 0.3)",
                          }}
                        >
                          {check.status === "pass" ? "Pass" : `${check.count} issues`}
                        </Badge>
                      </div>
                    </div>
                    {i < validationChecks.length - 1 && (
                      <Separator style={{ backgroundColor: "var(--border-subtle)" }} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error Summary */}
          <Card
            className="card-surface"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="flex w-full items-center justify-between p-4 text-left"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Error Summary ({errors.length} issues)
                </span>
              </div>
              {showErrors ? (
                <ChevronUp size={18} style={{ color: "var(--text-muted)" }} />
              ) : (
                <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />
              )}
            </button>

            {showErrors && (
              <CardContent style={{ padding: "0 16px 16px 16px" }}>
                <div className="flex flex-col gap-0">
                  {errors.map((error, i) => (
                    <div key={error.id}>
                      <div className="py-3">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)", margin: 0, marginBottom: "8px" }}
                        >
                          {error.description}
                        </p>
                        <div className="flex gap-4 text-[12px]">
                          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                            Field:{" "}
                            <span style={{ color: "var(--color-warning)" }}>
                              {error.affectedField}
                            </span>
                          </span>
                        </div>
                        <p
                          className="mt-1.5 text-[13px]"
                          style={{ color: "var(--color-info)", margin: 0, marginTop: "6px" }}
                        >
                          Suggested: {error.suggestedFix}
                        </p>
                      </div>
                      {i < errors.length - 1 && (
                        <Separator style={{ backgroundColor: "var(--border-subtle)" }} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
