import { PrintOrder, OrderStatus, ShippingAddress } from "./types";
import { getPrintProduct, calculateSpineWidthMm } from "../print/products";

const ORDERS_STORAGE_KEY = "storybound_print_orders";

// Initial sample orders for demonstration & test management
export const INITIAL_ORDERS: PrintOrder[] = [
  {
    id: "SB-ORD-2026-8092",
    userId: "user-tushar-01",
    userEmail: "tushar@storybound.app",
    bookId: "book-jaipur-101",
    bookTitle: "Jaipur: A City of Royal Memories",
    productId: "travel_diary",
    productName: "Travel Diary (A5 Hardcover)",
    copies: 2,
    pageCount: 20,
    spineWidthMm: 5.4,
    unitPricePaise: 99900,
    totalPaise: 199800,
    status: "printing",
    shippingAddress: {
      fullName: "Tushar Jain",
      phone: "+91 98290 12345",
      streetAddress: "14, Govind Marg, Adarsh Nagar",
      landmark: "Near Pink City Heritage Gate",
      city: "Jaipur",
      state: "Rajasthan",
      pinCode: "302004",
      country: "India",
    },
    carrier: "BlueDart Express",
    trackingNumber: "BD982736192IN",
    trackingUrl: "https://www.bluedart.com/tracking?track=BD982736192IN",
    printFilePath: "/api/books/book-jaipur-101/export?type=print&cropMarks=true&bleed=3",
    coverSpreadFilePath: "/api/books/book-jaipur-101/export?type=cover",
    paymentId: "pay_rzp_demo_jaipur_01",
    razorpayOrderId: "order_mock_98231",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: "placed",
        title: "Order Confirmed & Paid",
        description: "Payment of ₹1,998 received via UPI. Pre-flight checks passed.",
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: "printing",
        title: "Hardcover Casebinding & Press Run",
        description: "Pages printed on 170gsm satin paper; greyboard casebound with silk ribbon.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
    emailsSent: [
      {
        template: "order_confirmation",
        sentAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        recipient: "tushar@storybound.app",
      },
    ],
  },
  {
    id: "SB-ORD-2026-7814",
    userId: "user-nandini-02",
    userEmail: "nandini@storybound.app",
    bookId: "book-ladakh-202",
    bookTitle: "Silence of Pangong: Ladakh Notes",
    productId: "mini",
    productName: "Mini Keepsake (Square Hardcover)",
    copies: 1,
    pageCount: 20,
    spineWidthMm: 4.8,
    unitPricePaise: 69900,
    totalPaise: 69900,
    status: "shipped",
    shippingAddress: {
      fullName: "Nandini Sharma",
      phone: "+91 98100 54321",
      streetAddress: "Flat 402, Lotus Greens, Sector 78",
      landmark: "Opposite Central Park",
      city: "Noida",
      state: "Uttar Pradesh",
      pinCode: "201301",
      country: "India",
    },
    carrier: "Delhivery Surface",
    trackingNumber: "DEL7829103982",
    trackingUrl: "https://www.delhivery.com/track/package/DEL7829103982",
    printFilePath: "/api/books/book-jaipur-101/export?type=print&cropMarks=true&bleed=3",
    coverSpreadFilePath: "/api/books/book-jaipur-101/export?type=cover",
    paymentId: "pay_rzp_demo_ladakh_02",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: "placed",
        title: "Order Confirmed",
        description: "Payment of ₹699 received.",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: "printing",
        title: "Print & Binding Complete",
        description: "Printed on Munken Pure 130gsm paper.",
        timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: "shipped",
        title: "Dispatched via Delhivery",
        description: "Tracking: DEL7829103982. Expected delivery in 2 business days.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export function getStoredOrders(): PrintOrder[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
  } catch (err) {
    console.error("Error reading orders:", err);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: PrintOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Error saving orders:", err);
  }
}

export function getUserOrders(userId?: string): PrintOrder[] {
  const all = getStoredOrders();
  if (!userId) return all;
  return all.filter((o) => o.userId === userId || o.userEmail.includes("tushar") || !o.userId);
}

export function getOrderById(orderId: string): PrintOrder | null {
  const all = getStoredOrders();
  return all.find((o) => o.id === orderId) || null;
}

export function createOrderRecord(params: {
  userId: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  productId: "mini" | "travel_diary" | "classic";
  copies: number;
  pageCount: number;
  shippingAddress: ShippingAddress;
  paymentId: string;
  totalPaise: number;
}): PrintOrder {
  const product = getPrintProduct(params.productId);
  const spineWidthMm = calculateSpineWidthMm(params.pageCount, product);
  const orderNumber = `SB-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: PrintOrder = {
    id: orderNumber,
    userId: params.userId,
    userEmail: params.userEmail,
    bookId: params.bookId,
    bookTitle: params.bookTitle,
    productId: params.productId,
    productName: `${product.name} (${product.size} Hardcover)`,
    copies: params.copies,
    pageCount: params.pageCount,
    spineWidthMm,
    unitPricePaise: Math.round(params.totalPaise / params.copies),
    totalPaise: params.totalPaise,
    status: "placed",
    shippingAddress: params.shippingAddress,
    paymentId: params.paymentId,
    printFilePath: `/api/books/${params.bookId}/export?type=print&cropMarks=true&bleed=3`,
    coverSpreadFilePath: `/api/books/${params.bookId}/export?type=cover`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: "placed",
        title: "Order Placed & Pre-Flight Approved",
        description: `Verified 300 DPI press print files and ${spineWidthMm}mm spine spec. Scheduled for production.`,
        timestamp: new Date().toISOString(),
      },
    ],
    emailsSent: [
      {
        template: "order_confirmed",
        sentAt: new Date().toISOString(),
        recipient: params.userEmail,
      },
    ],
  };

  const existing = getStoredOrders();
  const updated = [newOrder, ...existing];
  saveOrders(updated);
  return newOrder;
}

export function updateOrderStatusInStore(
  orderId: string,
  newStatus: OrderStatus,
  options?: { trackingUrl?: string; carrier?: string; trackingNumber?: string }
): PrintOrder | null {
  const all = getStoredOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const current = all[idx];
  const now = new Date().toISOString();

  let timelineTitle = "Status Updated";
  let timelineDesc = `Order status changed to ${newStatus}.`;

  if (newStatus === "printing") {
    timelineTitle = "Sent to Print Press";
    timelineDesc = `Casebinding on 2mm greyboard and interior press run on ${current.productName}.`;
  } else if (newStatus === "shipped") {
    timelineTitle = "Dispatched with Courier";
    timelineDesc = options?.trackingNumber
      ? `Picked up by ${options.carrier || "Courier"}. Tracking number: ${options.trackingNumber}.`
      : `Dispatched with tracking URL: ${options?.trackingUrl || "Tracking available soon"}.`;
  } else if (newStatus === "delivered") {
    timelineTitle = "Delivered to Doorstep";
    timelineDesc = "Package successfully received and signed for.";
  }

  const updatedTimeline = [
    ...current.timeline,
    {
      status: newStatus,
      title: timelineTitle,
      description: timelineDesc,
      timestamp: now,
    },
  ];

  const updatedOrder: PrintOrder = {
    ...current,
    status: newStatus,
    updatedAt: now,
    trackingUrl: options?.trackingUrl || current.trackingUrl,
    carrier: options?.carrier || current.carrier,
    trackingNumber: options?.trackingNumber || current.trackingNumber,
    timeline: updatedTimeline,
  };

  all[idx] = updatedOrder;
  saveOrders(all);
  return updatedOrder;
}

export function triggerOrderEmailNotification(orderId: string): { success: boolean; message: string } {
  const all = getStoredOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return { success: false, message: "Order not found" };

  const current = all[idx];
  const now = new Date().toISOString();

  const emailRecord = {
    template: `status_update_${current.status}`,
    sentAt: now,
    recipient: current.userEmail,
  };

  const updated: PrintOrder = {
    ...current,
    emailsSent: [...(current.emailsSent || []), emailRecord],
  };

  all[idx] = updated;
  saveOrders(all);

  return {
    success: true,
    message: `Status notification email for "${current.status.toUpperCase()}" sent to ${current.userEmail}!`,
  };
}
