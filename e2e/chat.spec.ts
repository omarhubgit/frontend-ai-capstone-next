import { test, expect } from "@playwright/test";

test("user can complete the primary AI chat flow", async ({ page }) => {
  await page.goto("/");

  const chatInput = page.getByLabel(
    "Ask about my projects and skills"
  );

  await expect(chatInput).toBeVisible();

  await chatInput.fill(
    "What frontend technologies do I know?"
  );

  await page.getByRole("button", { name: "Send" }).click();

  await expect(
    page.getByText("What frontend technologies do I know?")
  ).toBeVisible();

  await expect(
    page.getByText("AI", { exact: true }).last()
  ).toBeVisible({
    timeout: 30000,
  });
});