"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export const ConfirmDialog = forwardRef<ModalHandle, ConfirmDialogProps>(function ConfirmDialog(
  { title, description, confirmLabel, isPending, onConfirm },
  ref,
) {
  const modalRef = useRef<ModalHandle>(null);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.open(),
    close: () => modalRef.current?.close(),
  }));

  return (
    <Modal ref={modalRef} title={title}>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => modalRef.current?.close()}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
});
