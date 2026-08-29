"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export type ModalHandle = {
  open: () => void;
  close: () => void;
};

type ModalProps = {
  title: string;
  children: React.ReactNode;
};

export const Modal = forwardRef<ModalHandle, ModalProps>(function Modal(
  { title, children },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-xl border border-neutral-200 bg-white p-0 shadow-xl backdrop:bg-black/40 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
});
