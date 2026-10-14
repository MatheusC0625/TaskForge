"use client";

import { FolderKanban, ListTodo, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const ICONS = {
  projects: FolderKanban,
  tasks: ListTodo,
  done: CheckCircle2,
  overdue: AlertTriangle,
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  index = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: keyof typeof ICONS;
  tone?: "default" | "danger";
  index?: number;
}) {
  const Icon = ICONS[icon];
  const isDanger = tone === "danger" && Number(value) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold",
              isDanger ? "text-red-600 dark:text-red-400" : "text-neutral-900 dark:text-neutral-100",
            )}
          >
            {value}
          </p>
          {hint && <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            isDanger
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </Card>
    </motion.div>
  );
}
