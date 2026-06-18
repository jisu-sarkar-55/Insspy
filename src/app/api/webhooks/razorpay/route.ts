import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getPaymentAdapter } from "@/lib/payment";

export async function POST(request: Request) {
  const adapter = getPaymentAdapter();

  if (adapter.isMock()) {
    return NextResponse.json({ status: "ignored_mock" });
  }

  const body = await request.text();
  const signature = request.headers.get("X-Razorpay-Signature") || "";

  const event = adapter.processWebhook(body, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload as Record<string, any>;
      const razorpayPayment = payment?.payment?.entity;
      if (!razorpayPayment) break;

      const orderId = razorpayPayment.order_id;

      const subs = await sql`SELECT * FROM subscriptions WHERE razorpay_order_id = ${orderId} LIMIT 1`;
      const subscription = subs.length > 0 ? subs[0] : null;

      if (!subscription || subscription.status !== "trialing") break;

      const now = new Date();
      const plans = await sql`SELECT * FROM pricing_plans WHERE id = ${subscription.plan_id} LIMIT 1`;
      const plan = plans.length > 0 ? plans[0] : null;

      let periodEnd: Date;
      if (plan?.interval === "month") {
        periodEnd = new Date(now.getTime() + 30 * 86400000);
      } else if (plan?.interval === "year") {
        periodEnd = new Date(now.getTime() + 365 * 86400000);
      } else {
        periodEnd = new Date("2099-12-31");
      }

      await sql`
        UPDATE subscriptions
        SET status = 'active',
            current_period_start = ${now.toISOString()},
            current_period_end = ${periodEnd.toISOString()},
            trial_start = NULL,
            trial_end = NULL,
            updated_at = ${now.toISOString()}
        WHERE id = ${subscription.id}
      `;

      await sql`
        INSERT INTO payments (user_id, subscription_id, amount, currency, status, processor, razorpay_payment_id, razorpay_order_id)
        VALUES (${subscription.user_id}, ${subscription.id}, ${razorpayPayment.amount / 100}, ${razorpayPayment.currency || "INR"}, 'succeeded', 'razorpay', ${razorpayPayment.id}, ${orderId})
      `;

      break;
    }

    case "payment.failed": {
      const failedPayment = (event.payload as Record<string, any>)?.payment?.entity;
      if (!failedPayment) break;

      await sql`
        INSERT INTO payments (user_id, amount, currency, status, processor, razorpay_payment_id, razorpay_order_id)
        VALUES (${failedPayment.notes?.user_id || ""}, ${failedPayment.amount / 100}, ${failedPayment.currency || "INR"}, 'failed', 'razorpay', ${failedPayment.id}, ${failedPayment.order_id})
      `;

      break;
    }

    case "subscription.charged": {
      const subEvent = event.payload as Record<string, any>;
      const razorpaySub = subEvent?.subscription?.entity;
      if (!razorpaySub) break;

      await sql`
        UPDATE subscriptions
        SET razorpay_subscription_id = ${razorpaySub.id},
            updated_at = ${new Date().toISOString()}
        WHERE razorpay_order_id = ${razorpaySub.order_id}
      `;

      break;
    }
  }

  return NextResponse.json({ status: "ok" });
}
