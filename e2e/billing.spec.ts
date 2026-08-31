import { expect, test } from "@playwright/test";
import { registerUser, uniqueEmail } from "./helpers";

test.describe("plano Free/Pro", () => {
  test("plano gratuito bloqueia um segundo repositório do GitHub", async ({ page }) => {
    await registerUser(page, { name: "Usuário Free", email: uniqueEmail("billing-free") });

    await page.goto("/projects");
    await page.locator('button:has-text("Novo projeto")').first().click();
    await page.waitForSelector('input[name="name"]');
    await page.fill('input[name="name"]', "Projeto Um");
    await page.fill('input[name="githubRepoUrl"]', "https://github.com/vercel/next.js");
    await page.click('button:has-text("Criar projeto")');
    await page.waitForURL("**/projects/**");

    await page.locator('button:has-text("Editar projeto")').click();
    await expect(page.getByText(/permite 1 repositório/i)).toBeVisible();
  });

  test("assinar o Pro libera múltiplos repositórios no mesmo projeto", async ({ page }) => {
    await registerUser(page, { name: "Usuário Pro", email: uniqueEmail("billing-pro") });

    await page.goto("/upgrade");
    await page.click('button:has-text("Assinar plano Pro")');
    await expect(page.getByText("Voltar para o plano Free")).toBeVisible();

    await page.goto("/projects");
    await page.locator('button:has-text("Novo projeto")').first().click();
    await page.waitForSelector('input[name="name"]');
    await page.fill('input[name="name"]', "Projeto Multi Repo");
    await page.fill('input[name="githubRepoUrl"]', "https://github.com/vercel/next.js");
    await page.click('button:has-text("Criar projeto")');
    await page.waitForURL("**/projects/**");

    await page.locator('button:has-text("Editar projeto")').click();
    await page.waitForSelector('input[name="url"]');
    await page.fill('input[name="url"]', "https://github.com/facebook/react");
    await page.click('button:has-text("Adicionar")');

    await expect(page.getByText("https://github.com/vercel/next.js")).toBeVisible();
    await expect(page.getByText("https://github.com/facebook/react")).toBeVisible();
  });

  test("template exclusivo Pro fica trancado para o plano gratuito", async ({ page }) => {
    await registerUser(page, { name: "Usuário Free", email: uniqueEmail("billing-template") });
    await page.goto("/templates/cicd-pipeline");
    await expect(page.getByText("Este template é exclusivo do plano Pro.")).toBeVisible();
    await expect(page.getByRole("link", { name: /assinar o pro/i })).toBeVisible();
  });
});
