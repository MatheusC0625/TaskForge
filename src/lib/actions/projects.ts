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

export type ActionState = { error?: string };

const DEFAULT_COLUMNS = ["A Fazer", "Em Andamento", "Concluído"];

async function assertProjectOwner(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  return !!project && project.ownerId === userId;
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
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      color: parsed.data.color || "#10b981",
      githubRepoUrl: parsed.data.githubRepoUrl || null,
      ownerId: session.user.id,
      columns: {
        create: DEFAULT_COLUMNS.map((name, order) => ({ name, order })),
      },
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
