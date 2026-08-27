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
    <form ref={formRef} action={formAction} className="flex items-center gap-2">
      <input
        name="name"
        placeholder="Nova coluna"
        required
        maxLength={40}
        className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60"
      >
        {isPending ? "Adicionando..." : "Adicionar coluna"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
