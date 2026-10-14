import { AuthShell } from "@/components/auth-shell";
import { getEnabledOAuthProviders } from "@/lib/oauth";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  const oauthProviders = getEnabledOAuthProviders();

  return (
    <AuthShell title="Criar conta no TaskForge" subtitle="Organize seus projetos em minutos.">
      <RegisterForm oauthProviders={oauthProviders} />
    </AuthShell>
  );
}
