/**
 * In-memory & localStorage store for book PDF entitlements
 * Grants 7-day free re-export upon ₹50 payment.
 */

export interface PdfEntitlement {
  bookId: string;
  userId: string;
  paidAt: string;
  freeReexportUntil: string;
  paymentId: string;
  amountPaise: number;
}

const STORAGE_KEY = "storybound_pdf_entitlements";

export function getEntitlement(bookId: string): PdfEntitlement | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const entitlements: Record<string, PdfEntitlement> = JSON.parse(raw);
    const ent = entitlements[bookId];
    if (!ent) return null;

    // Check if within 7-day window
    const expires = new Date(ent.freeReexportUntil).getTime();
    if (Date.now() > expires) {
      return null; // expired
    }
    return ent;
  } catch {
    return null;
  }
}

export function saveEntitlement(entitlement: PdfEntitlement) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entitlements: Record<string, PdfEntitlement> = raw ? JSON.parse(raw) : {};
    entitlements[entitlement.bookId] = entitlement;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entitlements));
  } catch (err) {
    console.error("Error saving entitlement:", err);
  }
}

export function grant7DayEntitlement(bookId: string, userId = "user-tushar-01", paymentId = "pay_test_123"): PdfEntitlement {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const entitlement: PdfEntitlement = {
    bookId,
    userId,
    paidAt: now.toISOString(),
    freeReexportUntil: sevenDaysLater.toISOString(),
    paymentId,
    amountPaise: 5000,
  };

  saveEntitlement(entitlement);
  return entitlement;
}
