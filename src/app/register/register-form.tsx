"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/components/ui/password-input";
import { OAuthButtons } from "@/components/oauth-buttons";

export function RegisterForm({
  oauthProviders,
}: {
  oauthProviders: { github: boolean; google: boolean };
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível criar a conta.");
      setIsSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
      <OAuthButtons github={oauthProviders.github} google={oauthProviders.google} />

      <div>
        <label htmlFor="name" className="sr-only">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Senha
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Senha (mínimo de 8 caracteres)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="sr-only">
          Confirmar senha
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={fieldClass}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-800 dark:bg-[#111214] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500";
