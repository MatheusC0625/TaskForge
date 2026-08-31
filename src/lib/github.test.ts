import { afterEach, describe, expect, it, vi } from "vitest";
import { getCiStatus, getGithubRepoInfo, parseGithubRepoUrl } from "./github";

describe("parseGithubRepoUrl", () => {
  it("extracts owner and repo from a plain URL", () => {
    expect(parseGithubRepoUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("strips a trailing slash", () => {
    expect(parseGithubRepoUrl("https://github.com/vercel/next.js/")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("strips a trailing .git suffix from URLs copied from the Clone button", () => {
    expect(parseGithubRepoUrl("https://github.com/MatheusC0625/JavaScript.git")).toEqual({
      owner: "MatheusC0625",
      repo: "JavaScript",
    });
  });

  it("does not strip a dot that is part of the repo name itself", () => {
    expect(parseGithubRepoUrl("https://github.com/vercel/next.js")?.repo).toBe("next.js");
  });

  it("returns null for a non-GitHub URL", () => {
    expect(parseGithubRepoUrl("https://gitlab.com/owner/repo")).toBeNull();
  });

  it("returns null for a malformed URL", () => {
    expect(parseGithubRepoUrl("not a url")).toBeNull();
  });
});

describe("getGithubRepoInfo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns repo info parsed from a successful API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          full_name: "vercel/next.js",
          html_url: "https://github.com/vercel/next.js",
          description: "The React Framework",
          stargazers_count: 120000,
          language: "JavaScript",
          default_branch: "canary",
        }),
      }),
    );

    const info = await getGithubRepoInfo("https://github.com/vercel/next.js");
    expect(info).toEqual({
      fullName: "vercel/next.js",
      url: "https://github.com/vercel/next.js",
      description: "The React Framework",
      stars: 120000,
      language: "JavaScript",
      defaultBranch: "canary",
    });
  });

  it("falls back to a bare-bones result when the API call fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const info = await getGithubRepoInfo("https://github.com/vercel/next.js");
    expect(info).toEqual({
      fullName: "vercel/next.js",
      url: "https://github.com/vercel/next.js",
      description: null,
      stars: null,
      language: null,
      defaultBranch: null,
    });
  });

  it("returns null for a URL that is not a GitHub repo", async () => {
    expect(await getGithubRepoInfo("https://example.com")).toBeNull();
  });
});

describe("getCiStatus", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports failure when any check run concluded with a failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          check_runs: [
            { status: "completed", conclusion: "success" },
            { status: "completed", conclusion: "failure" },
          ],
        }),
      }),
    );

    expect(await getCiStatus("https://github.com/vercel/next.js", "main")).toBe("failure");
  });

  it("reports pending when a check run has not completed yet", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ check_runs: [{ status: "in_progress", conclusion: null }] }),
      }),
    );

    expect(await getCiStatus("https://github.com/vercel/next.js", "main")).toBe("pending");
  });

  it("reports unknown when there are no check runs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ check_runs: [] }) }),
    );

    expect(await getCiStatus("https://github.com/vercel/next.js", "main")).toBe("unknown");
  });
});
