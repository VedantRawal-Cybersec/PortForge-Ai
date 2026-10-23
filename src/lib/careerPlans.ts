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
export type SavedCareer={role:string;overview:string;skills:string[];steps:CareerStep[];checked:number[];source:"curated"|"ai";savedAt:number};
const KEY="portforge_career_plan_v1";
export function getCareerPlan():SavedCareer|null{
 try{
  const x=JSON.parse(localStorage.getItem(KEY)||"null");
  if(!x||typeof x.role!=="string"||!Array.isArray(x.steps)||!Array.isArray(x.checked))return null;
  return {role:x.role.slice(0,150),overview:String(x.overview||"").slice(0,1200),skills:Array.isArray(x.skills)?x.skills.slice(0,30):[],steps:x.steps.slice(0,12),checked:x.checked.filter((n:unknown)=>Number.isInteger(n)),source:x.source==="ai"?"ai":"curated",savedAt:Number(x.savedAt)||0};
 }catch{return null;}
}
export function saveCareerPlan(plan:SavedCareer){
 localStorage.setItem(KEY,JSON.stringify(plan));
 window.dispatchEvent(new Event("portforge:career"));
}
