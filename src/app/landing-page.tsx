import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-white dark:bg-[#0d1117]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.14), transparent 70%)",
        }}
      />

      <nav className="flex items-center justify-between gap-2 px-4 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white dark:bg-emerald-500">
            TF
          </span>
          <span className="text-lg font-semibold whitespace-nowrap text-neutral-900 dark:text-neutral-100">
            TaskForge
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-full border border-neutral-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-700 transition hover:bg-neutral-100 sm:px-4 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition hover:bg-emerald-700 sm:px-4 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Criar conta
          </Link>
        </div>
      </nav>

      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="hero-card-enter absolute top-[18%] left-[8%] w-56" style={{ animationDelay: "0.1s" }}>
            <div className="hero-card-float" style={{ animationDuration: "4.4s", animationDelay: "0.7s" }}>
              <div className="-rotate-6 rounded-lg border border-neutral-200 bg-[#f6f8fa] p-3 shadow-lg dark:border-neutral-800 dark:bg-[#161b22]">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Definir escopo da sprint
                </p>
                <span className="mt-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                  Alta
                </span>
              </div>
            </div>
          </div>

          <div className="hero-card-enter absolute top-[12%] right-[10%] w-48" style={{ animationDelay: "0.28s" }}>
            <div className="hero-card-float" style={{ animationDuration: "5.1s", animationDelay: "0.88s" }}>
              <div className="rotate-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-[#161b22]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    QA/Testes
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">1</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div className="h-1.5 w-2/3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-card-enter absolute bottom-[22%] left-[12%]" style={{ animationDelay: "0.46s" }}>
            <div className="hero-card-float" style={{ animationDuration: "3.9s", animationDelay: "1.06s" }}>
              <div className="-rotate-3 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
                Já terminei a sprint?
              </div>
            </div>
          </div>

          <div className="hero-card-enter absolute right-[9%] bottom-[16%] w-44" style={{ animationDelay: "0.64s" }}>
            <div className="hero-card-float" style={{ animationDuration: "5.4s", animationDelay: "1.24s" }}>
              <div className="rotate-6 rounded-xl bg-emerald-600 p-4 text-white shadow-lg dark:bg-emerald-500">
                <p className="text-xs font-medium text-emerald-100">Concluídas</p>
                <p className="mt-1 text-2xl font-semibold">22%</p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-100">
          Planeje, organize e entregue — tudo em um board
        </h1>
        <p className="mt-4 max-w-md text-base text-neutral-500 sm:text-lg dark:text-neutral-400">
          TaskForge é o gerenciador de tarefas Kanban para quem quer simplicidade sem abrir mão
          de controle.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Começar — é grátis
        </Link>
      </section>
    </main>
  );
}
