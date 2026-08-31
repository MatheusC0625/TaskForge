const GITHUB_REPO_URL_REGEX = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)\/?$/;

export type GithubRepoInfo = {
  fullName: string;
  url: string;
  description: string | null;
  stars: number | null;
  language: string | null;
  defaultBranch: string | null;
};

export type CiStatus = "success" | "failure" | "pending" | "unknown";

export function parseGithubRepoUrl(url: string) {
  const match = url.match(GITHUB_REPO_URL_REGEX);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export async function getGithubRepoInfo(url: string): Promise<GithubRepoInfo | null> {
  const parsed = parseGithubRepoUrl(url);
  if (!parsed) return null;

  const fallback: GithubRepoInfo = {
    fullName: `${parsed.owner}/${parsed.repo}`,
    url,
    description: null,
    stars: null,
    language: null,
    defaultBranch: null,
  };

  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    return {
      fullName: data.full_name ?? fallback.fullName,
      url: data.html_url ?? url,
      description: data.description ?? null,
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
      language: data.language ?? null,
      defaultBranch: data.default_branch ?? null,
    };
  } catch {
    return fallback;
  }
}

export async function getCiStatus(
  url: string,
  defaultBranch?: string | null,
): Promise<CiStatus> {
  const parsed = parseGithubRepoUrl(url);
  if (!parsed) return "unknown";

  try {
    const ref = defaultBranch || "HEAD";
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits/${ref}/check-runs`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return "unknown";

    const data = await response.json();
    const runs = (data.check_runs ?? []) as { status: string; conclusion: string | null }[];
    if (runs.length === 0) return "unknown";
    if (runs.some((run) => run.status !== "completed")) return "pending";
    if (runs.some((run) => run.conclusion === "failure")) return "failure";
    return "success";
  } catch {
    return "unknown";
  }
}
