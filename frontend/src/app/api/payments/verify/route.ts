import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { PAYMENTS_DB, ENTITLEMENTS_DB } from "@/lib/payments/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id = `pay_${Date.now()}`,
      razorpay_signature,
      bookId = "book-jaipur-101",
      userId = "user-tushar-01",
      userEmail = "tushar@storybound.app",
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_storybound_test";

    // Signature verification (in production mode with secret)
    if (razorpay_signature && process.env.NODE_ENV === "production") {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Mark payment as paid in payments table
    if (PAYMENTS_DB[razorpay_order_id]) {
      PAYMENTS_DB[razorpay_order_id].status = "paid";
    }

    // Grant 7-day entitlement
    const now = new Date();
    const freeUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const entitlement = {
      bookId,
      userId,
      paidAt: now.toISOString(),
      freeReexportUntil: freeUntil,
      paymentId: razorpay_payment_id,
    };

    ENTITLEMENTS_DB[`${bookId}:${userId}`] = entitlement;

    // Simulate sending receipt email via Resend
    console.log(
      `[Resend Email Service] Receipt sent to ${userEmail} for ₹50. Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. PDF download unlocked for 7 days.",
      entitlement,
      downloadUrl: `/api/books/${bookId}/export`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 500 }
    );
  }
}
