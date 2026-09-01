import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-semibold text-emerald-600 dark:text-emerald-500">404</p>
      <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        Página não encontrada.
      </p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        O conteúdo que você está procurando não existe ou você não tem acesso a ele.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
