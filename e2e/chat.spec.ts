import { test, expect } from "@playwright/test";

test("user can complete the primary AI chat flow", async ({ page }) => {
  await page.goto("/");

  const chatInput = page.getByLabel(
    "Ask about my projects and skills"
  );

  await expect(chatInput).toBeVisible();

  await chatInput.click();
  await chatInput.pressSequentially(
    "What frontend technologies do I know?"
  );

  await expect(chatInput).toHaveValue(
    "What frontend technologies do I know?"
  );

  const sendButton = page.getByRole("button", { name: "Send" });

  await expect(sendButton).toBeEnabled({ timeout: 10000 });

  await sendButton.click();

  await expect(
    page.getByText("What frontend technologies do I know?")
  ).toBeVisible();

  await expect(
    page.getByText("AI", { exact: true }).last()
  ).toBeVisible({
    timeout: 30000,
  });
});