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
  "Seu plano gratuito permite vincular apenas 1 repositório do GitHub no total. Desvincule o outro projeto ou assine o plano Pro em /upgrade.";

async function canLinkGithubRepo(userId: string, projectId: string | null) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  if (user?.plan === "PRO") return true;

  const otherLinkedCount = await prisma.project.count({
    where: {
      ownerId: userId,
      githubRepoUrl: { not: null },
      ...(projectId ? { id: { not: projectId } } : {}),
    },
  });
  return otherLinkedCount === 0;
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

  if (parsed.data.githubRepoUrl && !(await canLinkGithubRepo(session.user.id, null))) {
    return { error: FREE_PLAN_REPO_LIMIT_MESSAGE };
  }

  const template = getProjectTemplate(parsed.data.templateId);

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      color: parsed.data.color || "#10b981",
      githubRepoUrl: parsed.data.githubRepoUrl || null,
      ownerId: session.user.id,
      ...(template && template.columns.length > 0
        ? { columns: { create: template.columns.map((name, order) => ({ name, order })) } }
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
    githubRepoUrl: formData.get("githubRepoUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (!(await assertProjectOwner(projectId, session.user.id))) {
    return { error: "Projeto não encontrado." };
  }

  if (parsed.data.githubRepoUrl && !(await canLinkGithubRepo(session.user.id, projectId))) {
    return { error: FREE_PLAN_REPO_LIMIT_MESSAGE };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      description: parsed.data.description || null,
      githubRepoUrl: parsed.data.githubRepoUrl || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return {};
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
