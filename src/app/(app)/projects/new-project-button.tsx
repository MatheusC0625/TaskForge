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
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
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
