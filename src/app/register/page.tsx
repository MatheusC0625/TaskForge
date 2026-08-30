import { ThemeToggle } from "@/components/theme-toggle";
import { getEnabledOAuthProviders } from "@/lib/oauth";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  const oauthProviders = getEnabledOAuthProviders();

  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Criar conta no TaskForge
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Organize seus projetos em minutos.
        </p>
      </div>

      <RegisterForm oauthProviders={oauthProviders} />
    </main>
  );
}
