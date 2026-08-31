import Link from "next/link";
import { PROJECT_TEMPLATES } from "@/lib/templates";
import { TemplatePreview } from "@/components/template-preview";

export default function TemplatesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Templates</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Comece um projeto já com colunas prontas para o seu fluxo de trabalho.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROJECT_TEMPLATES.map((template) => (
          <Link
            key={template.id}
            href={`/templates/${template.id}`}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
          >
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{template.name}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{template.description}</p>
            </div>
            <div className="overflow-x-auto">
              <TemplatePreview template={template} compact />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
