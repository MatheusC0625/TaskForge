import { expect, test } from "@playwright/test";
import { createProject, registerUser, uniqueEmail } from "./helpers";

test.describe("segurança entre usuários (IDOR)", () => {
  test("um usuário não consegue abrir o projeto de outro pela URL", async ({ browser }) => {
    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();
    await registerUser(ownerPage, { name: "Dono", email: uniqueEmail("idor-owner") });
    await createProject(ownerPage, "Projeto Privado");
    const projectUrl = ownerPage.url();
    await ownerContext.close();

    const attackerContext = await browser.newContext();
    const attackerPage = await attackerContext.newPage();
    await registerUser(attackerPage, { name: "Atacante", email: uniqueEmail("idor-attacker") });
    await attackerPage.goto(projectUrl);

    // A checagem de ownership no Server Component chama notFound(): o
    // atacante vê a página padrão de "não encontrado", nunca os dados do
    // projeto de outro usuário.
    await expect(attackerPage.getByText("This page could not be found.")).toBeVisible();
    await expect(attackerPage.getByText("Projeto Privado")).not.toBeVisible();
    await attackerContext.close();
  });

  test("a lista de projetos de um usuário não mostra projetos de outro", async ({ browser }) => {
    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();
    await registerUser(ownerPage, { name: "Dono", email: uniqueEmail("idor-list-owner") });
    await createProject(ownerPage, "Projeto Exclusivo Do Dono");
    await ownerContext.close();

    const otherContext = await browser.newContext();
    const otherPage = await otherContext.newPage();
    await registerUser(otherPage, { name: "Outro", email: uniqueEmail("idor-list-other") });
    await otherPage.goto("/projects");
    await expect(otherPage.getByText("Projeto Exclusivo Do Dono")).not.toBeVisible();
    await otherContext.close();
  });
});
