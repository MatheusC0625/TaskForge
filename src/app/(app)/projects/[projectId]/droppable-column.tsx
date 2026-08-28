"use client";

import { useDroppable } from "@dnd-kit/core";

export function DroppableColumn({
  columnId,
  children,
}: {
  columnId: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { type: "column" },
  });

  return (
    <div ref={setNodeRef} className="flex min-h-[2rem] flex-col gap-2">
      {children}
    </div>
  );
}
