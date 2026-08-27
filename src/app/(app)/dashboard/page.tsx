import Link from "next/link";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <p className="text-lg text-neutral-900">
        Bem-vindo, <span className="font-semibold">{session?.user?.name}</span>.
      </p>
      <p className="max-w-sm text-center text-sm text-neutral-500">
        O resumo das suas tarefas vai aparecer aqui numa fase mais à frente do projeto. Por
        enquanto, veja seus projetos.
      </p>
      <Link
        href="/projects"
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        Ver meus projetos
      </Link>
    </div>
  );
}
