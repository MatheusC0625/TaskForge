"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  projectSchema,
  renameProjectSchema,
  projectColorSchema,
  projectDetailsSchema,
  projectRepoSchema,
} from "@/lib/validations/project";
import { getProjectTemplate } from "@/lib/templates";

export type ActionState = { error?: string };

async function assertProjectOwner(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  return !!project && project.ownerId === userId;
}

const FREE_PLAN_REPO_LIMIT_MESSAGE =
  "Seu plano gratuito permite vincular apenas 1 repositório do GitHub no total. Remova o outro repositório ou assine o plano Pro em /upgrade.";

async function canAddGithubRepo(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  if (user?.plan === "PRO") return true;

  const linkedCount = await prisma.projectRepo.count({ where: { project: { ownerId: userId } } });
  return linkedCount === 0;
}

export async function createProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
    githubRepoUrl: formData.get("githubRepoUrl"),
    templateId: formData.get("templateId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (parsed.data.githubRepoUrl && !(await canAddGithubRepo(session.user.id))) {
    return { error: FREE_PLAN_REPO_LIMIT_MESSAGE };
  }

  const template = getProjectTemplate(parsed.data.templateId);

  if (template?.pro) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } });
    if (user?.plan !== "PRO") {
      return { error: "Esse template é exclusivo do plano Pro. Assine em /upgrade para usá-lo." };
    }
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      color: parsed.data.color || "#10b981",
      ownerId: session.user.id,
      ...(parsed.data.githubRepoUrl
        ? { repos: { create: [{ url: parsed.data.githubRepoUrl }] } }
        : {}),
      ...(template && template.columns.length > 0
        ? {
            columns: {
              create: template.columns.map((column, order) => ({ name: column.name, order })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function renameProject(projectId: string, name: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = renameProjectSchema.safeParse({ name });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nome inválido." };
  }

  if (!(await assertProjectOwner(projectId, session.user.id))) {
    return { error: "Projeto não encontrado." };
  }

  await prisma.project.update({ where: { id: projectId }, data: { name: parsed.data.name } });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function updateProjectColor(projectId: string, color: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = projectColorSchema.safeParse({ color });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Cor inválida." };
  }

  if (!(await assertProjectOwner(projectId, session.user.id))) {
    return { error: "Projeto não encontrado." };
  }

  await prisma.project.update({ where: { id: projectId }, data: { color: parsed.data.color } });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function updateProjectDetails(
  projectId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = projectDetailsSchema.safeParse({
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!(await assertProjectOwner(projectId, session.user.id))) {
    return { error: "Projeto não encontrado." };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { description: parsed.data.description || null },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function addProjectRepo(
  projectId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = projectRepoSchema.safeParse({ url: formData.get("url") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "URL inválida." };
  }

  if (!(await assertProjectOwner(projectId, session.user.id))) {
    return { error: "Projeto não encontrado." };
  }

  if (!(await canAddGithubRepo(session.user.id))) {
    return { error: FREE_PLAN_REPO_LIMIT_MESSAGE };
  }

  await prisma.projectRepo.create({ data: { url: parsed.data.url, projectId } });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function removeProjectRepo(repoId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const repo = await prisma.projectRepo.findUnique({
    where: { id: repoId },
    select: { projectId: true, project: { select: { ownerId: true } } },
  });
  if (!repo || repo.project.ownerId !== session.user.id) {
    throw new Error("Repositório não encontrado.");
  }

  await prisma.projectRepo.delete({ where: { id: repoId } });

  revalidatePath("/projects");
  revalidatePath(`/projects/${repo.projectId}`);
}

export async function deleteProject(projectId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project || project.ownerId !== session.user.id) {
    throw new Error("Projeto não encontrado.");
  }

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/projects");
}
