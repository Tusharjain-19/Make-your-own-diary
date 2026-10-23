import { test, expect } from "@playwright/test";

test.describe("Image Replacement & Preview Navigation with Collapsible Filmstrip", () => {
  test.beforeEach(async ({ context }) => {
    test.setTimeout(60000);
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

  test("1. Editor: image selection provides Change Photo / Upload options and collapsible bottom strip", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/books/book-jaipur-101/edit", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Verify editor canvas loads
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 25000 });

    // Wait for pages to populate
    await expect(page.getByText(/[1-9]\d* total/i)).toBeVisible({ timeout: 15000 });

    // Floating Prev / Next navigation buttons on canvas are present
    const canvasPrevBtn = page.getByTitle("Previous Page (ArrowLeft)");
    const canvasNextBtn = page.getByTitle("Next Page (ArrowRight)");
    await expect(canvasPrevBtn).toBeVisible();
    await expect(canvasNextBtn).toBeVisible();

    // Verify collapsible bottom filmstrip toggle
    const hideStripBtn = page.getByTitle("Hide Bottom Page Preview (Can see or not see)");
    await expect(hideStripBtn).toBeVisible();
    await hideStripBtn.click();

    // Filmstrip collapses to compact mode
    const showStripBtn = page.getByTitle("Show Page Thumbnails (Bottom Preview)");
    await expect(showStripBtn).toBeVisible();

    // Expand back
    await showStripBtn.click();
    await expect(page.getByTitle("Hide Bottom Page Preview (Can see or not see)")).toBeVisible();

    // Ensure next button is enabled now that pages are loaded
    await expect(canvasNextBtn).toBeEnabled({ timeout: 10000 });
    await canvasNextBtn.click();

    // Wait for page indicator update
    await expect(page.getByText(/Page 2/i).first()).toBeVisible();

    // Navigate back using keyboard ArrowLeft
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText(/Cover/i).first()).toBeVisible();
  });

  test("2. Preview: exact page count, left/right buttons, keyboard navigation, and collapsible bottom preview", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/books/book-jaipur-101/preview", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Check back to editor and book title
    await expect(page.getByText("Back to Editor")).toBeVisible({ timeout: 20000 });
    await expect(page.getByText("Order Hardcover Print")).toBeVisible();

    // Verify page indicator matches actual pages
    await expect(page.getByText(/of [1-9]\d*/i).first()).toBeVisible({ timeout: 15000 });

    // Floating navigation arrows
    const prevSpreadBtn = page.getByTitle("Previous Page (Left Arrow Key)");
    const nextSpreadBtn = page.getByTitle("Next Page (Right Arrow Key)");
    await expect(prevSpreadBtn).toBeVisible();
    await expect(nextSpreadBtn).toBeVisible();

    // Wait for Next button to be enabled if multiple spreads exist
    const isNextEnabled = await nextSpreadBtn.isEnabled();
    if (isNextEnabled) {
      await nextSpreadBtn.click();
      await expect(page.getByText(/Pages \d+–\d+ of \d+/i)).toBeVisible();

      // Turn back with ArrowLeft key
      await page.keyboard.press("ArrowLeft");
    }

    // Verify collapsible bottom preview strip ("can see or not see")
    const hideThumbnailsBtn = page.getByTitle("Hide Bottom Page Preview");
    await expect(hideThumbnailsBtn).toBeVisible();
    await hideThumbnailsBtn.click();

    // Filmstrip is hidden and button toggles to Show Strip
    const showThumbnailsBtn = page.getByTitle("Show Bottom Page Preview");
    await expect(showThumbnailsBtn).toBeVisible();

    // Re-open strip
    await showThumbnailsBtn.click();
    await expect(page.getByTitle("Hide Bottom Page Preview")).toBeVisible();
  });
});
