/** Portable browser-local progress. No server upload occurs here. Backups are unencrypted. */
const DATA_KEYS=[
 "portforge_profile_v2","portforge_learning_v1","portforge_missions_v1",
 "aero_workspace","aero_portfolio_v1","portforge_practice_v1",
 "portforge_project_interviews_v1","portforge_career_plan_v1",
 "portforge_showcase_projects_v1","portforge_workspace_language_drafts_v1","portforge_knowledge_checks_v1","portforge_resume_v1","portforge_track_checks_v1","portforge_role_reality_v1"
] as const;
type Backup={format:"portforge-local-backup";version:1;createdAt:string;items:Record<string,unknown>};
export const PORTABLE_KEYS=[...DATA_KEYS];
export function exportLocalBackup():Backup{
 const items:Record<string,unknown>={};
 for(const key of DATA_KEYS){
  const raw=localStorage.getItem(key);
  if(raw!==null){try{items[key]=JSON.parse(raw);}catch{/* damaged record is skipped */}}
 }
 return {format:"portforge-local-backup",version:1,createdAt:new Date().toISOString(),items};
}
export function downloadLocalBackup(){
 const data=JSON.stringify(exportLocalBackup(),null,2);
 const url=URL.createObjectURL(new Blob([data],{type:"application/json"}));
 const link=document.createElement("a");link.href=url;link.download="portforge-local-backup.json";
 document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
}
function valid(key:string,value:unknown):boolean{
 if(value===null||typeof value!=="object"||Array.isArray(value)&&!["aero_portfolio_v1","portforge_practice_v1","portforge_project_interviews_v1","portforge_showcase_projects_v1","portforge_knowledge_checks_v1","portforge_track_checks_v1","portforge_role_reality_v1"].includes(key))return false;
 if(["aero_portfolio_v1","portforge_practice_v1","portforge_project_interviews_v1","portforge_showcase_projects_v1","portforge_knowledge_checks_v1","portforge_track_checks_v1","portforge_role_reality_v1"].includes(key)){
  if(!Array.isArray(value)||value.length>60||!value.every(x=>x&&typeof x==="object"&&!Array.isArray(x)))return false;
  if(key==="portforge_role_reality_v1")return value.length<=30&&value.every(r=>
    typeof r.id==="string"&&r.id.length<=80&&typeof r.scenarioId==="string"&&r.scenarioId.length<=100&&
    ["frontend","data","security"].includes(r.role)&&Array.isArray(r.answers)&&r.answers.length===3&&
    r.answers.every(a=>Number.isInteger(a)&&a>=0&&a<=2)&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=3&&
    typeof r.reflection==="string"&&r.reflection.length<=1200&&typeof r.completedAt==="number"&&Number.isFinite(r.completedAt));
  if(key==="portforge_track_checks_v1")return value.length<=60&&value.every(r=>
    typeof r.id==="string"&&r.id.length<100&&typeof r.trackId==="string"&&
    r.trackId.length<=80&&typeof r.completedAt==="number"&&Number.isFinite(r.completedAt)&&
    Array.isArray(r.answers)&&r.answers.length===3&&r.answers.every(a=>Number.isInteger(a)&&a>=0&&a<=2)&&
    Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=3);
  if(key==="portforge_knowledge_checks_v1")return value.length<=40 && value.every(s=>
    typeof s.id==="string"&&s.id.length<=80&&["frontend","data","security"].includes(s.topic)&&
    ["beginner","intermediate","advanced"].includes(s.started)&&
    typeof s.startedAt==="number"&&typeof s.completedAt==="number"&&
    Array.isArray(s.answers)&&s.answers.length<=6&&s.answers.every(a=>
      typeof a.itemId==="string"&&a.itemId.length<=100&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<=3&&typeof a.correct==="boolean"));
  if(key==="portforge_showcase_projects_v1")return value.length<=24&&value.every(p=>
    typeof p.id==="string"&&p.id.length<=80&&typeof p.title==="string"&&p.title.length<=100&&
    typeof p.summary==="string"&&p.summary.length<=1200&&
    ["technologies","role","outcome","projectUrl","challenge","approach","validation"].every(field=>p[field]===undefined||typeof p[field]==="string")&&
    (!p.challenge||p.challenge.length<=800)&&(!p.approach||p.approach.length<=1000)&&(!p.validation||p.validation.length<=800)&&
    (!p.projectUrl||(/^https:\/\//.test(p.projectUrl)&&p.projectUrl.length<=600))
  );
  return true;
}
 const x=value as Record<string,unknown>;
 switch(key){
  case "portforge_profile_v2":return typeof x.name==="string"&&x.name.length<=60&&typeof x.goal==="string"&&typeof x.level==="string";
  case "portforge_learning_v1":return Array.isArray(x.passed)&&x.passed.length<=500&&x.passed.every(v=>typeof v==="string")&&!!x.attempts&&typeof x.attempts==="object";
  case "portforge_missions_v1":return Object.keys(x).length<=100&&Object.values(x).every(v=>Array.isArray(v)&&v.length<=100);
  case "aero_workspace":return typeof x.code==="string"&&x.code.length<=30000&&typeof x.langId==="string"&&typeof x.desc==="string";
  case "portforge_resume_v1":
    return typeof x.name==="string"&&x.name.length<=1100&&
      typeof x.summary==="string"&&x.summary.length<=1400&&
      typeof x.skills==="string"&&x.skills.length<=1400&&
      ["projects","experience","education"].every(field=>
        Array.isArray(x[field])&&x[field].length<=24&&(x[field] as unknown[]).every(entry=>
          !!entry&&typeof entry==="object"&&!Array.isArray(entry)&&
          typeof (entry as Record<string,unknown>).heading==="string"&&
          ((entry as Record<string,unknown>).heading as string).length<=180 &&
          typeof (entry as Record<string,unknown>).description==="string"&&
          ((entry as Record<string,unknown>).description as string).length<=2500
        ));
  case "portforge_career_plan_v1":return typeof x.role==="string"&&Array.isArray(x.steps)&&x.steps.length<=20&&Array.isArray(x.checked);
  case "portforge_workspace_language_drafts_v1":
    return Object.keys(x).length<=80&&Object.values(x).every(entry=>
      !!entry&&typeof entry==="object"&&!Array.isArray(entry)&&
      typeof (entry as Record<string,unknown>).code==="string"&&
      ((entry as Record<string,unknown>).code as string).length<=30000&&
      typeof (entry as Record<string,unknown>).desc==="string"&&
      ((entry as Record<string,unknown>).desc as string).length<=180
    );
  default:return false;
 }
}
export function restoreLocalBackup(content:string):number{
 if(content.length>1000000)throw new Error("Backup exceeds the 1 MB safety limit.");
 let p:Partial<Backup>;
 try{p=JSON.parse(content);}catch{throw new Error("The selected file is not valid JSON.");}
 if(!p||p.format!=="portforge-local-backup"||p.version!==1||!p.items||typeof p.items!=="object"||Array.isArray(p.items))throw new Error("Not a supported PortForge local backup.");
 const entries=Object.entries(p.items).filter(([key])=>DATA_KEYS.includes(key as (typeof DATA_KEYS)[number]));
 if(entries.length!==Object.keys(p.items).length)throw new Error("Backup contains unsupported data fields.");
 if(!entries.every(([key,value])=>valid(key,value)))throw new Error("Backup contains an invalid or damaged record.");
 const originals=Object.fromEntries(DATA_KEYS.map(k=>[k,localStorage.getItem(k)]));
 try{
  for(const [key,value] of entries)localStorage.setItem(key,JSON.stringify(value));
 }catch{
  for(const k of DATA_KEYS){const old=originals[k];try{if(old===null)localStorage.removeItem(k);else localStorage.setItem(k,old);}catch{}}
  throw new Error("Browser storage is full or blocked. No new backup was restored.");
 }
 window.dispatchEvent(new Event("portforge:profile"));
 window.dispatchEvent(new Event("portforge:progress"));
 window.dispatchEvent(new Event("portfolio:update"));
 window.dispatchEvent(new Event("portforge:practice"));
 window.dispatchEvent(new Event("portforge:project-interview"));
 window.dispatchEvent(new Event("portforge:career"));
 window.dispatchEvent(new Event("portforge:showcase-projects"));
 window.dispatchEvent(new Event("portforge:knowledge-checks"));
 window.dispatchEvent(new Event("portforge:track-checks"));
 window.dispatchEvent(new Event("portforge:role-reality"));
 window.dispatchEvent(new Event("portforge:resume"));
 return entries.length;
}
export function clearLocalProgress(){
 for(const key of DATA_KEYS)localStorage.removeItem(key);
 window.dispatchEvent(new Event("portforge:profile"));
 window.dispatchEvent(new Event("portforge:progress"));
 window.dispatchEvent(new Event("portfolio:update"));
 window.dispatchEvent(new Event("portforge:practice"));
 window.dispatchEvent(new Event("portforge:project-interview"));
 window.dispatchEvent(new Event("portforge:career"));
 window.dispatchEvent(new Event("portforge:showcase-projects"));
}
