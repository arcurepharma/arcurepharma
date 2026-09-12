export type PaymentMethod = "COD" | "JazzCash" | "EasyPaisa" | "Card";

export interface PaymentConfig {
  method: PaymentMethod;
  enabled: boolean;
  label: string;
  description: string;
  icon: string;
  fees?: number; // Additional fees
}

export const paymentMethods: PaymentConfig[] = [
  {
    method: "COD",
    enabled: true,
    label: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: "💵",
    fees: 0,
  },
  {
    method: "JazzCash",
    enabled: true,
    label: "JazzCash",
    description: "Pay securely via JazzCash mobile wallet",
    icon: "📱",
    fees: 0,
  },
  {
    method: "EasyPaisa",
    enabled: true,
    label: "EasyPaisa",
    description: "Pay using EasyPaisa account",
    icon: "💳",
    fees: 0,
  },
  {
    method: "Card",
    enabled: true,
    label: "Credit/Debit Card",
    description: "Secure payment with your card",
    icon: "💳",
    fees: 0,
  },
];

export function getPaymentMethod(method: PaymentMethod): PaymentConfig | undefined {
  return paymentMethods.find((pm) => pm.method === method && pm.enabled);
}

export function calculatePaymentFee(method: PaymentMethod, amount: number): number {
  const config = getPaymentMethod(method);
  if (!config || !config.fees) return 0;
  return config.fees;
}

// COD Payment Processing
export async function processCODPayment(orderId: string, orderData: any) {
  // For COD, we just need to create the order
  // Payment will be collected on delivery
  return {
    success: true,
    orderId,
    paymentMethod: "COD",
    status: "Pending",
    message: "Order placed successfully. Pay on delivery.",
  };
}

// JazzCash Integration (placeholder)
export async function processJazzCashPayment(amount: number, orderData: any) {
  // In production, integrate with JazzCash API
  // https://sandbox.jazzcash.com.pk/
  
  return {
    success: true,
    transactionId: `JC${Date.now()}`,
    paymentMethod: "JazzCash",
    status: "Paid",
    message: "Payment successful via JazzCash",
  };
}

// EasyPaisa Integration (placeholder)
export async function processEasyPaisaPayment(amount: number, orderData: any) {
  // In production, integrate with EasyPaisa API
  
  return {
    success: true,
    transactionId: `EP${Date.now()}`,
    paymentMethod: "EasyPaisa",
    status: "Paid",
    message: "Payment successful via EasyPaisa",
  };
}

// Card Payment Integration (placeholder)
export async function processCardPayment(amount: number, cardData: any, orderData: any) {
  // In production, integrate with payment gateway (Stripe, PayFast, etc.)
  
  return {
    success: true,
    transactionId: `CARD${Date.now()}`,
    paymentMethod: "Card",
    status: "Paid",
    message: "Payment successful",
  };
}
