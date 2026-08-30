"use client";

import { useEffect } from "react";

export default function RootError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        Algo deu errado.
      </p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        Tentar de novo
      </button>
    </div>
  );
}
