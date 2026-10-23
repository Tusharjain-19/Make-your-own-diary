"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  FileDown,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StoryboundLogo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth/auth-context";
import { PrintOrder, OrderStatus } from "@/lib/orders/types";
import { getStoredOrders } from "@/lib/orders/store";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<PrintOrder[]>([]);
  const [filter, setFilter] = React.useState<"all" | "active" | "delivered">("all");

  React.useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") return order.status === "placed" || order.status === "printing" || order.status === "shipped";
    if (filter === "delivered") return order.status === "delivered";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1a17] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e8e4db] bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-[#8c8273]">/ My Print Orders</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/orders">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 border-[#ded8cb]">
                <Layers className="h-3.5 w-3.5 text-accent" /> Admin Fulfilment
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs border-[#ded8cb]">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9e3d48] mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Press Bindery & Courier Tracking
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1c1a17]">
              My Hardcover Print Orders
            </h1>
            <p className="mt-1 text-xs text-[#787062]">
              Track real-time printing, hand casebinding, and BlueDart / Delhivery courier status.
            </p>
          </div>

          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#ded8cb] self-start sm:self-auto text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === "all" ? "bg-[#9e3d48] text-white" : "text-[#6e6659] hover:bg-[#faf8f5]"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === "active" ? "bg-[#9e3d48] text-white" : "text-[#6e6659] hover:bg-[#faf8f5]"
              }`}
            >
              In Progress ({orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length})
            </button>
            <button
              onClick={() => setFilter("delivered")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === "delivered" ? "bg-[#9e3d48] text-white" : "text-[#6e6659] hover:bg-[#faf8f5]"
              }`}
            >
              Delivered ({orders.filter((o) => o.status === "delivered").length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="border border-[#ded8cb] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf5f6] text-[#9e3d48]">
              <Package className="h-7 w-7" />
            </div>
            <CardHeader>
              <CardTitle className="font-serif text-xl">No orders found</CardTitle>
              <CardDescription>
                You haven&apos;t placed any hardcover print orders in this category yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button size="sm">Go to My Books</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
                placed: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
                printing: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
                shipped: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
                delivered: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
                cancelled: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
              };

              const currentTheme = statusColors[order.status] || statusColors.placed;

              const stages: { key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
                { key: "placed", label: "Order Received", icon: Package },
                { key: "printing", label: "Printing & Casing", icon: Printer },
                { key: "shipped", label: "Dispatched", icon: Truck },
                { key: "delivered", label: "Delivered", icon: CheckCircle2 },
              ];

              const currentStageIndex =
                order.status === "placed"
                  ? 0
                  : order.status === "printing"
                  ? 1
                  : order.status === "shipped"
                  ? 2
                  : 3;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#ded8cb] bg-white p-6 sm:p-7 shadow-xs space-y-6"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0ede6] pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#1c1a17]">
                          {order.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h2 className="font-serif text-lg font-semibold text-[#1c1a17] mt-1">
                        {order.bookTitle}
                      </h2>
                    </div>

                    <div className="text-right sm:text-right text-xs">
                      <div className="font-serif text-base font-bold text-[#1c1a17]">
                        ₹{(order.totalPaise / 100).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[#8c8273]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Timeline */}
                  <div className="bg-[#faf8f5] rounded-xl border border-[#ded8cb] p-5">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {stages.map((stage, idx) => {
                        const isDone = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const Icon = stage.icon;

                        return (
                          <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                                isDone
                                  ? "bg-[#9e3d48] border-[#9e3d48] text-white shadow-xs"
                                  : "bg-white border-[#ded8cb] text-[#8c8273]"
                              } ${isCurrent ? "ring-4 ring-[#9e3d48]/20" : ""}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span
                              className={`text-[11px] mt-2 font-medium ${
                                isDone ? "text-[#1c1a17]" : "text-[#8c8273]"
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline Log Messages */}
                    {order.timeline && order.timeline.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#e8e4db] space-y-1.5 text-xs text-[#595247]">
                        {order.timeline.slice(-2).map((tl, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium text-[#1c1a17]">{tl.title}: </span>
                              <span>{tl.description} </span>
                              <span className="text-[10px] text-[#8c8273] font-mono">
                                ({new Date(tl.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Specs & Delivery Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-[#ded8cb] p-4 space-y-1.5 bg-white">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8c8273]">
                        Specifications
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8c8273]">Edition:</span>
                        <span className="font-medium text-[#1c1a17]">{order.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8c8273]">Quantity:</span>
                        <span>{order.copies} copies</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8c8273]">Calculated Spine:</span>
                        <span className="font-mono text-amber-700 font-semibold">{order.spineWidthMm} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8c8273]">Page Count:</span>
                        <span>{order.pageCount} pages (archival paper)</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#ded8cb] p-4 space-y-1.5 bg-white">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8c8273]">
                        Courier Delivery Address
                      </div>
                      <div className="font-medium text-[#1c1a17]">
                        {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                      </div>
                      <div className="text-[#6e6659] leading-relaxed">
                        {order.shippingAddress.streetAddress}
                        {order.shippingAddress.landmark && `, ${order.shippingAddress.landmark}`}
                      </div>
                      <div className="text-[#6e6659] font-mono">
                        {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}
                      </div>
                      {order.trackingNumber && (
                        <div className="pt-1 text-[#9e3d48] font-mono text-[11px] font-semibold">
                          Carrier: {order.carrier || "BlueDart"} ({order.trackingNumber})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ede6] pt-4">
                    <div className="flex items-center gap-2">
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1a17] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          <span>Track Package</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      <Link href={`/books/${order.bookId}/preview`}>
                        <Button variant="outline" size="sm" className="text-xs border-[#ded8cb]">
                          View 3D Preview
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={order.printFilePath || `/api/books/${order.bookId}/export?type=print&cropMarks=true&bleed=3`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline" size="sm" className="text-xs gap-1 border-[#ded8cb]">
                          <FileDown className="h-3.5 w-3.5 text-accent" />
                          <span>Interior Proof (3mm Bleed)</span>
                        </Button>
                      </a>

                      <a
                        href={order.coverSpreadFilePath || `/api/books/${order.bookId}/export?type=cover`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline" size="sm" className="text-xs gap-1 border-[#ded8cb]">
                          <FileDown className="h-3.5 w-3.5 text-accent" />
                          <span>Cover Spread</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
