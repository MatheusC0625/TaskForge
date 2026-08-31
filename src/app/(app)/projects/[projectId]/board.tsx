"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColumnItem } from "./column-item";
import { NewColumnForm } from "./new-column-form";
import { NewTaskForm } from "./new-task-form";
import { TaskCard } from "./task-card";
import { SortableTaskCard } from "./sortable-task-card";
import { DroppableColumn } from "./droppable-column";
import type { TaskDetail } from "./task-panel";
import { moveTask } from "@/lib/actions/tasks";

export type BoardColumn = {
  id: string;
  name: string;
  tasks: TaskDetail[];
};

type MoveAction = { taskId: string; toColumnId: string; toIndex: number };

function moveTaskInColumns(state: BoardColumn[], action: MoveAction): BoardColumn[] {
  let movedTask: TaskDetail | undefined;

  const withoutTask = state.map((column) => {
    const index = column.tasks.findIndex((task) => task.id === action.taskId);
    if (index === -1) return column;
    movedTask = column.tasks[index];
    return { ...column, tasks: column.tasks.filter((task) => task.id !== action.taskId) };
  });

  if (!movedTask) return state;

  return withoutTask.map((column) => {
    if (column.id !== action.toColumnId) return column;
    const tasks = [...column.tasks];
    const index = Math.max(0, Math.min(action.toIndex, tasks.length));
    tasks.splice(index, 0, movedTask!);
    return { ...column, tasks };
  });
}

function toCardData(task: TaskDetail) {
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate,
    tags: task.tags,
    subtaskTotal: task.subtasks.length,
    subtaskDone: task.subtasks.filter((subtask) => subtask.done).length,
  };
}

export function Board({
  projectId,
  columns,
  filterPredicate,
  onSelectTask,
}: {
  projectId: string;
  columns: BoardColumn[];
  filterPredicate: (task: TaskDetail) => boolean;
  onSelectTask: (taskId: string) => void;
}) {
  const [activeTask, setActiveTask] = useState<TaskDetail | null>(null);
  const [optimisticColumns, applyMove] = useOptimistic(columns, moveTaskInColumns);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = optimisticColumns
      .flatMap((column) => column.tasks)
      .find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const overData = over.data.current as { type?: "column" | "task"; columnId?: string } | undefined;
    const toColumnId = overData?.type === "column" ? (over.id as string) : overData?.columnId;
    if (!toColumnId) return;

    const toColumn = optimisticColumns.find((column) => column.id === toColumnId);
    if (!toColumn) return;

    const toIndex =
      overData?.type === "task"
        ? toColumn.tasks.findIndex((task) => task.id === over.id)
        : toColumn.tasks.length;

    const taskId = active.id as string;
    const fromColumn = optimisticColumns.find((column) =>
      column.tasks.some((task) => task.id === taskId),
    );
    if (fromColumn?.id === toColumnId && fromColumn.tasks[toIndex]?.id === taskId) {
      return;
    }

    startTransition(async () => {
      applyMove({ taskId, toColumnId, toIndex });
      await moveTask(taskId, toColumnId, toIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {optimisticColumns.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <div>
            <p className="text-neutral-900 dark:text-neutral-100">Este quadro ainda não tem colunas.</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Crie a primeira coluna para começar a organizar as tarefas.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <NewColumnForm projectId={projectId} />
          </div>
        </div>
      ) : (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {optimisticColumns.map((column, index) => {
          const visibleTasks = column.tasks.filter(filterPredicate);
          return (
            <div
              key={column.id}
              className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 sm:w-80 dark:border-neutral-800 dark:bg-neutral-900/40"
            >
              <ColumnItem
                column={column}
                taskCount={column.tasks.length}
                isFirst={index === 0}
                isLast={index === optimisticColumns.length - 1}
              />

              <DroppableColumn columnId={column.id}>
                <SortableContext
                  items={visibleTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {visibleTasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={toCardData(task)}
                      columnId={column.id}
                      onOpen={() => onSelectTask(task.id)}
                    />
                  ))}
                </SortableContext>
                {visibleTasks.length === 0 && column.tasks.length > 0 && (
                  <p className="px-1 py-1 text-xs text-neutral-400 dark:text-neutral-500">
                    Nenhuma tarefa corresponde aos filtros.
                  </p>
                )}
              </DroppableColumn>

              <NewTaskForm columnId={column.id} />
            </div>
          );
        })}

        <div className="w-64 shrink-0 sm:w-72">
          <NewColumnForm projectId={projectId} />
        </div>
      </div>
      )}

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-2 opacity-90 sm:w-80">
            <TaskCard task={toCardData(activeTask)} onOpen={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
