import { PROJECT_TEMPLATES } from "@/lib/templates";
import { TemplateCard } from "./template-card";

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
        {PROJECT_TEMPLATES.map((template, index) => (
          <TemplateCard key={template.id} template={template} index={index} />
        ))}
      </div>
    </div>
  );
}
