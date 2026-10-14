"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Columns3, ListTodo, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProjectSettingsPanel } from "./project-settings-panel";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    repos: { id: string; url: string }[];
    columnCount: number;
    taskCount: number;
  };
  githubBadges?: ReactNode[];
  isPro?: boolean;
  index?: number;
};

export function ProjectCard({ project, githubBadges, isPro = false, index = 0 }: ProjectCardProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <Card
        className="flex h-full flex-col justify-between gap-3 border-t-4 p-5 transition-shadow hover:shadow-md dark:hover:shadow-black/20"
        style={{ borderTopColor: project.color }}
      >
        <div>
          <Link href={`/projects/${project.id}`} className="block">
            <h3 className="font-semibold text-neutral-900 hover:underline dark:text-neutral-100">
              {project.name}
            </h3>
          </Link>
          {project.description && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
              {project.description}
            </p>
          )}
          {githubBadges && githubBadges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">{githubBadges}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1">
              <Columns3 className="h-3.5 w-3.5" strokeWidth={1.75} />
              {project.columnCount}
            </span>
            <span className="flex items-center gap-1">
              <ListTodo className="h-3.5 w-3.5" strokeWidth={1.75} />
              {project.taskCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPanelOpen(true)}
            aria-label="Editar projeto"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <Settings2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Editar
          </button>
        </div>
      </Card>

      {isPanelOpen && (
        <ProjectSettingsPanel project={project} isPro={isPro} onClose={() => setIsPanelOpen(false)} />
      )}
    </motion.div>
  );
}
