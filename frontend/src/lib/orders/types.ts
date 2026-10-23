export type OrderStatus = "placed" | "printing" | "shipped" | "delivered" | "cancelled";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface PrintOrder {
  id: string; // e.g. 'SB-ORD-2026-8092'
  userId: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  productId: "mini" | "travel_diary" | "classic";
  productName: string;
  copies: number;
  pageCount: number;
  spineWidthMm: number;
  unitPricePaise: number;
  totalPaise: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  printFilePath?: string;
  coverSpreadFilePath?: string;
  paymentId: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
  emailsSent?: {
    template: string;
    sentAt: string;
    recipient: string;
  }[];
}

// Indian Postal PIN Code prefix lookup table for auto-fill
export const PIN_CODE_DIRECTORY: Record<string, { city: string; state: string }> = {
  "302": { city: "Jaipur", state: "Rajasthan" },
  "301": { city: "Alwar", state: "Rajasthan" },
  "303": { city: "Jaipur Rural", state: "Rajasthan" },
  "342": { city: "Jodhpur", state: "Rajasthan" },
  "313": { city: "Udaipur", state: "Rajasthan" },
  "110": { city: "New Delhi", state: "Delhi" },
  "122": { city: "Gurugram", state: "Haryana" },
  "201": { city: "Noida", state: "Uttar Pradesh" },
  "400": { city: "Mumbai", state: "Maharashtra" },
  "411": { city: "Pune", state: "Maharashtra" },
  "560": { city: "Bengaluru", state: "Karnataka" },
  "500": { city: "Hyderabad", state: "Telangana" },
  "600": { city: "Chennai", state: "Tamil Nadu" },
  "700": { city: "Kolkata", state: "West Bengal" },
  "380": { city: "Ahmedabad", state: "Gujarat" },
  "682": { city: "Kochi", state: "Kerala" },
  "462": { city: "Bhopal", state: "Madhya Pradesh" },
  "160": { city: "Chandigarh", state: "Chandigarh" },
};

export function lookupPinCode(pin: string): { city: string; state: string } | null {
  const clean = pin.trim().replace(/\D/g, "");
  if (clean.length < 3) return null;
  const prefix = clean.slice(0, 3);
  return PIN_CODE_DIRECTORY[prefix] || null;
}

export function isValidIndianPinCode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}

export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim().replace(/\D/g, ""));
}
