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
import { SortableContext, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ColumnItem } from "./column-item";
import { SortableColumn } from "./sortable-column";
import { NewColumnForm } from "./new-column-form";
import { NewTaskForm } from "./new-task-form";
import { TaskCard } from "./task-card";
import { SortableTaskCard } from "./sortable-task-card";
import { DroppableColumn } from "./droppable-column";
import type { TaskDetail } from "./task-panel";
import { moveTask } from "@/lib/actions/tasks";
import { reorderColumns } from "@/lib/actions/columns";

export type BoardColumn = {
  id: string;
  name: string;
  tasks: TaskDetail[];
};

type BoardAction =
  | { type: "moveTask"; taskId: string; toColumnId: string; toIndex: number }
  | { type: "reorderColumns"; orderedIds: string[] };

function boardReducer(state: BoardColumn[], action: BoardAction): BoardColumn[] {
  if (action.type === "reorderColumns") {
    const byId = new Map(state.map((column) => [column.id, column]));
    return action.orderedIds.map((id) => byId.get(id)).filter((c): c is BoardColumn => !!c);
  }

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
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [optimisticColumns, dispatchOptimistic] = useOptimistic(columns, boardReducer);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current as { type?: string; columnId?: string } | undefined;
    if (activeData?.type === "column-sort") {
      setActiveColumnId(activeData.columnId ?? null);
      setActiveTask(null);
      return;
    }
    setActiveColumnId(null);
    const task = optimisticColumns
      .flatMap((column) => column.tasks)
      .find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current as { type?: string; columnId?: string } | undefined;
    setActiveTask(null);
    setActiveColumnId(null);
    if (!over) return;

    if (activeData?.type === "column-sort") {
      const overData = over.data.current as { type?: string; columnId?: string } | undefined;
      const fromId = activeData.columnId;
      const toId =
        overData?.type === "column-sort" || overData?.type === "task"
          ? overData.columnId
          : overData?.type === "column"
            ? (over.id as string)
            : undefined;
      if (!fromId || !toId || fromId === toId) return;

      const currentIds = optimisticColumns.map((column) => column.id);
      const fromIndex = currentIds.indexOf(fromId);
      const toIndex = currentIds.indexOf(toId);
      if (fromIndex === -1 || toIndex === -1) return;

      const orderedIds = arrayMove(currentIds, fromIndex, toIndex);

      startTransition(async () => {
        dispatchOptimistic({ type: "reorderColumns", orderedIds });
        await reorderColumns(projectId, orderedIds);
      });
      return;
    }

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
      dispatchOptimistic({ type: "moveTask", taskId, toColumnId, toIndex });
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
        <SortableContext
          items={optimisticColumns.map((column) => `column:${column.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {optimisticColumns.map((column) => {
            const visibleTasks = column.tasks.filter(filterPredicate);
            return (
              <SortableColumn key={column.id} columnId={column.id}>
                {(dragHandle) => (
                  <>
                    <ColumnItem
                      column={column}
                      taskCount={column.tasks.length}
                      dragHandle={dragHandle}
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
                  </>
                )}
              </SortableColumn>
            );
          })}
        </SortableContext>

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
        ) : activeColumnId ? (
          <div className="w-72 rotate-1 rounded-xl border border-neutral-200 bg-[#f6f8fa] p-3 opacity-90 shadow-lg sm:w-80 dark:border-neutral-800 dark:bg-[#161b22]">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {optimisticColumns.find((column) => column.id === activeColumnId)?.name}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
