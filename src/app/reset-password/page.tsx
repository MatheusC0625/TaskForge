import { Suspense } from "react";
import { ResetForm } from "./reset-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Redefinir senha
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Escolha uma nova senha para sua conta.
        </p>
      </div>
      <Suspense>
        <ResetForm />
      </Suspense>
    </main>
  );
}
