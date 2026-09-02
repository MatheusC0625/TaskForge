import type { ProjectTemplate } from "@/lib/templates";

export function TemplatePreview({
  template,
  compact = false,
}: {
  template: ProjectTemplate;
  compact?: boolean;
}) {
  if (template.columns.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
        Sem colunas prontas — você cria do zero
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {template.columns.map((column) => (
        <div
          key={column.name}
          className="flex w-28 shrink-0 flex-col gap-1.5 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800"
        >
          <span className="truncate text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
            {column.name}
          </span>
          {column.sampleTasks.slice(0, compact ? 1 : 2).map((task) => (
            <div
              key={task}
              className="rounded-md border border-neutral-200 bg-[#f6f8fa] px-1.5 py-1 text-[10px] leading-tight text-neutral-500 shadow-sm dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-400"
            >
              {task}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
