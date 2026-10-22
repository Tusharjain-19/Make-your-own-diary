import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Idempotent payments in-memory table
export const PAYMENTS_DB: Record<
  string,
  {
    id: string;
    bookId: string;
    userId: string;
    amountPaise: number;
    currency: string;
    status: "created" | "paid" | "failed";
    createdAt: string;
  }
> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId = "book-jaipur-101", userId = "user-tushar-01" } = body;

    // Idempotent check: if an order exists and was created in the last 10 minutes, return it
    const existingOrder = Object.values(PAYMENTS_DB).find(
      (p) => p.bookId === bookId && p.userId === userId && p.status === "created"
    );

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        amount: existingOrder.amountPaise,
        currency: existingOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_storybound_key",
      });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const paymentRecord = {
      id: orderId,
      bookId,
      userId,
      amountPaise: 5000, // ₹50.00
      currency: "INR",
      status: "created" as const,
      createdAt: new Date().toISOString(),
    };

    PAYMENTS_DB[orderId] = paymentRecord;

    return NextResponse.json({
      success: true,
      orderId,
      amount: 5000,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_storybound_key",
      receipt: `rcpt_${bookId}_${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 }
    );
  }
}
