import { FolderKanban } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GithubRepoBadge } from "@/components/github-repo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { NewProjectButton } from "./new-project-button";
import { ProjectCard } from "./project-card";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { plan: true },
  });
  const isPro = user?.plan === "PRO";

  const projects = await prisma.project.findMany({
    where: { ownerId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      repos: { select: { id: true, url: true }, orderBy: { createdAt: "asc" } },
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
        <NewProjectButton initialTemplateId={template} isPro={isPro} />
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Você ainda não tem projetos."
          description="Crie o primeiro projeto para organizar suas tarefas em um quadro Kanban."
          action={<NewProjectButton isPro={isPro} />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                name: project.name,
                description: project.description,
                color: project.color,
                repos: project.repos,
                columnCount: project._count.columns,
                taskCount: project._count.tasks,
              }}
              githubBadges={project.repos.map((repo) => (
                <GithubRepoBadge key={repo.id} repoUrl={repo.url} />
              ))}
              isPro={isPro}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
