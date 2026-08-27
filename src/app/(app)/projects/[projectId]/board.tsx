"use client";

import { useState } from "react";
import { ColumnItem } from "./column-item";
import { NewColumnForm } from "./new-column-form";
import { NewTaskForm } from "./new-task-form";
import { TaskCard } from "./task-card";
import { TaskPanel, type TaskDetail, type ProjectTag } from "./task-panel";

export type BoardColumn = {
  id: string;
  name: string;
  tasks: TaskDetail[];
};

export function Board({
  projectId,
  columns,
  projectTags,
}: {
  projectId: string;
  columns: BoardColumn[];
  projectTags: ProjectTag[];
}) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = columns
    .flatMap((column) => column.tasks)
    .find((task) => task.id === selectedTaskId);

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex w-80 shrink-0 flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3"
          >
            <ColumnItem
              column={column}
              taskCount={column.tasks.length}
              isFirst={index === 0}
              isLast={index === columns.length - 1}
            />

            <div className="flex flex-col gap-2">
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    id: task.id,
                    title: task.title,
                    priority: task.priority,
                    dueDate: task.dueDate,
                    tags: task.tags,
                    subtaskTotal: task.subtasks.length,
                    subtaskDone: task.subtasks.filter((subtask) => subtask.done).length,
                  }}
                  onOpen={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>

            <NewTaskForm columnId={column.id} />
          </div>
        ))}

        <div className="w-72 shrink-0">
          <NewColumnForm projectId={projectId} />
        </div>
      </div>

      {selectedTask && (
        <TaskPanel
          key={selectedTask.id}
          task={selectedTask}
          projectId={projectId}
          projectTags={projectTags}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
