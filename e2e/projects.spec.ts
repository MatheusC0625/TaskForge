import { expect, test } from "@playwright/test";
import { createProject, registerUser, uniqueEmail } from "./helpers";

test.describe("projetos", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, { name: "Dono de Projeto", email: uniqueEmail("projects") });
  });

  test("cria um projeto e é redirecionado para o quadro dele", async ({ page }) => {
    await createProject(page, "Projeto de Teste");
    await expect(page.locator('input[maxlength="80"]').first()).toHaveValue("Projeto de Teste");
    await expect(page.getByText("Este quadro ainda não tem colunas.")).toBeVisible();
  });

  test("renomeia o projeto direto pelo título e o nome persiste após recarregar", async ({
    page,
  }) => {
    await createProject(page, "Nome Original");
    const titleInput = page.locator('input[maxlength="80"]').first();
    await titleInput.fill("Nome Renomeado");
    await titleInput.blur();
    await page.waitForTimeout(600);

    await page.reload();
    await expect(page.locator('input[maxlength="80"]').first()).toHaveValue("Nome Renomeado");
  });

  test("exclui um projeto pelo painel de configurações", async ({ page }) => {
    await createProject(page, "Projeto Descartável");
    await page.locator('button:has-text("Editar projeto")').click();
    await page.locator('button:has-text("Excluir projeto")').click();
    await page.locator('dialog[open] button:has-text("Excluir")').click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByText("Projeto Descartável")).not.toBeVisible();
  });

  test("lista vazia convida a criar o primeiro projeto", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByText("Você ainda não tem projetos.")).toBeVisible();
  });
});
