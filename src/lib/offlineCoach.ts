import { type PracticeLevel } from "./practiceLevels";
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
const beginner: Record<ReturnType<typeof category>, readonly [string,string,string]> = {
  javascript: [
    "What is a JavaScript variable? Show one example of declaring and updating a value.",
    "Explain when to use a JavaScript function and show one simple example.",
    "What is an array, and how would you read the first item safely?",
  ],
  python: [
    "What is a Python list and how would you read its first item?",
    "Explain the difference between a Python for-loop and an if statement using an example.",
    "Write or explain a simple Python function that adds two numbers.",
  ],
  sql: [
    "What does a SQL SELECT statement do? Explain what INNER JOIN means with two related tables.",
    "How would you filter rows using a SQL WHERE clause? Give a small example.",
    "Explain how ORDER BY changes a SQL result and what it does not change.",
  ],
  react: [
    "What is a React component? Describe props with a small example.",
    "What is React state, and when would a button need to update it?",
    "Why should a React list include a stable key? Give one example.",
  ],
  communication: [
    "Introduce a project in simple language and explain its purpose in under a minute.",
    "How would you ask a teammate for clarification when you do not understand a task?",
    "Describe how you would explain a delay in a project respectfully and clearly.",
  ],
  security: [
    "Explain confidentiality, integrity and availability with an everyday example.",
    "What is multifactor authentication and why is it useful?",
    "Explain why applying security updates matters, using a simple example.",
  ],
  general: [
    "Define one basic concept in your chosen topic and give an everyday example.",
    "Explain a simple task someone new to your topic should be able to complete.",
    "Describe one common beginner mistake in your topic and how to avoid it.",
  ],
};
const advanced: Record<ReturnType<typeof category>, readonly [string,string,string]> = {
  javascript: [
    "Analyze an intermittent race condition involving promises, retries and cancellation. How would you reproduce and contain it?",
    "Design a resilient asynchronous JavaScript workflow with bounded concurrency, timeouts and observable failures.",
    "Review a JavaScript architecture for memory leaks, event-loop blocking and security boundaries; defend your trade-offs.",
  ],
  python: [
    "Design a Python service for high-throughput data processing and explain memory, concurrency and fault-isolation trade-offs.",
    "Diagnose subtle shared-mutable-state or async cancellation bugs in Python, including tests that expose them.",
    "Explain how you would profile and optimize a large Python pipeline without compromising correctness.",
  ],
  sql: [
    "Analyze a complex SQL query plan involving skewed distributions and concurrent writes; propose tests and indexing trade-offs.",
    "Design a strategy to prevent duplicate transactions under concurrent SQL requests. Discuss isolation and retries.",
    "Explain how to validate a difficult analytical SQL query with window functions, null semantics and data-quality invariants.",
  ],
  react: [
    "Design a resilient React data-fetching flow under concurrent requests, hydration and out-of-order responses.",
    "Analyze rendering and accessibility failures in a large React application; prioritize measurable fixes.",
    "Defend a scalable state-management architecture and describe tests for race conditions and stale data.",
  ],
  communication: [
    "Explain how you would resolve conflicting stakeholder priorities under material technical constraints, with measurable outcomes.",
    "Present a high-stakes architectural trade-off to executives, identifying uncertainty and a reversible decision.",
    "Describe how you would communicate an incident to stakeholders while facts are incomplete and changing.",
  ],
  security: [
    "Prioritize several vulnerabilities under uncertain exploitability, production impact and compensating controls.",
    "Design a least-privilege authorization model with multi-tenant isolation, threat assumptions and negative tests.",
    "Describe an incident-response investigation preserving chain of custody, containment options and uncertainty.",
  ],
  general: [
    "Analyze a complex failure in your topic involving multiple trade-offs. Describe how to isolate root causes.",
    "Propose and defend an architecture or approach for your topic under conflicting real-world constraints.",
    "Evaluate two competing solutions in your topic using measurable criteria, risks and validation experiments.",
  ],
};
const levelCriteria: Record<PracticeLevel, readonly string[]> = {
  beginner: ["Define the key concept accurately.", "Use one straightforward, concrete example.", "Explain why your example works in simple terms."],
  intermediate: ["Apply the concept to a realistic scenario.", "Justify decisions and mention a relevant alternative.", "Explain what you would test or verify."],
  advanced: ["Identify failure modes and competing constraints.", "Justify trade-offs with evidence or measurable assumptions.", "Describe robust validation, including edge cases and limitations."],
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
export function offlineSkillPrompt(skill: string, index = 0, level: PracticeLevel = "beginner"): OfflinePrompt {
  const kind = category(skill);
  const safeName = (skill.trim() || "this topic").slice(0, 120);
  const questions = level === "advanced" ? advanced[kind] :
    level === "intermediate" ? prompts[kind] : beginner[kind];
  const q = questions[((index % questions.length) + questions.length) % questions.length];
  return {
    question: kind === "general" ? `For ${safeName}: ${q}` : q,
    checklist: [...levelCriteria[level], ...checklists[kind]].slice(0, 5),
    exampleTask: `${level === "beginner" ? "Build a small" : level === "intermediate" ? "Build and test a realistic" : "Design and critically evaluate a complex"} ${safeName} example; explain the evidence supporting your result.`,
  };
}
export function offlineInterviewPrompt(skill: string, index: number, level: PracticeLevel = "beginner"): OfflinePrompt {
  return offlineSkillPrompt(skill, index, level);
}
