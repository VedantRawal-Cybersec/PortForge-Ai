/**
 * Deterministic coaching prompts when a paid AI provider cannot respond.
 * These are not generated or scored by AI and never imply certification.
 */
export type OfflinePrompt = {
  question: string;
  checklist: readonly string[];
  exampleTask: string;
};

function category(skill: string): "javascript"|"python"|"sql"|"react"|"communication"|"security"|"general" {
  const s = skill.toLowerCase();
  if (/react|next\.js|frontend|front.end|hooks/.test(s)) return "react";
  if (/sql|database|postgres|mysql|join|analytics/.test(s)) return "sql";
  if (/python|django|flask|fastapi/.test(s)) return "python";
  if (/javascript|typescript|node|js\b/.test(s)) return "javascript";
  if (/communication|present|leadership|teamwork|soft.skill/.test(s)) return "communication";
  if (/security|pentest|cyber|network|vulnerability/.test(s)) return "security";
  return "general";
}
const prompts: Record<ReturnType<typeof category>, readonly [string, string, string]> = {
  javascript: [
    "Explain how you would find and fix an asynchronous JavaScript bug in a real application.",
    "Describe the difference between a Promise and async/await, and one failure case you would handle.",
    "Walk through how you would test a JavaScript function, including input and edge cases.",
  ],
  python: [
    "Describe how you would debug a Python function that behaves differently for empty and large inputs.",
    "Explain when you would use a list, dictionary and set in Python, with a practical example.",
    "Describe how you would structure and test a small Python data-processing script.",
  ],
  sql: [
    "You need records from two related tables. Explain when to use INNER JOIN versus LEFT JOIN.",
    "Describe how you would investigate a slow SQL query before adding an index.",
    "Explain how you would check that a SQL report handles duplicates and missing values correctly.",
  ],
  react: [
    "Describe how state, props and effects work together in a React form.",
    "Explain how you would diagnose an unnecessary re-render in a React application.",
    "Walk through how you would make a React data-loading screen accessible and reliable.",
  ],
  communication: [
    "Explain a difficult technical concept to someone unfamiliar with it, using a simple example.",
    "Describe a disagreement in a team and how you would reach a constructive resolution.",
    "Tell the story of a project setback, your actions, and what you learned.",
  ],
  security: [
    "Explain how you would assess the impact of a web application vulnerability without exaggerating its risk.",
    "Describe a safe approach to validating an authorization flaw in a system you have permission to test.",
    "Explain how you would write a clear, reproducible security finding with evidence and remediation.",
  ],
  general: [
    "Choose one important concept from your topic and explain how you used it to solve a real problem.",
    "Describe a mistake or common misconception in your topic, and explain a way to avoid it.",
    "Walk through how you would demonstrate and test your understanding of this topic in a small project.",
  ],
};
const checklists: Record<ReturnType<typeof category>, readonly string[]> = {
  javascript: ["Explain expected and actual behavior.", "Consider async errors and edge cases.", "Give a repeatable test or debugging approach."],
  python: ["Explain data structures and constraints.", "Handle invalid or empty inputs.", "Describe a test that would catch a mistake."],
  sql: ["Name the relevant data relationships.", "Explain correctness with missing or duplicate data.", "Discuss performance and verification."],
  react: ["Separate UI state from side effects.", "Explain loading, failure and success states.", "Account for accessibility and predictable tests."],
  communication: ["Present a specific situation and your role.", "Explain your actions and why you chose them.", "Describe a real outcome and what you learned."],
  security: ["Explain authorization and safety boundaries.", "Describe reproducible, minimal-risk evidence.", "Propose a practical remediation and impact limits."],
  general: ["Define the concept in your own words.", "Give a concrete example from work or practice.", "Mention a limitation and how you would test it."],
};
export function offlineSkillPrompt(skill: string, index = 0): OfflinePrompt {
  const kind = category(skill);
  const safeName = (skill.trim() || "this topic").slice(0, 120);
  const questions = prompts[kind];
  const q = questions[((index % questions.length) + questions.length) % questions.length];
  return {
    question: kind === "general" ? `For ${safeName}: ${q}` : q,
    checklist: checklists[kind],
    exampleTask: `Create a small, explainable ${safeName} example and describe one test that would prove it works.`,
  };
}
export function offlineInterviewPrompt(skill: string, index: number): OfflinePrompt {
  return offlineSkillPrompt(skill, index);
}
