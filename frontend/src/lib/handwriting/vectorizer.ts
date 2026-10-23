import * as opentype from "opentype.js";
import { ProcessedGlyph } from "./types";

/**
 * Traces a thresholded bitmap data URL into an opentype.js Path
 */
export async function vectorizeGlyph(
  glyph: ProcessedGlyph,
  unitsPerEm = 1000,
  scaleMultiplier = 1.0
): Promise<opentype.Path> {
  const path = new opentype.Path();

  if (glyph.status === "empty" || !glyph.dataUrl) {
    return path;
  }

  // Load glyph bitmap to trace contours
  const img = await loadBitmap(glyph.dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return path;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Typographic scale targets for OpenType 1000 UPM:
  // - Capitals (A-Z) & Numbers: ~700 units (Cap-Height)
  // - Small Ascenders (b, d, f, h, k, l, t): ~680 units
  // - Small Descenders (g, j, p, q, y): ~680 units (with descender dipping below baseline)
  // - Small X-Height (a, c, e, m, n, o, r, s, u, v, w, x, z): ~480 units (x-height)
  // - Small punctuation (., -): ~220 units
  let targetHeight = unitsPerEm * 0.70;
  if (glyph.isSmallXHeight) {
    targetHeight = unitsPerEm * 0.48;
  } else if (glyph.isAscender) {
    targetHeight = unitsPerEm * 0.68;
  } else if (glyph.isDescender) {
    targetHeight = unitsPerEm * 0.68;
  } else if (glyph.category === "symbol" && [".", ",", "-", "'", '"'].includes(glyph.char)) {
    targetHeight = unitsPerEm * 0.22;
  }

  const scale = (targetHeight / (canvas.height || 1)) * scaleMultiplier;

  // Baseline positioning:
  // Descenders dip below baseline into negative Y; other letters sit on baseline
  let baselineInCanvas = canvas.height;
  if (glyph.isDescender) {
    baselineInCanvas = canvas.height * 0.68;
  } else if (glyph.char === "-" || glyph.char === "—") {
    baselineInCanvas = canvas.height * 0.5;
  }

  // Marching squares / horizontal span decomposition
  // We decompose horizontal runs of black pixels into vector polygons
  const step = Math.max(1, Math.floor(canvas.height / 40));

  for (let y = 0; y < canvas.height; y += step) {
    let runStart = -1;
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      const alpha = data[idx + 3];
      const isBlack = alpha > 128;

      if (isBlack && runStart === -1) {
        runStart = x;
      } else if (!isBlack && runStart !== -1) {
        addRunRect(path, runStart, y, x - runStart, step, scale, baselineInCanvas);
        runStart = -1;
      }
    }
    if (runStart !== -1) {
      addRunRect(path, runStart, y, canvas.width - runStart, step, scale, baselineInCanvas);
    }
  }

  return path;
}

function addRunRect(
  path: opentype.Path,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number,
  baselineY: number
) {
  // Translate to font coords:
  // X: 50 (left side bearing) + x * scale
  // Y: (baselineY - y) * scale (invert Y so up is positive)
  const lsb = 70;
  const fx1 = lsb + x * scale;
  const fx2 = fx1 + Math.max(scale, w * scale);
  const fy1 = (baselineY - y) * scale;
  const fy2 = fy1 - Math.max(scale, h * scale);

  path.moveTo(fx1, fy1);
  path.lineTo(fx2, fy1);
  path.lineTo(fx2, fy2);
  path.lineTo(fx1, fy2);
  path.close();
}

function loadBitmap(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
