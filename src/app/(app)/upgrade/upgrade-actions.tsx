"use client";

import { useTransition } from "react";
import { upgradeToPro, downgradeToFree } from "@/lib/actions/billing";

export function UpgradeActions({ isPro }: { isPro: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (isPro) {
    return (
      <div className="flex flex-col gap-2">
        <span className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white dark:bg-emerald-500">
          Seu plano atual
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => downgradeToFree())}
          className="text-center text-xs text-neutral-400 underline hover:text-neutral-600 disabled:opacity-60 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          Voltar para o plano Free
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => upgradeToPro())}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
    >
      {isPending ? "Assinando..." : "Assinar plano Pro"}
    </button>
  );
}
