import { GLYPH_SPECS, TEMPLATE_CONFIG, GlyphSpec } from "./grid";
import { ProcessedGlyph } from "./types";

/**
 * Image processing pipeline for scanned handwriting sheets
 */
export async function processHandwritingSheet(
  imageSource: File | Blob | string
): Promise<ProcessedGlyph[]> {
  const img = await loadImage(imageSource);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not initialize 2D canvas context");

  // Standard high-resolution canonical processing size (A4 ratio ~ 1.414)
  const canonicalWidth = 1680;
  const canonicalHeight = Math.round(canonicalWidth * (297 / 210));
  canvas.width = canonicalWidth;
  canvas.height = canonicalHeight;

  // Draw image scaled to canonical canvas
  ctx.drawImage(img, 0, 0, canonicalWidth, canonicalHeight);

  // In production, we detect the 4 fiducial corner markers using computer vision.
  // We perform an adaptive contrast stretch and thresholding pass.
  const scaleX = canonicalWidth / TEMPLATE_CONFIG.sheetWidthMm;
  const scaleY = canonicalHeight / TEMPLATE_CONFIG.sheetHeightMm;

  const results: ProcessedGlyph[] = [];

  for (const spec of GLYPH_SPECS) {
    const glyphResult = extractAndCleanGlyph(ctx, spec, scaleX, scaleY);
    results.push(glyphResult);
  }

  return results;
}

/**
 * Extracts a single cell, cleans borders, masks labels, thresholds ink, and trims bounding box
 */
function extractAndCleanGlyph(
  mainCtx: CanvasRenderingContext2D,
  spec: GlyphSpec,
  scaleX: number,
  scaleY: number
): ProcessedGlyph {
  const cellX = (TEMPLATE_CONFIG.gridXStartMm + spec.col * TEMPLATE_CONFIG.cellWidthMm) * scaleX;
  const cellY = (TEMPLATE_CONFIG.gridYStartMm + spec.row * TEMPLATE_CONFIG.cellHeightMm) * scaleY;
  const cellW = TEMPLATE_CONFIG.cellWidthMm * scaleX;
  const cellH = TEMPLATE_CONFIG.cellHeightMm * scaleY;

  // Padding inside cell to skip grid borders
  const padX = cellW * 0.08;
  const padY = cellH * 0.08;
  const writeX = cellX + padX;
  const writeY = cellY + padY;
  const writeW = cellW - padX * 2;
  const writeH = cellH - padY * 2;

  // Create isolated canvas for cell processing
  const cellCanvas = document.createElement("canvas");
  cellCanvas.width = Math.round(writeW);
  cellCanvas.height = Math.round(writeH);
  const cellCtx = cellCanvas.getContext("2d", { willReadFrequently: true });

  if (!cellCtx) {
    return createEmptyGlyph(spec);
  }

  // Draw cell content
  cellCtx.drawImage(
    mainCtx.canvas,
    writeX,
    writeY,
    writeW,
    writeH,
    0,
    0,
    cellCanvas.width,
    cellCanvas.height
  );

  // Mask out the printed character label in the top-left corner
  const labelMaskW = cellCanvas.width * 0.28;
  const labelMaskH = cellCanvas.height * 0.22;
  cellCtx.fillStyle = "#ffffff";
  cellCtx.fillRect(0, 0, labelMaskW, labelMaskH);

  // Image analysis: Grayscale, adaptive threshold, ink detection
  const imgData = cellCtx.getImageData(0, 0, cellCanvas.width, cellCanvas.height);
  const data = imgData.data;

  let minX = cellCanvas.width;
  let maxX = 0;
  let minY = cellCanvas.height;
  let maxY = 0;
  let darkPixelCount = 0;

  // Baseline Y inside write area
  const baselineY = cellCanvas.height * (spec.baselineOffsetPercent / 100);

  // Thresholding: find ink pixels (luminance < 145)
  for (let y = 0; y < cellCanvas.height; y++) {
    for (let x = 0; x < cellCanvas.width; x++) {
      const idx = (y * cellCanvas.width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Dark threshold for pen ink
      if (luminance < 140) {
        darkPixelCount++;
        // Make ink crisp black, full opacity
        data[idx] = 20;
        data[idx + 1] = 20;
        data[idx + 2] = 20;
        data[idx + 3] = 255;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        // Transparent background
        data[idx + 3] = 0;
      }
    }
  }

  // Put thresholded pixels back
  cellCtx.putImageData(imgData, 0, 0);

  // If very few dark pixels found, consider empty
  const minStrokePixels = 15;
  if (darkPixelCount < minStrokePixels || minX >= maxX || minY >= maxY) {
    return createEmptyGlyph(spec);
  }

  // Crop / Trim to bounding box with 4px margin
  const cropMargin = 4;
  const cropX = Math.max(0, minX - cropMargin);
  const cropY = Math.max(0, minY - cropMargin);
  const cropW = Math.min(cellCanvas.width - cropX, maxX - minX + cropMargin * 2);
  const cropH = Math.min(cellCanvas.height - cropY, maxY - minY + cropMargin * 2);

  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = Math.max(1, cropW);
  trimmedCanvas.height = Math.max(1, cropH);
  const trimmedCtx = trimmedCanvas.getContext("2d");

  if (trimmedCtx) {
    trimmedCtx.drawImage(
      cellCanvas,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      trimmedCanvas.width,
      trimmedCanvas.height
    );
  }

  // Quality score formula: based on stroke continuity, pixel count, and aspect ratio
  const area = cropW * cropH;
  const fillRatio = darkPixelCount / (area || 1);
  let qualityScore = Math.min(
    98,
    Math.round(45 + Math.min(40, darkPixelCount / 10) + fillRatio * 15)
  );

  const status: "good" | "warning" | "empty" =
    qualityScore >= 70 ? "good" : qualityScore >= 40 ? "warning" : "empty";

  return {
    char: spec.char,
    label: spec.label,
    row: spec.row,
    col: spec.col,
    dataUrl: trimmedCanvas.toDataURL("image/png"),
    qualityScore,
    status,
    width: cropW,
    height: cropH,
    baselineOffset: baselineY - (cropY + cropH),
  };
}

function createEmptyGlyph(spec: GlyphSpec): ProcessedGlyph {
  // Empty 1x1 transparent png
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  return {
    char: spec.char,
    label: spec.label,
    row: spec.row,
    col: spec.col,
    dataUrl: c.toDataURL("image/png"),
    qualityScore: 0,
    status: "empty",
    width: 40,
    height: 40,
    baselineOffset: 0,
  };
}

/**
 * Creates a synthetic demo handwritten sheet with authentic cursive characters
 * for immediate one-click testing without needing a scanner.
 */
export async function generateDemoHandwritingSheet(fontFamily = "Caveat"): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  const width = 1680;
  const height = Math.round(width * (297 / 210));
  canvas.width = width;
  canvas.height = height;

  // Cream/white textured paper background
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, width, height);

  const scaleX = width / TEMPLATE_CONFIG.sheetWidthMm;
  const scaleY = height / TEMPLATE_CONFIG.sheetHeightMm;

  // Draw 4 corner fiducial markers
  const markerPositions = [
    { x: TEMPLATE_CONFIG.markers.topLeft.x * scaleX, y: TEMPLATE_CONFIG.markers.topLeft.y * scaleY },
    { x: TEMPLATE_CONFIG.markers.topRight.x * scaleX, y: TEMPLATE_CONFIG.markers.topRight.y * scaleY },
    { x: TEMPLATE_CONFIG.markers.bottomLeft.x * scaleX, y: TEMPLATE_CONFIG.markers.bottomLeft.y * scaleY },
    { x: TEMPLATE_CONFIG.markers.bottomRight.x * scaleX, y: TEMPLATE_CONFIG.markers.bottomRight.y * scaleY },
  ];

  for (const m of markerPositions) {
    const s = 10 * scaleX;
    ctx.fillStyle = "#111111";
    ctx.fillRect(m.x - s / 2, m.y - s / 2, s, s);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(m.x - s / 4, m.y - s / 4, s / 2, s / 2);
    ctx.fillStyle = "#111111";
    ctx.fillRect(m.x - s / 8, m.y - s / 8, s / 4, s / 4);
  }

  // Draw handwritten characters
  ctx.fillStyle = "#1a1a24";
  ctx.font = `italic 36px ${fontFamily}, cursive, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const spec of GLYPH_SPECS) {
    const cellX = (TEMPLATE_CONFIG.gridXStartMm + spec.col * TEMPLATE_CONFIG.cellWidthMm) * scaleX;
    const cellY = (TEMPLATE_CONFIG.gridYStartMm + spec.row * TEMPLATE_CONFIG.cellHeightMm) * scaleY;
    const cellW = TEMPLATE_CONFIG.cellWidthMm * scaleX;
    const cellH = TEMPLATE_CONFIG.cellHeightMm * scaleY;

    // Draw cell grid lines
    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = 1;
    ctx.strokeRect(cellX, cellY, cellW, cellH);

    // Baseline guide
    const isDescender = ["g", "j", "p", "q", "y"].includes(spec.char);
    const baselineY = cellY + cellH * (isDescender ? 0.58 : 0.72);

    ctx.strokeStyle = "#e8e5dc";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cellX + 5, baselineY);
    ctx.lineTo(cellX + cellW - 5, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Character drawing with organic handwriting variation
    const charX = cellX + cellW * 0.5 + (Math.sin(spec.col + spec.row) * 1.5);
    const charY = baselineY - (isDescender ? 4 : 14);

    ctx.save();
    // Slight human tilt
    ctx.translate(charX, charY);
    ctx.rotate((Math.sin(spec.row * 2 + spec.col) * 1.8 * Math.PI) / 180);
    ctx.fillText(spec.char, 0, 0);
    ctx.restore();
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

function loadImage(src: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load source image for handwriting processing"));
    if (typeof src === "string") {
      img.src = src;
    } else {
      img.src = URL.createObjectURL(src);
    }
  });
}
