"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        Algo deu errado.
      </p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        Ocorreu um erro ao carregar esta página. Tente novamente.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Tentar de novo
      </button>
    </div>
  );
}
