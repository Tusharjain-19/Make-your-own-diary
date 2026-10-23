import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const globalForOrders = globalThis as unknown as {
  __ORDERS_DB__?: any[];
};

const SERVER_ORDERS_DB = globalForOrders.__ORDERS_DB__ || [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const order = SERVER_ORDERS_DB.find((o) => o.id === orderId);

  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  try {
    const body = await request.json();
    const { status, trackingUrl, carrier, trackingNumber, triggerEmail } = body;

    const orderIdx = SERVER_ORDERS_DB.findIndex((o) => o.id === orderId);
    if (orderIdx === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const order = SERVER_ORDERS_DB[orderIdx];
    const now = new Date().toISOString();

    if (status && status !== order.status) {
      order.status = status;
      order.updatedAt = now;

      let desc = `Order advanced to ${status}.`;
      if (status === "printing") desc = "Production in progress at printing press.";
      if (status === "shipped") desc = `Dispatched with ${carrier || "Courier"}. Tracking: ${trackingNumber || trackingUrl || "Available"}`;
      if (status === "delivered") desc = "Package successfully delivered.";

      order.timeline.push({
        status,
        title: `Status: ${status.toUpperCase()}`,
        description: desc,
        timestamp: now,
      });
    }

    if (trackingUrl !== undefined) order.trackingUrl = trackingUrl;
    if (carrier !== undefined) order.carrier = carrier;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    if (triggerEmail) {
      order.emailsSent = order.emailsSent || [];
      order.emailsSent.push({
        template: `status_update_${order.status}`,
        sentAt: now,
        recipient: order.userEmail,
      });
    }

    return NextResponse.json({
      success: true,
      order,
      message: `Order ${orderId} updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
