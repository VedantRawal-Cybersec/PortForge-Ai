import {getLearning,tracks} from "./academy";
import {readTrackChecks} from "./trackChecks";
import {readKnowledgeSessions,knowledgeItems} from "./knowledgeChecks";
import {getPractice,exercises} from "./practice";
import {getShowcaseProjects} from "./showcaseProjects";
import {readRealityResults,getRealityScenario} from "./roleReality";

/** A browser-local evidence inventory. Nothing here constitutes third-party verification. */
export type ProofKind="lesson"|"answer-key"|"browser-test"|"simulation"|"authored";
export type ProofEntry={id:string;kind:ProofKind;title:string;detail:string;recordedAt:number|null;link:string};
export type ProofSummary={
  lessons:number;trackAttempts:number;knowledgeQuestions:number;testedExercises:number;
  testCasesPassed:number;roleSimulations:number;authoredProjects:number;entries:ProofEntry[];
};
const knownLesson=new Map(tracks.flatMap(t=>t.lessons.map(l=>[l.id,{name:t.name,title:l.title,trackId:t.id}] as const)));
const date=(value:unknown)=>typeof value==="number"&&Number.isFinite(value)&&value>0?value:null;
export function getProofSummary():ProofSummary{
 const record=getLearning();
 const quick=readTrackChecks();
 const knowledge=readKnowledgeSessions();
 const practice=getPractice();
 const scenarios=readRealityResults();
 const projects=getShowcaseProjects();
 const lessonEntries:ProofEntry[]=record.passed.filter(x=>knownLesson.has(x)).slice(0,220).map(id=>{
  const l=knownLesson.get(id)!;
  return {id:"lesson:"+id,kind:"lesson",title:l.title,detail:"Completed a locally checked introductory lesson in "+l.name,
    recordedAt:null,link:"/learn?track="+encodeURIComponent(l.trackId)};
 });
 const quickEntries:ProofEntry[]=quick.map(x=>({
  id:"quick:"+x.id,kind:"answer-key",title:"Introductory check: "+(tracks.find(t=>t.id===x.trackId)?.name||"Learning track"),
  detail:x.correct+"/"+x.answers.length+" answers matched the local answer key.",recordedAt:date(x.completedAt),link:"/skill-test"}));
 const knowledgeEntries:ProofEntry[]=knowledge.filter(x=>x.answers.length>0).map(x=>({
  id:"knowledge:"+x.id,kind:"answer-key",title:"Knowledge check: "+x.topic,
  detail:x.answers.filter(a=>a.correct).length+"/"+x.answers.length+" locally correct; sampled concepts, not formal proficiency.",
  recordedAt:date(x.completedAt)||date(x.startedAt),link:"/skill-test"}));
 const browserEntries:ProofEntry[]=practice.filter(p=>p.total>0).map(p=>({
  id:"practice:"+p.exerciseId,kind:"browser-test",
  title:"Code practice: "+(exercises.find(e=>e.id===p.exerciseId)?.title||"Exercise"),
  detail:p.passed+"/"+p.total+" browser-executed sample tests passed; results not externally attested.",
  recordedAt:date(p.updatedAt),link:"/practice"}));
 const roleEntries:ProofEntry[]=scenarios.map(s=>({
  id:"reality:"+s.id,kind:"simulation",title:getRealityScenario(s.scenarioId)?.title||"Role simulation",
  detail:s.correct+"/"+s.answers.length+" recommended decisions selected in a fictional case. Not verified job aptitude.",
  recordedAt:date(s.completedAt),link:"/role-lab?role="+s.role}));
 const projectEntries:ProofEntry[]=projects.map(p=>({
  id:"project:"+p.id,kind:"authored",title:p.title,
  detail:"User-authored project case study"+(p.validation.trim()?"; testing details self-reported.":". No independent validation."),
  recordedAt:date(p.updatedAt),link:"/portfolio"}));
 const entries=[...quickEntries,...knowledgeEntries,...browserEntries,...roleEntries,...projectEntries,...lessonEntries]
  .sort((a,b)=>(b.recordedAt||0)-(a.recordedAt||0)).slice(0,120);
 return {
  lessons:lessonEntries.length,trackAttempts:quick.length,
  knowledgeQuestions:knowledge.reduce((sum,s)=>sum+s.answers.length,0),
  testedExercises:practice.filter(p=>p.total>0&&p.total===p.passed).length,
  testCasesPassed:practice.reduce((sum,p)=>sum+(p.results||[]).filter(r=>r.pass).length,0),
  roleSimulations:scenarios.length,authoredProjects:projects.length,entries
 };
}
export function exportProofSummary(proof:ProofSummary):string{
 const lines=["# PortForge — Personal learning evidence inventory","",
  "Generated: "+new Date().toISOString(),
  "This report derives from browser-local records that the user can change. It is not a verified credential, proctored assessment, or independent attestation.",
  "",
  "## Counts",
  "- Locally completed introductory lessons: "+proof.lessons,
  "- Introductory topic checks: "+proof.trackAttempts,
  "- Knowledge-check answers: "+proof.knowledgeQuestions,
  "- Exercises whose current recorded sample tests all passed: "+proof.testedExercises,
  "- Passing recorded browser test cases: "+proof.testCasesPassed,
  "- Fictional workplace simulations: "+proof.roleSimulations,
  "- User-authored portfolio projects: "+proof.authoredProjects,
  "",
  "## Evidence and provenance"];
 for(const item of proof.entries){
  lines.push("", "### "+item.title.replace(/[\r\n#]/g," ").slice(0,140),
   "Type: "+item.kind,
   "Details: "+item.detail.replace(/[\r\n]/g," ").slice(0,400),
   "Recorded: "+(item.recordedAt?new Date(item.recordedAt).toISOString():"No timestamp"),
   "PortForge path: "+item.link);
 }
 return lines.join("\n").slice(0,80000);
}
