import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getGithubRepoInfo, getCiStatus } from "@/lib/github";

const CI_DOT_STYLES: Record<"success" | "failure" | "pending", { className: string; label: string }> = {
  success: { className: "bg-emerald-500", label: "CI passou" },
  failure: { className: "bg-red-500", label: "CI falhou" },
  pending: { className: "bg-amber-500", label: "CI em andamento" },
};

export async function GithubRepoBadge({ repoUrl }: { repoUrl: string }) {
  const info = await getGithubRepoInfo(repoUrl);
  if (!info) return null;

  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } })
    : null;
  const isPro = user?.plan === "PRO";

  const ciStatus = isPro ? await getCiStatus(repoUrl, info.defaultBranch) : "unknown";
  const ciStyle = ciStatus !== "unknown" ? CI_DOT_STYLES[ciStatus] : null;

  return (
    <a
      href={info.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      {info.fullName}
      {info.language && <span className="text-neutral-400 dark:text-neutral-600">· {info.language}</span>}
      {info.stars !== null && (
        <span className="flex items-center gap-0.5 text-neutral-400 dark:text-neutral-600">
          ★ {info.stars}
        </span>
      )}
      {ciStyle && (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${ciStyle.className}`}
          role="img"
          aria-label={ciStyle.label}
          title={ciStyle.label}
        />
      )}
    </a>
  );
}
