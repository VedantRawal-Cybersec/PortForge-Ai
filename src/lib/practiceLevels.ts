/** Shared, user-selected practice difficulty. Not a verified proficiency rating. */
export const practiceLevels = ["beginner", "intermediate", "advanced"] as const;
export type PracticeLevel = (typeof practiceLevels)[number];

export const levelGuidance: Record<PracticeLevel, { label: string; description: string; goal: string }> = {
  beginner: {
    label: "Beginner",
    description: "Start with one concept, an accessible example, and the basic reason it works.",
    goal: "Recall and apply fundamentals without assuming prior professional experience",
  },
  intermediate: {
    label: "Intermediate",
    description: "Solve realistic scenarios, weigh trade-offs, and explain your decisions.",
    goal: "Apply knowledge in a realistic setting and justify decisions",
  },
  advanced: {
    label: "Advanced",
    description: "Analyse complex situations, failure modes, performance, security, and constraints.",
    goal: "Evaluate trade-offs, diagnose subtle failure modes, and defend decisions",
  },
};
export function parsePracticeLevel(value: unknown): PracticeLevel {
  return typeof value === "string" && practiceLevels.includes(value as PracticeLevel)
    ? value as PracticeLevel : "beginner";
}
export function levelPrompt(level: PracticeLevel): string {
  return levelGuidance[level].goal;
}
