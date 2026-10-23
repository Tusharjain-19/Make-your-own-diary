import { GlyphCategory } from "./types";

/**
 * Storybound Handwriting Template Grid Specifications
 * Defines standard A4 dimensions, fiducial corner markers, and glyph grid cell coordinates
 * Fully structured for both Capital Letters (A-Z) and Small Letters (a-z) with typographic metrics
 */

export interface GlyphSpec {
  char: string;
  label: string;
  row: number;
  col: number;
  baselineOffsetPercent: number; // e.g. 72% from top of cell
  category: GlyphCategory;
  pairedChar?: string;
  isAscender: boolean;
  isDescender: boolean;
  isSmallXHeight: boolean;
}

export interface GridDimensions {
  sheetWidthMm: number;
  sheetHeightMm: number;
  cols: number;
  rows: number;
  gridXStartMm: number;
  gridYStartMm: number;
  cellWidthMm: number;
  cellHeightMm: number;
  cornerMarkerSizeMm: number;
  markers: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export const TEMPLATE_CONFIG: GridDimensions = {
  sheetWidthMm: 210, // A4 width
  sheetHeightMm: 297, // A4 height
  cols: 8,
  rows: 10,
  gridXStartMm: 18,
  gridYStartMm: 46,
  cellWidthMm: 21.75,
  cellHeightMm: 23,
  cornerMarkerSizeMm: 12,
  markers: {
    topLeft: { x: 15, y: 15 },
    topRight: { x: 195, y: 15 },
    bottomLeft: { x: 15, y: 282 },
    bottomRight: { x: 195, y: 282 },
  },
};

// Character Case & Category Helpers
export function isCapitalLetter(char: string): boolean {
  return char.length === 1 && char >= "A" && char <= "Z";
}

export function isSmallLetter(char: string): boolean {
  return char.length === 1 && char >= "a" && char <= "z";
}

export function isNumber(char: string): boolean {
  return char.length === 1 && char >= "0" && char <= "9";
}

export function isAscender(char: string): boolean {
  return ["b", "d", "f", "h", "k", "l", "t"].includes(char);
}

export function isDescender(char: string): boolean {
  return ["g", "j", "p", "q", "y"].includes(char);
}

export function isSmallXHeight(char: string): boolean {
  return isSmallLetter(char) && !isAscender(char) && !isDescender(char);
}

export function getPairedChar(char: string): string | undefined {
  if (isCapitalLetter(char)) return char.toLowerCase();
  if (isSmallLetter(char)) return char.toUpperCase();
  return undefined;
}

export function getGlyphCategory(char: string): GlyphCategory {
  if (isCapitalLetter(char)) return "capital";
  if (isSmallLetter(char)) return "small";
  if (isNumber(char)) return "number";
  return "symbol";
}

// 76 canonical glyphs: A-Z (26), a-z (26), 0-9 (10), and punctuation (14)
export const GLYPH_CHARS: string[] = [
  // Row 0: A - H (Capitals)
  "A", "B", "C", "D", "E", "F", "G", "H",
  // Row 1: I - P (Capitals)
  "I", "J", "K", "L", "M", "N", "O", "P",
  // Row 2: Q - X (Capitals)
  "Q", "R", "S", "T", "U", "V", "W", "X",
  // Row 3: Y - Z (Capitals), a - f (Small letters)
  "Y", "Z", "a", "b", "c", "d", "e", "f",
  // Row 4: g - n (Small letters)
  "g", "h", "i", "j", "k", "l", "m", "n",
  // Row 5: o - v (Small letters)
  "o", "p", "q", "r", "s", "t", "u", "v",
  // Row 6: w - z (Small letters), 0 - 3 (Numbers)
  "w", "x", "y", "z", "0", "1", "2", "3",
  // Row 7: 4 - 9, . ,
  "4", "5", "6", "7", "8", "9", ".", ",",
  // Row 8: ! ? ' " - : ; (
  "!", "?", "'", '"', "-", ":", ";", "(",
  // Row 9: ) & @ ₹ + reserved slots
  ")", "&", "@", "₹", "—", "/", "%", "♥",
];

export const GLYPH_SPECS: GlyphSpec[] = GLYPH_CHARS.map((char, index) => {
  const row = Math.floor(index / TEMPLATE_CONFIG.cols);
  const col = index % TEMPLATE_CONFIG.cols;

  const desc = isDescender(char);
  const asc = isAscender(char);
  const smallX = isSmallXHeight(char);
  const category = getGlyphCategory(char);
  const paired = getPairedChar(char);

  // Descenders like g, j, p, q, y have higher baseline guide (58% from top)
  // Regular baseline is 72% from top of cell
  const baselineOffsetPercent = desc ? 58 : 72;

  return {
    char,
    label: char,
    row,
    col,
    baselineOffsetPercent,
    category,
    pairedChar: paired,
    isAscender: asc,
    isDescender: desc,
    isSmallXHeight: smallX,
  };
});

/**
 * Returns exact cell bounds in millimeters
 */
export function getCellBoundsMm(row: number, col: number) {
  const x = TEMPLATE_CONFIG.gridXStartMm + col * TEMPLATE_CONFIG.cellWidthMm;
  const y = TEMPLATE_CONFIG.gridYStartMm + row * TEMPLATE_CONFIG.cellHeightMm;
  return {
    x,
    y,
    width: TEMPLATE_CONFIG.cellWidthMm,
    height: TEMPLATE_CONFIG.cellHeightMm,
    baselineY: y + TEMPLATE_CONFIG.cellHeightMm * 0.72,
  };
}
