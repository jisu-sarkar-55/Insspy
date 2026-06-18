import type {
  PaymentAdapter,
  CreateOrderParams,
  CreateOrderResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
  WebhookEvent,
} from "./adapter";

function randomId(prefix: string): string {
  const hex = Array.from({ length: 14 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `${prefix}_${hex}`;
}

export const mockAdapter: PaymentAdapter = {
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      id: randomId("order"),
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      status: "created",
    };
  },

  async verifyPayment(_params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    await new Promise((r) => setTimeout(r, 200));
    return { verified: true };
  },

  processWebhook(_body: string, _signature: string): WebhookEvent | null {
    return null;
  },

  isMock(): boolean {
    return true;
  },
};
