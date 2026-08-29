import type { Priority } from "@/generated/prisma/enums";

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export const PRIORITY_ORDER = ["LOW", "MEDIUM", "HIGH"] as const satisfies readonly Priority[];
