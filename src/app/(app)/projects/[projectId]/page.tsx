import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ColumnItem } from "./column-item";
import { NewColumnForm } from "./new-column-form";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      columns: {
        orderBy: { order: "asc" },
        select: { id: true, name: true, _count: { select: { tasks: true } } },
      },
    },
  });

  if (!project || project.ownerId !== session?.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Link href="/projects" className="text-sm text-neutral-500 hover:underline">
          ← Projetos
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-sm text-neutral-500">{project.description}</p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-neutral-700">
          Colunas ({project.columns.length})
        </h2>

        {project.columns.length === 0 ? (
          <p className="mb-3 text-sm text-neutral-500">
            Nenhuma coluna ainda. Crie uma abaixo.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {project.columns.map((column, index) => (
              <ColumnItem
                key={column.id}
                column={column}
                taskCount={column._count.tasks}
                isFirst={index === 0}
                isLast={index === project.columns.length - 1}
              />
            ))}
          </div>
        )}

        <div className="mt-4">
          <NewColumnForm projectId={project.id} />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        O quadro Kanban com as tarefas será construído nas próximas fases.
      </div>
    </div>
  );
}
