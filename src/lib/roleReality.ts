/** Browser-local educational role simulations, not a hiring or aptitude assessment. */
export type RealityRole="frontend"|"data"|"security";
export type RealityStep={prompt:string;choices:[string,string,string];correct:0|1|2;explanation:string};
export type RealityScenario={id:string;role:RealityRole;title:string;duration:number;setting:string;deliverable:string;steps:[RealityStep,RealityStep,RealityStep]};
export const realityRoles:{id:RealityRole;title:string;summary:string;icon:string;skills:string[]}[]=[
{id:"frontend",title:"Frontend Developer",summary:"Build accessible interfaces and diagnose browser problems.",icon:"💻",skills:["User interfaces","Problem solving","Accessibility"]},
{id:"data",title:"Data Analyst",summary:"Clean messy data, validate calculations and communicate uncertainty.",icon:"📊",skills:["Data quality","SQL reasoning","Evidence"]},
{id:"security",title:"Defensive Security Analyst",summary:"Investigate simulated alerts and explain defensible access controls.",icon:"🛡️",skills:["Triage","Authorization","Incident reporting"]}
];
export const realityScenarios:RealityScenario[]=[
  {
    "id": "frontend-registration",
    "role": "frontend",
    "title": "Repair a student's registration form",
    "duration": 12,
    "setting": "You are a junior frontend developer. Students report that the registration page accepts bad emails and gives no useful error message. No production access is required.",
    "deliverable": "A form validation plan covering input constraints, accessible errors, and test cases.",
    "steps": [
      {
        "prompt": "A student submits an empty name and an email without @. What's the right first move?",
        "choices": [
          "Hide Submit until the user types something",
          "Define validation rules and reproduce the issue with invalid inputs",
          "Assume the API fixes the inputs automatically"
        ],
        "correct": 1,
        "explanation": "Reproduce the failure and define concrete rules before editing. A disabled button alone does not give users useful feedback."
      },
      {
        "prompt": "How should the form communicate an invalid email?",
        "choices": [
          "Use a persistent labelled error associated with the input",
          "Turn only the border red",
          "Show an unlabelled animation that disappears instantly"
        ],
        "correct": 0,
        "explanation": "A readable, programmatically associated message communicates the problem beyond color."
      },
      {
        "prompt": "How should you check your fix?",
        "choices": [
          "Try one valid address and call it complete",
          "Ask a teammate whether it looks premium",
          "Test blank, malformed and valid inputs using mouse and keyboard"
        ],
        "correct": 2,
        "explanation": "Acceptance tests should cover failure and success paths, keyboard operation and clear feedback."
      }
    ]
  },
  {
    "id": "frontend-slow-page",
    "role": "frontend",
    "title": "Improve a slow learning dashboard",
    "duration": 12,
    "setting": "A dashboard with many cards feels slow on older laptops. Your assignment is to investigate the bottleneck rather than guessing.",
    "deliverable": "A baseline measurement, prioritized optimization, and before/after verification plan.",
    "steps": [
      {
        "prompt": "Before changing components, what should you record?",
        "choices": [
          "A rendering profile and a user-relevant timing baseline",
          "How many animations competitors use",
          "A higher target frame rate without measurement"
        ],
        "correct": 0,
        "explanation": "Profile the real interaction to identify where time is spent."
      },
      {
        "prompt": "Profiling finds thousands of cards mounted even when offscreen. What change might help?",
        "choices": [
          "Add more CSS filters",
          "Virtualize the list while keeping accessibility and scrolling usable",
          "Disable error messages"
        ],
        "correct": 1,
        "explanation": "Virtualization can reduce mounted elements; validate its usability and measured improvement."
      },
      {
        "prompt": "What makes the outcome defensible?",
        "choices": [
          "Saying the page feels futuristic",
          "Reporting a faster time without mentioning conditions",
          "Comparing the same task and device before/after with correctness checks"
        ],
        "correct": 2,
        "explanation": "Comparable performance measurements and regression tests make the conclusion credible."
      }
    ]
  },
  {
    "id": "data-duplicate-sales",
    "role": "data",
    "title": "Investigate doubled sales totals",
    "duration": 12,
    "setting": "A data analyst sees that the revenue total doubled after joining sales to a product table. The CFO wants a trustworthy explanation.",
    "deliverable": "A duplicate-key investigation, corrected aggregation, and reconciled revenue report.",
    "steps": [
      {
        "prompt": "What should you inspect first?",
        "choices": [
          "Change the color of the chart",
          "Count the join matches and inspect duplicated product identifiers",
          "Round every revenue total"
        ],
        "correct": 1,
        "explanation": "A one-to-many join can multiply source rows and inflate totals."
      },
      {
        "prompt": "How should you avoid inventing the correct number?",
        "choices": [
          "Reconcile aggregates with raw orders and document filtering assumptions",
          "Divide all numbers by two without evidence",
          "Remove all duplicated values without inspecting meaning"
        ],
        "correct": 0,
        "explanation": "Independent source reconciliation is needed; automatic halving is not defensible."
      },
      {
        "prompt": "What belongs in the final report?",
        "choices": [
          "Only the corrected dashboard screenshot",
          "An apology without calculations",
          "Source counts, join assumptions, corrected totals, and remaining limitations"
        ],
        "correct": 2,
        "explanation": "A reliable analysis communicates method, evidence, and uncertainty."
      }
    ]
  },
  {
    "id": "data-missing-values",
    "role": "data",
    "title": "Clean a customer dataset responsibly",
    "duration": 12,
    "setting": "Your product team wants regional signup statistics. The input CSV has missing regions, inconsistent dates, and duplicate IDs.",
    "deliverable": "A reproducible cleaning rule sheet and a quality summary listing excluded or corrected rows.",
    "steps": [
      {
        "prompt": "Before filling missing values, what should you ask?",
        "choices": [
          "Whether missingness could bias the region comparison",
          "Which pie chart is trendiest",
          "How to drop every missing row without a record"
        ],
        "correct": 0,
        "explanation": "Missing data may have systematic causes and should not be silently erased."
      },
      {
        "prompt": "What is a repeatable cleaning step?",
        "choices": [
          "Manually edit a few screenshots",
          "Parse dates with explicit formats and record conversion failures",
          "Guess unknown regions at random"
        ],
        "correct": 1,
        "explanation": "Deterministic parsing with failure counts supports auditability."
      },
      {
        "prompt": "How should stakeholders use the final chart?",
        "choices": [
          "Treat it as exact regardless of excluded data",
          "Hide sample size to avoid confusion",
          "Review sample size, missingness and assumptions with the insight"
        ],
        "correct": 2,
        "explanation": "Communicating data limitations prevents misleading decisions."
      }
    ]
  },
  {
    "id": "security-alert-triage",
    "role": "security",
    "title": "Triage a suspicious sign-in alert",
    "duration": 14,
    "setting": "You are an entry-level SOC analyst reviewing synthetic logs: one unfamiliar IP, multiple failed sign-ins, then a successful login. No real systems are accessed.",
    "deliverable": "A short alert-triage timeline, supporting evidence, confidence level, and escalation recommendation.",
    "steps": [
      {
        "prompt": "What should you do before declaring account compromise?",
        "choices": [
          "Correlate identity, source, timestamps and known activity",
          "Publish the user's identity publicly",
          "Disable every service without assessment"
        ],
        "correct": 0,
        "explanation": "Multiple observations support a defensible conclusion; one indicator rarely proves compromise."
      },
      {
        "prompt": "The successful login is from an expected VPN egress and a scheduled user test. What changes?",
        "choices": [
          "Ignore all future auth alerts",
          "Update the assessment using the documented context and other signals",
          "Keep a high-severity compromise claim regardless of evidence"
        ],
        "correct": 1,
        "explanation": "Triage must respond to credible benign context while checking for contradictory evidence."
      },
      {
        "prompt": "How should the ticket close?",
        "choices": [
          "Delete the logs so the alarm stops",
          "Write 'false positive' with no evidence",
          "Record a sourced timeline, evidence, remaining uncertainty and follow-up"
        ],
        "correct": 2,
        "explanation": "Detailed, minimal necessary documentation enables review and future tuning."
      }
    ]
  },
  {
    "id": "security-private-record",
    "role": "security",
    "title": "Prevent cross-account data exposure",
    "duration": 14,
    "setting": "In a deliberately fictional application, two students have private assessment records. A report says one can read another student's record by editing an identifier.",
    "deliverable": "A defensive authorization fix plan and a two-user negative test matrix.",
    "steps": [
      {
        "prompt": "Which system boundary must enforce ownership?",
        "choices": [
          "The authoritative server or database policy",
          "Only a hidden button in the UI",
          "Only a random-looking record identifier"
        ],
        "correct": 0,
        "explanation": "Object authorization must run on the trusted side even when clients forge requests."
      },
      {
        "prompt": "Which regression test gives useful negative evidence?",
        "choices": [
          "Test only one administrator",
          "Verify user A cannot read, change, or delete user B's private records",
          "See whether the homepage loads"
        ],
        "correct": 1,
        "explanation": "Cross-account tests must cover unauthorized reads and writes."
      },
      {
        "prompt": "How should findings be communicated?",
        "choices": [
          "Share production account secrets in a public portfolio",
          "Claim all accounts are compromised without validating scope",
          "Record reproducible results using permitted test accounts and recommend a scoped fix"
        ],
        "correct": 2,
        "explanation": "Evidence and ethical test scope matter more than dramatic claims."
      }
    ]
  }
];

export const ROLE_REALITY_KEY="portforge_role_reality_v1";
export type RealityResult={id:string;scenarioId:string;role:RealityRole;answers:number[];correct:number;reflection:string;completedAt:number};
export function getRealityScenario(id:string):RealityScenario|undefined{return realityScenarios.find(s=>s.id===id);}
export function evaluateReality(scenarioId:string,answers:number[],reflection=""):RealityResult{
 const s=getRealityScenario(scenarioId);
 if(!s||answers.length!==s.steps.length||!answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<s.steps[i].choices.length))
   throw Error("Complete all role simulation decisions using the provided choices.");
 return {id:crypto.randomUUID(),scenarioId:s.id,role:s.role,answers:[...answers],
   correct:s.steps.filter((step,i)=>step.correct===answers[i]).length,
   reflection:reflection.trim().slice(0,1200),completedAt:Date.now()};
}
export function readRealityResults():RealityResult[]{
 try{
   const raw:unknown=JSON.parse(localStorage.getItem(ROLE_REALITY_KEY)||"[]");
   if(!Array.isArray(raw))return [];
   return raw.slice(0,30).filter((candidate):candidate is RealityResult=>{
    if(!candidate||typeof candidate!=="object"||Array.isArray(candidate))return false;
    const v=candidate as Record<string,unknown>;
    const s=typeof v.scenarioId==="string"?getRealityScenario(v.scenarioId):undefined;
    if(!s||v.role!==s.role||typeof v.id!=="string"||v.id.length>80||
       typeof v.reflection!=="string"||v.reflection.length>1200||
       typeof v.completedAt!=="number"||!Number.isFinite(v.completedAt))return false;
    if(!Array.isArray(v.answers)||v.answers.length!==s.steps.length||
       !v.answers.every((a:unknown,i:number)=>Number.isInteger(a)&&Number(a)>=0&&Number(a)<s.steps[i].choices.length))return false;
    return v.correct===s.steps.filter((step,i)=>step.correct===v.answers[i]).length;
   });
 }catch{return [];}
}
export function saveRealityResult(result:RealityResult):void{
 if(!getRealityScenario(result.scenarioId)||
   !Number.isInteger(result.correct)||result.correct<0||result.correct>3)throw Error("Invalid simulation result.");
 localStorage.setItem(ROLE_REALITY_KEY,JSON.stringify([result,...readRealityResults()].slice(0,30)));
 window.dispatchEvent(new Event("portforge:role-reality"));
}
export function realityReport(result:RealityResult):string{
 const s=getRealityScenario(result.scenarioId);
 if(!s)throw Error("The scenario is no longer available.");
 return ["PortForge Role Reality Lab — educational simulation",
  "Scenario: "+s.title,"Role: "+realityRoles.find(r=>r.id===s.role)?.title,
  "These decisions are based on fictional scenarios, not validated occupational readiness.",
  "Locally checked decisions: "+result.correct+"/"+result.answers.length,
  ...s.steps.map((step,i)=>[
    "Decision "+(i+1)+": "+step.prompt,
    "Your choice: "+step.choices[result.answers[i]],
    "Recommended: "+step.choices[step.correct],
    "Explanation: "+step.explanation
  ].join("\n")),"Proposed deliverable: "+s.deliverable,"Your own reflection: "+(result.reflection||"Not provided")].join("\n\n");
}
