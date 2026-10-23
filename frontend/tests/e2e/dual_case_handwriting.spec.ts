import { test, expect } from "@playwright/test";

test.describe("Dual-Case Handwriting System: Capital Letters & Small Letters", () => {
  test.beforeEach(async ({ context }) => {
    test.setTimeout(90000);
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

  test("1. Handwriting Studio processes sample sheet with both Capitals (A–Z) and Small Letters (a–z)", async ({
    page,
  }) => {
    page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.log("PAGE ERROR:", err));

    await page.goto("http://localhost:3000/handwriting", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Check title and step instructions mentioning Capitals & Small letters
    await expect(page.getByRole("heading", { name: "Handwriting Studio" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/covers A–Z Capitals & a–z Small Letters/i)).toBeVisible();

    // Trigger synthetic demo sample sheet (use toPass to ensure React hydration has attached handlers)
    const trySampleBtn = page.getByRole("button", { name: /Try Sample Hand-drawn Sheet/i });
    await expect(trySampleBtn).toBeVisible();
    await expect(async () => {
      await trySampleBtn.click();
      await expect(page.getByText(/Review & Refine Letters/i)).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 25000 });

    // Verify Capital and Small letter breakdown badges
    await expect(page.getByText(/Capitals A–Z/i).first()).toBeVisible();
    await expect(page.getByText(/Small Letters a–z/i).first()).toBeVisible();

    // Test switching to Capital Letters filter
    await page.getByRole("button", { name: /Capitals A–Z/i }).click();
    await expect(page.getByText("Cap").first()).toBeVisible();

    // Test switching to Small Letters filter
    await page.getByRole("button", { name: /Small Letters a–z/i }).click();
    await expect(page.getByText("Small").first()).toBeVisible();

    // Test switching to Aa Pairs View
    const pairsToggleBtn = page.getByRole("button", { name: /Aa Pairs/i });
    await expect(pairsToggleBtn).toBeVisible();
    await pairsToggleBtn.click();

    // Verify Alphabet Pair cards render (e.g. Aa, Bb, Cc)
    await expect(page.getByText("Aa", { exact: true })).toBeVisible();
    await expect(page.getByText("Bb")).toBeVisible();
    await expect(page.getByText("Cap A:")).toBeVisible();
    await expect(page.getByText("Small a:")).toBeVisible();

    // Open Draw Character modal by clicking a Small letter cell
    await page.getByText("Small a:").click();
    await expect(page.getByText(/Draw Letter:.*"a"/i)).toBeVisible();
    await expect(page.getByText("SMALL LETTER", { exact: true })).toBeVisible();
    await expect(page.getByText(/x-height/i).first()).toBeVisible();

    // Close draw modal
    await page.getByRole("button", { name: "Cancel" }).click();

    // Compile Font with both Capitals and Small letters
    const compileBtn = page.getByRole("button", { name: /Compile Font/i });
    await expect(compileBtn).toBeVisible();
    await compileBtn.click();

    // Step: Live Typography Preview
    await expect(page.getByText(/Dual-Case Enabled/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Dual-Case Inspection")).toBeVisible();
    await expect(page.getByText("A–Z & a–z", { exact: true })).toBeVisible();

    // Test case preset buttons
    await page.getByRole("button", { name: "AA Capitals" }).click();
    await page.getByRole("button", { name: "aa Small" }).click();
    await page.getByRole("button", { name: "Aa Mixed" }).click();

    // Test case transform buttons
    await page.getByRole("button", { name: "UPPER" }).click();
    await page.getByRole("button", { name: "lower" }).click();

    // Verify Export .OTF button is present
    await expect(page.getByRole("button", { name: /Export .OTF/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Apply to Text/i })).toBeVisible();
  });
});
