"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset";
import type { ActionState } from "@/lib/actions/projects";

const initialState: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);
  const submitted = state !== initialState && !state.error;

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Esqueci minha senha
        </h1>
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          Informe seu e-mail e, se houver uma conta associada, enviaremos um link para redefinir
          sua senha.
        </p>
      </div>

      {submitted ? (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Se esse e-mail estiver cadastrado, você vai receber um link de redefinição em
            instantes. Confira também a caixa de spam.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-100"
          >
            Voltar para o login
          </Link>
        </div>
      ) : (
        <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
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
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400 dark:focus:ring-neutral-400"
            />
          </div>

          {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {isPending ? "Enviando..." : "Enviar link de redefinição"}
          </button>

          <Link
            href="/login"
            className="text-center text-sm font-medium text-neutral-500 hover:underline dark:text-neutral-400"
          >
            Voltar para o login
          </Link>
        </form>
      )}
    </main>
  );
}
