"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

export function SortableColumn({
  columnId,
  children,
}: {
  columnId: string;
  children: (drag: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
  }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `column:${columnId}`,
    data: { type: "column-sort", columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 sm:w-80 dark:border-neutral-800 dark:bg-[#161b22]/40"
    >
      {children({ attributes, listeners })}
    </div>
  );
}
