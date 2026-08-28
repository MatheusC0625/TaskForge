# TaskForge

Gerenciador de tarefas estilo Kanban — projeto full stack em desenvolvimento.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io)
- [Auth.js (NextAuth)](https://authjs.dev)

## Rodando localmente

1. Suba o banco de dados com Docker:

   ```bash
   docker compose up -d
   ```

2. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   Gere um valor para `AUTH_SECRET` e substitua no `.env`:

   ```bash
   openssl rand -base64 32
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Gere o Prisma Client e aplique as migrations no banco:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Abra [http://localhost:3000](http://localhost:3000).

> Este README ainda está em construção — a documentação completa do projeto será finalizada ao final do desenvolvimento.

## Sobre este projeto

Este projeto foi construído, em grande parte, com o auxílio do **Claude** (Anthropic). Usei o desenvolvimento do TaskForge para me aprofundar no Claude Code e dominar a ferramenta como parte do meu fluxo de trabalho — sem deixar de lado minhas próprias habilidades técnicas e raciocínio, que guiaram cada decisão de arquitetura, revisão de código e critério de qualidade do produto final.
