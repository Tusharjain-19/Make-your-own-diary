"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/editor/store";
import { useAuth } from "@/lib/auth/auth-context";
import { getEntitlement, grant7DayEntitlement, PdfEntitlement } from "@/lib/payments/entitlements";
import { StoryboundLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  ArrowLeft,
  Sparkles,
  Clock,
  QrCode,
  CreditCard,
  Smartphone,
} from "lucide-react";

export default function BookCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-jaipur-101";
  const { user } = useAuth();
  const { book } = useEditorStore();

  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "card" | "qr">("upi");
  const [upiId, setUpiId] = React.useState(user?.email ? `${user.email.split("@")[0]}@okhdfcbank` : "tushar@okhdfcbank");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [entitlement, setEntitlement] = React.useState<PdfEntitlement | null>(null);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  const title = book?.title || "Jaipur: A City of Royal Memories";

  React.useEffect(() => {
    // Check if user already holds active 7-day entitlement
    const existing = getEntitlement(bookId);
    if (existing) {
      setEntitlement(existing);
      setPaymentSuccess(true);
    }
  }, [bookId]);

  const handleSimulatePayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Create order
      const createRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          userId: user?.id || "user-tushar-01",
        }),
      });
      const orderData = await createRes.json();

      // 2. Simulate payment capture & verification
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: "simulated_test_signature",
          bookId,
          userId: user?.id || "user-tushar-01",
          userEmail: user?.email || "tushar@storybound.app",
        }),
      });

      const verifyData = await verifyRes.json();
      const granted = grant7DayEntitlement(bookId, user?.id, verifyData.entitlement?.paymentId);
      setEntitlement(granted);
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1a17] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e8e4db] bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoryboundLogo size="sm" href="/dashboard" />
            <span className="text-xs text-[#8c8273]">/ Secure Checkout</span>
          </div>

          <Link
            href={`/books/${bookId}/preview`}
            className="inline-flex items-center gap-1.5 text-xs text-[#6e6659] hover:text-[#1c1a17] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Preview
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary & Book Spec */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9e3d48] mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Print-Ready Book Export
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1a17]">
                Order Summary
              </h1>
              <p className="mt-1 text-xs text-[#7d7465]">
                Download high-resolution 300 DPI PDF ready for local or professional printing.
              </p>
            </div>

            {/* Book Spec Card */}
            <div className="rounded-xl border border-[#ded8cb] bg-white p-5 shadow-sm space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-20 bg-[#4a181d] rounded border border-[#6b252c] shadow flex flex-col justify-between p-1.5 text-center shrink-0">
                  <div className="h-0.5 w-3 bg-[#d4af37]/60 mx-auto" />
                  <span className="font-serif text-[8px] text-[#f7dfa5] line-clamp-2">
                    {title}
                  </span>
                  <div className="h-0.5 w-3 bg-[#d4af37]/60 mx-auto" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#1c1a17] line-clamp-1">
                    {title}
                  </h3>
                  <div className="text-xs text-[#7d7465] mt-0.5">
                    A5 Hardbound Format · 20 Pages
                  </div>
                  <div className="text-[11px] font-mono text-[#a16207] mt-1">
                    300 DPI CMYK Printable PDF
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0ede6] pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-[#595247]">
                  <span>20-Page Print PDF</span>
                  <span>₹50.00</span>
                </div>
                <div className="flex justify-between text-[#595247]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-600" /> 7-Day Free Re-exports
                  </span>
                  <span className="text-emerald-700 font-medium">Included</span>
                </div>
                <div className="flex justify-between text-[#595247]">
                  <span>Handwriting Font Licensing</span>
                  <span className="text-emerald-700 font-medium">Included</span>
                </div>

                <div className="border-t border-[#ded8cb] pt-2.5 flex justify-between font-serif text-base font-bold text-[#1c1a17]">
                  <span>Total Amount</span>
                  <span>₹50.00</span>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2.5 text-xs text-[#787062] bg-[#f2eee6] p-3 rounded-lg border border-[#e3ded5]">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
              <span>
                Protected by 256-bit encrypted Razorpay checkout. Instant download unlock.
              </span>
            </div>
          </div>

          {/* Right Column: Checkout / Download State */}
          <div className="md:col-span-7">
            {paymentSuccess ? (
              /* ================= POST-PAYMENT UNLOCKED STATE ================= */
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 font-bold">
                    Payment Verified (₹50)
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#1c1a17]">
                    Your Print PDF is Ready!
                  </h2>
                  <p className="text-xs text-[#6e6659] max-w-sm mx-auto">
                    Clean, unwatermarked 300 DPI PDF unlocked. You can re-download this book for free for the next 7 days.
                  </p>
                </div>

                <div className="bg-[#faf8f5] rounded-xl border border-[#ded8cb] p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Order ID:</span>
                    <span className="font-mono">{entitlement?.paymentId || "pay_test_verified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Customer:</span>
                    <span className="font-medium">{user?.name || "Tushar"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c8273]">Free Re-export Until:</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {entitlement?.freeReexportUntil
                        ? new Date(entitlement.freeReexportUntil).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "7 Days"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link href={`/api/books/${bookId}/export`} target="_blank" className="block">
                    <Button size="lg" className="w-full text-sm font-semibold shadow-md gap-2">
                      <Download className="h-4 w-4" /> Download Clean 300 DPI PDF
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center gap-4 text-xs text-[#787062] pt-2">
                    <Link href={`/books/${bookId}/edit`} className="underline hover:text-[#1c1a17]">
                      Return to Book Editor
                    </Link>
                    <span>·</span>
                    <Link href="/dashboard" className="underline hover:text-[#1c1a17]">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= RAZORPAY UPI-FIRST CHECKOUT FORM ================= */
              <div className="rounded-2xl border border-[#ded8cb] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#f0ede6] pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#1c1a17]">
                      Payment Method
                    </h3>
                    <p className="text-xs text-[#8c8273]">UPI First payment for fast India checkout</p>
                  </div>
                  <div className="font-serif text-xl font-bold text-[#1c1a17]">₹50</div>
                </div>

                {/* Tabs: UPI, QR, Card */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#9e3d48] bg-[#fbf5f6] text-[#9e3d48] shadow-sm"
                        : "border-[#e8e4db] hover:bg-[#faf8f5] text-[#6e6659]"
                    }`}
                  >
                    <Smartphone className="h-4 w-4 mb-1" />
                    <span>UPI Apps / ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qr")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === "qr"
                        ? "border-[#9e3d48] bg-[#fbf5f6] text-[#9e3d48] shadow-sm"
                        : "border-[#e8e4db] hover:bg-[#faf8f5] text-[#6e6659]"
                    }`}
                  >
                    <QrCode className="h-4 w-4 mb-1" />
                    <span>Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === "card"
                        ? "border-[#9e3d48] bg-[#fbf5f6] text-[#9e3d48] shadow-sm"
                        : "border-[#e8e4db] hover:bg-[#faf8f5] text-[#6e6659]"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mb-1" />
                    <span>Card / Netbanking</span>
                  </button>
                </div>

                {/* UPI Content */}
                {paymentMethod === "upi" && (
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-medium text-[#4f483d] block mb-1.5">
                        Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3.5 py-2.5 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      {["Google Pay", "PhonePe", "Paytm", "CRED"].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setUpiId(`${user?.name?.toLowerCase().replace(/\s+/g, "") || "tushar"}@${app.toLowerCase().slice(0, 3)}`)}
                          className="px-2.5 py-1 rounded-md border border-[#e5dfd3] bg-[#faf8f5] text-[10px] text-[#665f53] hover:border-[#9e3d48] transition-colors"
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* QR Code Content */}
                {paymentMethod === "qr" && (
                  <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#ded8cb] text-center space-y-3">
                    <div className="mx-auto w-36 h-36 bg-white p-2 rounded-lg border border-[#e5dfd3] shadow-sm flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-[#1c1a17]" />
                    </div>
                    <p className="text-[11px] text-[#787062]">
                      Scan with any UPI app to pay ₹50.00
                    </p>
                  </div>
                )}

                {/* Card Content */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-1 text-xs">
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      className="w-full rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3.5 py-2.5 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3.5 py-2.5 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={4}
                        className="rounded-lg border border-[#ded8cb] bg-[#faf8f5] px-3.5 py-2.5 text-xs text-[#1c1a17] focus:border-[#9e3d48] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <Button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full text-xs font-semibold shadow-md"
                >
                  {isProcessing ? "Processing ₹50 Razorpay Payment..." : "Pay ₹50 & Unlock PDF"}
                </Button>

                <div className="text-center text-[10px] text-[#8c8273]">
                  Test Mode Enabled · Instant entitlement and clean PDF unlocked.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
