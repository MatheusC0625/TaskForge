import Link from "next/link";
import { Inbox, CalendarClock } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDueDate, isOverdue } from "@/lib/date";
import { PRIORITY_ORDER } from "@/lib/priority";
import type { Priority } from "@/generated/prisma/enums";
import { StatCard } from "./stat-card";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      name: true,
      columns: {
        orderBy: { order: "desc" },
        take: 1,
        select: { id: true },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
          columnId: true,
        },
      },
    },
  });

  const allTasks = projects.flatMap((project) => {
    const lastColumnId = project.columns[0]?.id;
    return project.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      projectId: project.id,
      projectName: project.name,
      isDone: task.columnId === lastColumnId,
    }));
  });

  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((task) => task.isDone).length;
  const pendingTasks = allTasks.filter((task) => !task.isDone);
  const overdueCount = pendingTasks.filter(
    (task) => task.dueDate && isOverdue(task.dueDate),
  ).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const upcomingTasks = pendingTasks
    .filter((task) => task.dueDate)
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
    .slice(0, 6);

  const priorityCounts: { priority: Priority; count: number }[] = PRIORITY_ORDER.map(
    (priority) => ({
      priority,
      count: pendingTasks.filter((task) => task.priority === priority).length,
    }),
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Olá, {session?.user?.name}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aqui está um resumo das suas tarefas.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Você ainda não tem projetos."
          description="Crie o primeiro projeto para começar a organizar suas tarefas."
          action={
            <Link
              href="/projects"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Ir para Projetos
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Projetos" value={projects.length} icon="projects" index={0} />
            <StatCard label="Tarefas" value={totalTasks} icon="tasks" index={1} />
            <StatCard
              label="Concluídas"
              value={`${completionRate}%`}
              hint={`${doneTasks} de ${totalTasks}`}
              icon="done"
              index={2}
            />
            <StatCard
              label="Atrasadas"
              value={overdueCount}
              icon="overdue"
              tone="danger"
              index={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section>
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <CalendarClock className="h-4 w-4" strokeWidth={1.75} />
                Próximos prazos
              </h2>
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-neutral-400 dark:text-neutral-500">
                  Nenhuma tarefa pendente com prazo.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {upcomingTasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/projects/${task.projectId}`}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 text-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                      >
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {task.title}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {task.projectName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={task.priority} />
                          <span
                            className={
                              isOverdue(task.dueDate!)
                                ? "text-xs font-medium text-red-600 dark:text-red-400"
                                : "text-xs text-neutral-500 dark:text-neutral-400"
                            }
                          >
                            {formatDueDate(task.dueDate!)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tarefas pendentes por prioridade
              </h2>
              <div className="flex flex-col gap-3">
                {priorityCounts.map(({ priority, count }) => (
                  <div key={priority} className="flex items-center gap-3">
                    <div className="w-16">
                      <PriorityBadge priority={priority} />
                    </div>
                    <Progress
                      value={pendingTasks.length === 0 ? 0 : (count / pendingTasks.length) * 100}
                      className="flex-1"
                    />
                    <span className="w-6 text-right text-xs text-neutral-500 dark:text-neutral-400">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
