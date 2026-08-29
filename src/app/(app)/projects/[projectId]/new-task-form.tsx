"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createTask } from "@/lib/actions/tasks";
import type { ActionState } from "@/lib/actions/projects";

const initialState: ActionState = {};

export function NewTaskForm({ columnId }: { columnId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const boundCreate = createTask.bind(null, columnId);
  const [state, formAction, isPending] = useActionState(boundCreate, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="rounded-lg px-2 py-1.5 text-left text-sm text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        + Adicionar tarefa
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input
        name="title"
        placeholder="Título da tarefa"
        required
        maxLength={200}
        autoFocus
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400 dark:focus:ring-neutral-400"
      />
      {state.error && <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {isPending ? "Adicionando..." : "Adicionar"}
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
