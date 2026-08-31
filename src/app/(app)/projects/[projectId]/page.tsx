import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GithubRepoBadge } from "@/components/github-repo-badge";
import { ProjectHeader } from "./project-header";
import { ProjectView } from "./project-view";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { plan: true },
  });
  const isPro = user?.plan === "PRO";

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      ownerId: true,
      repos: { select: { id: true, url: true }, orderBy: { createdAt: "asc" } },
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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <ProjectHeader
        project={{
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
          repos: project.repos,
        }}
        githubBadges={project.repos.map((repo) => (
          <GithubRepoBadge key={repo.id} repoUrl={repo.url} />
        ))}
        isPro={isPro}
      />

      <ProjectView projectId={project.id} columns={columns} projectTags={project.tags} />
    </div>
  );
}
