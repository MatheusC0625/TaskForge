"use client";

import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDueDate, isOverdue } from "@/lib/date";
import type { BoardColumn } from "./board";
import type { TaskDetail } from "./task-panel";

export function TaskListView({
  columns,
  filterPredicate,
  onSelectTask,
}: {
  columns: BoardColumn[];
  filterPredicate: (task: TaskDetail) => boolean;
  onSelectTask: (taskId: string) => void;
}) {
  const hasAnyTask = columns.some((column) => column.tasks.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {columns.map((column) => {
        const visibleTasks = column.tasks.filter(filterPredicate);
        if (visibleTasks.length === 0) return null;

        return (
          <div key={column.id}>
            <h3 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {column.name}{" "}
              <span className="text-neutral-400 dark:text-neutral-500">
                ({visibleTasks.length})
              </span>
            </h3>
            <div className="flex flex-col divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {visibleTasks.map((task) => {
                const doneCount = task.subtasks.filter((subtask) => subtask.done).length;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onSelectTask(task.id)}
                    className="flex flex-col items-start gap-2 px-4 py-3 text-left transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:hover:bg-neutral-800/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {task.title}
                      </p>
                      {task.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      {task.subtasks.length > 0 && (
                        <span>
                          {doneCount}/{task.subtasks.length}
                        </span>
                      )}
                      {task.dueDate && (
                        <span
                          className={
                            isOverdue(task.dueDate)
                              ? "font-medium text-red-600 dark:text-red-400"
                              : undefined
                          }
                        >
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {hasAnyTask && columns.every((column) => column.tasks.filter(filterPredicate).length === 0) && (
        <p className="py-10 text-center text-sm text-neutral-400 dark:text-neutral-500">
          Nenhuma tarefa corresponde aos filtros.
        </p>
      )}

      {!hasAnyTask && (
        <p className="py-10 text-center text-sm text-neutral-400 dark:text-neutral-500">
          Nenhuma tarefa neste projeto ainda.
        </p>
      )}
    </div>
  );
}
