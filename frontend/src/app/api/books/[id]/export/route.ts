import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import {
  getPrintProduct,
  calculateSpineWidthMm,
  calculateCoverSpreadDimensionsMm,
} from "@/lib/print/products";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  const { searchParams } = new URL(request.url);

  const exportType = searchParams.get("type") || "pdf"; // 'pdf' | 'print' | 'cover'
  const isWatermarked = searchParams.get("watermark") === "true";
  const cropMarks = searchParams.get("cropMarks") !== "false";
  const bleedMm = parseFloat(searchParams.get("bleed") || "3");
  const productId = searchParams.get("product") || "travel_diary";
  const rawPageCount = parseInt(searchParams.get("pages") || "20", 10);
  const pageCount = isNaN(rawPageCount) ? 20 : Math.max(10, Math.min(100, rawPageCount));

  const product = getPrintProduct(productId);
  const mmToPt = 2.83465;

  try {
    const pdfDoc = await PDFDocument.create();
    const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // =========================================================================
    // 1. HARDCOVER SPREAD PDF EXPORT (with computed spine width & 20mm wrap bleed)
    // =========================================================================
    if (exportType === "cover") {
      const geometry = calculateCoverSpreadDimensionsMm(pageCount, product);
      const spreadWidthPt = geometry.totalSpreadWidthMm * mmToPt;
      const spreadHeightPt = geometry.totalSpreadHeightMm * mmToPt;

      const page = pdfDoc.addPage([spreadWidthPt, spreadHeightPt]);

      // Fill entire sheet (including 20mm wrap bleed) with rich cloth cover color
      page.drawRectangle({
        x: 0,
        y: 0,
        width: spreadWidthPt,
        height: spreadHeightPt,
        color: rgb(0.24, 0.08, 0.1), // Rich Burgundy / Jaipur Claret
      });

      // Board outlines & wrap bleed boundary line
      const wrapBleedPt = geometry.wrapBleedMm * mmToPt;
      const boardWPt = geometry.boardWidthMm * mmToPt;
      const boardHPt = geometry.boardHeightMm * mmToPt;
      const spineWPt = geometry.spineWidthMm * mmToPt;
      const hingePt = geometry.hingeGapMm * mmToPt;

      const backCoverXPt = geometry.backCover.x * mmToPt;
      const spineXPt = geometry.spine.x * mmToPt;
      const frontCoverXPt = geometry.frontCover.x * mmToPt;
      const boardYPt = geometry.backCover.y * mmToPt;

      // Draw faint fold/crease guides for binder
      const guideColor = rgb(0.83, 0.69, 0.22); // Warm Gold

      // Back Cover Decorative Box
      page.drawRectangle({
        x: backCoverXPt + 20 * mmToPt,
        y: boardYPt + 20 * mmToPt,
        width: boardWPt - 40 * mmToPt,
        height: boardHPt - 40 * mmToPt,
        borderWidth: 1,
        borderColor: guideColor,
        color: rgb(0.2, 0.06, 0.08),
      });

      page.drawText("STORYBOUND PRIVATE PRESS", {
        x: backCoverXPt + (boardWPt / 2) - 60,
        y: boardYPt + 35 * mmToPt,
        size: 8,
        font: fontHelvetica,
        color: guideColor,
      });

      // Spine Area
      page.drawRectangle({
        x: spineXPt,
        y: boardYPt,
        width: spineWPt,
        height: boardHPt,
        color: rgb(0.18, 0.05, 0.07),
        borderWidth: 0.5,
        borderColor: guideColor,
      });

      // Vertical spine title text
      const spineTitle = "JAIPUR : A CITY OF ROYAL MEMORIES";
      if (geometry.spineWidthMm >= 4.0) {
        page.drawText(spineTitle, {
          x: spineXPt + (spineWPt / 2) + 2.5,
          y: boardYPt + (boardHPt / 2) - 90,
          size: Math.min(9, Math.max(6, geometry.spineWidthMm * 1.5)),
          font: fontTimesBold,
          color: guideColor,
          rotate: degrees(90),
        });
      }

      // Front Cover Area
      page.drawRectangle({
        x: frontCoverXPt + 20 * mmToPt,
        y: boardYPt + 20 * mmToPt,
        width: boardWPt - 40 * mmToPt,
        height: boardHPt - 40 * mmToPt,
        borderWidth: 1.5,
        borderColor: guideColor,
        color: rgb(0.2, 0.06, 0.08),
      });

      page.drawText("JAIPUR", {
        x: frontCoverXPt + (boardWPt / 2) - 45,
        y: boardYPt + boardHPt - 65 * mmToPt,
        size: 24,
        font: fontTimesBold,
        color: guideColor,
      });

      page.drawText("A City of Royal Memories & Courtyard Echoes", {
        x: frontCoverXPt + (boardWPt / 2) - 90,
        y: boardYPt + boardHPt - 76 * mmToPt,
        size: 9,
        font: fontTimes,
        color: rgb(0.95, 0.9, 0.8),
      });

      page.drawText("TUSHAR JAIN", {
        x: frontCoverXPt + (boardWPt / 2) - 32,
        y: boardYPt + 35 * mmToPt,
        size: 9,
        font: fontHelveticaBold,
        color: guideColor,
      });

      // Crop & Fold ticks on outer wrap boundary
      if (cropMarks) {
        drawCropMarks(page, wrapBleedPt, boardYPt, boardWPt * 2 + spineWPt + hingePt * 2, boardHPt, 10);
      }

      // Press Slug Line
      page.drawText(
        `STORYBOUND PRESS SPEC · Hardcover Case Spread | Pages: ${pageCount} | Calculated Spine: ${geometry.spineWidthMm}mm | Wrap Bleed: 20mm | Spec: ${product.name}`,
        {
          x: 20,
          y: 12,
          size: 7,
          font: fontHelvetica,
          color: rgb(0.7, 0.7, 0.7),
        }
      );

      const pdfBytes = await pdfDoc.save();
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${bookId}_cover_spread_spine_${geometry.spineWidthMm}mm.pdf"`,
        },
      });
    }

    // =========================================================================
    // 2. PRINT-READY INTERIOR PDF EXPORT (with 3mm bleed & optional crop marks)
    // =========================================================================
    const isPrintMode = exportType === "print";
    const actualBleedMm = isPrintMode ? bleedMm : 0;
    const cropMarginMm = isPrintMode && cropMarks ? 8.0 : 0; // extra sheet space to hold crop marks outside bleed

    // Base trim size in mm
    const trimWidthMm = product.widthMm;
    const trimHeightMm = product.heightMm;

    // Total PDF page dimensions
    const sheetWidthMm = trimWidthMm + 2 * (actualBleedMm + cropMarginMm);
    const sheetHeightMm = trimHeightMm + 2 * (actualBleedMm + cropMarginMm);

    const sheetWPt = sheetWidthMm * mmToPt;
    const sheetHPt = sheetHeightMm * mmToPt;

    const trimOriginXPt = (actualBleedMm + cropMarginMm) * mmToPt;
    const trimOriginYPt = (actualBleedMm + cropMarginMm) * mmToPt;
    const trimWPt = trimWidthMm * mmToPt;
    const trimHPt = trimHeightMm * mmToPt;

    const bleedOriginXPt = cropMarginMm * mmToPt;
    const bleedOriginYPt = cropMarginMm * mmToPt;
    const bleedWPt = (trimWidthMm + 2 * actualBleedMm) * mmToPt;
    const bleedHPt = (trimHeightMm + 2 * actualBleedMm) * mmToPt;

    for (let i = 1; i <= pageCount; i++) {
      const page = pdfDoc.addPage([sheetWPt, sheetHPt]);

      // Fill paper texture to bleed edge
      page.drawRectangle({
        x: bleedOriginXPt,
        y: bleedOriginYPt,
        width: bleedWPt,
        height: bleedHPt,
        color: rgb(0.985, 0.975, 0.955), // Fine stationery cream
      });

      // Optional Crop Marks outside the bleed line
      if (isPrintMode && cropMarks) {
        drawCropMarks(page, trimOriginXPt, trimOriginYPt, trimWPt, trimHPt, 12);
      }

      // Safe Area Header Rule (Inside Trim Box)
      const contentLeft = trimOriginXPt + 15 * mmToPt;
      const contentRight = trimOriginXPt + trimWPt - 15 * mmToPt;
      const headerY = trimOriginYPt + trimHPt - 14 * mmToPt;
      const footerY = trimOriginYPt + 12 * mmToPt;

      page.drawLine({
        start: { x: contentLeft, y: headerY },
        end: { x: contentRight, y: headerY },
        thickness: 0.5,
        color: rgb(0.85, 0.82, 0.77),
      });

      page.drawText(i === 1 ? "STORYBOUND KEEPSAKE" : `JAIPUR CHRONICLES · PLATE ${i}`, {
        x: contentLeft,
        y: headerY + 4,
        size: 7,
        font: fontHelvetica,
        color: rgb(0.52, 0.46, 0.4),
      });

      // Page Title & Body Text
      page.drawText(
        i === 1
          ? "Jaipur: A City of Royal Memories"
          : `Chapter ${Math.ceil(i / 2)}: Courtyards & Echoes`,
        {
          x: contentLeft,
          y: headerY - 24,
          size: i === 1 ? 16 : 13,
          font: fontTimesBold,
          color: rgb(0.18, 0.15, 0.13),
        }
      );

      const paragraph =
        i === 1
          ? "A collected personal journal of terracotta battlements, morning chai in silver cups, and the warm breeze carrying temple sitar chords through the walled city."
          : `Before the Johari Bazaar awakened, dawn cast an ember radiance over the terracotta arches. Marigold garlands were strung across stone balconies while the sweet perfume of cardamom tea drifted into the alleyways. Every stone whispers a hundred years of memories.`;

      page.drawText(paragraph, {
        x: contentLeft,
        y: headerY - 50,
        size: 9.5,
        font: fontTimes,
        color: rgb(0.28, 0.25, 0.22),
        lineHeight: 15,
        maxWidth: contentRight - contentLeft,
      });

      // Decorative Image Mock Placeholder Frame
      const imgBoxY = trimOriginYPt + 45 * mmToPt;
      const imgBoxH = 65 * mmToPt;
      page.drawRectangle({
        x: contentLeft,
        y: imgBoxY,
        width: contentRight - contentLeft,
        height: imgBoxH,
        color: rgb(0.95, 0.93, 0.9),
        borderWidth: 0.5,
        borderColor: rgb(0.86, 0.83, 0.78),
      });

      page.drawText("Archival Photograph · 300 DPI Native", {
        x: contentLeft + 10,
        y: imgBoxY + imgBoxH / 2 - 3,
        size: 8,
        font: fontHelvetica,
        color: rgb(0.6, 0.55, 0.5),
      });

      // Watermark for draft previews
      if (isWatermarked) {
        page.drawText("STORYBOUND DRAFT PREVIEW", {
          x: trimOriginXPt + 30,
          y: trimOriginYPt + trimHPt / 2,
          size: 26,
          font: fontTimesBold,
          color: rgb(0.8, 0.2, 0.2),
          rotate: degrees(45),
          opacity: 0.12,
        });
      }

      // Footer Rule & Page Number
      page.drawLine({
        start: { x: contentLeft, y: footerY + 8 },
        end: { x: contentRight, y: footerY + 8 },
        thickness: 0.5,
        color: rgb(0.85, 0.82, 0.77),
      });

      page.drawText(`Storybound Press · ${product.paperName}`, {
        x: contentLeft,
        y: footerY,
        size: 7,
        font: fontHelvetica,
        color: rgb(0.55, 0.5, 0.45),
      });

      page.drawText(`${i} / ${pageCount}`, {
        x: contentRight - 25,
        y: footerY,
        size: 7.5,
        font: fontHelveticaBold,
        color: rgb(0.55, 0.5, 0.45),
      });

      // Slug info in bleed area
      if (isPrintMode && cropMarks) {
        page.drawText(
          `Page ${i} | Trim: ${trimWidthMm}x${trimHeightMm}mm (+${actualBleedMm}mm bleed) | ${product.name}`,
          {
            x: trimOriginXPt,
            y: sheetHPt - 14,
            size: 6,
            font: fontHelvetica,
            color: rgb(0.4, 0.4, 0.4),
          }
        );
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${bookId}_${isPrintMode ? "print_3mm_bleed" : "interior"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Export failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Draws standard offset corner crop marks on four corners of the trim box.
 */
function drawCropMarks(
  page: any,
  originX: number,
  originY: number,
  width: number,
  height: number,
  tickLength = 12
) {
  const markColor = rgb(0.1, 0.1, 0.1);
  const thickness = 0.5;
  const offset = 4; // distance from trim line to start of mark

  // Bottom-Left
  page.drawLine({
    start: { x: originX - offset - tickLength, y: originY },
    end: { x: originX - offset, y: originY },
    thickness,
    color: markColor,
  });
  page.drawLine({
    start: { x: originX, y: originY - offset - tickLength },
    end: { x: originX, y: originY - offset },
    thickness,
    color: markColor,
  });

  // Bottom-Right
  page.drawLine({
    start: { x: originX + width + offset, y: originY },
    end: { x: originX + width + offset + tickLength, y: originY },
    thickness,
    color: markColor,
  });
  page.drawLine({
    start: { x: originX + width, y: originY - offset - tickLength },
    end: { x: originX + width, y: originY - offset },
    thickness,
    color: markColor,
  });

  // Top-Left
  page.drawLine({
    start: { x: originX - offset - tickLength, y: originY + height },
    end: { x: originX - offset, y: originY + height },
    thickness,
    color: markColor,
  });
  page.drawLine({
    start: { x: originX, y: originY + height + offset },
    end: { x: originX, y: originY + height + offset + tickLength },
    thickness,
    color: markColor,
  });

  // Top-Right
  page.drawLine({
    start: { x: originX + width + offset, y: originY + height },
    end: { x: originX + width + offset + tickLength, y: originY + height },
    thickness,
    color: markColor,
  });
  page.drawLine({
    start: { x: originX + width, y: originY + height + offset },
    end: { x: originX + width, y: originY + height + offset + tickLength },
    thickness,
    color: markColor,
  });
}
