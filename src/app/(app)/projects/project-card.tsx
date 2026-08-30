"use client";

import { useRef, useTransition, type ReactNode } from "react";
import Link from "next/link";
import type { ModalHandle } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProjectFormDialog } from "./project-form-dialog";
import { deleteProject, updateProject } from "@/lib/actions/projects";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    githubRepoUrl: string | null;
    columnCount: number;
    taskCount: number;
  };
  githubBadge?: ReactNode;
};

export function ProjectCard({ project, githubBadge }: ProjectCardProps) {
  const editRef = useRef<ModalHandle>(null);
  const deleteRef = useRef<ModalHandle>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const boundUpdate = updateProject.bind(null, project.id);

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
        {githubBadge && <div className="mt-2">{githubBadge}</div>}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {project.columnCount} colunas · {project.taskCount} tarefas
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editRef.current?.open()}
            className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => deleteRef.current?.open()}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Excluir
          </button>
        </div>
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

      <ConfirmDialog
        ref={deleteRef}
        title={`Excluir "${project.name}"?`}
        description="Essa ação remove o projeto e todas as colunas e tarefas dentro dele. Não pode ser desfeita."
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        isPending={isDeleting}
        onConfirm={() => startDeleteTransition(async () => { await deleteProject(project.id); })}
      />
    </div>
  );
}
