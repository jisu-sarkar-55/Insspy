import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
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
  const { code, plan_id } = body;

  if (!code) {
    return NextResponse.json({ valid: false, error: "Coupon code is required" });
  }

  if (!plan_id) {
    return NextResponse.json({ valid: false, error: "Plan ID is required" });
  }

  try {
    const coupons = await sql`SELECT * FROM coupons WHERE code = ${code.toUpperCase()} AND is_active = true LIMIT 1`;
    const coupon = coupons.length > 0 ? coupons[0] : null;

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: "Coupon has expired" });
    }

    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }

    const usageResult = await sql`SELECT COUNT(*) as count FROM coupon_usages WHERE coupon_id = ${coupon.id} AND user_id = ${user.id}`;
    const userUsageCount = Number(usageResult[0].count);

    if (userUsageCount && userUsageCount >= coupon.max_uses_per_user) {
      return NextResponse.json({ valid: false, error: "You have already used this coupon" });
    }

    if (
      coupon.applies_to_plan_ids &&
      coupon.applies_to_plan_ids.length > 0 &&
      !coupon.applies_to_plan_ids.includes(plan_id)
    ) {
      return NextResponse.json({ valid: false, error: "Coupon does not apply to this plan" });
    }

    const plans = await sql`SELECT price FROM pricing_plans WHERE id = ${plan_id} LIMIT 1`;
    const plan = plans.length > 0 ? plans[0] : null;

    if (!plan) {
      return NextResponse.json({ valid: false, error: "Plan not found" });
    }

    let discount_amount = 0;
    const price = parseFloat(plan.price);

    if (coupon.discount_type === "percentage") {
      discount_amount = Math.round(price * (coupon.discount_value / 100) * 100) / 100;
    } else {
      discount_amount = coupon.discount_value;
    }

    if (discount_amount > price) {
      discount_amount = price;
    }

    const final_amount = price - discount_amount;

    if (coupon.min_amount && final_amount < coupon.min_amount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount is ₹${coupon.min_amount}`,
      });
    }

    return NextResponse.json({
      valid: true,
      coupon,
      discount_amount,
      final_amount,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
