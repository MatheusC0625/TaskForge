"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePreview } from "@/components/template-preview";
import type { ProjectTemplate } from "@/lib/templates";

export function TemplateCard({ template, index }: { template: ProjectTemplate; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/templates/${template.id}`} className="block">
        <Card className="flex flex-col gap-3 p-4 transition-shadow hover:shadow-md dark:hover:shadow-black/20">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {template.name}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {template.description}
              </p>
            </div>
            {template.pro && <Badge className="shrink-0">Pro</Badge>}
          </div>
          <div className="overflow-x-auto">
            <TemplatePreview template={template} compact />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
