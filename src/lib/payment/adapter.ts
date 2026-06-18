export interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface VerifyPaymentParams {
  order_id: string;
  payment_id: string;
  signature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
}

export interface WebhookEvent {
  event: string;
  payload: Record<string, unknown>;
}

export interface PaymentAdapter {
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  processWebhook(body: string, signature: string): WebhookEvent | null;
  isMock(): boolean;
}
