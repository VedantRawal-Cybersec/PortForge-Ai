import { describe, expect, it } from "vitest";
import { buildPortfolioSite } from "./portfolioSite";
import { defaultProfile } from "./profile";
import {
  emptyShowcaseDraft, safeProjectUrl, validShowcaseDraft, type ShowcaseProject,
} from "./showcaseProjects";

const project: ShowcaseProject = {
  id: "local-1",
  title: "Student Portfolio",
  summary: "Built a portfolio website to show my genuine projects.",
  challenge: "Students need clear project presentation.",
  approach: "Compared two approaches and implemented one.",
  validation: "Tested keyboard access on a demo project.",
  technologies: "React, TypeScript",
  role: "Full stack",
  outcome: "Learned how to ship responsive applications.",
  projectUrl: "https://github.com/example/project",
  createdAt: 1,
  updatedAt: 1,
};

describe("manually authored portfolio projects", () => {
  it("requires meaningful titles and explanations", () => {
    expect(validShowcaseDraft(emptyShowcaseDraft)).toBe(false);
    expect(validShowcaseDraft({ ...emptyShowcaseDraft, title: "A", summary: "A project summary long enough" })).toBe(false);
    expect(validShowcaseDraft({ ...emptyShowcaseDraft, title: "Work", summary: "A project summary long enough" })).toBe(true);
  });

  it("allows only clean HTTPS links without embedded credentials", () => {
    expect(safeProjectUrl("javascript:alert(1)")).toBe("");
    expect(safeProjectUrl("http://example.com")).toBe("");
    expect(safeProjectUrl("https://user:pass@example.com")).toBe("");
    expect(safeProjectUrl("https://example.com/demo")).toBe("https://example.com/demo");
  });

  it("includes manually authored work and escapes unsafe supplied content", () => {
    const html = buildPortfolioSite(
      { ...defaultProfile, name: "Taylor" },
      [],
      "night",
      [{ ...project, title: '<script>alert("x")</script>', summary: '<img src=x onerror=alert(1)>', projectUrl: "javascript:alert(1)" }],
    );
    expect(html).toContain("Self-reported project");
    expect(html).toContain("Tests and evidence:");
    expect(html).toContain("keyboard access");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).not.toContain("<img src=x onerror");
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain("No projects added yet");
  });
});
