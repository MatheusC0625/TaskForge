import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <p className="text-neutral-900 dark:text-neutral-100">{title}</p>
      <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
