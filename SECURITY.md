# Segurança

Este projeto é um portfólio pessoal, sem usuários reais, mas recebeu um diagnóstico de
segurança de verdade — tanto auditoria de código quanto testes dinâmicos contra a
aplicação rodando. Este documento resume o que foi verificado, o que foi encontrado e o
que foi corrigido.

## Metodologia

- **Auditoria estática**: revisão de todas as Server Actions (`src/lib/actions/*.ts`) para
  confirmar que toda mutação verifica a posse (*ownership*) do recurso antes de tocar no
  banco; busca por `dangerouslySetInnerHTML`, SQL cru (`$queryRaw`/`$executeRaw`) e
  "mass assignment" (campos do Prisma montados a partir de input não validado).
- **Testes dinâmicos**: headers HTTP, cookies de sessão, IDOR entre dois usuários reais
  (`e2e/security.spec.ts`), enumeração de usuário nos fluxos de cadastro/redefinição de
  senha, comportamento de erro e 404, e o comportamento real de redirecionamento do
  Next.js (verificado lendo o código-fonte do framework, não só supondo).
- **Dependências**: `npm audit --omit=dev`, para separar vulnerabilidades de
  devDependencies (ex: ferramentas do Prisma CLI, que não entram no bundle de produção)
  de riscos reais em runtime.

Os testes dinâmicos foram feitos localmente (`npm run build && npm run start`), não
contra a produção.

## Achados

| Achado | Severidade | Status |
| --- | --- | --- |
| Sem headers de segurança HTTP + `X-Powered-By` exposto | Baixa/Média | ✅ Corrigido |
| Open redirect no login via `callbackUrl` | Média | ✅ Corrigido |
| Sem página 404 customizada | — (UX, não segurança) | ✅ Corrigido |
| Enumeração de usuário em `/api/register` | Baixa | 📝 Documentado (aceito) |
| Força bruta de senha sem limite de tentativas | Média | ✅ Corrigido |
| Força bruta contra e-mail que não existe (sem conta para bloquear) | Média | ✅ Corrigido |
| Rate limit por IP via Upstash dependente de config externa opcional | Baixa | 📝 Documentado (aceito) |
| Sem Content-Security-Policy completa | Baixa | 📝 Documentado (roadmap) |

### Headers de segurança ausentes + `X-Powered-By` exposto

`next.config.ts` não configurava nenhum header de segurança, e o Next.js expõe
`X-Powered-By: Next.js` por padrão — informação desnecessária para um atacante.

**Correção**: `next.config.ts` agora define `poweredByHeader: false` e aplica
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e
`Strict-Transport-Security` em todas as rotas.

### Open redirect no login

Depois de um login com credenciais bem-sucedido, o formulário chamava
`router.push(callbackUrl)` com o valor bruto do parâmetro `?callbackUrl=` da URL, sem
validar o destino. O router do Next.js, ao receber uma URL de outra origem, faz uma
navegação completa do navegador (confirmado lendo `app-router-instance.js` e
`navigate-reducer.js` do próprio framework) — ou seja, um link como
`/login?callbackUrl=https://site-malicioso.com` de fato levaria o usuário, já autenticado,
para fora do site após o login.

O login via OAuth (GitHub/Google) nunca teve esse problema: o callback `redirect` padrão
do Auth.js já valida o destino contra a origem configurada antes de redirecionar.

**Correção**: `callbackUrl` só é aceito se for um caminho interno (começa com `/` e não
com `//`); qualquer outro valor cai no fallback `/dashboard`. Coberto por um teste e2e
(`e2e/security.spec.ts`).

### Enumeração de usuário em `/api/register`

O endpoint de cadastro responde `409` com uma mensagem explícita
(`"Já existe uma conta com esse e-mail."`) quando o e-mail já está em uso, o que permite a
alguém descobrir se um e-mail está cadastrado sem precisar da senha.

**Decisão**: mantido como está. É uma troca de UX comum e defensável — o usuário precisa
saber que já tem conta com aquele e-mail para não tentar se cadastrar de novo por engano
(GitHub e Twitter, por exemplo, fazem o mesmo). O ponto realmente sensível, o fluxo de
redefinição de senha, **não** sofre desse problema: já responde de forma genérica
independentemente de o e-mail existir ou não, com token de uso único.

### Força bruta de senha sem limite de tentativas

A tela de login aceitava qualquer número de tentativas de senha para a mesma conta, sem
nenhum atraso ou bloqueio — abrindo espaço para um bot testar senhas em sequência.

**Correção**: depois de 5 tentativas erradas seguidas, a conta é bloqueada por 15 minutos
(`failedLoginAttempts`/`lockedUntil` em `User`, aplicado em `src/auth.ts`) — mesmo a senha
correta é recusada enquanto o bloqueio está ativo. Não depende de nenhum serviço externo,
funciona sempre.

### Força bruta contra e-mail que não existe

O bloqueio de conta acima só funciona quando existe uma linha de usuário para gravar a
tentativa (`User.failedLoginAttempts`/`lockedUntil`). Testando manualmente, percebemos que
um e-mail que não existe no banco passa direto (`if (!user) return null`, sem registrar
nada) — um bot podia martelar e-mails aleatórios sem limite nenhum, já que não há conta
para travar.

**Correção**: um bloqueio por IP gravado no Postgres (`LoginThrottle`, aplicado em
`src/auth.ts`), independente de o e-mail existir ou não — depois de 10 tentativas
malsucedidas seguidas do mesmo IP (combinando falhas contra e-mails inexistentes e senhas
erradas; o contador zera a cada login bem-sucedido), esse IP fica bloqueado por 15 minutos.
Ao contrário do rate limit via Upstash abaixo, não depende de nenhum serviço externo —
funciona sempre, inclusive sem nenhuma variável de ambiente configurada.

### Rate limit por IP via Upstash dependente de config externa opcional

Além dos dois bloqueios acima, `/api/register`, o login e a solicitação de redefinição de
senha também passam por um rate limit por IP via Upstash Redis (`src/lib/rate-limit.ts`
— necessário para um limite realmente compartilhado entre instâncias, já que o app roda em
funções serverless da Vercel, sem memória compartilhada; o `LoginThrottle` acima, por
consulta direta ao Postgres, já cobre isso para o login especificamente, mas não para
`/api/register`/redefinição de senha).

**Decisão**: aceito como está. Sem as variáveis `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`
configuradas, esse limitador especificamente vira um no-op silencioso — mas os dois
bloqueios de login acima, que não dependem de nada externo, já cobrem o cenário que mais
importa (bot tentando adivinhar credenciais via login).

### Sem Content-Security-Policy completa

Os demais headers de segurança foram adicionados, mas uma CSP completa (`script-src`,
`style-src` etc.) ficou de fora.

**Decisão**: documentado como roadmap. Implementar corretamente exigiria nonces via
middleware para os scripts inline que o próprio Next.js injeta (tema, hidratação) — mais
risco de quebrar a aplicação do que benefício neste estágio.

## O que foi verificado e está OK

- **IDOR**: todo recurso (projeto, coluna, tarefa, subtarefa, tag) é buscado por um
  helper de *ownership* (`assertProjectOwner`, `requireColumnOwnership`, etc.) antes de
  qualquer leitura ou mutação — confirmado por auditoria estática em todas as Server
  Actions e por teste e2e com dois usuários reais.
- **Mass assignment**: nenhuma mutação do Prisma usa spread de input não validado; todo
  `data:` é montado campo a campo a partir de dados já validados por Zod.
- **XSS**: nenhum uso de `dangerouslySetInnerHTML` em código da aplicação.
- **SQL Injection**: nenhum uso de `$queryRaw`/`$executeRaw`; todo acesso ao banco passa
  pelo Prisma Client.
- **Cookies de sessão**: `HttpOnly` e `SameSite=Lax` presentes nos cookies do Auth.js
  (`Secure` é aplicado automaticamente em produção sob HTTPS).
- **Divulgação de erro**: uma exceção não tratada retorna uma página de erro genérica em
  produção, sem stack trace ou detalhes internos.
- **Dependências**: as únicas vulnerabilidades reportadas pelo `npm audit` são
  transitivas de devDependencies (tooling do Prisma CLI) — não fazem parte do bundle que
  roda em produção.

## Relatando uma vulnerabilidade

Este é um projeto pessoal sem processo formal de divulgação, mas se você encontrar algo,
abra uma [issue no repositório](https://github.com/MatheusC0625/TaskForge/issues) ou
entre em contato diretamente com o autor.
