export type ProjectTemplateColumn = {
  name: string;
  sampleTasks: string[];
};

export type ProjectTemplate = {
  id: string;
  name: string;
  description: string;
  columns: ProjectTemplateColumn[];
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
    columns: [
      { name: "Backlog", sampleTasks: ["Definir escopo da sprint", "Revisar backlog técnico"] },
      { name: "Sprint Atual", sampleTasks: ["Implementar tela de login"] },
      { name: "Em Revisão (PR)", sampleTasks: ["Ajustar validação de formulário"] },
      { name: "QA/Testes", sampleTasks: ["Testar fluxo de checkout"] },
      { name: "Concluído", sampleTasks: ["Configurar CI/CD"] },
    ],
  },
  {
    id: "bugs",
    name: "Kanban de Bugs",
    description: "Acompanhe bugs do reporte até a correção.",
    columns: [
      { name: "Novo", sampleTasks: ["Erro 500 ao salvar perfil"] },
      { name: "Confirmado", sampleTasks: ["Botão não responde no Safari"] },
      { name: "Em Correção", sampleTasks: ["Vazamento de memória no worker"] },
      { name: "Em Teste", sampleTasks: ["Corrigir race condition no cache"] },
      { name: "Resolvido", sampleTasks: ["Loop infinito no parser corrigido"] },
    ],
  },
  {
    id: "pentest",
    name: "Pentest / Segurança",
    description: "Organize um teste de invasão por etapas.",
    columns: [
      { name: "Reconhecimento", sampleTasks: ["Mapear subdomínios", "Levantar tecnologias usadas"] },
      { name: "Exploração", sampleTasks: ["Testar injeção SQL no login"] },
      { name: "Pós-Exploração", sampleTasks: ["Verificar escalonamento de privilégios"] },
      { name: "Relatório", sampleTasks: ["Documentar vulnerabilidades encontradas"] },
    ],
  },
  {
    id: "certification",
    name: "Preparação para Certificação",
    description: "Estude para uma prova de TI com constância.",
    columns: [
      { name: "Estudar", sampleTasks: ["Ler sobre redes e protocolos"] },
      { name: "Praticar (labs)", sampleTasks: ["Montar lab de firewall"] },
      { name: "Revisar", sampleTasks: ["Refazer simulado geral"] },
      { name: "Pronto para a prova", sampleTasks: ["Agendar exame"] },
    ],
  },
];

export function getProjectTemplate(templateId: string | null | undefined) {
  return PROJECT_TEMPLATES.find((template) => template.id === templateId) ?? null;
}
