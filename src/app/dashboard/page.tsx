import { auth } from "@/auth";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4">
      <p className="text-lg text-neutral-900">
        Bem-vindo, <span className="font-semibold">{session?.user?.name}</span>.
      </p>
      <p className="text-sm text-neutral-500">
        O dashboard completo será construído numa fase mais à frente do projeto.
      </p>
      <SignOutButton />
    </main>
  );
}
