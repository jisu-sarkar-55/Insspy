"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Loader2, Sparkles } from "lucide-react";
import { CheckoutModal } from "./checkout-modal";
import type { PricingPlan, Subscription } from "@/types";

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [canceling, setCanceling] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [subRes, plansRes] = await Promise.all([
        fetch("/api/user/subscription").then(r => r.ok ? r.json() : null),
        fetch("/api/pricing").then(r => r.ok ? r.json() : null),
      ]);

      if (subRes) setSubscription(subRes as unknown as Subscription);
      if (plansRes) setPlans(plansRes as PricingPlan[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) return;

    setCanceling(true);
    await fetch("/api/user/subscription/cancel", { method: "POST" });

    setSubscription((prev) => prev ? { ...prev, status: "canceled" as const, canceled_at: new Date().toISOString() } : null);
    setCanceling(false);
  };

  const handleUpgrade = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base" style={{ color: "var(--text-primary)" }}>
            <Crown className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--text-muted)" }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subscription) {
    const plan = subscription.plan;
    const planName = plan?.name === "premium_monthly" ? "Premium Monthly"
      : plan?.name === "premium_yearly" ? "Premium Yearly"
      : "Premium Lifetime";

    const endDate = new Date(subscription.current_period_end);
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;

    return (
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base" style={{ color: "var(--text-primary)" }}>
            <Crown className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)" }}
          >
            <div>
              <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {planName}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {subscription.status === "trialing" && trialEnd
                  ? `Trial ends ${trialEnd.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
                  : `Renews ${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: subscription.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(251,191,36,0.12)",
                color: subscription.status === "active" ? "rgb(34,197,94)" : "var(--primary)",
              }}
            >
              {subscription.status === "trialing" ? "Trial" : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>

          {subscription.status !== "canceled" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={canceling}
              className="w-full"
              style={{ borderColor: "rgba(239,68,68,0.3)", color: "rgb(239,68,68)" }}
            >
              {canceling ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
              Cancel Subscription
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base" style={{ color: "var(--text-primary)" }}>
            <Crown className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
            Upgrade to Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Unlock AI coaching, advanced analytics, reports, and more.
          </p>

          <div className="grid gap-3">
            {plans.map((plan) => {
              const planLabel = plan.name === "premium_monthly" ? "Monthly"
                : plan.name === "premium_yearly" ? "Yearly"
                : "Lifetime";

              const priceLabel = plan.price.toLocaleString("en-IN", {
                style: "currency",
                currency: plan.currency || "INR",
                maximumFractionDigits: 0,
              });

              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:opacity-80"
                  style={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)" }}
                  onClick={() => handleUpgrade(plan)}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {planLabel}
                      {plan.interval === "year" && <span className="text-xs ml-2" style={{ color: "var(--color-ai)" }}>Best value</span>}
                    </div>
                    {plan.trial_days > 0 && (
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {plan.trial_days}-day free trial
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {priceLabel}
                      </div>
                      {plan.interval && (
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          per {plan.interval === "month" ? "month" : "year"}
                        </div>
                      )}
                    </div>
                    <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--color-ai)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          open={showCheckout}
          onClose={() => { setShowCheckout(false); setSelectedPlan(null); }}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}
