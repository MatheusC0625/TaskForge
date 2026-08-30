"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import type { ModalHandle } from "@/components/ui/modal";
import { ProjectFormDialog } from "../project-form-dialog";
import { updateProject } from "@/lib/actions/projects";

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
  const editRef = useRef<ModalHandle>(null);
  const boundUpdate = updateProject.bind(null, project.id);

  return (
    <div>
      <Link href="/projects" className="text-sm text-neutral-500 hover:underline dark:text-neutral-400">
        ← Projetos
      </Link>

      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {project.description}
              </p>
            )}
            {githubBadge && <div className="mt-2">{githubBadge}</div>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => editRef.current?.open()}
          className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Editar projeto
        </button>
      </div>

      <ProjectFormDialog
        ref={editRef}
        title="Editar projeto"
        submitLabel="Salvar"
        pendingLabel="Salvando..."
        action={boundUpdate}
        defaultValues={{
          name: project.name,
          description: project.description ?? "",
          color: project.color,
          githubRepoUrl: project.githubRepoUrl ?? "",
        }}
      />
    </div>
  );
}
