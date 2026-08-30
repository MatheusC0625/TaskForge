"use client";

import { useRef } from "react";
import type { ModalHandle } from "@/components/ui/modal";
import { ProjectFormDialog } from "./project-form-dialog";
import { createProject } from "@/lib/actions/projects";

export function NewProjectButton() {
  const modalRef = useRef<ModalHandle>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        + Novo projeto
      </button>
      <ProjectFormDialog
        ref={modalRef}
        title="Novo projeto"
        submitLabel="Criar projeto"
        pendingLabel="Criando..."
        action={createProject}
      />
    </>
  );
}
