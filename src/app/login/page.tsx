import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { AuthShell } from "@/components/auth-shell";
import { getEnabledOAuthProviders } from "@/lib/oauth";

export default function LoginPage() {
  const oauthProviders = getEnabledOAuthProviders();

  return (
    <AuthShell title="Entrar no TaskForge" subtitle="Acesse seus projetos e tarefas.">
      <Suspense>
        <LoginForm oauthProviders={oauthProviders} />
      </Suspense>
    </AuthShell>
  );
}
