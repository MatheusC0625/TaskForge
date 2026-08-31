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
  const [name, setName] = useState(column.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, startRenameTransition] = useTransition();
  const [isMoving, startMoveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const deleteRef = useRef<ModalHandle>(null);

  const handleNameBlur = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === column.name) {
      setName(column.name);
      setRenameError(null);
      return;
    }
    const formData = new FormData();
    formData.set("name", trimmed);
    startRenameTransition(async () => {
      const result = await renameColumn(column.id, {}, formData);
      if (result.error) {
        setRenameError(result.error);
        setName(column.name);
      } else {
        setRenameError(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            maxLength={40}
            className="-ml-1 min-w-0 flex-1 rounded-md border border-transparent px-1 text-sm font-medium text-neutral-900 outline-none focus:border-neutral-300 focus:bg-white dark:text-neutral-100 dark:focus:border-neutral-700 dark:focus:bg-neutral-800"
          />
          <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">{taskCount}</span>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Opções da coluna"
            className="rounded-md px-1.5 py-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            ⋯
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  type="button"
                  disabled={isFirst || isMoving}
                  onClick={() => {
                    setIsMenuOpen(false);
                    startMoveTransition(() => moveColumn(column.id, "up"));
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  ← Mover para a esquerda
                </button>
                <button
                  type="button"
                  disabled={isLast || isMoving}
                  onClick={() => {
                    setIsMenuOpen(false);
                    startMoveTransition(() => moveColumn(column.id, "down"));
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  → Mover para a direita
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    deleteRef.current?.open();
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Excluir coluna
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {renameError && <p className="text-xs text-red-600 dark:text-red-400">{renameError}</p>}

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
