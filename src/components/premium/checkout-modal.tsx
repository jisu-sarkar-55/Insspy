"use client";

import { useState } from "react";
import { X, Check, Loader2, Shield, Sparkles, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PricingPlan, CheckoutResponse } from "@/types";

interface CheckoutModalProps {
  plan: PricingPlan;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ plan, open, onClose, onSuccess }: CheckoutModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{
    valid: boolean;
    discount?: number;
    final?: number;
    error?: string;
  } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"details" | "pay" | "success" | "failed">("details");
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null);

  const supabase = createClient();

  if (!open) return null;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponStatus(null);
      return;
    }

    setCheckingCoupon(true);
    setCouponStatus(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), plan_id: plan.id }),
      });

      const data = await res.json();

      if (data.valid) {
        setCouponStatus({
          valid: true,
          discount: data.discount_amount,
          final: data.final_amount,
        });
      } else {
        setCouponStatus({ valid: false, error: data.error });
      }
    } catch {
      setCouponStatus({ valid: false, error: "Failed to validate coupon" });
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleProceedToPay = async () => {
    setProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan.id,
          coupon_code: couponStatus?.valid ? couponCode.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponStatus({ valid: false, error: data.error });
        setProcessing(false);
        return;
      }

      setCheckoutData(data);
      setStep("pay");
    } catch {
      setCouponStatus({ valid: false, error: "Checkout failed" });
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    setProcessing(true);

    try {
      if (!success) {
        setStep("failed");
        setProcessing(false);
        return;
      }

      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: checkoutData?.order_id,
          plan_id: plan.id,
          coupon_id: checkoutData?.coupon?.id || null,
          amount: checkoutData?.final_amount,
          mock: checkoutData?.mock,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("success");
      } else {
        setStep("failed");
      }
    } catch {
      setStep("failed");
    } finally {
      setProcessing(false);
    }
  };

  const price = couponStatus?.valid ? couponStatus.final! : plan.price;
  const originalPrice = plan.price;
  const hasDiscount = couponStatus?.valid && price < originalPrice;

  const displayPrice = price.toLocaleString("en-IN", {
    style: "currency",
    currency: plan.currency || "INR",
    maximumFractionDigits: 0,
  });

  const displayOriginalPrice = originalPrice.toLocaleString("en-IN", {
    style: "currency",
    currency: plan.currency || "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}
      >
        {step === "success" ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(34,197,94,0.15)" }}>
              <Check className="h-8 w-8" style={{ color: "rgb(34,197,94)" }} />
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Payment Successful!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {plan.trial_days > 0
                ? `Your ${plan.trial_days}-day free trial has started.`
                : "Your premium subscription is now active."}
            </p>
            <Button onClick={onSuccess} className="w-full">
              Start Exploring Premium
            </Button>
          </div>
        ) : step === "failed" ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.15)" }}>
              <X className="h-8 w-8" style={{ color: "rgb(239,68,68)" }} />
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Payment Failed
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Something went wrong. Please try again.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                Try Again
              </Button>
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : step === "pay" ? (
          <>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Confirm Payment
              </h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5">
                <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface-raised)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(192,132,252,0.15)" }}>
                  <Crown className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {plan.name === "premium_monthly" ? "Premium Monthly" : plan.name === "premium_yearly" ? "Premium Yearly" : "Premium Lifetime"}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {plan.trial_days > 0 ? `${plan.trial_days}-day free trial, then ` : ""}
                    {displayPrice}/{plan.interval === "month" ? "mo" : plan.interval === "year" ? "yr" : "once"}
                  </div>
                </div>
              </div>

              {hasDiscount && (
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)" }}>
                  <span className="text-sm" style={{ color: "rgb(34,197,94)" }}>Coupon discount</span>
                  <span className="text-sm font-medium" style={{ color: "rgb(34,197,94)" }}>
                    -{(originalPrice - price).toLocaleString("en-IN", { style: "currency", currency: plan.currency || "INR", maximumFractionDigits: 0 })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Total</span>
                <div className="text-right">
                  {hasDiscount && (
                    <span className="text-xs line-through mr-2" style={{ color: "var(--text-muted)" }}>
                      {displayOriginalPrice}
                    </span>
                  )}
                  <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {displayPrice}
                  </span>
                </div>
              </div>

              {checkoutData?.mock && (
                <div
                  className="p-3 rounded-xl text-xs flex items-start gap-2"
                  style={{ background: "rgba(251,191,36,0.08)", color: "var(--text-secondary)", border: "1px solid rgba(251,191,36,0.15)" }}
                >
                  <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                  <span>Mock mode — no real payment will be processed. Use the buttons below to simulate a payment outcome.</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleSimulatePayment(false)}
                  disabled={processing}
                  className="flex-1"
                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "rgb(239,68,68)" }}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Simulate Failure
                </Button>
                <Button
                  onClick={() => handleSimulatePayment(true)}
                  disabled={processing}
                  className="flex-1"
                  style={{ background: "linear-gradient(135deg, var(--color-ai), #7c3aed)" }}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Pay {displayPrice}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {plan.name === "premium_monthly" ? "Premium Monthly" : plan.name === "premium_yearly" ? "Premium Yearly" : "Premium Lifetime"}
              </h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5">
                <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                  {displayPrice}
                  {plan.interval && (
                    <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>
                      /{plan.interval === "month" ? "month" : "year"}
                    </span>
                  )}
                </div>
                {plan.trial_days > 0 && (
                  <div className="text-xs mt-1" style={{ color: "var(--color-ai)" }}>
                    {plan.trial_days}-day free trial • cancel anytime
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {plan.features && typeof plan.features === "object" && Object.entries(plan.features).map(([key]) => (
                  <div key={key} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--primary)" }} />
                    {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponStatus(null);
                    }}
                    placeholder="Enter code"
                    className="flex-1 text-sm"
                    style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleValidateCoupon}
                    disabled={!couponCode.trim() || checkingCoupon}
                  >
                    {checkingCoupon ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </div>
                {couponStatus && (
                  <div className={`text-xs ${couponStatus.valid ? "text-green-500" : "text-red-500"}`}>
                    {couponStatus.valid
                      ? `Coupon applied! You save ${((plan.price - couponStatus.final!) / plan.price * 100).toFixed(0)}%`
                      : couponStatus.error}
                  </div>
                )}
              </div>

              {couponStatus?.valid && (
                <div
                  className="flex items-center justify-between p-3 rounded-xl text-sm"
                  style={{ background: "rgba(34,197,94,0.08)" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>Total</span>
                  <div className="text-right">
                    <span className="text-xs line-through mr-2" style={{ color: "var(--text-muted)" }}>
                      {displayOriginalPrice}
                    </span>
                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {(couponStatus.final!).toLocaleString("en-IN", { style: "currency", currency: plan.currency || "INR", maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleProceedToPay}
                disabled={processing}
                className="w-full"
                size="lg"
                style={{ background: processing ? undefined : "linear-gradient(135deg, var(--color-ai), #7c3aed)" }}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {processing ? "Processing..." : `Subscribe ${couponStatus?.valid ? `for ${(couponStatus.final!).toLocaleString("en-IN", { style: "currency", currency: plan.currency || "INR", maximumFractionDigits: 0 })}` : ""}`}
              </Button>

              <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                <Shield className="h-3 w-3 inline mr-1" />
                Secure payment • Cancel anytime • No hidden fees
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
