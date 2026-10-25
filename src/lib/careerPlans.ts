import { type PracticeLevel, parsePracticeLevel } from "./practiceLevels";
export type CareerStep={title:string;description:string};
export type CareerPath={id:string;role:string;overview:string;skills:string[];steps:CareerStep[]};
export const starterCareers:CareerPath[]=[
 {id:"frontend",role:"Frontend Developer",overview:"Create accessible interactive websites and explain how you test them.",skills:["HTML & CSS","JavaScript","React fundamentals","Accessibility","Git","Testing"],steps:[
 {title:"Understand the Web",description:"Learn HTML semantics, responsive layouts and browser fundamentals."},
 {title:"Practice JavaScript",description:"Solve functions, conditions and data-structure exercises independently."},
 {title:"Build and test",description:"Create an accessible multipage project and write meaningful tests."},
 {title:"Explain your work",description:"Document design choices, results and limitations; rehearse a project interview."}]},
 {id:"data",role:"Data Analyst",overview:"Turn messy data into trustworthy analysis and decisions.",skills:["Spreadsheets","SQL","Statistics","Python","Data visualization","Communication"],steps:[
 {title:"Learn data basics",description:"Practice types of data, quality checks and responsible interpretation."},
 {title:"Query and transform",description:"Analyze example datasets using formulas, SQL and Python."},
 {title:"Build a case study",description:"Explain a data question, cleaning decisions, visualizations and limitations."},
 {title:"Communicate conclusions",description:"Present grounded results without exaggerating certainty."}]},
 {id:"design",role:"Product / UX Designer",overview:"Investigate user needs and create usable, accessible interfaces.",skills:["User research","Wireframes","Prototyping","Accessibility","Usability testing","Communication"],steps:[
 {title:"Understand a user problem",description:"Interview stakeholders and clarify the desired outcome."},
 {title:"Explore solutions",description:"Sketch flows and create wireframes with clear interaction goals."},
 {title:"Test the prototype",description:"Observe real users; prioritize issues based on evidence."},
 {title:"Build a case study",description:"Show rationale, revisions and honest product outcomes."}]},
 {id:"marketing",role:"Digital Marketing Specialist",overview:"Plan measurable campaigns and communicate with audiences.",skills:["Audience research","Copywriting","Analytics","Content strategy","SEO basics","Experimentation"],steps:[
 {title:"Understand the customer",description:"Build an audience hypothesis and research their real needs."},
 {title:"Create content",description:"Draft a campaign with measurable goals and accessible messaging."},
 {title:"Measure outcomes",description:"Use consistent definitions and track relevant campaign metrics."},
 {title:"Explain improvements",description:"Present what worked, what did not, and what you would change."}]},
 {id:"security",role:"Cybersecurity Analyst",overview:"Develop defensive analysis, system fundamentals and incident reporting.",skills:["Networking","Linux basics","Security principles","Log analysis","Incident response","Reporting"],steps:[
 {title:"Learn system fundamentals",description:"Understand networking, operating systems and the CIA triad."},
 {title:"Practice safe analysis",description:"Interpret sample logs and identify suspicious patterns."},
 {title:"Document a scenario",description:"Write a defensible incident report based on authorized lab evidence."},
 {title:"Communicate response",description:"Explain root cause, detection logic and remediation steps."}]}
];
const demonstrators: Record<string, Record<PracticeLevel, string>> = {
  frontend: {
    beginner: "Create an accessible personal site with responsive navigation and an explicit keyboard test.",
    intermediate: "Develop a responsive dashboard with loading/error states, reusable components and documented testing.",
    advanced: "Architect a performant multi-page frontend, benchmark Core Web Vitals and explain accessibility and caching trade-offs.",
  },
  data: {
    beginner: "Clean a small spreadsheet and document five data-quality checks and one clear chart.",
    intermediate: "Combine two datasets using SQL, validate joins and explain insights with reproducible charts.",
    advanced: "Design a versioned analytics workflow, define data-quality invariants and measure query performance.",
  },
  design: {
    beginner: "Research a single user need, sketch two flows and ask someone to test the simplest prototype.",
    intermediate: "Create a working interactive prototype and analyse at least three observed usability issues.",
    advanced: "Defend a design-system architecture using accessibility audits, observed outcomes and research limitations.",
  },
  marketing: {
    beginner: "Plan three accessible posts for one clearly defined audience and explain the intended outcome.",
    intermediate: "Design a small content experiment with a primary metric, measurement plan and ethical attribution.",
    advanced: "Develop a multi-channel experiment and explain incrementality, statistical uncertainty and privacy trade-offs.",
  },
  security: {
    beginner: "Inspect a permitted sample log dataset and write a short report with two indicators of unusual activity.",
    intermediate: "Analyse an authorized lab incident, document evidence, response steps and a reproducible detection rule.",
    advanced: "Threat-model a multi-tenant system and validate defensive controls with negative authorization tests.",
  },
};
export function makeCuratedCareerPlan(path: CareerPath, difficulty: PracticeLevel, skillsAlreadyKnown = ""): SavedCareer {
  const known = skillsAlreadyKnown.toLowerCase().split(/[,;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 20);
  const challenges = demonstrators[path.id];
  const proof = challenges?.[difficulty] || "Create and document a project appropriate to your target role.";
  const levelTask = difficulty === "beginner"
    ? "Focus on one manageable example and explain it in everyday language."
    : difficulty === "intermediate"
      ? "Add test cases, failure handling and a written explanation of key trade-offs."
      : "Measure outcomes, evaluate alternatives, explain failure modes and document reproducible evidence.";
  const steps = path.steps.map((s, i) => ({
    title: s.title,
    description: i === 2 ? `${s.description} Portfolio deliverable: ${proof}` :
      `${s.description} ${levelTask}`,
  }));
  return {
    role: path.role, overview: path.overview, skills: path.skills,
    steps, checked: [], source: "curated", savedAt: Date.now(),
    difficulty, knownSkills: known,
  };
}
export type SavedCareer={role:string;overview:string;skills:string[];steps:CareerStep[];checked:number[];source:"curated"|"ai";savedAt:number;difficulty?:PracticeLevel;knownSkills?:string[]};
const KEY="portforge_career_plan_v1";
export function getCareerPlan():SavedCareer|null{
 try{
  const x=JSON.parse(localStorage.getItem(KEY)||"null");
  if(!x||typeof x.role!=="string"||!Array.isArray(x.steps)||!Array.isArray(x.checked))return null;
  return {role:x.role.slice(0,150),overview:String(x.overview||"").slice(0,1200),skills:Array.isArray(x.skills)?x.skills.slice(0,30):[],steps:x.steps.slice(0,12),checked:x.checked.filter((n:unknown)=>Number.isInteger(n)),source:x.source==="ai"?"ai":"curated",savedAt:Number(x.savedAt)||0,difficulty:parsePracticeLevel(x.difficulty),knownSkills:Array.isArray(x.knownSkills)?x.knownSkills.filter((y:unknown)=>typeof y==="string").slice(0,20):[]};
 }catch{return null;}
}
export function saveCareerPlan(plan:SavedCareer){
 localStorage.setItem(KEY,JSON.stringify(plan));
 window.dispatchEvent(new Event("portforge:career"));
}
