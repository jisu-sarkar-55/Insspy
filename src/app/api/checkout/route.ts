import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { getPaymentAdapter, isMockMode } from "@/lib/payment";
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
  const { plan_id, coupon_code } = body;

  if (!plan_id) {
    return NextResponse.json({ error: "plan_id is required" }, { status: 400 });
  }

  try {
    const plans = await sql`SELECT * FROM pricing_plans WHERE id = ${plan_id} AND is_active = true LIMIT 1`;
    const plan = plans.length > 0 ? plans[0] : null;

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    let coupon = null;
    let discount_amount = 0;
    let final_amount = parseFloat(plan.price);

    if (coupon_code) {
      const coupons = await sql`SELECT * FROM coupons WHERE code = ${coupon_code.toUpperCase()} AND is_active = true LIMIT 1`;
      const couponData = coupons.length > 0 ? coupons[0] : null;

      if (!couponData) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }

      if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }

      const usageResult = await sql`SELECT COUNT(*) as count FROM coupon_usages WHERE coupon_id = ${couponData.id} AND user_id = ${user.id}`;
      const userUsageCount = Number(usageResult[0].count);

      if (userUsageCount && userUsageCount >= couponData.max_uses_per_user) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }

      if (
        couponData.applies_to_plan_ids &&
        couponData.applies_to_plan_ids.length > 0 &&
        !couponData.applies_to_plan_ids.includes(plan_id)
      ) {
        return NextResponse.json({ error: "Coupon does not apply to this plan" }, { status: 400 });
      }

      coupon = couponData;

      if (couponData.discount_type === "percentage") {
        discount_amount = Math.round(final_amount * (couponData.discount_value / 100) * 100) / 100;
      } else {
        discount_amount = couponData.discount_value;
      }

      if (discount_amount > final_amount) {
        discount_amount = final_amount;
      }

      final_amount = final_amount - discount_amount;

      if (couponData.min_amount && final_amount < couponData.min_amount) {
        return NextResponse.json({
          error: `Minimum order amount is ₹${couponData.min_amount}`,
        }, { status: 400 });
      }
    }

    const adapter = getPaymentAdapter();
    const receipt = `rcpt_${user.id.slice(0, 8)}_${Date.now()}`;

    const order = await adapter.createOrder({
      amount: final_amount,
      currency: plan.currency || "INR",
      receipt,
      notes: {
        user_id: user.id,
        plan_id,
        coupon_id: coupon?.id || "",
      },
    });

    const mock = isMockMode();

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      coupon,
      discount_amount,
      final_amount,
      mock,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
