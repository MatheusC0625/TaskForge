"use client";

import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDueDate, isOverdue } from "@/lib/date";
import type { Priority } from "@/generated/prisma/enums";

export type TaskCardData = {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string | null;
  tags: { id: string; name: string; color: string }[];
  subtaskTotal: number;
  subtaskDone: number;
};

export function TaskCard({ task, onOpen }: { task: TaskCardData; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
    >
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{task.title}</p>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
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

      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          {task.subtaskTotal > 0 && (
            <span>
              {task.subtaskDone}/{task.subtaskTotal}
            </span>
          )}
          {task.dueDate && (
            <span
              className={isOverdue(task.dueDate) ? "font-medium text-red-600 dark:text-red-400" : ""}
            >
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
