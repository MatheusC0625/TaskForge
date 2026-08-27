import type { Priority } from "@/generated/prisma/enums";
import { PRIORITY_LABELS, PRIORITY_STYLES } from "@/lib/priority";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
