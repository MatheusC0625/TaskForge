"use client";

import { forwardRef, useId, useImperativeHandle, useRef, useState, useTransition } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal";
import type { ActionState } from "@/lib/actions/projects";

type ProjectFormDialogProps = {
  title: string;
  submitLabel: string;
  pendingLabel: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { name: string; description: string };
};

export const ProjectFormDialog = forwardRef<ModalHandle, ProjectFormDialogProps>(
  function ProjectFormDialog({ title, submitLabel, pendingLabel, action, defaultValues }, ref) {
    const modalRef = useRef<ModalHandle>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const nameId = useId();
    const descriptionId = useId();

    useImperativeHandle(ref, () => ({
      open: () => {
        setError(null);
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
            <label htmlFor={nameId} className="text-sm font-medium text-neutral-700">
              Nome
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              required
              maxLength={80}
              defaultValue={defaultValues?.name}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={descriptionId} className="text-sm font-medium text-neutral-700">
              Descrição (opcional)
            </label>
            <textarea
              id={descriptionId}
              name="description"
              rows={3}
              maxLength={500}
              defaultValue={defaultValues?.description}
              className="resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => modalRef.current?.close()}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {isPending ? pendingLabel : submitLabel}
            </button>
          </div>
        </form>
      </Modal>
    );
  },
);
