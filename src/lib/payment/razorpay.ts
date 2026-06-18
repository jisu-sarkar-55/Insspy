import Razorpay from "razorpay";
import {
  validateWebhookSignature,
  validatePaymentVerification,
} from "razorpay/dist/utils/razorpay-utils";
import type {
  PaymentAdapter,
  CreateOrderParams,
  CreateOrderResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
  WebhookEvent,
} from "./adapter";

let instance: Razorpay | null = null;

function getClient(): Razorpay {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return instance;
}

export const razorpayAdapter: PaymentAdapter = {
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const client = getClient();
    const order = await client.orders.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes,
    });
    return {
      id: order.id || "",
      amount: Number(order.amount) / 100,
      currency: order.currency || "INR",
      receipt: order.receipt || "",
      status: order.status || "",
    };
  },

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const isValid = validatePaymentVerification(
      {
        order_id: params.order_id,
        payment_id: params.payment_id,
      },
      params.signature,
      process.env.RAZORPAY_KEY_SECRET!
    );
    return { verified: isValid };
  },

  processWebhook(body: string, signature: string): WebhookEvent | null {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return null;
    const isValid = validateWebhookSignature(body, signature, secret);
    if (!isValid) return null;
    try {
      return JSON.parse(body) as WebhookEvent;
    } catch {
      return null;
    }
  },

  isMock(): boolean {
    return false;
  },
};
