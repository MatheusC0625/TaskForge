import { describe, expect, it } from "vitest";
import { PROJECT_TEMPLATES, getProjectTemplate } from "./templates";

describe("getProjectTemplate", () => {
  it("resolves every declared template by id", () => {
    for (const template of PROJECT_TEMPLATES) {
      expect(getProjectTemplate(template.id)).toEqual(template);
    }
  });

  it("returns null for an unknown id", () => {
    expect(getProjectTemplate("does-not-exist")).toBeNull();
  });

  it("returns null for undefined/null input", () => {
    expect(getProjectTemplate(undefined)).toBeNull();
    expect(getProjectTemplate(null)).toBeNull();
  });

  it("marks the blank template as free and column-less", () => {
    const blank = getProjectTemplate("blank");
    expect(blank?.pro).toBeFalsy();
    expect(blank?.columns).toHaveLength(0);
  });

  it("marks the CI/CD and incident-response templates as Pro-only", () => {
    expect(getProjectTemplate("cicd-pipeline")?.pro).toBe(true);
    expect(getProjectTemplate("incident-response")?.pro).toBe(true);
  });

  it("gives every non-blank template at least one column", () => {
    for (const template of PROJECT_TEMPLATES) {
      if (template.id === "blank") continue;
      expect(template.columns.length).toBeGreaterThan(0);
    }
  });
});
