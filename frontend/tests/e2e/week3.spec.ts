import { test, expect } from "@playwright/test";

test.describe("Week 3: Handwriting, Preview, PDF Export & ₹50 Razorpay Flow", () => {
  test("1. Glyph template PDF is downloadable and valid", async ({ request }) => {
    const response = await request.get("http://localhost:3000/glyph-template.pdf");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"] || "";
    expect(contentType).toContain("pdf");
  });

  test("2. Handwriting Studio page loads with generation options", async ({ page }) => {
    await page.goto("http://localhost:3000/handwriting");
    await expect(page.getByText("Handwriting Studio")).toBeVisible();
    await expect(page.getByText("Step 1: Download A4 Sheet")).toBeVisible();
    await expect(page.getByText("Try Sample Hand-drawn Sheet")).toBeVisible();
  });

  test("3. Book preview loads with 3D spread, cover, and keyboard controls", async ({ page }) => {
    await page.goto("http://localhost:3000/books/book-jaipur-101/preview");
    await expect(page.getByText("Download PDF · ₹50")).toBeVisible();
    await expect(page.getByText("Spread")).toBeVisible();
    await expect(page.getByText("Cover")).toBeVisible();

    // Switch to cover
    await page.getByText("Cover").click();
    await expect(page.getByText("STORYBOUND PRIVATE PRESS")).toBeVisible();
  });

  test("4. ₹50 Checkout flow creates order and grants entitlement", async ({ page }) => {
    await page.goto("http://localhost:3000/books/book-jaipur-101/checkout");
    await expect(page.getByText("Order Summary")).toBeVisible();
    await expect(page.getByText("Total Amount")).toBeVisible();
    await expect(page.getByText("₹50.00")).toBeVisible();

    // Trigger payment
    const payButton = page.getByRole("button", { name: /Pay ₹50/i });
    await payButton.click();

    // Check post-payment unlocked state
    await expect(page.getByText("Payment Verified (₹50)")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Download Clean 300 DPI PDF")).toBeVisible();
  });

  test("5. PDF Export API generates print-ready document", async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/books/book-jaipur-101/export");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });
});
