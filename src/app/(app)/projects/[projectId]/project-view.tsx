"use client";

import { useMemo, useState } from "react";
import type { Priority } from "@/generated/prisma/enums";
import { Board, type BoardColumn } from "./board";
import { BoardFilters, type ViewMode } from "./board-filters";
import { TaskListView } from "./task-list-view";
import { TaskPanel, type TaskDetail, type ProjectTag } from "./task-panel";

export function ProjectView({
  projectId,
  columns,
  projectTags,
}: {
  projectId: string;
  columns: BoardColumn[];
  projectTags: ProjectTag[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((current) => {
      const next = new Set(current);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const filterPredicate = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (task: TaskDetail) => {
      if (query && !task.title.toLowerCase().includes(query)) return false;
      if (priority !== "ALL" && task.priority !== priority) return false;
      if (selectedTagIds.size > 0 && !task.tags.some((tag) => selectedTagIds.has(tag.id))) {
        return false;
      }
      return true;
    };
  }, [search, priority, selectedTagIds]);

  const selectedTask = columns
    .flatMap((column) => column.tasks)
    .find((task) => task.id === selectedTaskId);

  return (
    <div>
      <BoardFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
        projectTags={projectTags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
      />

      <div className="mt-4">
        {viewMode === "kanban" ? (
          <Board
            projectId={projectId}
            columns={columns}
            filterPredicate={filterPredicate}
            onSelectTask={setSelectedTaskId}
          />
        ) : (
          <TaskListView
            columns={columns}
            filterPredicate={filterPredicate}
            onSelectTask={setSelectedTaskId}
          />
        )}
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
