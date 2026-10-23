import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidIndianPinCode } from "@/lib/orders/types";
import { calculateOrderPrice, getPrintProduct } from "@/lib/print/products";

// Server-side in-memory orders cache
const globalForOrders = globalThis as unknown as {
  __ORDERS_DB__?: any[];
};

const SERVER_ORDERS_DB = globalForOrders.__ORDERS_DB__ || [];
if (process.env.NODE_ENV !== "production") {
  globalForOrders.__ORDERS_DB__ = SERVER_ORDERS_DB;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  let orders = [...SERVER_ORDERS_DB];
  if (userId) {
    orders = orders.filter((o) => o.userId === userId);
  }

  return NextResponse.json({ success: true, orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "user-tushar-01",
      userEmail = "tushar@storybound.app",
      bookId = "book-jaipur-101",
      bookTitle = "Jaipur: A City of Royal Memories",
      productId = "travel_diary",
      copies = 1,
      pageCount = 20,
      shippingAddress,
      paymentId = `pay_${Date.now()}`,
    } = body;

    // PIN code validation
    if (!shippingAddress || !shippingAddress.pinCode) {
      return NextResponse.json(
        { success: false, error: "Shipping address and 6-digit Indian PIN code are required." },
        { status: 400 }
      );
    }

    if (!isValidIndianPinCode(shippingAddress.pinCode)) {
      return NextResponse.json(
        { success: false, error: "Invalid Indian PIN code. Must be 6 numeric digits (e.g. 302001)." },
        { status: 400 }
      );
    }

    const product = getPrintProduct(productId);
    const pricing = calculateOrderPrice(productId, copies, pageCount);
    const orderNumber = `SB-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = {
      id: orderNumber,
      userId,
      userEmail,
      bookId,
      bookTitle,
      productId,
      productName: `${product.name} (${product.size} Hardcover)`,
      copies,
      pageCount,
      totalPaise: pricing.totalPaise,
      unitPricePaise: pricing.unitPricePaise,
      shippingAddress,
      status: "placed",
      paymentId,
      printFilePath: `/api/books/${bookId}/export?type=print&cropMarks=true&bleed=3`,
      coverSpreadFilePath: `/api/books/${bookId}/export?type=cover`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: "placed",
          title: "Order Placed & Pre-Flight Approved",
          description: `Press files generated with 3mm bleed. Total: ₹${(pricing.totalPaise / 100).toFixed(2)}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      emailsSent: [
        {
          template: "order_confirmation",
          sentAt: new Date().toISOString(),
          recipient: userEmail,
        },
      ],
    };

    SERVER_ORDERS_DB.unshift(order);

    return NextResponse.json({
      success: true,
      order,
      message: "Print order placed successfully!",
    });
  } catch (error) {
    console.error("Failed to place print order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to place print order",
      },
      { status: 500 }
    );
  }
}
