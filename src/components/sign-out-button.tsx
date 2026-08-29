"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.97] sm:px-4 sm:py-2 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      Sair
    </button>
  );
}
