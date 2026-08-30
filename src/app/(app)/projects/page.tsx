import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GithubRepoBadge } from "@/components/github-repo-badge";
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
      color: true,
      githubRepoUrl: true,
      _count: { select: { columns: true, tasks: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Projetos
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Seus quadros Kanban.</p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-700">
          <p className="text-neutral-900 dark:text-neutral-100">Você ainda não tem projetos.</p>
          <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
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
                color: project.color,
                githubRepoUrl: project.githubRepoUrl,
                columnCount: project._count.columns,
                taskCount: project._count.tasks,
              }}
              githubBadge={
                project.githubRepoUrl ? <GithubRepoBadge repoUrl={project.githubRepoUrl} /> : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
