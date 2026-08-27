import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewProjectButton } from "./new-project-button";
import { ProjectCard } from "./project-card";

export default async function ProjectsPage() {
  const session = await auth();

  const projects = await prisma.project.findMany({
    where: { ownerId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: { select: { columns: true, tasks: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Projetos</h1>
          <p className="text-sm text-neutral-500">Seus quadros Kanban.</p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 py-20 text-center">
          <p className="text-neutral-900">Você ainda não tem projetos.</p>
          <p className="max-w-xs text-sm text-neutral-500">
            Crie o primeiro projeto para organizar suas tarefas em um quadro Kanban.
          </p>
          <div className="mt-2">
            <NewProjectButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                name: project.name,
                description: project.description,
                columnCount: project._count.columns,
                taskCount: project._count.tasks,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
