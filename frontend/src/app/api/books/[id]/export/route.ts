import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  const { searchParams } = new URL(request.url);
  const isWatermarked = searchParams.get("watermark") === "true";

  try {
    // Generate multi-page print-ready HTML
    const html = generatePrintableHtml(bookId, isWatermarked);

    // Attempt to call PDF service if running on localhost:8080
    const pdfServiceUrl = process.env.PDF_SERVICE_URL || "http://localhost:8080";
    try {
      const response = await fetch(`${pdfServiceUrl}/render-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          pageSize: "A5",
          printBackground: true,
          watermarked: isWatermarked,
        }),
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${bookId}${isWatermarked ? "_draft" : "_print"}.pdf"`,
          },
        });
      }
    } catch {
      // PDF worker is offline or not running; fallback to vector PDF generation via pdf-lib
    }

    // Direct standalone vector PDF fallback using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // A5 Dimensions in points: 148mm x 210mm = 419.53 x 595.28 pt
    const mmToPt = 2.83465;
    const pageW = 148 * mmToPt;
    const pageH = 210 * mmToPt;

    // Generate 20 pages
    for (let i = 1; i <= 20; i++) {
      const page = pdfDoc.addPage([pageW, pageH]);

      // Paper background
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageW,
        height: pageH,
        color: rgb(0.98, 0.97, 0.95),
      });

      // Header rule
      page.drawLine({
        start: { x: 30, y: pageH - 40 },
        end: { x: pageW - 30, y: pageH - 40 },
        thickness: 0.5,
        color: rgb(0.85, 0.82, 0.78),
      });

      page.drawText(i === 1 ? "COVER PAGE" : `CHAPTER ${Math.ceil(i / 2)}`, {
        x: 35,
        y: pageH - 35,
        size: 7,
        font: fontHelvetica,
        color: rgb(0.5, 0.45, 0.4),
      });

      // Sample story content
      page.drawText(`Storybound Personal Chronicle — Page ${i}`, {
        x: 35,
        y: pageH - 80,
        size: 14,
        font: fontTimesBold,
        color: rgb(0.15, 0.14, 0.13),
      });

      page.drawText(
        "Stepping into old Jaipur feels like walking inside a watercolor painting.\nEvery alley smells of cardamom tea, marigolds, and ancient palace stone.\nThe memory remains etched in heart and book forever.",
        {
          x: 35,
          y: pageH - 120,
          size: 10,
          font: fontTimes,
          color: rgb(0.25, 0.23, 0.22),
          lineHeight: 15,
        }
      );

      // Watermark if requested
      if (isWatermarked) {
        page.drawText("STORYBOUND DRAFT PREVIEW", {
          x: 60,
          y: pageH / 2,
          size: 24,
          font: fontTimesBold,
          color: rgb(0.8, 0.2, 0.2),
          rotate: degrees(45),
          opacity: 0.15,
        });
      }

      // Footer
      page.drawLine({
        start: { x: 30, y: 40 },
        end: { x: pageW - 30, y: 40 },
        thickness: 0.5,
        color: rgb(0.85, 0.82, 0.78),
      });

      page.drawText(`Page ${i} of 20`, {
        x: pageW - 80,
        y: 28,
        size: 8,
        font: fontHelvetica,
        color: rgb(0.5, 0.45, 0.4),
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${bookId}${isWatermarked ? "_draft" : "_print"}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  }
}

function generatePrintableHtml(bookId: string, watermarked: boolean) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Storybound Book Export</title>
        <style>
          @page {
            size: 148mm 210mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: 'Times New Roman', serif;
            -webkit-print-color-adjust: exact;
          }
          .page {
            width: 148mm;
            height: 210mm;
            page-break-after: always;
            position: relative;
            box-sizing: border-box;
            padding: 15mm;
            background: #faf8f5;
          }
          .header {
            border-bottom: 1px solid #ded8cb;
            padding-bottom: 2mm;
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #7d7568;
            display: flex;
            justify-content: space-between;
          }
          .footer {
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            border-top: 1px solid #ded8cb;
            padding-top: 2mm;
            font-size: 8pt;
            display: flex;
            justify-content: space-between;
            color: #7d7568;
          }
          .content {
            margin-top: 10mm;
          }
          h1 {
            font-size: 18pt;
            font-weight: normal;
            color: #1a1a1a;
            margin-bottom: 4mm;
          }
          p {
            font-size: 11pt;
            line-height: 1.6;
            color: #333333;
          }
          ${
            watermarked
              ? `
            .watermark {
              position: absolute;
              top: 45%;
              left: 15%;
              transform: rotate(-35deg);
              font-size: 32pt;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.08);
              pointer-events: none;
            }
          `
              : ""
          }
        </style>
      </head>
      <body>
        ${Array.from({ length: 20 })
          .map(
            (_, i) => `
          <div class="page">
            ${watermarked ? `<div class="watermark">STORYBOUND DRAFT</div>` : ""}
            <div class="header">
              <span>Jaipur: A City of Royal Memories</span>
              <span>Plate ${i + 1}</span>
            </div>
            <div class="content">
              <h1>Chapter ${Math.ceil((i + 1) / 2)}: Morning Reflections</h1>
              <p>
                Before the bazaars of Johari awakened with their brilliant displays of beaten silver, dawn cast an ember radiance over the terracotta battlements. The morning air carried the scent of crushed marigolds, cardamom seeds, and woodsmoke from courtyard fires.
              </p>
            </div>
            <div class="footer">
              <span>Storybound Private Press</span>
              <span>Page ${i + 1}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </body>
    </html>
  `;
}
