import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateTemplatePdf() {
  const pdfDoc = await PDFDocument.create();
  // A4: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const mmToPt = 2.83465;
  const widthPt = 210 * mmToPt;
  const heightPt = 297 * mmToPt;

  // Header Title
  page.drawText("STORYBOUND · PERSONAL HANDWRITING TEMPLATE", {
    x: 45,
    y: heightPt - 40,
    size: 14,
    font: fontHelveticaBold,
    color: rgb(0.12, 0.12, 0.12),
  });

  page.drawText(
    "INSTRUCTIONS: Print at 100% scale on A4. Write clearly using a dark black ink pen inside each box. Use the dashed line as your baseline.",
    {
      x: 45,
      y: heightPt - 56,
      size: 7.5,
      font: fontHelvetica,
      color: rgb(0.35, 0.35, 0.35),
    }
  );

  page.drawText(
    "Do NOT fold or write across the corner markers. After writing, take a well-lit flat photo or scan to upload.",
    {
      x: 45,
      y: heightPt - 68,
      size: 7.5,
      font: fontHelvetica,
      color: rgb(0.45, 0.45, 0.45),
    }
  );

  // 4 Corner Alignment Fiducial Markers
  // Marker shape: 12mm black square with 6mm white cutout and 3mm black central box
  const markerPositions = [
    { x: 15 * mmToPt, y: heightPt - 15 * mmToPt }, // Top-Left
    { x: 195 * mmToPt, y: heightPt - 15 * mmToPt }, // Top-Right
    { x: 15 * mmToPt, y: 15 * mmToPt }, // Bottom-Left
    { x: 195 * mmToPt, y: 15 * mmToPt }, // Bottom-Right
  ];

  const markerSize = 10 * mmToPt;

  for (const m of markerPositions) {
    // Outer black box
    page.drawRectangle({
      x: m.x - markerSize / 2,
      y: m.y - markerSize / 2,
      width: markerSize,
      height: markerSize,
      color: rgb(0, 0, 0),
    });
    // White ring
    page.drawRectangle({
      x: m.x - markerSize / 4,
      y: m.y - markerSize / 4,
      width: markerSize / 2,
      height: markerSize / 2,
      color: rgb(1, 1, 1),
    });
    // Inner black center
    page.drawRectangle({
      x: m.x - markerSize / 8,
      y: m.y - markerSize / 8,
      width: markerSize / 4,
      height: markerSize / 4,
      color: rgb(0, 0, 0),
    });
  }

  // Grid Configuration
  const cols = 8;
  const rows = 10;
  const gridX = 18 * mmToPt;
  const gridYTop = heightPt - 80; // top of grid
  const cellW = 21.75 * mmToPt;
  const cellH = 24.5 * mmToPt;

  const GLYPHS = [
    "A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", ".", ",",
    "!", "?", "'", '"', "-", ":", ";", "(",
    ")", "&", "@", "Rs", "-", "/", "%", "*",
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const char = GLYPHS[idx] || "";
      const x = gridX + c * cellW;
      const y = gridYTop - (r + 1) * cellH;

      // Cell border
      page.drawRectangle({
        x,
        y,
        width: cellW,
        height: cellH,
        borderColor: rgb(0.75, 0.75, 0.75),
        borderWidth: 0.75,
      });

      // Label at top left
      if (char) {
        page.drawText(char === "₹" ? "Rs" : char, {
          x: x + 4,
          y: y + cellH - 10,
          size: 7.5,
          font: fontHelveticaBold,
          color: rgb(0.4, 0.4, 0.4),
        });
      }

      // Baseline guide line (at ~30% from bottom of cell = 70% from top)
      const isDescender = ["g", "j", "p", "q", "y"].includes(char);
      const baselineY = isDescender ? y + cellH * 0.45 : y + cellH * 0.28;

      // Draw dashed baseline guide
      page.drawLine({
        start: { x: x + 3, y: baselineY },
        end: { x: x + cellW - 3, y: baselineY },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
        dashArray: [2, 2],
      });

      // Draw dotted mid-line (x-height)
      const xHeightY = baselineY + cellH * 0.32;
      page.drawLine({
        start: { x: x + 3, y: xHeightY },
        end: { x: x + cellW - 3, y: xHeightY },
        thickness: 0.35,
        color: rgb(0.85, 0.85, 0.85),
        dashArray: [1, 2],
      });
    }
  }

  // Footer note
  page.drawText("Storybound Private Press · Proprietary Handwriting Synthesis Spec · 80 Glyphs", {
    x: 45,
    y: 28,
    size: 7,
    font: fontHelvetica,
    color: rgb(0.55, 0.55, 0.55),
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve("public", "glyph-template.pdf");
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Generated template PDF at ${outputPath} (${pdfBytes.length} bytes)`);
}

generateTemplatePdf().catch(console.error);
