"use client";

import { useActionState, useEffect, useRef } from "react";
import { createColumn } from "@/lib/actions/columns";
import type { ActionState } from "@/lib/actions/projects";

const initialState: ActionState = {};

export function NewColumnForm({ projectId }: { projectId: string }) {
  const boundCreate = createColumn.bind(null, projectId);
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

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input
        name="name"
        placeholder="Nova coluna"
        required
        maxLength={40}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400 dark:focus:ring-neutral-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {isPending ? "Adicionando..." : "Adicionar coluna"}
      </button>
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
    </form>
  );
}
