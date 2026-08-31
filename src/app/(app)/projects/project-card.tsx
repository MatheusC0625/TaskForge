"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ProjectSettingsPanel } from "./project-settings-panel";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    repos: { id: string; url: string }[];
    columnCount: number;
    taskCount: number;
  };
  githubBadges?: ReactNode[];
  isPro?: boolean;
};

export function ProjectCard({ project, githubBadges, isPro = false }: ProjectCardProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div
      className="flex flex-col justify-between gap-3 rounded-xl border border-neutral-200 border-t-4 p-5 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
      style={{ borderTopColor: project.color }}
    >
      <div>
        <Link href={`/projects/${project.id}`} className="block">
          <h3 className="font-semibold text-neutral-900 hover:underline dark:text-neutral-100">
            {project.name}
          </h3>
        </Link>
        {project.description && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {project.description}
          </p>
        )}
        {githubBadges && githubBadges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">{githubBadges}</div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {project.columnCount} colunas · {project.taskCount} tarefas
        </span>
        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          Editar
        </button>
      </div>

      {isPanelOpen && (
        <ProjectSettingsPanel project={project} isPro={isPro} onClose={() => setIsPanelOpen(false)} />
      )}
    </div>
  );
}
