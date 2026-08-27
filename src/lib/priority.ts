import type { Priority } from "@/generated/prisma/enums";

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: "bg-neutral-100 text-neutral-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};

export const PRIORITY_ORDER = ["LOW", "MEDIUM", "HIGH"] as const satisfies readonly Priority[];
