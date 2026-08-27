import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Board } from "./board";

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
      tags: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, color: true },
      },
      columns: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              priority: true,
              dueDate: true,
              tags: { select: { id: true, name: true, color: true } },
              subtasks: {
                orderBy: { order: "asc" },
                select: { id: true, title: true, done: true },
              },
            },
          },
        },
      },
    },
  });

  if (!project || project.ownerId !== session?.user.id) {
    notFound();
  }

  const columns = project.columns.map((column) => ({
    id: column.id,
    name: column.name,
    tasks: column.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      tags: task.tags,
      subtasks: task.subtasks,
    })),
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <Link href="/projects" className="text-sm text-neutral-500 hover:underline">
          ← Projetos
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-sm text-neutral-500">{project.description}</p>
        )}
      </div>

      <Board projectId={project.id} columns={columns} projectTags={project.tags} />
    </div>
  );
}
