export type ProjectTemplate = {
  id: string;
  name: string;
  description: string;
  columns: string[];
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Board vazio",
    description: "Comece do zero e crie suas próprias colunas.",
    columns: [],
  },
  {
    id: "scrum",
    name: "Sprint Ágil (Scrum)",
    description: "Fluxo de sprint com revisão de PR e QA.",
    columns: ["Backlog", "Sprint Atual", "Em Revisão (PR)", "QA/Testes", "Concluído"],
  },
  {
    id: "bugs",
    name: "Kanban de Bugs",
    description: "Acompanhe bugs do reporte até a correção.",
    columns: ["Novo", "Confirmado", "Em Correção", "Em Teste", "Resolvido"],
  },
  {
    id: "pentest",
    name: "Pentest / Segurança",
    description: "Organize um teste de invasão por etapas.",
    columns: ["Reconhecimento", "Exploração", "Pós-Exploração", "Relatório"],
  },
  {
    id: "certification",
    name: "Preparação para Certificação",
    description: "Estude para uma prova de TI com constância.",
    columns: ["Estudar", "Praticar (labs)", "Revisar", "Pronto para a prova"],
  },
];

export function getProjectTemplate(templateId: string | null | undefined) {
  return PROJECT_TEMPLATES.find((template) => template.id === templateId) ?? null;
}
