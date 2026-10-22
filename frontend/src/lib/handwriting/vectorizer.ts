import opentype from "opentype.js";
import { ProcessedGlyph } from "./types";

/**
 * Traces a thresholded bitmap data URL into an opentype.js Path
 */
export async function vectorizeGlyph(
  glyph: ProcessedGlyph,
  unitsPerEm = 1000
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

  // Compute scale to fit unitsPerEm (1000)
  // Standard cap height ~ 700 units, baseline at y = 0
  const maxDim = Math.max(canvas.width, canvas.height);
  const scale = (unitsPerEm * 0.7) / (maxDim || 1);

  // In OpenType coordinate system:
  // y = 0 is the baseline, positive y goes UP, negative y goes DOWN (descenders).
  // In canvas coordinate system:
  // y = 0 is top, positive y goes DOWN.
  const baselineInCanvas = canvas.height - Math.max(0, glyph.baselineOffset);

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
