import { expect, test } from "@playwright/test";
import { createProject, registerUser, uniqueEmail } from "./helpers";

async function addColumn(page: import("@playwright/test").Page, name: string) {
  await page.fill('input[name="name"][placeholder="Nova coluna"]', name);
  await page.click('button:has-text("Adicionar coluna")');
  await page.waitForTimeout(300);
}

test.describe("quadro Kanban", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, { name: "Usuário Board", email: uniqueEmail("board") });
    await createProject(page, "Projeto Board");
  });

  test("cria uma coluna e uma tarefa com prioridade e prazo", async ({ page }) => {
    await addColumn(page, "Backlog");
    await expect(page.locator('input[maxlength="40"]:not([placeholder])').first()).toHaveValue("Backlog");

    await page.click('button:has-text("Adicionar tarefa")');
    await page.waitForSelector('dialog[open] input[name="title"]');
    await page.fill('dialog[open] input[name="title"]', "Configurar CI/CD");
    await page.selectOption('dialog[open] select[name="priority"]', "HIGH");
    await page.click('dialog[open] button[type="submit"]');

    await expect(page.getByText("Configurar CI/CD")).toBeVisible();
    await expect(page.locator("span", { hasText: /^Alta$/ })).toBeVisible();
  });

  test("renomeia uma coluna direto no cabeçalho", async ({ page }) => {
    await addColumn(page, "Coluna Original");
    const columnInput = page.locator('input[maxlength="40"]:not([placeholder])').first();
    await columnInput.fill("Coluna Renomeada");
    await columnInput.blur();
    await page.waitForTimeout(500);

    await page.reload();
    await expect(page.locator('input[maxlength="40"]:not([placeholder])').first()).toHaveValue("Coluna Renomeada");
  });

  test("arrasta uma coluna para reordenar e a ordem persiste", async ({ page }) => {
    await addColumn(page, "Primeira");
    await addColumn(page, "Segunda");
    await addColumn(page, "Terceira");

    const handles = page.locator('button[aria-label="Arrastar coluna"]');
    const first = handles.nth(0);
    const box = await first.boundingBox();
    if (!box) throw new Error("não foi possível localizar o handle de arrastar");

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 700, box.y, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(600);

    await page.reload();
    const values = await page.locator('input[maxlength="40"]:not([placeholder])').evaluateAll((inputs) =>
      inputs.map((input) => (input as HTMLInputElement).value),
    );
    expect(values[0]).not.toBe("Primeira");
  });

  test("exclui uma coluna pelo menu de opções", async ({ page }) => {
    await addColumn(page, "Coluna Temporária");
    const columnInput = page.locator('input[maxlength="40"]:not([placeholder])').first();
    await expect(columnInput).toHaveValue("Coluna Temporária");

    await page.click('button[aria-label="Opções da coluna"]');
    await page.click('button:has-text("Excluir coluna")');
    await page.click('dialog[open] button:has-text("Excluir")');

    await expect(page.locator('input[maxlength="40"]:not([placeholder])')).toHaveCount(0);
  });
});
