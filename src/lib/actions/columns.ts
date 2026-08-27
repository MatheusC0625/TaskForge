"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { columnSchema } from "@/lib/validations/project";
import type { ActionState } from "@/lib/actions/projects";

async function requireColumnOwnership(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { id: true, order: true, projectId: true, project: { select: { ownerId: true } } },
  });

  if (!column || column.project.ownerId !== userId) {
    throw new Error("Coluna não encontrada.");
  }

  return column;
}

export async function createColumn(
  projectId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project || project.ownerId !== session.user.id) {
    return { error: "Projeto não encontrado." };
  }

  const parsed = columnSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nome inválido." };
  }

  const lastColumn = await prisma.column.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
  });

  await prisma.column.create({
    data: {
      name: parsed.data.name,
      order: (lastColumn?.order ?? -1) + 1,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function renameColumn(
  columnId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const column = await requireColumnOwnership(columnId, session.user.id);

  const parsed = columnSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nome inválido." };
  }

  await prisma.column.update({
    where: { id: columnId },
    data: { name: parsed.data.name },
  });

  revalidatePath(`/projects/${column.projectId}`);
  return {};
}

export async function deleteColumn(columnId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const column = await requireColumnOwnership(columnId, session.user.id);
  await prisma.column.delete({ where: { id: columnId } });
  revalidatePath(`/projects/${column.projectId}`);
}

export async function moveColumn(columnId: string, direction: "up" | "down"): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const column = await requireColumnOwnership(columnId, session.user.id);

  const neighbor = await prisma.column.findFirst({
    where: {
      projectId: column.projectId,
      order: direction === "up" ? { lt: column.order } : { gt: column.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbor) return;

  await prisma.$transaction([
    prisma.column.update({ where: { id: column.id }, data: { order: neighbor.order } }),
    prisma.column.update({ where: { id: neighbor.id }, data: { order: column.order } }),
  ]);

  revalidatePath(`/projects/${column.projectId}`);
}
