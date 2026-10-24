import { describe, expect, it } from "vitest";
import { buildPortfolioSite, escapePortfolioHtml } from "./portfolioSite";
import { defaultProfile } from "./profile";
import type { PortfolioEntry } from "./portfolio";

const project: PortfolioEntry = {
  id: "sample-1",
  type: "project",
  title: "Sample application",
  skill: "JavaScript",
  level: "Beginner",
  scores: { logic: 3, clarity: 3, depth: 3 },
  verdict: "Built and explained a practice exercise.",
  hash: "LOCAL1234",
  createdAt: Date.UTC(2026, 9, 24),
};

describe("standalone portfolio export", () => {
  it("escapes user and AI sourced HTML, including attributes", () => {
    expect(escapePortfolioHtml(`"><script>alert(1)</script>`))
      .toBe("&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;");
    const html = buildPortfolioSite(
      { ...defaultProfile, name: "<img src=x onerror=alert(1)>", headline: '"><script>bad()</script>', bio: "<svg/onload=alert(1)>", links: ["javascript:alert(1)"] },
      [{ ...project, verdict: "<iframe src=x></iframe>" }],
      "minimal",
    );
    expect(html).not.toContain("<img src=x onerror");
    expect(html).not.toContain("<script>bad()");
    expect(html).not.toContain("<iframe src=x>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;iframe src=x&gt;");
    expect(html).toContain("Content-Security-Policy");
  });

  it.each(["minimal", "editorial", "night"] as const)("renders a responsive %s portfolio with genuine data", theme => {
    const html = buildPortfolioSite(
      { ...defaultProfile, name: "Taylor", headline: "Software developer", links: ["https://example.com"] },
      [project, { ...project, id: "skill-1", type: "skill", title: "JavaScript assessment" }],
      theme,
    );
    expect(html).toContain("Taylor");
    expect(html).toContain("Sample application");
    expect(html).toContain("Software developer");
    expect(html).toContain("https://example.com/");
    expect(html).toContain("viewport");
    expect(html).toContain("not independently verified");
  });

  it("shows useful empty states without inventing work", () => {
    const html = buildPortfolioSite(defaultProfile, [], "minimal");
    expect(html).toContain("No saved project reviews yet");
    expect(html).not.toContain("Sample application");
  });
});
