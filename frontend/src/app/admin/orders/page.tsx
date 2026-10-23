"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  ArrowLeft,
  Truck,
  Printer,
  FileDown,
  Mail,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Shield,
  Clock,
  Send,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryboundLogo } from "@/components/ui/logo";
import { PrintOrder, OrderStatus } from "@/lib/orders/types";
import {
  getStoredOrders,
  updateOrderStatusInStore,
  triggerOrderEmailNotification,
} from "@/lib/orders/store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<PrintOrder[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [notificationToast, setNotificationToast] = React.useState<string | null>(null);

  // Editable tracking state per order
  const [trackingEdits, setTrackingEdits] = React.useState<
    Record<string, { carrier: string; trackingNumber: string; trackingUrl: string }>
  >({});

  const loadOrders = () => {
    const list = getStoredOrders();
    setOrders(list);

    // Initialize edit fields
    const initialEdits: Record<string, { carrier: string; trackingNumber: string; trackingUrl: string }> = {};
    list.forEach((o) => {
      initialEdits[o.id] = {
        carrier: o.carrier || "BlueDart Express",
        trackingNumber: o.trackingNumber || "",
        trackingUrl: o.trackingUrl || "",
      };
    });
    setTrackingEdits(initialEdits);
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const edits = trackingEdits[orderId] || {};
    const updated = updateOrderStatusInStore(orderId, newStatus, {
      carrier: edits.carrier,
      trackingNumber: edits.trackingNumber,
      trackingUrl: edits.trackingUrl,
    });
    if (updated) {
      loadOrders();
      showToast(`Order ${orderId} updated to "${newStatus.toUpperCase()}"`);
    }
  };

  const handleSaveTracking = (orderId: string) => {
    const edits = trackingEdits[orderId];
    if (!edits) return;

    const autoUrl =
      edits.trackingUrl ||
      (edits.carrier.toLowerCase().includes("bluedart")
        ? `https://www.bluedart.com/tracking?track=${edits.trackingNumber}`
        : `https://www.delhivery.com/track/package/${edits.trackingNumber}`);

    const updated = updateOrderStatusInStore(orderId, "shipped", {
      carrier: edits.carrier,
      trackingNumber: edits.trackingNumber,
      trackingUrl: autoUrl,
    });

    if (updated) {
      loadOrders();
      showToast(`Tracking saved & order dispatched via ${edits.carrier}!`);
    }
  };

  const handleTriggerEmail = (orderId: string) => {
    const result = triggerOrderEmailNotification(orderId);
    loadOrders();
    showToast(result.message);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.pinCode.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPaise, 0);
  const activePrintCount = orders.filter((o) => o.status === "printing").length;
  const inTransitCount = orders.filter((o) => o.status === "shipped").length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1a17] antialiased">
      {/* Toast Alert */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-900 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e8e4db] bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-[#8c8273]">/ Press Fulfilment & Bindery Ops</span>
            <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 border border-amber-200">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="text-xs border-[#ded8cb]">
                <Package className="mr-1.5 h-3.5 w-3.5" /> Customer Orders
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

      {/* Main Admin Dashboard */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1c1a17]">
            Print Orders Fulfilment
          </h1>
          <p className="mt-1 text-xs text-[#787062]">
            Inspect print files (3mm bleed, crop marks, spine wrap), advance status, assign courier tracking, and dispatch status emails.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#ded8cb] bg-white p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-[#8c8273]">Total Orders</span>
            <div className="font-serif text-2xl font-bold text-[#1c1a17] mt-1">{orders.length}</div>
          </div>
          <div className="rounded-xl border border-[#ded8cb] bg-white p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-amber-700">At Press & Binding</span>
            <div className="font-serif text-2xl font-bold text-amber-800 mt-1">{activePrintCount}</div>
          </div>
          <div className="rounded-xl border border-[#ded8cb] bg-white p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-indigo-700">Dispatched in Transit</span>
            <div className="font-serif text-2xl font-bold text-indigo-800 mt-1">{inTransitCount}</div>
          </div>
          <div className="rounded-xl border border-[#ded8cb] bg-white p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-emerald-700">Fulfilment Revenue</span>
            <div className="font-serif text-2xl font-bold text-emerald-800 mt-1">
              ₹{(totalRevenue / 100).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#e8e4db] pb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8c8273]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, city, PIN..."
              className="w-full rounded-lg border border-[#ded8cb] bg-white pl-8.5 pr-3 py-1.5 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto text-xs">
            {["all", "placed", "printing", "shipped", "delivered"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                  statusFilter === st
                    ? "bg-[#9e3d48] text-white"
                    : "bg-white border border-[#ded8cb] text-[#6e6659] hover:bg-[#faf8f5]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-[#ded8cb] bg-white p-8 text-center text-xs text-[#8c8273]">
              No orders matched your search or filter.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const edits = trackingEdits[order.id] || {
                carrier: order.carrier || "BlueDart Express",
                trackingNumber: order.trackingNumber || "",
                trackingUrl: order.trackingUrl || "",
              };

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#ded8cb] bg-white p-6 shadow-xs space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#f0ede6] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#1c1a17]">{order.id}</span>
                        <span className="rounded bg-[#faf8f5] px-2 py-0.5 text-[10px] font-mono border border-[#e5dfd3] text-[#787062]">
                          Ref: {order.paymentId}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#1c1a17] mt-0.5">
                        {order.bookTitle}
                      </h3>
                      <div className="text-xs text-[#787062]">
                        {order.productName} · <strong>{order.copies} {order.copies > 1 ? "copies" : "copy"}</strong> · Spine: <strong>{order.spineWidthMm}mm</strong> · {order.pageCount} pages
                      </div>
                    </div>

                    {/* Download Print Files (Core Day 22 / Day 23 requirement) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={order.printFilePath || `/api/books/${order.bookId}/export?type=print&cropMarks=true&bleed=3`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-8 text-xs gap-1.5 bg-[#1c1a17] text-white hover:bg-neutral-800"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          <span>Interior (3mm Bleed + Marks)</span>
                        </Button>
                      </a>

                      <a
                        href={order.coverSpreadFilePath || `/api/books/${order.bookId}/export?type=cover`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5 border-[#ded8cb]"
                        >
                          <FileDown className="h-3.5 w-3.5 text-accent" />
                          <span>Cover Spread ({order.spineWidthMm}mm Spine)</span>
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Shipping Address & Status Controls Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                    {/* Shipping Address Box (5 cols) */}
                    <div className="md:col-span-5 rounded-xl border border-[#ded8cb] bg-[#faf8f5] p-4 space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c8273]">
                        Shipping Destination
                      </div>
                      <div className="font-semibold text-[#1c1a17]">
                        {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                      </div>
                      <div className="text-[#595247] leading-relaxed">
                        {order.shippingAddress.streetAddress}
                        {order.shippingAddress.landmark && `, ${order.shippingAddress.landmark}`}
                      </div>
                      <div className="font-mono text-[#595247]">
                        {order.shippingAddress.city}, {order.shippingAddress.state} — <strong>{order.shippingAddress.pinCode}</strong>
                      </div>
                      <div className="text-[11px] text-[#8c8273] pt-1">
                        Email: {order.userEmail}
                      </div>
                    </div>

                    {/* Fulfilment Controls (7 cols) */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Status Dropdown & Email Trigger */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf8f5] p-3 rounded-xl border border-[#ded8cb]">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-medium text-[#595247]">
                            Current Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="rounded-lg border border-[#ded8cb] bg-white px-2.5 py-1 text-xs font-semibold text-[#1c1a17] focus:outline-none focus:border-[#9e3d48]"
                          >
                            <option value="placed">Placed (Pending Print)</option>
                            <option value="printing">Printing & Casing (At Bindery)</option>
                            <option value="shipped">Shipped (With Courier)</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTriggerEmail(order.id)}
                          className="h-7 text-[11px] gap-1.5 border-[#ded8cb] bg-white hover:bg-emerald-50 text-emerald-800 hover:border-emerald-300"
                          title="Sends customer notification email for current status"
                        >
                          <Mail className="h-3 w-3 text-emerald-600" />
                          <span>Trigger Status Email</span>
                        </Button>
                      </div>

                      {/* Courier & Tracking URL Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#8c8273] block mb-1">
                            Courier Carrier
                          </label>
                          <select
                            value={edits.carrier}
                            onChange={(e) =>
                              setTrackingEdits({
                                ...trackingEdits,
                                [order.id]: { ...edits, carrier: e.target.value },
                              })
                            }
                            className="w-full rounded-lg border border-[#ded8cb] bg-white px-2.5 py-1.5 text-xs text-[#1c1a17] focus:outline-none"
                          >
                            <option value="BlueDart Express">BlueDart Express</option>
                            <option value="Delhivery Surface">Delhivery Surface</option>
                            <option value="DTDC Air">DTDC Air</option>
                            <option value="Speed Post">Speed Post (India Post)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#8c8273] block mb-1">
                            Waybill / Tracking #
                          </label>
                          <input
                            type="text"
                            value={edits.trackingNumber}
                            onChange={(e) =>
                              setTrackingEdits({
                                ...trackingEdits,
                                [order.id]: { ...edits, trackingNumber: e.target.value },
                              })
                            }
                            placeholder="e.g. BD892019IN"
                            className="w-full rounded-lg border border-[#ded8cb] bg-white px-2.5 py-1.5 text-xs text-[#1c1a17] focus:outline-none font-mono"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            size="sm"
                            onClick={() => handleSaveTracking(order.id)}
                            className="w-full h-8 text-xs gap-1.5 bg-[#9e3d48] text-white hover:bg-[#832d36]"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Save & Dispatch</span>
                          </Button>
                        </div>
                      </div>

                      {/* Email logs */}
                      {order.emailsSent && order.emailsSent.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                          <span>
                            Last notification sent on {new Date(order.emailsSent[order.emailsSent.length - 1].sentAt).toLocaleTimeString()} to {order.userEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
