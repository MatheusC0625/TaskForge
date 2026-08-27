"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import type { ActionState } from "@/lib/actions/projects";

async function requireColumnInProject(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { id: true, projectId: true, project: { select: { ownerId: true } } },
  });
  if (!column || column.project.ownerId !== userId) {
    throw new Error("Coluna não encontrada.");
  }
  return column;
}

async function requireTaskOwnership(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true, columnId: true, project: { select: { ownerId: true } } },
  });
  if (!task || task.project.ownerId !== userId) {
    throw new Error("Tarefa não encontrada.");
  }
  return task;
}

export async function createTask(
  columnId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const column = await requireColumnInProject(columnId, session.user.id);

  const parsed = createTaskSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Título inválido." };
  }

  const lastTask = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      order: (lastTask?.order ?? -1) + 1,
      columnId,
      projectId: column.projectId,
    },
  });

  revalidatePath(`/projects/${column.projectId}`);
  return {};
}

export type UpdateTaskPatch = {
  title?: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string | null;
};

export async function updateTask(taskId: string, patch: UpdateTaskPatch): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await requireTaskOwnership(taskId, session.user.id);

  const parsed = updateTaskSchema.safeParse(patch);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { title, description, priority, dueDate } = parsed.data;

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description: description || null }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && {
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
      }),
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return {};
}

export async function deleteTask(taskId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await requireTaskOwnership(taskId, session.user.id);
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/projects/${task.projectId}`);
}
