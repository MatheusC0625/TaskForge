"use client";

import { useId, useRef, useState, useTransition } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/priority";
import { createTask } from "@/lib/actions/tasks";

export function NewTaskForm({ columnId }: { columnId: string }) {
  const modalRef = useRef<ModalHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const titleId = useId();
  const priorityId = useId();
  const dueDateId = useId();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createTask(columnId, {}, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        modalRef.current?.close();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        className="rounded-lg px-2 py-1.5 text-left text-sm text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        + Adicionar tarefa
      </button>

      <Modal ref={modalRef} title="Nova tarefa">
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={titleId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Título
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              required
              maxLength={200}
              autoFocus
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={priorityId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Prioridade
              </label>
              <select
                id={priorityId}
                name="priority"
                defaultValue="MEDIUM"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-100 dark:focus:border-emerald-500"
              >
                {PRIORITY_ORDER.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={dueDateId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Prazo (opcional)
              </label>
              <input
                id={dueDateId}
                name="dueDate"
                type="date"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-100 dark:[color-scheme:dark] dark:focus:border-emerald-500"
              />
            </div>
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
              {isPending ? "Adicionando..." : "Adicionar tarefa"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
