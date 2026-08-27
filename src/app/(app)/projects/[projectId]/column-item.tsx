"use client";

import { useRef, useState, useTransition } from "react";
import type { ModalHandle } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteColumn, moveColumn, renameColumn } from "@/lib/actions/columns";

type ColumnItemProps = {
  column: { id: string; name: string };
  taskCount: number;
  isFirst: boolean;
  isLast: boolean;
};

export function ColumnItem({ column, taskCount, isFirst, isLast }: ColumnItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isRenaming, startRenameTransition] = useTransition();
  const [isMoving, startMoveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const deleteRef = useRef<ModalHandle>(null);

  const handleRename = (formData: FormData) => {
    setRenameError(null);
    startRenameTransition(async () => {
      const result = await renameColumn(column.id, {}, formData);
      if (result.error) {
        setRenameError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3">
      {isEditing ? (
        <form action={handleRename} className="flex flex-1 items-center gap-2">
          <input
            name="name"
            defaultValue={column.name}
            autoFocus
            maxLength={40}
            className="flex-1 rounded-md border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            disabled={isRenaming}
            className="rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setRenameError(null);
            }}
            className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <div>
            <span className="text-sm font-medium text-neutral-900">{column.name}</span>
            <span className="ml-2 text-xs text-neutral-400">{taskCount} tarefas</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isFirst || isMoving}
              onClick={() => startMoveTransition(() => moveColumn(column.id, "up"))}
              className="rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
              aria-label="Mover coluna para a esquerda"
            >
              ←
            </button>
            <button
              type="button"
              disabled={isLast || isMoving}
              onClick={() => startMoveTransition(() => moveColumn(column.id, "down"))}
              className="rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
              aria-label="Mover coluna para a direita"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Renomear
            </button>
            <button
              type="button"
              onClick={() => deleteRef.current?.open()}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Excluir
            </button>
          </div>
        </>
      )}

      {renameError && <p className="text-xs text-red-600">{renameError}</p>}

      <ConfirmDialog
        ref={deleteRef}
        title={`Excluir coluna "${column.name}"?`}
        description="Essa ação remove a coluna e todas as tarefas que estão dentro dela. Não pode ser desfeita."
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        isPending={isDeleting}
        onConfirm={() => startDeleteTransition(async () => { await deleteColumn(column.id); })}
      />
    </div>
  );
}
