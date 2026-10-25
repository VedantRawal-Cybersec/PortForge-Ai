/** Reviewed-by-software educational prototype; NOT expert-calibrated or certified. */
export type TopicId="frontend"|"data"|"security";
export type Difficulty="beginner"|"intermediate"|"advanced";
export type KnowledgeItem={id:string;version:1;topic:TopicId;difficulty:Difficulty;concept:string;question:string;options:[string,string,string,string];answer:number;explanation:string;practice:string};
export const topics:{id:TopicId;title:string;description:string}[]=[
{id:"frontend",title:"Frontend Development",description:"HTML, JavaScript, React and accessible experiences"},
{id:"data",title:"SQL and Data Analysis",description:"SQL queries, joins, statistics and data trust"},
{id:"security",title:"Defensive Cybersecurity",description:"Defensive fundamentals, investigation and authorization"}
];
export const knowledgeItems:KnowledgeItem[]=[
  {
    "id": "frontend:beginner:0",
    "version": 1,
    "topic": "frontend",
    "difficulty": "beginner",
    "concept": "HTML semantics",
    "question": "Which element represents the primary navigation links?",
    "options": [
      "nav",
      "div",
      "b",
      "small"
    ],
    "answer": 0,
    "explanation": "Use the nav landmark for navigation links.",
    "practice": "Build a page with nav, main and footer."
  },
  {
    "id": "frontend:beginner:1",
    "version": 1,
    "topic": "frontend",
    "difficulty": "beginner",
    "concept": "JavaScript variables",
    "question": "What does let x=2; x+=3; produce?",
    "options": [
      "2",
      "3",
      "5",
      "23"
    ],
    "answer": 2,
    "explanation": "The += operator adds three to the existing numeric value two.",
    "practice": "Write and test three variable updates."
  },
  {
    "id": "frontend:beginner:2",
    "version": 1,
    "topic": "frontend",
    "difficulty": "beginner",
    "concept": "Accessible form labels",
    "question": "Which gives a form field a reliable accessible name?",
    "options": [
      "Only placeholder text",
      "A matching label and input id",
      "Color alone",
      "A CSS class"
    ],
    "answer": 1,
    "explanation": "An associated label supplies a programmatic accessible name.",
    "practice": "Make a form navigable with the keyboard."
  },
  {
    "id": "frontend:intermediate:3",
    "version": 1,
    "topic": "frontend",
    "difficulty": "intermediate",
    "concept": "Async failures",
    "question": "What is the most useful behavior when an API request fails?",
    "options": [
      "Spin indefinitely",
      "Show a recoverable error and retry",
      "Assume success",
      "Clear all user input"
    ],
    "answer": 1,
    "explanation": "Failure UI should explain an error and preserve recoverability.",
    "practice": "Build loading, error and success states."
  },
  {
    "id": "frontend:intermediate:4",
    "version": 1,
    "topic": "frontend",
    "difficulty": "intermediate",
    "concept": "React state",
    "question": "What is a reliable way to update one item in a React state array?",
    "options": [
      "Mutate in place",
      "Return a new array containing the changed item",
      "Reload the page",
      "Update CSS only"
    ],
    "answer": 1,
    "explanation": "Immutable updates make React state changes predictable.",
    "practice": "Write and test a pure array update helper."
  },
  {
    "id": "frontend:intermediate:5",
    "version": 1,
    "topic": "frontend",
    "difficulty": "intermediate",
    "concept": "Effect cleanup",
    "question": "Why clean up an event subscription from a React effect?",
    "options": [
      "Shorter syntax",
      "Prevent duplicate handlers and leaks",
      "Improve colors",
      "Avoid labels"
    ],
    "answer": 1,
    "explanation": "Cleanup removes no-longer-needed subscriptions.",
    "practice": "Write an effect that unsubscribes on cleanup."
  },
  {
    "id": "frontend:advanced:6",
    "version": 1,
    "topic": "frontend",
    "difficulty": "advanced",
    "concept": "Race conditions",
    "question": "Two searches return in the wrong order. Which design prevents stale results winning?",
    "options": [
      "No validation",
      "Cancel obsolete work or track latest request identity",
      "Always merge",
      "Hide responses"
    ],
    "answer": 1,
    "explanation": "Cancellation or request IDs guard against out-of-order completion.",
    "practice": "Test search requests with simulated network delays."
  },
  {
    "id": "frontend:advanced:7",
    "version": 1,
    "topic": "frontend",
    "difficulty": "advanced",
    "concept": "Rendering cost",
    "question": "How should you optimize a very large rendering list?",
    "options": [
      "Memoize everything",
      "Profile bottlenecks and consider virtualization",
      "Remove all keys",
      "Turn off errors"
    ],
    "answer": 1,
    "explanation": "Measure actual bottlenecks and use virtualization where warranted.",
    "practice": "Record before-and-after render costs."
  },
  {
    "id": "frontend:advanced:8",
    "version": 1,
    "topic": "frontend",
    "difficulty": "advanced",
    "concept": "Modal accessibility",
    "question": "What must an accessible custom modal manage?",
    "options": [
      "Only shape and colors",
      "Focus entry, trapping and restoration with appropriate semantics",
      "Only a close icon",
      "Only animation"
    ],
    "answer": 1,
    "explanation": "Dialog behavior needs keyboard and focus management.",
    "practice": "Test keyboard tab order, Escape and focus restoration."
  },
  {
    "id": "data:beginner:9",
    "version": 1,
    "topic": "data",
    "difficulty": "beginner",
    "concept": "SQL SELECT",
    "question": "Which SQL statement reads the name column of students?",
    "options": [
      "SELECT name FROM students;",
      "DROP students;",
      "DELETE name FROM students;",
      "INSERT name;"
    ],
    "answer": 0,
    "explanation": "SELECT retrieves values without altering table rows.",
    "practice": "Read columns from a small local SQL fixture."
  },
  {
    "id": "data:beginner:10",
    "version": 1,
    "topic": "data",
    "difficulty": "beginner",
    "concept": "SQL WHERE",
    "question": "What does a WHERE clause do in a SELECT query?",
    "options": [
      "Sort by default",
      "Filter rows matching a condition",
      "Drop a column",
      "Encrypt records"
    ],
    "answer": 1,
    "explanation": "WHERE filters the result set.",
    "practice": "Filter a synthetic dataset using two conditions."
  },
  {
    "id": "data:beginner:11",
    "version": 1,
    "topic": "data",
    "difficulty": "beginner",
    "concept": "Missing values",
    "question": "How do you test a SQL column for NULL?",
    "options": [
      "= NULL",
      "IS NULL",
      "LIKE NULL",
      "IS EMPTY"
    ],
    "answer": 1,
    "explanation": "IS NULL tests unknown/missing database values.",
    "practice": "List missing emails from a synthetic table."
  },
  {
    "id": "data:intermediate:12",
    "version": 1,
    "topic": "data",
    "difficulty": "intermediate",
    "concept": "LEFT JOIN",
    "question": "Why use LEFT JOIN when reporting all customers and their orders?",
    "options": [
      "Drop customers without orders",
      "Keep all left customers, even unmatched ones",
      "Sort tables",
      "Create an index"
    ],
    "answer": 1,
    "explanation": "LEFT JOIN retains left-side rows with NULLs for unmatched right side.",
    "practice": "Report customers with zero orders."
  },
  {
    "id": "data:intermediate:13",
    "version": 1,
    "topic": "data",
    "difficulty": "intermediate",
    "concept": "Grouping",
    "question": "Which query counts orders per customer?",
    "options": [
      "SELECT COUNT(*) FROM orders",
      "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id",
      "SELECT DISTINCT customer_id FROM orders",
      "DELETE FROM orders"
    ],
    "answer": 1,
    "explanation": "GROUP BY creates per-customer aggregates.",
    "practice": "Check group counts with known sample rows."
  },
  {
    "id": "data:intermediate:14",
    "version": 1,
    "topic": "data",
    "difficulty": "intermediate",
    "concept": "Join duplication",
    "question": "A report total doubles after a join. What should you inspect?",
    "options": [
      "Formatting",
      "Join cardinality and duplicate keys",
      "Browser zoom",
      "Chart colors"
    ],
    "answer": 1,
    "explanation": "One-to-many joins can multiply records before aggregation.",
    "practice": "Test a join on a fixture with duplicated keys."
  },
  {
    "id": "data:advanced:15",
    "version": 1,
    "topic": "data",
    "difficulty": "advanced",
    "concept": "Concurrent updates",
    "question": "Two users try to reserve the last item. Which option reduces overselling?",
    "options": [
      "Unprotected read then write",
      "Atomic conditional update or appropriate transaction",
      "Hide the item",
      "Delay the browser"
    ],
    "answer": 1,
    "explanation": "Atomic updates or suitable transactions guard shared state.",
    "practice": "Test competing writes on a disposable DB."
  },
  {
    "id": "data:advanced:16",
    "version": 1,
    "topic": "data",
    "difficulty": "advanced",
    "concept": "Query plans",
    "question": "How should you choose indexes for a slow query?",
    "options": [
      "Index everything",
      "Inspect execution plans and realistic workload",
      "Change a chart",
      "Always drop indexes"
    ],
    "answer": 1,
    "explanation": "Use an execution plan to understand scans, selectivity and cost.",
    "practice": "Compare EXPLAIN output before and after indexing."
  },
  {
    "id": "data:advanced:17",
    "version": 1,
    "topic": "data",
    "difficulty": "advanced",
    "concept": "Window functions",
    "question": "What can a window aggregate do that a GROUP BY aggregate cannot do identically?",
    "options": [
      "Always run faster",
      "Keep individual result rows while calculating partition aggregates",
      "Remove permissions",
      "Delete duplicates"
    ],
    "answer": 1,
    "explanation": "Window functions calculate per partition without collapsing every row.",
    "practice": "Rank sales within groups using a window function."
  },
  {
    "id": "security:beginner:18",
    "version": 1,
    "topic": "security",
    "difficulty": "beginner",
    "concept": "Confidentiality",
    "question": "Which property protects information from unauthorized disclosure?",
    "options": [
      "Availability",
      "Confidentiality",
      "Compression",
      "Latency"
    ],
    "answer": 1,
    "explanation": "Confidentiality restricts who may access information.",
    "practice": "Describe a real-world confidentiality safeguard."
  },
  {
    "id": "security:beginner:19",
    "version": 1,
    "topic": "security",
    "difficulty": "beginner",
    "concept": "MFA",
    "question": "What does multifactor authentication combine?",
    "options": [
      "Two passwords of the same kind",
      "Independent factor categories",
      "Only email",
      "A public token"
    ],
    "answer": 1,
    "explanation": "Different factor categories provide stronger account protection.",
    "practice": "Describe password plus authenticator sign-in."
  },
  {
    "id": "security:beginner:20",
    "version": 1,
    "topic": "security",
    "difficulty": "beginner",
    "concept": "Least privilege",
    "question": "What is least privilege?",
    "options": [
      "Everyone gets admin",
      "Permissions limited to necessary tasks",
      "All public access",
      "No login"
    ],
    "answer": 1,
    "explanation": "Limit permissions to the tasks the identity needs.",
    "practice": "Define read-only database permissions."
  },
  {
    "id": "security:intermediate:21",
    "version": 1,
    "topic": "security",
    "difficulty": "intermediate",
    "concept": "Object authorization",
    "question": "A user changes an ID and reads someone else's private record. What is missing?",
    "options": [
      "CSS validation",
      "Server-side object authorization",
      "Longer random IDs alone",
      "A spinner"
    ],
    "answer": 1,
    "explanation": "Every object access needs a server-side ownership/policy check.",
    "practice": "Create negative authorization tests for two test users."
  },
  {
    "id": "security:intermediate:22",
    "version": 1,
    "topic": "security",
    "difficulty": "intermediate",
    "concept": "Incident triage",
    "question": "What should happen before declaring an unfamiliar IP to be an attack?",
    "options": [
      "Erase logs",
      "Correlate context and evidence",
      "Make public accusations",
      "Disable all services"
    ],
    "answer": 1,
    "explanation": "An isolated indicator is insufficient proof of compromise.",
    "practice": "Triage sample logs with explicit uncertainty."
  },
  {
    "id": "security:intermediate:23",
    "version": 1,
    "topic": "security",
    "difficulty": "intermediate",
    "concept": "Production secrets",
    "question": "Where should sensitive backend API tokens be stored?",
    "options": [
      "Public frontend code",
      "Protected server secrets or environment",
      "Git README",
      "HTML comments"
    ],
    "answer": 1,
    "explanation": "Server secrets cannot be distributed in frontend assets.",
    "practice": "Audit a sample project for secret exposure."
  },
  {
    "id": "security:advanced:24",
    "version": 1,
    "topic": "security",
    "difficulty": "advanced",
    "concept": "Tenant isolation",
    "question": "Which test best checks multi-tenant privacy?",
    "options": [
      "One admin test",
      "Check A cannot read, update or delete B's records",
      "Only CSS audit",
      "Home page load"
    ],
    "answer": 1,
    "explanation": "Negative cross-tenant operation tests validate isolation.",
    "practice": "Create two synthetic users and test read/write/delete denial."
  },
  {
    "id": "security:advanced:25",
    "version": 1,
    "topic": "security",
    "difficulty": "advanced",
    "concept": "Threat modeling",
    "question": "What inputs are most useful for a practical threat model?",
    "options": [
      "Button colors",
      "Assets, actors, flows and trust boundaries",
      "Only commit count",
      "Only marketing"
    ],
    "answer": 1,
    "explanation": "Flows and boundaries expose credible abuse paths.",
    "practice": "Diagram data flows and trust boundaries."
  },
  {
    "id": "security:advanced:26",
    "version": 1,
    "topic": "security",
    "difficulty": "advanced",
    "concept": "AI spending controls",
    "question": "Why is browser-side rate limiting not sufficient for costly AI calls?",
    "options": [
      "It changes CSS",
      "Attackers can bypass clients; enforce atomic server quotas",
      "All clients are honest",
      "API usage is free"
    ],
    "answer": 1,
    "explanation": "Billable limits need trusted server-side authorization and accounting.",
    "practice": "Model concurrent requests and global quota limits."
  }
];

export type KnowledgeAnswer={itemId:string;selected:number;correct:boolean;difficulty:Difficulty};
export type KnowledgeSession={id:string;topic:TopicId;started:Difficulty;startedAt:number;completedAt:number;answers:KnowledgeAnswer[]};
export const KNOWLEDGE_KEY="portforge_knowledge_checks_v1";
const levels:Difficulty[]=["beginner","intermediate","advanced"];
export function createKnowledgeSession(topic:TopicId,started:Difficulty):KnowledgeSession{
  return {id:crypto.randomUUID(),topic,started,startedAt:Date.now(),completedAt:0,answers:[]};
}
export function questionForSession(s:KnowledgeSession):KnowledgeItem|null{
  if(s.answers.length>=6)return null;
  const used=new Set(s.answers.map(a=>a.itemId));
  const recent=s.answers.slice(-2);
  let level=s.answers.at(-1)?.difficulty||s.started;
  if(recent.length===2&&recent.every(x=>x.correct))level=levels[Math.min(2,levels.indexOf(level)+1)];
  if(recent.length===2&&recent.every(x=>!x.correct))level=levels[Math.max(0,levels.indexOf(level)-1)];
  for(const candidate of [level,...levels.filter(x=>x!==level)]){
    const question=knowledgeItems.find(x=>x.topic===s.topic&&x.difficulty===candidate&&!used.has(x.id));
    if(question)return question;
  }
  return null;
}
export function answerKnowledge(s:KnowledgeSession,item:KnowledgeItem,selected:number):KnowledgeSession{
  if(s.topic!==item.topic||questionForSession(s)?.id!==item.id||!Number.isInteger(selected)||selected<0||selected>3)
    throw Error("This answer does not match the current item.");
  const answers=[...s.answers,{itemId:item.id,selected,correct:item.answer===selected,difficulty:item.difficulty}];
  return {...s,answers,completedAt:answers.length===6?Date.now():0};
}
export function readKnowledgeSessions():KnowledgeSession[]{
  try{
    const value:unknown=JSON.parse(localStorage.getItem(KNOWLEDGE_KEY)||"[]");
    if(!Array.isArray(value))return [];
    return value.slice(0,40).filter((s):s is KnowledgeSession=>
      !!s&&typeof s==="object"&&typeof s.id==="string"&&topics.some(t=>t.id===s.topic)&&
      levels.includes(s.started)&&Number.isFinite(s.startedAt)&&Number.isFinite(s.completedAt)&&
      Array.isArray(s.answers)&&s.answers.length<=6&&s.answers.every((a:KnowledgeAnswer)=>
        !!a&&typeof a.itemId==="string"&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<=3&&typeof a.correct==="boolean"));
  }catch{return [];}
}
export function saveKnowledgeSession(s:KnowledgeSession):void{
  const previous=readKnowledgeSessions().filter(x=>x.id!==s.id);
  localStorage.setItem(KNOWLEDGE_KEY,JSON.stringify([s,...previous].slice(0,40)));
  window.dispatchEvent(new Event("portforge:knowledge-checks"));
}
export function knowledgeSummary(sessions:KnowledgeSession[]){
  return topics.map(topic=>{
    const attempts=sessions.filter(x=>x.topic===topic.id);
    const responses=attempts.flatMap(x=>x.answers);
    return {topic:topic.id,title:topic.title,attempts:responses.length,
      correct:responses.filter(a=>a.correct).length,completed:attempts.filter(x=>x.completedAt>0).length,
      recommended:responses.length===0?"Begin a quick check":
        responses.filter(a=>a.correct).length/responses.length<0.7?"Review missed concepts and retry":
        "Apply the knowledge in a small practical project"};
  });
}
export function knowledgeReport(s:KnowledgeSession):string{
  return ["PortForge locally checked practice notes","Topic: "+s.topic,"Starting level: "+s.started,
    "Locally checked answer-key practice. Not a verified qualification or standardized assessment.",
    ...s.answers.map((a,i)=>{
      const q=knowledgeItems.find(x=>x.id===a.itemId);
      return [String(i+1)+". "+(q?.question||"Question"),"Your response: "+(q?.options[a.selected]||""),
        a.correct?"Correct":"Needs review",q?.explanation||"",q?.practice||""].join("\n");
    })].join("\n\n");
}
