import { PageSize } from "./types";

// Base canvas scaling: 1 mm = 4 pixels (A5 148x210 mm = 592x840 px)
export const MM_TO_PX = 4;

export function mmToPx(mm: number, zoom = 1): number {
  return Math.round(mm * MM_TO_PX * zoom * 100) / 100;
}

export function pxToMm(px: number, zoom = 1): number {
  return Math.round((px / (MM_TO_PX * zoom)) * 100) / 100;
}

export interface PageDimensionInfo {
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  safeMarginMm: number;
}

export function getPageDimensionsMm(size: PageSize): PageDimensionInfo {
  switch (size) {
    case "A4":
      return {
        widthMm: 210,
        heightMm: 297,
        bleedMm: 3,
        safeMarginMm: 12,
      };
    case "Square":
      return {
        widthMm: 203,
        heightMm: 203,
        bleedMm: 3,
        safeMarginMm: 10,
      };
    case "A5":
    default:
      return {
        widthMm: 148,
        heightMm: 210,
        bleedMm: 3,
        safeMarginMm: 10,
      };
  }
}

export function resolveCanvasColor(color?: string, fallback = "#FAFAF8"): string {
  if (!color || typeof color !== "string" || color.trim() === "" || color.startsWith("var(")) {
    return fallback;
  }
  return color;
}

