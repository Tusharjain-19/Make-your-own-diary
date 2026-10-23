import { PageSize } from "../editor/types";

export interface PrintProduct {
  id: "mini" | "travel_diary" | "classic";
  name: string;
  tagline: string;
  description: string;
  size: PageSize;
  widthMm: number;
  heightMm: number;
  paperWeightGsm: number;
  paperName: string;
  coverType: "hardcover";
  finish: string;
  bulkFactor: number;
  paperCaliperMm: number;
  hingeGapMm: number;
  wrapBleedMm: number;
  interiorBleedMm: number;
  safeMarginMm: number;
  minPages: number;
  maxPages: number;
  basePricePaise: number;
  extraPagePricePaise: number; // per additional 2 pages beyond minPages
  features: string[];
  popular?: boolean;
}

export const PRINT_PRODUCTS: Record<string, PrintProduct> = {
  mini: {
    id: "mini",
    name: "Mini Keepsake",
    tagline: "Pocket-sized memories & daily vignettes",
    description: "Compact 148 x 148 mm square hardcover. Printed on velvety 130gsm Munken Pure cream paper with scratch-resistant matte board binding.",
    size: "Square",
    widthMm: 148,
    heightMm: 148,
    paperWeightGsm: 130,
    paperName: "Munken Pure Cream 130gsm",
    coverType: "hardcover",
    finish: "Soft-touch matte lamination",
    bulkFactor: 1.25,
    paperCaliperMm: 0.12,
    hingeGapMm: 7.0,
    wrapBleedMm: 20.0,
    interiorBleedMm: 3.0,
    safeMarginMm: 6.0,
    minPages: 10,
    maxPages: 60,
    basePricePaise: 69900, // ₹699
    extraPagePricePaise: 1500, // ₹15 per 2 pages
    features: [
      "148 × 148 mm Square Hardcover",
      "130gsm Munken Pure Natural Paper",
      "2mm Dutch Greyboard Casebound",
      "Compact gift & bedside keepsake",
      "Free India delivery included",
    ],
  },
  travel_diary: {
    id: "travel_diary",
    name: "Travel Diary",
    tagline: "Our signature heirloom travel chronicle",
    description: "Classic A5 (148 x 210 mm) hardcover with emerald woven silk bookmark ribbon and heavyweight 170gsm archival satin art paper.",
    size: "A5",
    widthMm: 148,
    heightMm: 210,
    paperWeightGsm: 170,
    paperName: "Archival Satin Art Paper 170gsm",
    coverType: "hardcover",
    finish: "Scuff-proof velvet matte + Silk ribbon",
    bulkFactor: 1.3,
    paperCaliperMm: 0.15,
    hingeGapMm: 8.0,
    wrapBleedMm: 20.0,
    interiorBleedMm: 3.0,
    safeMarginMm: 7.0,
    minPages: 10,
    maxPages: 80,
    basePricePaise: 99900, // ₹999
    extraPagePricePaise: 2000, // ₹20 per 2 pages
    popular: true,
    features: [
      "A5 (148 × 210 mm) Hardcover Format",
      "170gsm Archival Satin Art Paper",
      "Emerald Woven Silk Bookmark Ribbon",
      "Smyth sewn lay-flat durable binding",
      "Handwriting font fidelity guaranteed",
    ],
  },
  classic: {
    id: "classic",
    name: "Classic Heritage Album",
    tagline: "Grand coffee table edition with foil spine",
    description: "Generous A4 (210 x 297 mm) grand casebound book. Features gold foil stamped spine lettering and ultra-premium 200gsm textured layflat paper.",
    size: "A4",
    widthMm: 210,
    heightMm: 297,
    paperWeightGsm: 200,
    paperName: "Textured Layflat Fine Art 200gsm",
    coverType: "hardcover",
    finish: "Linen-grain matte + Gold foil spine",
    bulkFactor: 1.35,
    paperCaliperMm: 0.18,
    hingeGapMm: 9.0,
    wrapBleedMm: 22.0,
    interiorBleedMm: 3.0,
    safeMarginMm: 8.0,
    minPages: 10,
    maxPages: 100,
    basePricePaise: 149900, // ₹1,499
    extraPagePricePaise: 2500, // ₹25 per 2 pages
    features: [
      "A4 (210 × 297 mm) Grand Coffee Table Edition",
      "200gsm Textured Layflat Fine Art Paper",
      "Debossed Gold Foil Spine Title",
      "Full photographic spread reproduction",
      "Protective gift presentation sleeve",
    ],
  },
};

export function getPrintProduct(productId?: string): PrintProduct {
  if (productId && PRINT_PRODUCTS[productId]) {
    return PRINT_PRODUCTS[productId];
  }
  return PRINT_PRODUCTS.travel_diary;
}

export function getAllPrintProducts(): PrintProduct[] {
  return Object.values(PRINT_PRODUCTS);
}

/**
 * Computes exact spine width in mm from page count and printer spec.
 * Total sheets = Math.ceil(pageCount / 2).
 * Spine thickness = sheets * paperCaliperMm * bulkFactor + binding glue allowance (0.8mm).
 * Hardcover minimum spine is 4.0mm to support 2mm board casing.
 */
export function calculateSpineWidthMm(pageCount: number, product: PrintProduct): number {
  const leaves = Math.ceil(Math.max(product.minPages, pageCount) / 2);
  const paperStackThickness = leaves * product.paperCaliperMm * product.bulkFactor;
  const bindingGlueAllowance = 0.8;
  const calculatedSpine = paperStackThickness + bindingGlueAllowance;
  return Math.max(4.0, Math.round(calculatedSpine * 100) / 100);
}

export interface CoverSpreadGeometry {
  totalSpreadWidthMm: number;
  totalSpreadHeightMm: number;
  boardWidthMm: number;
  boardHeightMm: number;
  spineWidthMm: number;
  wrapBleedMm: number;
  hingeGapMm: number;
  backCover: { x: number; y: number; w: number; h: number };
  spine: { x: number; y: number; w: number; h: number };
  frontCover: { x: number; y: number; w: number; h: number };
}

/**
 * Calculates full hardcover cover spread sheet layout with 20mm wrap turn-in bleed,
 * board overhang (3mm each edge), hinge crease gaps, and centered spine.
 */
export function calculateCoverSpreadDimensionsMm(
  pageCount: number,
  product: PrintProduct
): CoverSpreadGeometry {
  const spineWidthMm = calculateSpineWidthMm(pageCount, product);
  const boardOverhangMm = 3.0; // Hardcover board extends 3mm past interior page trim
  const boardWidthMm = product.widthMm + boardOverhangMm;
  const boardHeightMm = product.heightMm + 2 * boardOverhangMm;
  const wrapBleedMm = product.wrapBleedMm;
  const hingeGapMm = product.hingeGapMm;

  // Horizontal layout from left to right:
  // WrapBleed | BackCoverBoard | HingeGap | Spine | HingeGap | FrontCoverBoard | WrapBleed
  const totalSpreadWidthMm =
    2 * wrapBleedMm + 2 * boardWidthMm + 2 * hingeGapMm + spineWidthMm;
  const totalSpreadHeightMm = 2 * wrapBleedMm + boardHeightMm;

  const backCoverX = wrapBleedMm;
  const backCoverY = wrapBleedMm;

  const spineX = backCoverX + boardWidthMm + hingeGapMm;
  const spineY = wrapBleedMm;

  const frontCoverX = spineX + spineWidthMm + hingeGapMm;
  const frontCoverY = wrapBleedMm;

  return {
    totalSpreadWidthMm: Math.round(totalSpreadWidthMm * 100) / 100,
    totalSpreadHeightMm: Math.round(totalSpreadHeightMm * 100) / 100,
    boardWidthMm,
    boardHeightMm,
    spineWidthMm,
    wrapBleedMm,
    hingeGapMm,
    backCover: { x: backCoverX, y: backCoverY, w: boardWidthMm, h: boardHeightMm },
    spine: { x: spineX, y: spineY, w: spineWidthMm, h: boardHeightMm },
    frontCover: { x: frontCoverX, y: frontCoverY, w: boardWidthMm, h: boardHeightMm },
  };
}

/**
 * Computes order pricing with multi-copy discounts and optional extra pages
 */
export function calculateOrderPrice(
  productId: string,
  copies = 1,
  pageCount = 20
): {
  baseUnitPaise: number;
  extraPagesCostPaise: number;
  unitPricePaise: number;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  totalPaise: number;
  discountPercentage: number;
} {
  const product = getPrintProduct(productId);
  const safeCopies = Math.max(1, Math.min(20, copies));
  const safePages = Math.max(product.minPages, pageCount);

  const extraPages = Math.max(0, safePages - 20); // standard included 20 pages
  const extraPagesCostPaise = Math.ceil(extraPages / 2) * product.extraPagePricePaise;
  const unitPricePaise = product.basePricePaise + extraPagesCostPaise;
  const subtotalPaise = unitPricePaise * safeCopies;

  // Bulk discount: 10% off for 3+ copies, 15% off for 5+ copies
  let discountPercentage = 0;
  if (safeCopies >= 5) {
    discountPercentage = 15;
  } else if (safeCopies >= 3) {
    discountPercentage = 10;
  }

  const discountPaise = Math.round((subtotalPaise * discountPercentage) / 100);
  const shippingPaise = 0; // Free nationwide shipping
  const totalPaise = subtotalPaise - discountPaise + shippingPaise;

  return {
    baseUnitPaise: product.basePricePaise,
    extraPagesCostPaise,
    unitPricePaise,
    subtotalPaise,
    discountPaise,
    shippingPaise,
    totalPaise,
    discountPercentage,
  };
}
