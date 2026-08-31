"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { ProjectSettingsPanel } from "../project-settings-panel";
import { renameProject } from "@/lib/actions/projects";

type ProjectHeaderProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    githubRepoUrl: string | null;
  };
  githubBadge?: ReactNode;
};

export function ProjectHeader({ project, githubBadge }: ProjectHeaderProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleNameBlur = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === project.name) {
      setName(project.name);
      setNameError(null);
      return;
    }
    startTransition(async () => {
      const result = await renameProject(project.id, trimmed);
      if (result?.error) {
        setNameError(result.error);
        setName(project.name);
      } else {
        setNameError(null);
      }
    });
  };

  return (
    <div>
      <Link href="/projects" className="text-sm text-neutral-500 hover:underline dark:text-neutral-400">
        ← Projetos
      </Link>

      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <span
            className="mt-2.5 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleNameBlur}
              maxLength={80}
              className="w-full max-w-md rounded-lg border border-transparent px-1 -ml-1 text-xl font-semibold text-neutral-900 outline-none focus:border-neutral-300 focus:bg-neutral-50 dark:text-neutral-100 dark:focus:border-neutral-700 dark:focus:bg-neutral-800"
            />
            {nameError && <p className="px-1 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
            {project.description && (
              <p className="mt-1 px-1 text-sm text-neutral-500 dark:text-neutral-400">
                {project.description}
              </p>
            )}
            {githubBadge && <div className="mt-2 px-1">{githubBadge}</div>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Editar projeto
        </button>
      </div>

      {isPanelOpen && (
        <ProjectSettingsPanel
          project={project}
          showNameField={false}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}
