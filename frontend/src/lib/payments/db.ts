// Shared in-memory payments & entitlements DB for Next.js App Router API routes

export interface PaymentRecord {
  id: string;
  bookId: string;
  userId: string;
  purpose?: "pdf_export" | "print_order";
  amountPaise: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  createdAt: string;
}

export interface EntitlementRecord {
  bookId: string;
  userId: string;
  paidAt: string;
  freeReexportUntil: string;
  paymentId: string;
}

// Global persistence in Node.js runtime across hot reloads
const globalForPayments = globalThis as unknown as {
  __PAYMENTS_DB__?: Record<string, PaymentRecord>;
  __ENTITLEMENTS_DB__?: Record<string, EntitlementRecord>;
};

export const PAYMENTS_DB: Record<string, PaymentRecord> =
  globalForPayments.__PAYMENTS_DB__ || {};
export const ENTITLEMENTS_DB: Record<string, EntitlementRecord> =
  globalForPayments.__ENTITLEMENTS_DB__ || {};

if (process.env.NODE_ENV !== "production") {
  globalForPayments.__PAYMENTS_DB__ = PAYMENTS_DB;
  globalForPayments.__ENTITLEMENTS_DB__ = ENTITLEMENTS_DB;
}
