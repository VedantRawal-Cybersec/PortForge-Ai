import type {Lesson} from "./academy";
export type FlagshipTrackId="frontend"|"data-analyst"|"cybersecurity";
type AdditionalLesson=[title:string,concept:string,example:string,prompt:string,
 correct:string,wrongA:string,wrongB:string,why:string,hint:string];
const sources:Record<FlagshipTrackId,AdditionalLesson[]>={
  "frontend": [
    [
      "Build an accessible form",
      "A form is a communication contract: use persistent labels, clear required-field rules, accessible descriptions and an explicit success state. Before adding polish, test with keyboard only and with missing or malformed inputs.",
      "A contact form links <label htmlFor='email'> to <input id='email' aria-describedby='email-error'> and keeps the error available until fixed.",
      "Which design gives usable validation feedback?",
      "Programmatically associated text errors",
      "Only a red border",
      "Only a delayed tooltip",
      "Text plus semantic association is accessible beyond color and persists long enough to correct.",
      "Can someone understand the error without seeing red?"
    ],
    [
      "Pure functions and state",
      "Separating business rules into pure functions makes UI state safer to test. A pure function returns results from inputs without changing shared objects; React state updates should create new references.",
      "updateTask(tasks,id) returns tasks.map(t=>t.id===id?{...t,done:true}:t) instead of mutating t.",
      "Which technique makes state transitions easier to reason about?",
      "Return a new collection from a pure updater",
      "Mutate a shared array silently",
      "Reload for every state change",
      "Immutable pure updaters avoid hidden side effects and enable reliable tests.",
      "Is the original value changed?"
    ],
    [
      "Loading, failure and retry",
      "A network request can be slow, fail, or complete after a newer request. Present loading, result, empty and retryable error states. Never erase user input simply because a response failed.",
      "A dashboard shows 'Unable to load; Retry' while preserving entered filters.",
      "Which state must accompany a failed API call?",
      "A recoverable error with retry",
      "An endless loading skeleton",
      "An automatic success message",
      "Users need an explanation and a safe next action when requests fail.",
      "Design the failure state too."
    ],
    [
      "Test the real workflow",
      "Test behavior from a user's perspective: keyboard navigation, loading, invalid form submission, empty results and success. Component unit tests are helpful, but an end-to-end test catches interactions across multiple layers.",
      "An end-to-end test fills an invalid email, checks the message, corrects the value, submits and verifies the success announcement.",
      "What proves that a user journey actually works?",
      "An end-to-end assertion on observable outcomes",
      "Only a TypeScript compile",
      "Only a design screenshot",
      "Runtime tests exercise integrated behavior in realistic states.",
      "What would the student actually observe?"
    ],
    [
      "Avoid stale async updates",
      "Overlapping requests may complete out of order. If a learner types quickly, old results must not replace the newer search. Use request identity or cancellation and confirm that results correspond to the latest input.",
      "Use an AbortController in a cleanup, or compare the request ID before committing search results.",
      "How do you prevent older fetch results overwriting newer ones?",
      "Cancel obsolete work or compare request identity",
      "Always use the response that finishes last",
      "Hide the input field",
      "Controlling concurrency preserves latest user intent and prevents stale UI.",
      "What happens if the first request is slow?"
    ],
    [
      "Ship and document a capstone",
      "A portfolio-ready feature is not just a screenshot. Record the user problem, implementation choices, test evidence, accessibility checks and limitations. Treat untested features as claims, not passed checks.",
      "Build an accessible task manager, test creation and completion, verify keyboard focus, and document one known limitation.",
      "What makes a software case study defensible?",
      "Clear problem, real decisions, reproducible checks and limits",
      "Only an animation and a score",
      "Unverified claims of 100% reliability",
      "Explainable evidence matters more than visual hype.",
      "Could a reviewer reproduce your results?"
    ]
  ],
  "data-analyst": [
    [
      "SQL filtering and NULLs",
      "Use SELECT and WHERE to answer a clear question. NULL represents unknown or missing information: test with IS NULL, not ordinary equality. Write down whether incomplete rows are included.",
      "SELECT COUNT(*) FROM orders WHERE shipped_at IS NULL; counts orders with no recorded ship date.",
      "How should SQL test missing shipping dates?",
      "shipped_at IS NULL",
      "shipped_at = NULL",
      "shipped_at = '' only",
      "SQL NULL comparisons use IS NULL to identify missing values.",
      "NULL is not an ordinary string."
    ],
    [
      "Validate join cardinality",
      "Joining tables on nonunique identifiers can duplicate rows and inflate totals. Inspect key uniqueness and row counts before and after a join, then reconcile aggregates against trusted raw data.",
      "A product table accidentally contains two rows for one SKU; joining sales doubles that product's reported revenue.",
      "What should you investigate when totals double after a JOIN?",
      "Duplicate join keys and row cardinality",
      "Chart theme settings",
      "Whether column names are longer than ten characters",
      "A one-to-many join can multiply records before aggregation.",
      "Check how many matches each ID has."
    ],
    [
      "Use transparent transformations",
      "Cleaning is an analytical decision. Define parse rules, preserve source counts and report which rows were corrected, dropped or missing. Avoid filling unknown values with invented facts.",
      "Parse transaction dates with an explicit format, record four malformed dates, and keep a rejected-rows log.",
      "Which process is easiest to audit?",
      "Deterministic cleaning with a quality report",
      "Silent manual deletion of problematic rows",
      "Replacing unknown regions with a popular region",
      "Reproducible transformations make limitations inspectable.",
      "Could another analyst repeat your cleaning?"
    ],
    [
      "Choose useful visualizations",
      "Choose a chart from the question and data. Time series suits trends, bars compare categories, and tables serve detailed lookup. Keep units, dates, source freshness and sample sizes visible.",
      "Show monthly completed orders as a time series using the same status filter for every month.",
      "Which visual best answers 'how did weekly signups change'?",
      "A time-series chart with dated values",
      "A pie chart with no time dimension",
      "A single unlabeled icon",
      "Time series preserves sequence and supports comparison.",
      "Does the question ask about time?"
    ],
    [
      "Explain uncertainty",
      "A pattern alone does not prove causation. Consider sample selection, changing definitions, missing data and alternative explanations. State limitations and confidence, especially for decisions affecting people.",
      "A signup-rate increase coincides with a campaign, but seasonality and tracking changes also occurred.",
      "Which conclusion is justified?",
      "An observed association with stated limitations",
      "The campaign definitely caused every signup",
      "A percentage without a denominator proves impact",
      "A responsible analyst separates measurement from causal inference.",
      "What else could explain the change?"
    ],
    [
      "Deliver a reproducible report",
      "A decision-ready report describes the question, data, cleaning, metric definition, reconciliation, findings and uncertainty. Include scripts or queries and screenshots only as supporting artifacts.",
      "Write a synthetic sales analysis with validated SQL totals and a one-page explanation of a recommendation.",
      "What best demonstrates a finished analysis?",
      "Reproducible queries, quality checks, evidence and caveats",
      "A polished chart with no data sources",
      "A strong conclusion from a single row",
      "Analytical value depends on method, traceability and communication.",
      "Can someone recompute the numbers?"
    ]
  ],
  "cybersecurity": [
    [
      "Read network evidence",
      "IP addresses, ports, DNS and protocols help explain a connection, but a single unusual indicator does not prove malicious activity. Check timestamps, baseline and permitted scope.",
      "A synthetic DNS log shows a query followed by a connection to the returned address; correlate before drawing conclusions.",
      "What should an analyst do with one unfamiliar destination IP?",
      "Correlate it with baseline traffic and other evidence",
      "Immediately accuse the address owner",
      "Publish the full logs with account secrets",
      "Context reduces false positives and unsupported attribution.",
      "What other evidence would change your assessment?"
    ],
    [
      "Correlate authentication logs",
      "Multiple login failures followed by a success can indicate several scenarios: an actual compromise, legitimate user retries or a scheduled test. Correlate identity, device, source and time before escalation.",
      "Match synthetic sign-in events with helpdesk records and device access metadata.",
      "What is the best first step for a failed-login spike?",
      "Validate scope, identity and time correlation",
      "Delete the log stream",
      "Disable all accounts permanently",
      "Triage starts with reproducible contextual evidence.",
      "Does the timestamp align with a known change?"
    ],
    [
      "Understand object authorization",
      "Signing in proves an identity, not permission to access another person's records. A secure backend checks the authenticated user for each private resource. Client-side hiding and hard-to-guess IDs are insufficient.",
      "In a local training application, test that user A is denied reads, updates and deletes of user B's saved record.",
      "Which control prevents cross-tenant object access?",
      "Server-side per-resource authorization",
      "Longer random file names alone",
      "A hidden frontend edit button",
      "Trusted authorization is required for every protected operation.",
      "Can a client bypass the visible interface?"
    ],
    [
      "Prioritize risk proportionately",
      "Assess likelihood, exposure, potential impact and mitigation. CVSS can inform severity but does not prove exploitability in a specific environment. Document evidence and uncertainty.",
      "A public read of private student records may outrank an internal cosmetic security-header warning.",
      "Which report should be prioritized first?",
      "An exposed high-impact issue supported by evidence",
      "The issue with the longest title",
      "All issues assigned maximum severity",
      "Impact and reachability determine useful triage priorities.",
      "What is actually exposed?"
    ],
    [
      "Prepare safe incident response",
      "A basic response process prepares, detects, analyzes, contains, recovers and learns. Preserve relevant evidence, choose proportionate and reversible actions where possible, and document who decided what.",
      "For a fictional compromised test account, record timeline, revoke its sessions in the lab, restore access and confirm recurrence monitoring.",
      "Which response protects investigation quality?",
      "Preserve evidence and document containment decisions",
      "Erase all logs before triage",
      "Attribute a threat actor from one IP",
      "Good response balances evidence, user impact and containment.",
      "Will a future reviewer understand your decision?"
    ],
    [
      "Publish an ethical defensive case study",
      "A security portfolio should explain the authorized lab scope, findings, positive and negative checks, remediation, limitations and lessons. Never publish access tokens or personal data.",
      "Use deliberately synthetic logs and a self-owned test app to demonstrate a fixed ownership check with two test accounts.",
      "What belongs in a responsible defensive project report?",
      "Authorized scope, repeatable checks and clear remediation",
      "Secrets and private customer logs",
      "Unverified claims that all users are compromised",
      "Credible defensive work is specific, scoped and reproducible.",
      "Can someone verify the fix without harming others?"
    ]
  ]
};
const labels=["4","5","6","7","8","9"];
export const flagshipLessonIds=(Object.keys(sources) as FlagshipTrackId[]).flatMap(id=>labels.map(n=>id+"-"+n));
export function additionalFlagshipLessons(id:string):Lesson[]{
  const source=sources[id as FlagshipTrackId];
  if(!source)return [];
  return source.map(([title,concept,example,prompt,correct,a,b,why,hint],i)=>({
    id:id+"-"+labels[i],title,concept,summary:concept.split(/[.!?]/)[0].trim()+".",
    example,prompt,choices:[correct,a,b],correct:0,why,hint,minutes:12+i*2
  }));
}
