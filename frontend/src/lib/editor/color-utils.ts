/**
 * Color math and conversion utilities: HSV <-> RGB <-> HEX
 * Supports color names, HEX search, and HSV coordinate calculations.
 */

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

// Common named colors dictionary for search
export const COLOR_NAMES: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  charcoal: "#1A1A1A",
  ivory: "#FFFFF0",
  cream: "#FAF8F5",
  gold: "#D4AF37",
  amber: "#FFBF00",
  maroon: "#7A1F2B",
  crimson: "#DC143C",
  rose: "#E11D48",
  coral: "#FF6F61",
  terracotta: "#E07A5F",
  emerald: "#2F5D50",
  forest: "#228B22",
  sage: "#8A9A86",
  olive: "#808000",
  navy: "#0A192F",
  royal: "#4169E1",
  cobalt: "#0047AB",
  sky: "#38BDF8",
  teal: "#0D9488",
  indigo: "#4B0082",
  lavender: "#E6E6FA",
  sepia: "#704214",
  sand: "#D8C7A5",
  paper: "#FDFCF9",
  clay: "#B35446",
};

export function hsvToRgb(h: number, s: number, v: number): RGB {
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r1 = 0, g1 = 0, b1 = 0;
  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hsvToHex(h: number, s: number, v: number): string {
  return rgbToHex(hsvToRgb(h, s, v));
}

export function hexToRgb(hexStr: string): RGB | null {
  let hex = hexStr.trim().replace(/^#/, "");
  // Check if it's a named color
  const lower = hex.toLowerCase();
  if (COLOR_NAMES[lower]) {
    hex = COLOR_NAMES[lower].replace(/^#/, "");
  }

  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length !== 6) return null;

  const num = parseInt(hex, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const diff = max - min;

  let h = 0;
  if (diff === 0) {
    h = 0;
  } else if (max === r1) {
    h = (60 * ((g1 - b1) / diff) + 360) % 360;
  } else if (max === g1) {
    h = (60 * ((b1 - r1) / diff) + 120) % 360;
  } else {
    h = (60 * ((r1 - g1) / diff) + 240) % 360;
  }

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

export function hexToHsv(hex: string): HSV {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, v: 100 }; // default white
  return rgbToHsv(rgb);
}
