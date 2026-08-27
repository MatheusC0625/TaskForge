"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/validations/task";
import type { ActionState } from "@/lib/actions/projects";

async function requireProjectOwnership(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project || project.ownerId !== userId) {
    throw new Error("Projeto não encontrado.");
  }
}

async function requireTagOwnership(tagId: string, userId: string) {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    select: { id: true, projectId: true, project: { select: { ownerId: true } } },
  });
  if (!tag || tag.project.ownerId !== userId) {
    throw new Error("Etiqueta não encontrada.");
  }
  return tag;
}

async function requireTaskOwnership(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true, project: { select: { ownerId: true } } },
  });
  if (!task || task.project.ownerId !== userId) {
    throw new Error("Tarefa não encontrada.");
  }
  return task;
}

export type CreateTagResult = ActionState & { tagId?: string };

export async function createTag(
  projectId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<CreateTagResult> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await requireProjectOwnership(projectId, session.user.id);

  const parsed = tagSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.tag.findUnique({
    where: { projectId_name: { projectId, name: parsed.data.name } },
  });
  if (existing) {
    return { error: "Já existe uma etiqueta com esse nome." };
  }

  const tag = await prisma.tag.create({
    data: { name: parsed.data.name, color: parsed.data.color, projectId },
  });

  revalidatePath(`/projects/${projectId}`);
  return { tagId: tag.id };
}

export async function deleteTag(tagId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tag = await requireTagOwnership(tagId, session.user.id);
  await prisma.tag.delete({ where: { id: tagId } });
  revalidatePath(`/projects/${tag.projectId}`);
}

export async function setTaskTag(
  taskId: string,
  tagId: string,
  attach: boolean,
): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await requireTaskOwnership(taskId, session.user.id);
  await requireTagOwnership(tagId, session.user.id);

  await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: attach ? { connect: { id: tagId } } : { disconnect: { id: tagId } },
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
}
