import { describe, expect, it } from "vitest";
import {
  columnSchema,
  projectColorSchema,
  projectRepoSchema,
  projectSchema,
  renameProjectSchema,
} from "./project";

describe("projectSchema", () => {
  it("accepts a minimal valid project", () => {
    const result = projectSchema.safeParse({ name: "Meu Projeto" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(projectSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects a name longer than 80 characters", () => {
    expect(projectSchema.safeParse({ name: "a".repeat(81) }).success).toBe(false);
  });

  it("accepts a valid GitHub repo URL", () => {
    const result = projectSchema.safeParse({
      name: "Projeto",
      githubRepoUrl: "https://github.com/vercel/next.js",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty string for the repo URL (no repo linked)", () => {
    expect(projectSchema.safeParse({ name: "Projeto", githubRepoUrl: "" }).success).toBe(true);
  });

  it("rejects a malformed repo URL", () => {
    expect(
      projectSchema.safeParse({ name: "Projeto", githubRepoUrl: "not-a-url" }).success,
    ).toBe(false);
  });

  it("rejects a non-hex color", () => {
    expect(projectSchema.safeParse({ name: "Projeto", color: "green" }).success).toBe(false);
  });
});

describe("renameProjectSchema", () => {
  it("trims whitespace and accepts the result", () => {
    const result = renameProjectSchema.safeParse({ name: "  Novo nome  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Novo nome");
  });

  it("rejects a name that is only whitespace", () => {
    expect(renameProjectSchema.safeParse({ name: "   " }).success).toBe(false);
  });
});

describe("projectColorSchema", () => {
  it("accepts a 6-digit hex color", () => {
    expect(projectColorSchema.safeParse({ color: "#10b981" }).success).toBe(true);
  });

  it("rejects a 3-digit shorthand hex color", () => {
    expect(projectColorSchema.safeParse({ color: "#fff" }).success).toBe(false);
  });
});

describe("projectRepoSchema", () => {
  it("requires a URL (unlike the optional field on projectSchema)", () => {
    expect(projectRepoSchema.safeParse({ url: "" }).success).toBe(false);
  });

  it("accepts a repo URL ending in .git", () => {
    expect(
      projectRepoSchema.safeParse({ url: "https://github.com/owner/repo.git" }).success,
    ).toBe(true);
  });
});

describe("columnSchema", () => {
  it("rejects a name longer than 40 characters", () => {
    expect(columnSchema.safeParse({ name: "a".repeat(41) }).success).toBe(false);
  });

  it("accepts a normal column name", () => {
    expect(columnSchema.safeParse({ name: "Em Andamento" }).success).toBe(true);
  });
});
