"use client";

import { PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/priority";
import type { Priority } from "@/generated/prisma/enums";
import type { ProjectTag } from "./task-panel";

export type ViewMode = "kanban" | "lista";

export function BoardFilters({
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  projectTags,
  selectedTagIds,
  onToggleTag,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  search: string;
  onSearchChange: (value: string) => void;
  priority: Priority | "ALL";
  onPriorityChange: (value: Priority | "ALL") => void;
  projectTags: ProjectTag[];
  selectedTagIds: Set<string>;
  onToggleTag: (tagId: string) => void;
}) {
  const hasActiveFilters = search !== "" || priority !== "ALL" || selectedTagIds.size > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar tarefas..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-600 sm:w-56 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500"
          />

          <select
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value as Priority | "ALL")}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500"
          >
            <option value="ALL">Todas as prioridades</option>
            {PRIORITY_ORDER.map((option) => (
              <option key={option} value={option}>
                {PRIORITY_LABELS[option]}
              </option>
            ))}
          </select>

          {projectTags.map((tag) => {
            const isSelected = selectedTagIds.has(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag(tag.id)}
                className="rounded-full px-2.5 py-1 text-xs font-medium transition"
                style={
                  isSelected
                    ? { backgroundColor: tag.color, color: "white" }
                    : { border: `1px solid ${tag.color}`, color: tag.color }
                }
              >
                {tag.name}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onPriorityChange("ALL");
                projectTags.forEach((tag) => {
                  if (selectedTagIds.has(tag.id)) onToggleTag(tag.id);
                });
              }}
              className="text-xs font-medium text-neutral-500 hover:underline dark:text-neutral-400"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="flex rounded-lg border border-neutral-300 p-0.5 text-sm dark:border-neutral-700">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "kanban"
                ? "bg-emerald-600 text-white dark:bg-emerald-500"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Kanban
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("lista")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "lista"
                ? "bg-emerald-600 text-white dark:bg-emerald-500"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Lista
          </button>
        </div>
      </div>
    </div>
  );
}
