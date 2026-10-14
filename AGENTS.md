# TaskForge — guia para agentes de IA

Gerenciador de tarefas estilo Kanban (Next.js App Router + TypeScript). Projeto de
portfólio construído inteiramente com assistentes de IA — veja a seção "Sobre este
projeto" no `README.md`.

## Stack e comandos

- Next.js (App Router, Server Actions) + TypeScript, Tailwind CSS v4, Prisma + PostgreSQL, Auth.js v5.
- `npm run lint` / `npm run typecheck` / `npm run test` (Vitest) / `npm run test:e2e` (Playwright) — rode antes de considerar qualquer mudança pronta.
- `npx prisma migrate dev --name <nome>` para criar uma migration; `npx prisma generate` depois de qualquer mudança em `prisma/schema.prisma`.

## Convenções do projeto

- **A coluna é o status da tarefa** — não existe campo `status` separado; a posição da
  tarefa no Kanban é a única fonte da verdade (inclusive para o cálculo de "concluída"
  no dashboard).
- **Toda mutação é uma Server Action em `src/lib/actions/`**, não uma rota de API
  separada — e toda Server Action verifica a posse (*ownership*) do recurso antes de
  ler ou escrever (ver `assertProjectOwner` e equivalentes). Nunca pule essa checagem
  numa Server Action nova.
- **Validação de input sempre via Zod** (`src/lib/validations/`) antes de montar
  qualquer `data:` do Prisma — nunca repasse o input do usuário direto pro Prisma.
- Sem campo novo em um formulário sem o campo correspondente no schema Zod.
- Siga os padrões já documentados em `SECURITY.md` ao mexer em autenticação, rate
  limiting ou qualquer rota pública.

## O que não fazer

- Não adicionar uma rota de API REST pra algo que pode ser uma Server Action.
- Não introduzir um serviço externo como dependência obrigatória — Upstash, Resend e
  Sentry são todos opcionais (o app funciona sem eles configurados); mantenha esse
  padrão em features novas.
- Não editar `src/generated/prisma/` — é gerado; rode `npx prisma generate` em vez
  disso.
