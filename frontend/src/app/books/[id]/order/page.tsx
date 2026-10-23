"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  Sparkles,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryboundLogo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth/auth-context";
import { useEditorStore } from "@/lib/editor/store";
import {
  PRINT_PRODUCTS,
  PrintProduct,
  calculateOrderPrice,
  calculateSpineWidthMm,
} from "@/lib/print/products";
import {
  ShippingAddress,
  PrintOrder,
  isValidIndianPinCode,
  isValidIndianMobile,
  lookupPinCode,
} from "@/lib/orders/types";
import { createOrderRecord } from "@/lib/orders/store";

export default function BookOrderFlowPage() {
  const params = useParams();
  const bookId = (params?.id as string) || "book-jaipur-101";
  const { user } = useAuth();
  const { book } = useEditorStore();

  const title = book?.title || "Jaipur: A City of Royal Memories";
  const pageCount = book?.pages.length || 20;

  // Flow State
  const [selectedProductId, setSelectedProductId] = React.useState<"mini" | "travel_diary" | "classic">(
    book?.size === "A4" ? "classic" : book?.size === "Square" ? "mini" : "travel_diary"
  );
  const [copies, setCopies] = React.useState(1);

  // Address State
  const [address, setAddress] = React.useState<ShippingAddress>({
    fullName: user?.name || "Tushar Jain",
    phone: "9829012345",
    streetAddress: "14, Govind Marg, Adarsh Nagar",
    landmark: "Near Pink City Heritage Gate",
    city: "Jaipur",
    state: "Rajasthan",
    pinCode: "302004",
    country: "India",
  });

  const [pinValidationMsg, setPinValidationMsg] = React.useState<string | null>(() => {
    const match = lookupPinCode("302004");
    return match ? `✓ Deliverable to ${match.city}, ${match.state}` : null;
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState<PrintOrder | null>(null);

  const selectedProduct: PrintProduct = PRINT_PRODUCTS[selectedProductId];
  const spineWidth = calculateSpineWidthMm(pageCount, selectedProduct);
  const pricing = calculateOrderPrice(selectedProductId, copies, pageCount);

  // Handle PIN input with instant auto-lookup
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAddress((prev) => ({ ...prev, pinCode: rawVal }));

    if (rawVal.length === 6) {
      if (isValidIndianPinCode(rawVal)) {
        const match = lookupPinCode(rawVal);
        if (match) {
          setAddress((prev) => ({
            ...prev,
            city: match.city,
            state: match.state,
          }));
          setPinValidationMsg(`✓ Deliverable to ${match.city}, ${match.state}`);
        } else {
          setPinValidationMsg("✓ Valid 6-digit Indian PIN code");
        }
      } else {
        setPinValidationMsg("Invalid PIN code format");
      }
    } else {
      setPinValidationMsg(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName.trim()) {
      alert("Please enter recipient name");
      return;
    }
    if (!isValidIndianMobile(address.phone)) {
      alert("Please enter a valid 10-digit Indian phone number");
      return;
    }
    if (!isValidIndianPinCode(address.pinCode)) {
      alert("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    if (!address.streetAddress.trim()) {
      alert("Please enter street address");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create simulated Razorpay payment ID
      const paymentId = `pay_rzp_${Date.now()}`;

      // 1. Post to Server Orders API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "user-tushar-01",
          userEmail: user?.email || "tushar@storybound.app",
          bookId,
          bookTitle: title,
          productId: selectedProductId,
          copies,
          pageCount,
          shippingAddress: address,
          paymentId,
        }),
      });

      const data = await res.json();

      // 2. Also persist in client localStorage store for immediate UI reactivity
      const localRecord = createOrderRecord({
        userId: user?.id || "user-tushar-01",
        userEmail: user?.email || "tushar@storybound.app",
        bookId,
        bookTitle: title,
        productId: selectedProductId,
        copies,
        pageCount,
        shippingAddress: address,
        paymentId,
        totalPaise: pricing.totalPaise,
      });

      setPlacedOrder(data.order || localRecord);
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1a17] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e8e4db] bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-[#8c8273]">/ Hardcover Print Order</span>
          </div>

          <Link
            href={`/books/${bookId}/preview`}
            className="inline-flex items-center gap-1.5 text-xs text-[#6e6659] hover:text-[#1c1a17] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Preview
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {placedOrder ? (
          /* ================= SUCCESS CONFIRMATION STATE ================= */
          <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-sm text-center space-y-6 animate-in fade-in-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 font-bold">
                Order Confirmed · Manual Fulfilment
              </span>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1c1a17]">
                Your Hardcover is Scheduled for Print!
              </h1>
              <p className="text-sm text-[#787062] max-w-md mx-auto">
                Thank you! We have verified your 300 DPI press files with 3mm bleed. Your book is entering the bindery.
              </p>
            </div>

            {/* Order Card Summary */}
            <div className="rounded-xl border border-[#ded8cb] bg-[#faf8f5] p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#e8e4db] pb-2.5">
                <span className="text-[#8c8273]">Order Reference:</span>
                <span className="font-mono font-bold text-[#1c1a17]">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Book:</span>
                <span className="font-medium text-[#1c1a17]">{placedOrder.bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Product & Copies:</span>
                <span>
                  {placedOrder.productName} × {placedOrder.copies} {placedOrder.copies > 1 ? "copies" : "copy"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Computed Spine Width:</span>
                <span className="font-mono text-amber-700 font-semibold">{placedOrder.spineWidthMm} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Delivery To:</span>
                <span>
                  {placedOrder.shippingAddress.fullName}, {placedOrder.shippingAddress.city} ({placedOrder.shippingAddress.pinCode})
                </span>
              </div>
              <div className="flex justify-between border-t border-[#e8e4db] pt-2 font-serif text-sm font-bold text-[#1c1a17]">
                <span>Total Amount Paid:</span>
                <span>₹{(placedOrder.totalPaise / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/orders" className="flex-1">
                <Button size="lg" className="w-full text-xs font-semibold gap-2 shadow-sm">
                  <Package className="h-4 w-4" /> View Order Status Timeline
                </Button>
              </Link>

              <Link href="/admin/orders" className="flex-1">
                <Button variant="outline" size="lg" className="w-full text-xs gap-2 border-[#ded8cb]">
                  <Layers className="h-4 w-4" /> Admin Fulfilment View
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= 3-STEP ORDER PLACEMENT FORM ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Product Choice, Copies & Address Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9e3d48] mb-1">
                  <Sparkles className="h-3.5 w-3.5" /> Handcrafted Memory Keepsakes
                </div>
                <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1c1a17]">
                  Order Hardcover Print Edition
                </h1>
                <p className="mt-1 text-sm text-[#787062]">
                  Manufactured with 2mm Dutch greyboard, sewn Smyth binding, and archival paper.
                </p>
              </div>

              {/* Step 1: Product Selection Cards */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wider uppercase text-[#595247] block">
                  1. Choose Product Spec
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.values(PRINT_PRODUCTS).map((prod) => {
                    const isSelected = selectedProductId === prod.id;
                    const calculatedSpine = calculateSpineWidthMm(pageCount, prod);

                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedProductId(prod.id as any)}
                        className={`relative rounded-xl border p-4 text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[#9e3d48] bg-[#fbf5f6] ring-2 ring-[#9e3d48]/20 shadow-sm"
                            : "border-[#ded8cb] bg-white hover:border-[#b8afa0]"
                        }`}
                      >
                        {prod.popular && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-[#9e3d48] px-2 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider shadow-xs">
                            Most Loved
                          </span>
                        )}

                        <div>
                          <div className="font-serif text-base font-bold text-[#1c1a17]">
                            {prod.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#8c8273] mt-0.5">
                            {prod.widthMm} × {prod.heightMm} mm ({prod.size})
                          </div>
                          <p className="text-xs text-[#6e6659] mt-2 line-clamp-2 leading-relaxed">
                            {prod.tagline}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#f0ede6] space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-[#8c8273]">Starting at:</span>
                            <span className="font-serif text-base font-bold text-[#1c1a17]">
                              ₹{(prod.basePricePaise / 100).toFixed(0)}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-emerald-700">
                            Spine: {calculatedSpine}mm
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Copies Selector */}
              <div className="rounded-xl border border-[#ded8cb] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold tracking-wider uppercase text-[#595247] block">
                      2. Number of Copies
                    </label>
                    <p className="text-xs text-[#8c8273] mt-0.5">
                      Print copies for travel companions, family, or personal bedside library.
                    </p>
                  </div>

                  {copies >= 3 && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 border border-emerald-200">
                      {pricing.discountPercentage}% Bulk Discount Applied
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center rounded-lg border border-[#ded8cb] bg-[#faf8f5] p-1">
                    <button
                      type="button"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      disabled={copies <= 1}
                      className="h-8 w-8 rounded text-sm font-semibold hover:bg-white disabled:opacity-30 text-[#1c1a17]"
                    >
                      –
                    </button>
                    <span className="font-mono text-sm font-bold text-[#1c1a17] w-10 text-center">
                      {copies}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCopies(Math.min(20, copies + 1))}
                      disabled={copies >= 20}
                      className="h-8 w-8 rounded text-sm font-semibold hover:bg-white text-[#1c1a17]"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    {[1, 2, 3, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCopies(num)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          copies === num
                            ? "border-[#9e3d48] bg-[#9e3d48] text-white"
                            : "border-[#ded8cb] bg-[#faf8f5] text-[#595247] hover:border-[#1c1a17]"
                        }`}
                      >
                        {num} {num === 1 ? "Copy" : "Copies"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Indian Address Form with PIN Validation */}
              <div className="rounded-xl border border-[#ded8cb] bg-white p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#595247] block">
                    3. Delivery Address (India Nationwide)
                  </label>
                  <p className="text-xs text-[#8c8273] mt-0.5">
                    Shipped securely via BlueDart / Delhivery Surface with live SMS tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Tushar Jain"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      Mobile Number (for Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="10-digit number (e.g. 9829012345)"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      Street Address / House / Flat No. *
                    </label>
                    <input
                      type="text"
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      placeholder="House No., Building, Street Name, Colony"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark || ""}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="Near landmark or gate"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      Postal PIN Code * (6 Digits)
                    </label>
                    <input
                      type="text"
                      aria-label="Postal PIN Code"
                      value={address.pinCode}
                      onChange={handlePinChange}
                      maxLength={6}
                      placeholder="e.g. 302004 or 110001"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none font-mono"
                    />
                    {pinValidationMsg && (
                      <span className="text-[10px] text-emerald-700 mt-1 block font-medium">
                        {pinValidationMsg}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#4f483d] block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Sticky Order Summary & Checkout Trigger */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              <div className="rounded-2xl border border-[#ded8cb] bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-[#f0ede6] pb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#1c1a17]">
                    Order Summary
                  </h3>
                  <div className="text-xs text-[#8c8273] mt-0.5">
                    {title} · {pageCount} Pages
                  </div>
                </div>

                {/* Book & Spine Spec Badge */}
                <div className="bg-[#faf8f5] rounded-xl border border-[#ded8cb] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Product:</span>
                    <span className="font-medium text-[#1c1a17]">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Format:</span>
                    <span className="font-mono text-[#1c1a17]">{selectedProduct.size} ({selectedProduct.widthMm}×{selectedProduct.heightMm}mm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Computed Spine:</span>
                    <span className="font-mono text-amber-700 font-semibold">{spineWidth} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Paper:</span>
                    <span>{selectedProduct.paperName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Cover Board:</span>
                    <span>2mm Dutch Greyboard Hardcover</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-b border-[#f0ede6] pb-4">
                  <div className="flex justify-between text-[#595247]">
                    <span>
                      Unit Price ({selectedProduct.name})
                    </span>
                    <span>₹{(pricing.unitPricePaise / 100).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#595247]">
                    <span>Quantity</span>
                    <span className="font-semibold">× {copies}</span>
                  </div>

                  {pricing.discountPaise > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Bulk Savings ({pricing.discountPercentage}%)</span>
                      <span>– ₹{(pricing.discountPaise / 100).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#595247]">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3 text-emerald-600" /> Courier Delivery (India)
                    </span>
                    <span className="text-emerald-700 font-medium">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline font-serif text-xl font-bold text-[#1c1a17]">
                  <span>Total Amount</span>
                  <span>₹{(pricing.totalPaise / 100).toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full text-xs font-semibold shadow-md gap-2"
                >
                  {isSubmitting ? (
                    "Placing Print Order & Verifying Razorpay..."
                  ) : (
                    <>
                      <span>Pay ₹{(pricing.totalPaise / 100).toFixed(0)} & Place Order</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-[11px] text-[#8c8273] justify-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Razorpay Secure · 100% Satisfaction Guarantee</span>
                </div>
              </div>

              {/* Press & Fulfilment Note */}
              <div className="rounded-xl border border-[#ded8cb] bg-[#fbf5f6]/50 p-4 space-y-1.5 text-xs text-[#6e6659]">
                <div className="font-semibold text-[#9e3d48] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Handcrafted Turnaround Time
                </div>
                <p className="text-[11px] leading-relaxed">
                  Printed in 2 business days on HP Indigo digital press. Hand-bound and dispatched with BlueDart tracking.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
