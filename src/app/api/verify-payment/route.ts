import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { getPaymentAdapter } from "@/lib/payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { order_id, payment_id, signature, plan_id, coupon_id, amount, mock } = body;

  if (!mock) {
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    const adapter = getPaymentAdapter();
    const result = await adapter.verifyPayment({ order_id, payment_id, signature });

    if (!result.verified) {
      await sql`
        INSERT INTO payments (user_id, amount, currency, status, processor, razorpay_order_id, razorpay_payment_id)
        VALUES (${user.id}, ${amount || 0}, 'INR', 'failed', 'razorpay', ${order_id}, ${payment_id})
      `;

      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }
  }

  const plans = await sql`SELECT * FROM pricing_plans WHERE id = ${plan_id} LIMIT 1`;
  const plan = plans.length > 0 ? plans[0] : null;

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const now = new Date();
  const trial_days = plan.trial_days || 0;

  let current_period_start: Date;
  let current_period_end: Date;
  let status: string;
  let trial_start: Date | null = null;
  let trial_end: Date | null = null;

  if (trial_days > 0) {
    trial_start = now;
    trial_end = new Date(now.getTime() + trial_days * 86400000);
    current_period_start = trial_end;
    status = "trialing";
  } else {
    current_period_start = now;
    status = "active";
  }

  if (plan.interval === "month") {
    current_period_end = new Date(
      (trial_end || now).getTime() + 30 * 86400000
    );
  } else if (plan.interval === "year") {
    current_period_end = new Date(
      (trial_end || now).getTime() + 365 * 86400000
    );
  } else {
    current_period_end = new Date("2099-12-31");
  }

  const existingSubs = await sql`SELECT id FROM subscriptions WHERE user_id = ${user.id} AND status = ANY(${["active", "trialing"]}) LIMIT 1`;
  const existingSub = existingSubs.length > 0 ? existingSubs[0] : null;

  if (existingSub) {
    return NextResponse.json(
      { success: false, error: "User already has an active subscription" },
      { status: 409 }
    );
  }

  const subs = await sql`
    INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end, trial_start, trial_end, coupon_id, razorpay_order_id)
    VALUES (${user.id}, ${plan_id}, ${status}, ${current_period_start.toISOString()}, ${current_period_end.toISOString()}, ${trial_start?.toISOString() || null}, ${trial_end?.toISOString() || null}, ${coupon_id || null}, ${order_id || null})
    RETURNING *
  `;
  const subscription = subs[0];

  if (!subscription) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }

  await sql`
    INSERT INTO payments (user_id, subscription_id, amount, currency, status, processor, razorpay_order_id, razorpay_payment_id, razorpay_signature, coupon_id, discount_amount)
    VALUES (${user.id}, ${subscription.id}, ${amount || parseFloat(plan.price)}, ${plan.currency || "INR"}, 'succeeded', ${mock ? "mock" : "razorpay"}, ${order_id || null}, ${payment_id || null}, ${signature || null}, ${coupon_id || null}, 0)
  `;

  if (coupon_id) {
    await sql`INSERT INTO coupon_usages (coupon_id, user_id) VALUES (${coupon_id}, ${user.id})`;

    const couponRows = await sql`SELECT current_uses FROM coupons WHERE id = ${coupon_id} LIMIT 1`;
    const couponData = couponRows.length > 0 ? couponRows[0] : null;

    if (couponData) {
      await sql`UPDATE coupons SET current_uses = ${(couponData.current_uses || 0) + 1} WHERE id = ${coupon_id}`;
    }
  }

  return NextResponse.json({
    success: true,
    subscription,
  });
}
