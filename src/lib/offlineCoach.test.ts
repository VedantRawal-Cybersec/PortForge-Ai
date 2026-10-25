import { describe, expect, it } from "vitest";
import { offlineSkillPrompt, offlineInterviewPrompt } from "./offlineCoach";

describe("offline coaching when the AI service is unavailable", () => {
  it("provides relevant technical questions and criteria without pretend scores", () => {
    const sql = offlineSkillPrompt("PostgreSQL");
    expect(sql.question).toMatch(/JOIN/);
    expect(sql.checklist.length).toBe(5);
    expect(sql).not.toHaveProperty("scores");
    expect(offlineSkillPrompt("Python").question).toMatch(/Python/);
    expect(offlineSkillPrompt("React hooks").question).toMatch(/React/);
  });
  it("distinguishes all three difficulty levels with appropriate prompts", () => {
    const levels = ["beginner","intermediate","advanced"] as const;
    for (const topic of ["JavaScript","React hooks","SQL","Python","Cybersecurity","Communication"]) {
      const qs = levels.map(level => offlineSkillPrompt(topic,0,level).question);
      expect(new Set(qs).size).toBe(3);
      expect(qs.every(q=>q.length > 20)).toBe(true);
    }
    expect(offlineSkillPrompt("SQL",0,"beginner").question).toMatch(/SELECT/);
    expect(offlineSkillPrompt("SQL",0,"advanced").question).toMatch(/query plan/);
  });
  it("provides three different questions per interview topic", () => {
    const questions = [0, 1, 2].map(i => offlineInterviewPrompt("JavaScript", i).question);
    expect(new Set(questions).size).toBe(3);
  });
  it("never embeds uncontrolled long user text in generated prompts", () => {
    const p = offlineSkillPrompt("Custom " + "x".repeat(50000));
    expect(p.question.length).toBeLessThan(350);
    expect(p.exampleTask.length).toBeLessThan(250);
    expect(p.checklist).toHaveLength(5);
  });
});
