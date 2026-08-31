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

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority") || undefined,
    dueDate: formData.get("dueDate") || undefined,
  });
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
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(`${parsed.data.dueDate}T00:00:00`) : null,
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

export async function moveTask(
  taskId: string,
  toColumnId: string,
  toIndex: number,
): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await requireTaskOwnership(taskId, session.user.id);
  const toColumn = await requireColumnInProject(toColumnId, session.user.id);

  if (toColumn.projectId !== task.projectId) {
    throw new Error("Coluna inválida.");
  }

  const fromColumnId = task.columnId;

  const [fromTasks, toTasksRaw] = await Promise.all([
    fromColumnId === toColumnId
      ? Promise.resolve([])
      : prisma.task.findMany({
          where: { columnId: fromColumnId },
          orderBy: { order: "asc" },
          select: { id: true },
        }),
    prisma.task.findMany({
      where: { columnId: toColumnId },
      orderBy: { order: "asc" },
      select: { id: true },
    }),
  ]);

  const toTaskIds = toTasksRaw.map((t) => t.id).filter((id) => id !== taskId);
  const clampedIndex = Math.max(0, Math.min(toIndex, toTaskIds.length));
  toTaskIds.splice(clampedIndex, 0, taskId);

  const updates = [
    ...toTaskIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: { order: index, columnId: toColumnId },
      }),
    ),
    ...(fromColumnId !== toColumnId
      ? fromTasks
          .filter((t) => t.id !== taskId)
          .map((t, index) => prisma.task.update({ where: { id: t.id }, data: { order: index } }))
      : []),
  ];

  await prisma.$transaction(updates);

  revalidatePath(`/projects/${task.projectId}`);
}
