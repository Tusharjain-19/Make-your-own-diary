import { test, expect } from "@playwright/test";

test.describe("Week 4 — Day 22 & Day 23: Print Export, Pre-Flight, & Order Fulfilment", () => {
  test.beforeEach(async ({ context }) => {
    // Authenticate test browser with Tushar session cookie
    const sessionData = JSON.stringify({
      userId: "user-tushar-01",
      email: "tushar@storybound.app",
      name: "Tushar Jain",
    });
    await context.addCookies([
      {
        name: "storybound_session",
        value: encodeURIComponent(sessionData),
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("1. Print Export API produces 3mm bleed PDF with crop marks", async ({ request }) => {
    const response = await request.get(
      "http://localhost:3000/api/books/book-jaipur-101/export?type=print&cropMarks=true&bleed=3"
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
    const disposition = response.headers()["content-disposition"] || "";
    expect(disposition).toContain("print_3mm_bleed");
  });

  test("2. Cover Spread API generates wrap spread with spine width calculated from page count", async ({
    request,
  }) => {
    const response = await request.get(
      "http://localhost:3000/api/books/book-jaipur-101/export?type=cover&pages=20&product=travel_diary"
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
    const disposition = response.headers()["content-disposition"] || "";
    expect(disposition).toContain("cover_spread_spine");
  });

  test("3. Editor loads with Pre-Flight Check Inspection modal", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("http://localhost:3000/books/book-jaipur-101/edit", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Pre-flight button in TopBar
    const preflightBtn = page.getByRole("button", { name: /Pre-Flight/i });
    await expect(preflightBtn).toBeVisible({ timeout: 30000 });
    await preflightBtn.click();

    // Pre-flight inspection modal
    await expect(page.getByText("Pre-Flight Print Inspection")).toBeVisible();
    await expect(page.getByText(/3mm bleed/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Cover Spread PDF/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Generate Print PDF/i })).toBeVisible();

    // Close modal
    await page.getByRole("button", { name: "Close" }).click();
  });

  test("4. Order Flow allows choosing product, copies, validating PIN, and placing test order", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/books/book-jaipur-101/order", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("Order Hardcover Print Edition")).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: /Travel Diary/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Mini Keepsake/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Classic Heritage Album/i })).toBeVisible();

    // Verify PIN code auto-fill feedback
    const pinInput = page.getByRole("textbox", { name: "Postal PIN Code" });
    await expect(pinInput).toBeVisible();
    await pinInput.fill("302001");
    await expect(page.getByText(/Deliverable to Jaipur, Rajasthan/i)).toBeVisible();

    // Place order
    const payOrderBtn = page.getByRole("button", { name: /Pay ₹.*& Place Order/i });
    await payOrderBtn.click();

    // Confirmation screen
    await expect(page.getByText("Your Hardcover is Scheduled for Print!")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/SB-ORD-/i)).toBeVisible();
    await expect(page.getByText("View Order Status Timeline")).toBeVisible();
  });

  test("5. Customer /orders page displays placed orders with status timeline", async ({ page }) => {
    await page.goto("http://localhost:3000/orders", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("My Hardcover Print Orders")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Order Received").first()).toBeVisible();
    await expect(page.getByText("Printing & Casing").first()).toBeVisible();
    await expect(page.getByText("Dispatched").first()).toBeVisible();
    await expect(page.getByText("Interior Proof (3mm Bleed)").first()).toBeVisible();
  });

  test("6. Admin /admin/orders page allows managing orders, updating tracking, and triggering status emails", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/admin/orders", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Print Orders Fulfilment")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Total Orders/i)).toBeVisible();
    await expect(page.getByText("Trigger Status Email").first()).toBeVisible();

    // Trigger status email
    await page.getByText("Trigger Status Email").first().click();
    await expect(page.getByText(/notification email.*sent/i)).toBeVisible({ timeout: 5000 });

    // Download print file buttons are present
    await expect(page.getByText("Interior (3mm Bleed + Marks)").first()).toBeVisible();
  });
});
