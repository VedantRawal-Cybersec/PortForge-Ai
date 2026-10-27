import {getLearning,getLearningTrack} from "./academy";
import {getPractice,exercises} from "./practice";
import {getShowcaseProjects} from "./showcaseProjects";

export type FlagshipId="frontend"|"data-analyst"|"cybersecurity";
export type Milestone={id:string;title:string;description:string;complete:boolean;link:string;evidence:string};
export const flagshipPlans:{id:FlagshipId;title:string;project:string;exerciseIds:string[];keywords:string[]}[]=[
 {id:"frontend",title:"Frontend Developer",project:"Build and document an accessible, responsive app",exerciseIds:["real-form-validation","immutable-task-update","capstone-frontend-form"],keywords:["frontend","react","javascript","form","accessible","website"]},
 {id:"data-analyst",title:"Data Analyst",project:"Create a reproducible data-quality and analysis report",exerciseIds:["data-quality-counts","valid-revenue-report"],keywords:["data","analysis","sql","report","dashboard","dataset"]},
 {id:"cybersecurity",title:"Defensive Cybersecurity",project:"Investigate a synthetic alert and document a scoped security fix",exerciseIds:["synthetic-auth-log-counts","owner-authorization-model"],keywords:["security","soc","incident","authorization","logs","defensive"]}
];
export function getFlagshipMilestones(id:FlagshipId):Milestone[]{
 const plan=flagshipPlans.find(p=>p.id===id);
 const track=getLearningTrack(id);
 if(!plan||!track)return [];
 const completed=new Set(getLearning().passed);
 const attempts=getPractice();
 const authored=getShowcaseProjects();
 const learned=track.lessons.filter(l=>completed.has(l.id)).length;
 const tests=plan.exerciseIds.map(x=>{
   const attempt=attempts.find(p=>p.exerciseId===x);
   const exercise=exercises.find(p=>p.id===x);
   const passes=Boolean(attempt&&exercise&&attempt.total===exercise.tests.length&&attempt.passed===exercise.tests.length&&attempt.results.length===exercise.tests.length&&attempt.results.every(r=>r.pass));
   return {id:x,passes,title:exercise?.title||x};
 });
 const relevant=authored.find(p=>
   p.title.trim().length>=3&&p.summary.trim().length>=10&&
   plan.keywords.some(word=>(p.title+" "+p.summary+" "+p.technologies).toLowerCase().includes(word)));
 const documented=Boolean(relevant&&relevant.challenge.trim().length>=20&&relevant.approach.trim().length>=20&&relevant.validation.trim().length>=20&&relevant.outcome.trim().length>=10);
 const checks:Milestone[]=[
 {id:id+":learn",title:"Understand core concepts",description:"Finish the first three introductory lessons in this career path.",complete:track.lessons.slice(0,3).every(l=>completed.has(l.id)),link:"/learn?track="+id,evidence:learned+"/"+track.lessons.length+" total lessons recorded locally"},
 {id:id+":deepen",title:"Explore the deeper curriculum",description:"Complete the extended flagship lessons and revisit difficult concepts.",complete:track.lessons.every(l=>completed.has(l.id)),link:"/learn?track="+id,evidence:learned+"/"+track.lessons.length+" locally checked lessons"},
 ...tests.map(t=>({id:id+":test:"+t.id,title:"Execute: "+t.title,description:"Complete every recorded sample test in the browser for this selected exercise.",complete:t.passes,link:"/practice?exercise="+t.id,evidence:t.passes?"All local sample cases recorded as passed":"No complete passing run saved"})),
 {id:id+":portfolio",title:"Explain and document genuine project work",description:"Add a relevant project with its problem, approach, real validation and outcome. This checklist uses self-authored text; it is not externally verified.",complete:documented,link:"/portfolio",evidence:documented?"Relevant case study sections filled (self-reported)":"Document a project with substantive problem, method, validation and outcome"}
 ];
 return checks;
}
export function flagshipOverview(){
 return flagshipPlans.map(p=>{
  const steps=getFlagshipMilestones(p.id);
  const passed=steps.filter(s=>s.complete).length;
  return {id:p.id,title:p.title,project:p.project,passed,total:steps.length,steps,finished:steps.length>0&&passed===steps.length};
 });
}
