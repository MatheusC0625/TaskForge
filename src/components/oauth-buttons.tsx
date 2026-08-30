"use client";

import { signIn } from "next-auth/react";

export function OAuthButtons({
  github,
  google,
  callbackUrl,
}: {
  github: boolean;
  google: boolean;
  callbackUrl?: string;
}) {
  if (!github && !google) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Continuar com GitHub
          </button>
        )}
        {google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Continuar com Google
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        ou
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
