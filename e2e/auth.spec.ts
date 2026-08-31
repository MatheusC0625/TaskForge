import { expect, test } from "@playwright/test";
import { login, registerUser, uniqueEmail } from "./helpers";

test.describe("autenticação", () => {
  test("registra uma conta nova e chega ao dashboard", async ({ page }) => {
    const email = uniqueEmail("auth-register");
    await registerUser(page, { name: "Usuário Teste", email });
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Olá, Usuário Teste" })).toBeVisible();
  });

  test("recusa o cadastro quando as senhas não coincidem", async ({ page }) => {
    await page.goto("/register");
    await page.fill("#name", "Usuário Teste");
    await page.fill("#email", uniqueEmail("auth-mismatch"));
    await page.fill("#password", "senha12345");
    await page.fill("#confirmPassword", "outrasenha");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText(/senhas não coincidem/i)).toBeVisible();
  });

  test("mostra erro genérico ao logar com senha errada", async ({ page }) => {
    const email = uniqueEmail("auth-wrongpass");
    await registerUser(page, { name: "Usuário Teste", email });
    await page.goto("/dashboard");
    await page.locator('button:has-text("Sair")').click();
    await page.waitForURL(/\/login/);

    await login(page, { email, password: "senhaErrada123" });
    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
  });

  test("bloqueia a conta após 5 tentativas de senha erradas", async ({ page }) => {
    const email = uniqueEmail("auth-lockout");
    await registerUser(page, { name: "Usuário Teste", email });
    await page.goto("/dashboard");
    await page.locator('button:has-text("Sair")').click();
    await page.waitForURL(/\/login/);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await login(page, { email, password: "senhaErrada123" });
      await page.waitForTimeout(300);
    }

    await expect(page.getByText(/muitas tentativas incorretas/i)).toBeVisible();
  });

  test("um usuário não autenticado é redirecionado ao acessar /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
