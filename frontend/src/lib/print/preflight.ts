import { BookModel, TextEl, ImageEl } from "../editor/types";
import { getPrintProduct } from "./products";

export type PreflightSeverity = "error" | "warning" | "info";
export type PreflightCategory =
  | "low_res_image"
  | "text_outside_safe_area"
  | "empty_page"
  | "missing_glyph_fallback"
  | "bleed_compliance";

export interface PreflightIssue {
  id: string;
  category: PreflightCategory;
  severity: PreflightSeverity;
  pageIndex: number;
  pagePosition: number;
  elementId?: string;
  title: string;
  message: string;
  details?: string;
  suggestion?: string;
  bounds?: { x: number; y: number; w: number; h: number };
}

export interface PreflightReport {
  bookId: string;
  bookTitle: string;
  pageCount: number;
  checkedAt: string;
  passed: boolean; // no errors
  readyForPrint: boolean; // no fatal errors
  errorsCount: number;
  warningsCount: number;
  infoCount: number;
  issues: PreflightIssue[];
}

// Standard glyphs provided in handwriting template
const STANDARD_HANDWRITING_GLYPHS = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?'\"-;:()[]{}@#%&*+=/\\_~`$€₹".split("")
);

/**
 * Runs pre-flight checks across all pages of a book:
 * 1. Low-res images (< 200 DPI)
 * 2. Text outside safe margin area
 * 3. Empty content pages
 * 4. Missing glyph fallbacks for custom handwriting fonts
 */
export function runPreflightCheck(book: BookModel): PreflightReport {
  const issues: PreflightIssue[] = [];
  const product = getPrintProduct(book.size === "A4" ? "classic" : book.size === "Square" ? "mini" : "travel_diary");
  const safeMarginMm = product.safeMarginMm;
  const pageWidthMm = product.widthMm;
  const pageHeightMm = product.heightMm;

  book.pages.forEach((page, pageIndex) => {
    const pagePosition = page.position || pageIndex + 1;
    const elements = page.elements || [];

    // Check 1: Empty Page Check
    const visibleElements = elements.filter((el) => {
      if (el.type === "text") {
        return (el as TextEl).text && (el as TextEl).text.trim().length > 0;
      }
      return true;
    });

    if (visibleElements.length === 0) {
      // Cover page (page 1) or inside pages
      issues.push({
        id: `empty-page-${pagePosition}`,
        category: "empty_page",
        severity: pagePosition === 1 ? "error" : "warning",
        pageIndex,
        pagePosition,
        title: pagePosition === 1 ? "Empty Book Cover" : `Empty Page ${pagePosition}`,
        message:
          pagePosition === 1
            ? "Your front cover has no title or elements."
            : `Page ${pagePosition} has no text or photos. A blank sheet will be printed.`,
        suggestion: "Add a photo, journal text, or delete this page from the page strip.",
      });
      return;
    }

    elements.forEach((el) => {
      // Check 2: Low-Resolution Images (< 300 DPI target, < 200 DPI warning)
      if (el.type === "image") {
        const img = el as ImageEl;
        // Compute effective DPI if dimensions are known
        if (img.originalWidth && img.originalHeight && img.w > 0 && img.h > 0) {
          const widthInches = img.w / 25.4;
          const effectiveDpi = Math.round(img.originalWidth / widthInches);

          if (effectiveDpi < 150) {
            issues.push({
              id: `low-res-err-${el.id}`,
              category: "low_res_image",
              severity: "error",
              pageIndex,
              pagePosition,
              elementId: el.id,
              title: `Low Resolution Photo (${effectiveDpi} DPI)`,
              message: `Image on Page ${pagePosition} is printed at only ${effectiveDpi} DPI. It may appear visibly pixelated or blurry in print.`,
              details: `Dimensions: ${img.originalWidth}x${img.originalHeight}px printed across ${Math.round(img.w)}x${Math.round(img.h)}mm. Target is 300 DPI.`,
              suggestion: "Scale down the photo box on the canvas or replace with a higher resolution original.",
              bounds: { x: el.x, y: el.y, w: el.w, h: el.h },
            });
          } else if (effectiveDpi < 240) {
            issues.push({
              id: `low-res-warn-${el.id}`,
              category: "low_res_image",
              severity: "warning",
              pageIndex,
              pagePosition,
              elementId: el.id,
              title: `Moderate Resolution Photo (${effectiveDpi} DPI)`,
              message: `Image on Page ${pagePosition} is ${effectiveDpi} DPI (recommended: 300 DPI for high-end art books).`,
              details: `Acceptable for personal journals, but sharp edges may be slightly softened.`,
              suggestion: "Keep or resize down slightly for maximum clarity.",
              bounds: { x: el.x, y: el.y, w: el.w, h: el.h },
            });
          }
        }
      }

      // Check 3: Text Outside Safe Area
      if (el.type === "text") {
        const textEl = el as TextEl;
        const textContent = textEl.text || "";

        const rightEdge = el.x + el.w;
        const bottomEdge = el.y + el.h;

        const outsideLeft = el.x < safeMarginMm;
        const outsideTop = el.y < safeMarginMm;
        const outsideRight = rightEdge > pageWidthMm - safeMarginMm;
        const outsideBottom = bottomEdge > pageHeightMm - safeMarginMm;

        if (outsideLeft || outsideTop || outsideRight || outsideBottom) {
          const edgeLabels: string[] = [];
          if (outsideLeft) edgeLabels.push("left");
          if (outsideRight) edgeLabels.push("right");
          if (outsideTop) edgeLabels.push("top");
          if (outsideBottom) edgeLabels.push("bottom");

          const snippet = textContent.slice(0, 28) + (textContent.length > 28 ? "…" : "");

          issues.push({
            id: `safe-margin-${el.id}`,
            category: "text_outside_safe_area",
            severity: "warning",
            pageIndex,
            pagePosition,
            elementId: el.id,
            title: `Text Outside Safe Margin (${edgeLabels.join(", ")})`,
            message: `"${snippet}" extends within the ${safeMarginMm}mm safe area buffer.`,
            details: `Trim cut blades can shift by ±1.5mm during industrial binding. Text outside safe margins risks being sliced.`,
            suggestion: `Nudge the text box at least ${safeMarginMm}mm away from the page border.`,
            bounds: { x: el.x, y: el.y, w: el.w, h: el.h },
          });
        }

        // Check 4: Missing Glyph Fallbacks in Handwriting Font
        const isCustomHandwriting =
          textEl.font &&
          (textEl.font.toLowerCase().includes("handwriting") ||
            textEl.font.toLowerCase().includes("custom") ||
            textEl.font.toLowerCase().includes("tushar") ||
            textEl.font.toLowerCase().includes("script"));

        if (isCustomHandwriting && textContent) {
          const missingGlyphs: string[] = [];
          for (const char of textContent) {
            if (!STANDARD_HANDWRITING_GLYPHS.has(char) && char.charCodeAt(0) > 31 && !missingGlyphs.includes(char)) {
              missingGlyphs.push(char);
            }
          }

          if (missingGlyphs.length > 0) {
            issues.push({
              id: `glyph-fallback-${el.id}`,
              category: "missing_glyph_fallback",
              severity: "info",
              pageIndex,
              pagePosition,
              elementId: el.id,
              title: "Handwriting Glyph Fallback",
              message: `Special character(s) [${missingGlyphs.join(" ")}] are not in your custom handwriting font.`,
              details: `These specific symbols will fall back to a matching classic serif typeface in the printed export.`,
              suggestion: "Standard letters & numbers will use your true handwriting.",
              bounds: { x: el.x, y: el.y, w: el.w, h: el.h },
            });
          }
        }
      }
    });
  });

  const errorsCount = issues.filter((i) => i.severity === "error").length;
  const warningsCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  return {
    bookId: book.id,
    bookTitle: book.title || "Untitled Book",
    pageCount: book.pages.length,
    checkedAt: new Date().toISOString(),
    passed: errorsCount === 0 && warningsCount === 0,
    readyForPrint: errorsCount === 0,
    errorsCount,
    warningsCount,
    infoCount,
    issues,
  };
}
