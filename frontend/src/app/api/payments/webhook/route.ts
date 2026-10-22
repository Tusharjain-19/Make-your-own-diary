import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { PAYMENTS_DB } from "../create/route";
import { ENTITLEMENTS_DB } from "../verify/route";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_storybound";

    // Validate signature in production
    if (signature && process.env.NODE_ENV === "production") {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody || "{}");
    const eventType = event.event;

    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const notes = paymentEntity?.notes || {};
      const bookId = notes.bookId || "book-jaipur-101";
      const userId = notes.userId || "user-tushar-01";

      if (orderId && PAYMENTS_DB[orderId]) {
        PAYMENTS_DB[orderId].status = "paid";
      }

      // Idempotently ensure 7-day entitlement
      const now = new Date();
      const freeUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      ENTITLEMENTS_DB[`${bookId}:${userId}`] = {
        bookId,
        userId,
        paidAt: now.toISOString(),
        freeReexportUntil: freeUntil,
        paymentId: paymentEntity?.id || `pay_${Date.now()}`,
      };

      console.log(`[Webhook] Processed ${eventType} for order ${orderId}, book ${bookId}`);
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
