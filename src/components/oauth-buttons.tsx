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
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-3">
        {github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            aria-label="Continuar com GitHub"
            title="Continuar com GitHub"
            className="flex flex-1 items-center justify-center rounded-lg border border-neutral-300 py-2.5 text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-800 dark:bg-[#111214] dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <GitHubIcon className="h-5 w-5" />
          </button>
        )}
        {google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            aria-label="Continuar com Google"
            title="Continuar com Google"
            className="flex flex-1 items-center justify-center rounded-lg border border-neutral-300 py-2.5 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-800 dark:bg-[#111214] dark:hover:bg-neutral-800"
          >
            <GoogleIcon className="h-5 w-5" />
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

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.4 7.86 10.94.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.9-.38 2.88-.38s1.96.13 2.88.38c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.15v3.19c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.07-1.47-.22-2.12H12v3.84h6.6c-.13 1.07-.86 2.68-2.47 3.76l-.02.15 3.59 2.78.25.02c2.28-2.1 3.57-5.19 3.57-8.43Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.79-2.95c-1.01.7-2.37 1.19-4.15 1.19-3.18 0-5.88-2.1-6.84-5l-.14.01-3.73 2.89-.05.13C3.23 21.3 7.3 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.16 14.33c-.25-.73-.4-1.52-.4-2.33s.15-1.6.39-2.33l-.01-.16L1.34 6.7l-.12.06A11.98 11.98 0 0 0 0 12c0 1.94.47 3.77 1.22 5.24l3.94-2.91Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c2.25 0 3.77.97 4.64 1.79l3.38-3.3C17.94 1.19 15.24 0 12 0 7.3 0 3.23 2.7 1.22 6.76l3.93 3.04c.97-2.9 3.67-5.05 6.85-5.05Z"
      />
    </svg>
  );
}
