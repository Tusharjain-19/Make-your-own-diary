/**
 * Storybound Handwriting Template Grid Specifications
 * Defines standard A4 dimensions, fiducial corner markers, and glyph grid cell coordinates
 */

export interface GlyphSpec {
  char: string;
  label: string;
  row: number;
  col: number;
  baselineOffsetPercent: number; // e.g. 72% from top of cell
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

// 76 canonical glyphs: A-Z, a-z, 0-9, and punctuation (. , ! ? ' " - : ; ( ) & @ ₹)
export const GLYPH_CHARS: string[] = [
  // Row 0: A - H
  "A", "B", "C", "D", "E", "F", "G", "H",
  // Row 1: I - P
  "I", "J", "K", "L", "M", "N", "O", "P",
  // Row 2: Q - X
  "Q", "R", "S", "T", "U", "V", "W", "X",
  // Row 3: Y - Z, a - f
  "Y", "Z", "a", "b", "c", "d", "e", "f",
  // Row 4: g - n
  "g", "h", "i", "j", "k", "l", "m", "n",
  // Row 5: o - v
  "o", "p", "q", "r", "s", "t", "u", "v",
  // Row 6: w - z, 0 - 3
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

  // Descenders like g, j, p, q, y have higher baseline guide
  const isDescender = ["g", "j", "p", "q", "y"].includes(char);
  const baselineOffsetPercent = isDescender ? 58 : 72;

  return {
    char,
    label: char,
    row,
    col,
    baselineOffsetPercent,
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
    baselineY: y + (TEMPLATE_CONFIG.cellHeightMm * 0.72),
  };
}
