"use client";

import { forwardRef, useId, useImperativeHandle, useRef, useState, useTransition } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal";
import { PROJECT_TEMPLATES, getProjectTemplate } from "@/lib/templates";
import type { ActionState } from "@/lib/actions/projects";

const PROJECT_COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#06b6d4",
  "#ec4899",
];

type ProjectFormDialogProps = {
  title: string;
  submitLabel: string;
  pendingLabel: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialTemplateId?: string;
};

export const ProjectFormDialog = forwardRef<ModalHandle, ProjectFormDialogProps>(
  function ProjectFormDialog({ title, submitLabel, pendingLabel, action, initialTemplateId }, ref) {
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState<string | null>(null);
    const [color, setColor] = useState(PROJECT_COLORS[0]);
    const [templateId, setTemplateId] = useState(
      getProjectTemplate(initialTemplateId)?.id ?? PROJECT_TEMPLATES[0].id,
    );
    const [isPending, startTransition] = useTransition();
    const nameId = useId();
    const descriptionId = useId();
    const githubId = useId();

    useImperativeHandle(ref, () => ({
      open: () => {
        setError(null);
        setTemplateId(getProjectTemplate(initialTemplateId)?.id ?? PROJECT_TEMPLATES[0].id);
        modalRef.current?.open();
      },
      close: () => modalRef.current?.close(),
    }));

    const handleSubmit = (formData: FormData) => {
      setError(null);
      startTransition(async () => {
        const result = await action({}, formData);
        if (result?.error) {
          setError(result.error);
        } else {
          modalRef.current?.close();
        }
      });
    };

    return (
      <Modal ref={modalRef} title={title}>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Modelo</span>
            <div className="flex flex-col gap-1.5">
              {PROJECT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setTemplateId(template.id)}
                  aria-pressed={templateId === template.id}
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    templateId === template.id
                      ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                  }`}
                >
                  <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {template.name}
                  </span>
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    {template.description}
                  </span>
                </button>
              ))}
            </div>
            <input type="hidden" name="templateId" value={templateId} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={nameId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Nome
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              required
              maxLength={80}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={descriptionId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Descrição (opcional)
            </label>
            <textarea
              id={descriptionId}
              name="description"
              rows={3}
              maxLength={500}
              className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cor do projeto</span>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setColor(option)}
                  aria-label={`Cor ${option}`}
                  aria-pressed={color === option}
                  className={`h-7 w-7 rounded-full transition ${
                    color === option
                      ? "ring-2 ring-offset-2 ring-neutral-900 dark:ring-offset-neutral-900 dark:ring-neutral-100"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: option }}
                />
              ))}
            </div>
            <input type="hidden" name="color" value={color} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={githubId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Repositório do GitHub (opcional)
            </label>
            <input
              id={githubId}
              name="githubRepoUrl"
              type="url"
              placeholder="https://github.com/usuario/repositorio"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Vincule um repositório público para exibir um selo com nome, linguagem e estrelas no projeto.
            </p>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => modalRef.current?.close()}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {isPending ? pendingLabel : submitLabel}
            </button>
          </div>
        </form>
      </Modal>
    );
  },
);
