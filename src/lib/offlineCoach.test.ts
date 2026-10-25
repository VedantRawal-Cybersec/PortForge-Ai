import { describe, expect, it } from "vitest";
import { offlineSkillPrompt, offlineInterviewPrompt } from "./offlineCoach";

describe("offline coaching when the AI service is unavailable", () => {
  it("provides relevant technical questions and criteria without pretend scores", () => {
    const sql = offlineSkillPrompt("PostgreSQL");
    expect(sql.question).toMatch(/JOIN/);
    expect(sql.checklist.length).toBe(3);
    expect(sql).not.toHaveProperty("scores");
    expect(offlineSkillPrompt("Python").question).toMatch(/Python/);
    expect(offlineSkillPrompt("React hooks").question).toMatch(/React/);
  });
  it("provides three different questions per interview topic", () => {
    const questions = [0, 1, 2].map(i => offlineInterviewPrompt("JavaScript", i).question);
    expect(new Set(questions).size).toBe(3);
  });
  it("never embeds uncontrolled long user text in generated prompts", () => {
    const p = offlineSkillPrompt("Custom " + "x".repeat(50000));
    expect(p.question.length).toBeLessThan(350);
    expect(p.exampleTask.length).toBeLessThan(250);
    expect(p.checklist).toHaveLength(3);
  });
});
