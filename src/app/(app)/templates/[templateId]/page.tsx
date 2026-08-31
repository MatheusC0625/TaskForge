import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectTemplate } from "@/lib/templates";
import { TemplatePreview } from "@/components/template-preview";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getProjectTemplate(templateId);
  if (!template) notFound();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <Link href="/templates" className="text-sm text-neutral-500 hover:underline dark:text-neutral-400">
          ← Templates
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {template.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{template.description}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        <TemplatePreview template={template} />
      </div>

      <Link
        href={`/projects?template=${template.id}`}
        className="self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        Usar este template no projeto
      </Link>
    </div>
  );
}
