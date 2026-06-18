import type { PaymentAdapter } from "./adapter";
import { razorpayAdapter } from "./razorpay";
import { mockAdapter } from "./mock";

let cachedAdapter: PaymentAdapter | null = null;

export function getPaymentAdapter(): PaymentAdapter {
  if (cachedAdapter) return cachedAdapter;

  const mode = process.env.RAZORPAY_MODE || "mock";
  const hasKeys =
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

  if (mode === "live" && hasKeys) {
    cachedAdapter = razorpayAdapter;
  } else {
    cachedAdapter = mockAdapter;
  }

  return cachedAdapter;
}

export function isMockMode(): boolean {
  return getPaymentAdapter().isMock();
}
