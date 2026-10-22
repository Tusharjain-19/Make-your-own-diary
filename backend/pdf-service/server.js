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
  const { html, pageSize = "A5", printBackground = true } = req.body;

  if (!html) {
    return res.status(400).json({ error: "Missing HTML payload" });
  }

  let browser = null;
  try {
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      printBackground,
    });

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation failed:", error);
    res.status(500).json({ error: error.message || "PDF generation failure" });
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
