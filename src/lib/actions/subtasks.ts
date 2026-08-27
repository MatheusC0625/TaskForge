"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subtaskSchema } from "@/lib/validations/task";
import type { ActionState } from "@/lib/actions/projects";

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

async function requireSubtaskOwnership(subtaskId: string, userId: string) {
  const subtask = await prisma.subtask.findUnique({
    where: { id: subtaskId },
    select: {
      id: true,
      taskId: true,
      task: { select: { projectId: true, project: { select: { ownerId: true } } } },
    },
  });
  if (!subtask || subtask.task.project.ownerId !== userId) {
    throw new Error("Item não encontrado.");
  }
  return subtask;
}

export async function createSubtask(
  taskId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await requireTaskOwnership(taskId, session.user.id);

  const parsed = subtaskSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Título inválido." };
  }

  const lastSubtask = await prisma.subtask.findFirst({
    where: { taskId },
    orderBy: { order: "desc" },
  });

  await prisma.subtask.create({
    data: {
      title: parsed.data.title,
      order: (lastSubtask?.order ?? -1) + 1,
      taskId,
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return {};
}

export async function toggleSubtask(subtaskId: string, done: boolean): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const subtask = await requireSubtaskOwnership(subtaskId, session.user.id);

  await prisma.subtask.update({ where: { id: subtaskId }, data: { done } });
  revalidatePath(`/projects/${subtask.task.projectId}`);
}

export async function deleteSubtask(subtaskId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const subtask = await requireSubtaskOwnership(subtaskId, session.user.id);

  await prisma.subtask.delete({ where: { id: subtaskId } });
  revalidatePath(`/projects/${subtask.task.projectId}`);
}
