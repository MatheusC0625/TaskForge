import type { Page } from "@playwright/test";

export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}@example.com`;
}

export async function registerUser(
  page: Page,
  { name, email, password = "senha12345" }: { name: string; email: string; password?: string },
) {
  await page.goto("/register");
  await page.fill("#name", name);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.fill("#confirmPassword", password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
}

export async function login(
  page: Page,
  { email, password = "senha12345" }: { email: string; password?: string },
) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}

export async function createProject(page: Page, name: string) {
  await page.goto("/projects");
  await page.locator('button:has-text("Novo projeto")').first().click();
  await page.waitForSelector('input[name="name"]');
  await page.fill('input[name="name"]', name);
  await page.click('button:has-text("Criar projeto")');
  await page.waitForURL("**/projects/**");
}
