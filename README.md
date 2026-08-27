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

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000).

> Este README ainda está em construção — a documentação completa do projeto será finalizada ao final do desenvolvimento.
