const GITHUB_REPO_URL_REGEX = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)\/?$/;

export type GithubRepoInfo = {
  fullName: string;
  url: string;
  description: string | null;
  stars: number | null;
  language: string | null;
};

export function parseGithubRepoUrl(url: string) {
  const match = url.match(GITHUB_REPO_URL_REGEX);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function getGithubRepoInfo(url: string): Promise<GithubRepoInfo | null> {
  const parsed = parseGithubRepoUrl(url);
  if (!parsed) return null;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return { fullName: `${parsed.owner}/${parsed.repo}`, url, description: null, stars: null, language: null };
    }

    const data = await response.json();
    return {
      fullName: data.full_name ?? `${parsed.owner}/${parsed.repo}`,
      url: data.html_url ?? url,
      description: data.description ?? null,
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
      language: data.language ?? null,
    };
  } catch {
    return { fullName: `${parsed.owner}/${parsed.repo}`, url, description: null, stars: null, language: null };
  }
}
