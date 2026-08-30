"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/password-reset";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <p className="max-w-sm text-center text-sm text-red-600 dark:text-red-400">
        Link inválido: nenhum token foi informado. Solicite uma nova redefinição em{" "}
        <Link href="/forgot-password" className="underline">
          Esqueci minha senha
        </Link>
        .
      </p>
    );
  }

  const handleSubmit = (formData: FormData) => {
    setError(null);
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    startTransition(async () => {
      const result = await resetPassword({}, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/login");
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Nova senha
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Confirmar nova senha
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        {isPending ? "Salvando..." : "Redefinir senha"}
      </button>
    </form>
  );
}
