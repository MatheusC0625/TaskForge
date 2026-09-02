"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/components/ui/password-input";
import { OAuthButtons } from "@/components/oauth-buttons";

export function LoginForm({
  oauthProviders,
}: {
  oauthProviders: { github: boolean; google: boolean };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallbackUrl = searchParams.get("callbackUrl");
  // Só aceitamos caminhos internos (começando com "/", mas não "//"), para
  // evitar que um callbackUrl malicioso redirecione o usuário para outro site.
  const callbackUrl =
    requestedCallbackUrl && requestedCallbackUrl.startsWith("/") && !requestedCallbackUrl.startsWith("//")
      ? requestedCallbackUrl
      : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      if (result.code === "account_locked") {
        setError("Muitas tentativas incorretas. Tente novamente em 15 minutos.");
      } else {
        setError("E-mail ou senha incorretos.");
      }
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <OAuthButtons
        github={oauthProviders.github}
        google={oauthProviders.google}
        callbackUrl={callbackUrl}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Senha
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-neutral-500 hover:underline dark:text-neutral-400"
          >
            Esqueci minha senha
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-[#161b22] dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}
