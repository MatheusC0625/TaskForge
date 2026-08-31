import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UpgradeActions } from "./upgrade-actions";

export default async function UpgradePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { plan: true },
  });
  const isPro = user?.plan === "PRO";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Plano</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Escolha o plano que melhor se encaixa no seu fluxo de trabalho.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div>
            <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
              Free
            </span>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">R$ 0</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✓ Projetos e tarefas ilimitados</li>
            <li>✓ Quadro Kanban e visualização em lista</li>
            <li>✓ 1 repositório do GitHub vinculado no total</li>
          </ul>
          {!isPro && (
            <span className="rounded-lg border border-neutral-300 px-4 py-2 text-center text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              Seu plano atual
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border-2 border-emerald-600 p-6 dark:border-emerald-500">
          <div>
            <span className="text-xs font-medium tracking-wide text-emerald-600 uppercase dark:text-emerald-500">
              Pro
            </span>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              R$ 19,90<span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">/mês</span>
            </p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✓ Tudo do plano Free</li>
            <li>✓ Repositórios do GitHub ilimitados</li>
            <li>✓ Suporte prioritário</li>
          </ul>
          <UpgradeActions isPro={isPro} />
        </div>
      </div>

      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Cobrança simulada para fins de demonstração — nenhum pagamento real é processado.
      </p>
    </div>
  );
}
