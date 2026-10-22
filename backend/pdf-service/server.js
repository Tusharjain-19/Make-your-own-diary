const express = require("express");
const { chromium } = require("playwright");

const app = express();
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT || 8080;
const AUTH_TOKEN = process.env.PDF_SERVICE_TOKEN;

// Token verification middleware
app.use((req, res, next) => {
  if (AUTH_TOKEN) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized PDF service request" });
    }
  }
  next();
});

// Render HTML with mm dimensions to print-ready PDF
app.post("/render-pdf", async (req, res) => {
  const { html, pageSize = "A5", printBackground = true, watermarked = false } = req.body;

  if (!html) {
    return res.status(400).json({ error: "Missing HTML payload" });
  }

  let browser = null;
  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set high device scale factor for 300 DPI sharpness
    await page.setViewportSize({ width: 794, height: 1123 }); // A5 at 135 DPI screen preview
    await page.setContent(html, { waitUntil: "networkidle" });

    // Inject watermark overlay if requested
    if (watermarked) {
      await page.addStyleTag({
        content: `
          body::after {
            content: "STORYBOUND PREVIEW";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-35deg);
            font-size: 60px;
            font-family: serif;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.08);
            pointer-events: none;
            z-index: 999999;
          }
        `,
      });
    }

    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      printBackground,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="storybound_book.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation failed:", error);
    res.status(500).json({ error: error.message || "PDF generation failure" });
  } finally {
    if (browser) await browser.close();
  }
});

// Render single page screenshot for visual fixture testing
app.post("/render-screenshot", async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: "Missing HTML" });

  let browser = null;
  try {
    browser = await chromium.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 559, height: 794 });
    await page.setContent(html, { waitUntil: "networkidle" });
    const pngBuffer = await page.screenshot({ type: "png", fullPage: true });
    res.contentType("image/png");
    res.send(pngBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "storybound-pdf-service" });
});

app.listen(PORT, () => {
  console.log(`Storybound PDF export service running on port ${PORT}`);
});
