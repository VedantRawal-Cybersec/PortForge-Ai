import {getLearning,getLearningTrack,tracks} from "./academy";
import {getPractice,exercises} from "./practice";
import {readTrackChecks} from "./trackChecks";

export const REVIEW_KEY="portforge_learning_reviews_v1";
const DAY=86400000;
const intervals=[1,3,7,14,30];
const allIds=new Set(tracks.flatMap(t=>t.lessons.map(l=>l.id)));
export type LessonReview={id:string;lastAt:number;dueAt:number;streak:number;correct:number;attempts:number};
export type ReviewMap=Record<string,LessonReview>;
export function validReview(id:string,v:unknown):v is LessonReview{
 if(!allIds.has(id)||!v||typeof v!=="object"||Array.isArray(v))return false;
 const x=v as Record<string,unknown>;
 return x.id===id&&typeof x.lastAt==="number"&&Number.isSafeInteger(x.lastAt)&&Number(x.lastAt)>=0&&
 typeof x.dueAt==="number"&&Number.isSafeInteger(x.dueAt)&&Number(x.dueAt)>=Number(x.lastAt)&&
 typeof x.streak==="number"&&Number.isSafeInteger(x.streak)&&Number(x.streak)>=0&&Number(x.streak)<=1000&&
 typeof x.correct==="number"&&Number.isSafeInteger(x.correct)&&Number(x.correct)>=0&&
 typeof x.attempts==="number"&&Number.isSafeInteger(x.attempts)&&Number(x.attempts)>=1&&Number(x.attempts)<=100000&&
 Number(x.correct)<=Number(x.attempts);
}
export function readReviews():ReviewMap{
 try{
  const raw:unknown=JSON.parse(localStorage.getItem(REVIEW_KEY)||"{}");
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return {};
  const out:ReviewMap={};
  for(const [id,v] of Object.entries(raw).slice(0,350))if(validReview(id,v))out[id]=v;
  return out;
 }catch{return {};}
}
export function reviewAnswer(id:string,isCorrect:boolean,now=Date.now()):LessonReview{
 if(!allIds.has(id)||!Number.isSafeInteger(now)||now<0)throw Error("Unknown lesson or invalid time");
 const old=readReviews(),prev=old[id];
 const streak=isCorrect?(prev?.streak||0)+1:0;
 const result:LessonReview={id,lastAt:now,dueAt:now+(isCorrect?intervals[Math.min(streak-1,4)]*DAY:DAY),
 streak,correct:(prev?.correct||0)+(isCorrect?1:0),attempts:(prev?.attempts||0)+1};
 localStorage.setItem(REVIEW_KEY,JSON.stringify({...old,[id]:result}));
 window.dispatchEvent(new Event("portforge:reviews"));
 return result;
}
export function dueReviews(now=Date.now(),trackId?:string):LessonReview[]{
 const allowed=trackId?new Set(getLearningTrack(trackId)?.lessons.map(l=>l.id)||[]):allIds;
 return Object.values(readReviews()).filter(r=>allowed.has(r.id)&&r.dueAt<=now).sort((a,b)=>a.dueAt-b.dueAt);
}
export function reviewOverview(now=Date.now()){
 const entries=Object.values(readReviews());
 return {reviewed:entries.length,due:entries.filter(r=>r.dueAt<=now).length,
 scheduled:entries.filter(r=>r.dueAt>now).length};
}
export type RecommendedAction={title:string;reason:string;path:string;kind:"review"|"learn"|"project"|"recheck"};
const groups:Record<string,string[]>={
 frontend:["frontend","html-css","javascript","react","typescript","nextjs"],
 "data-analyst":["data-analyst","sql","python-data","statistics"],
 cybersecurity:["cybersecurity","soc","appsec","incident-response"]
};
const projects:Record<string,string[]>={
 frontend:["real-form-validation","immutable-task-update","normalize-name"],
 "data-analyst":["data-quality-counts","valid-revenue-report","score-summary"],
 cybersecurity:["synthetic-auth-log-counts","owner-authorization-model"]
};
export function learningActions(focus:string,now=Date.now()):RecommendedAction[]{
 const track=getLearningTrack(focus)||getLearningTrack("frontend")!;
 const actions:RecommendedAction[]=[];
 const due=dueReviews(now);
 const repeat=due.find(r=>track.lessons.some(l=>l.id===r.id))||due[0];
 if(repeat){
   const t=tracks.find(x=>x.lessons.some(l=>l.id===repeat.id))!;
   const l=t.lessons.find(x=>x.id===repeat.id)!;
   actions.push({title:"Review "+l.title,reason:"This answer is due for spaced retrieval practice, not a certified mastery check.",
    path:"/learn?track="+encodeURIComponent(t.id)+"&lesson="+encodeURIComponent(l.id),kind:"review"});
 }
 const done=new Set(getLearning().passed);
 const next=track.lessons.find(x=>!done.has(x.id));
 if(next)actions.push({title:"Learn "+next.title,reason:"Continue the next incomplete lesson in "+track.name,
   path:"/learn?track="+encodeURIComponent(track.id)+"&lesson="+encodeURIComponent(next.id),kind:"learn"});
 const role=Object.entries(groups).find(([,ids])=>ids.includes(track.id))?.[0]||"frontend";
 const passed=new Set(getPractice().filter(a=>a.total>0&&a.total===a.passed).map(a=>a.exerciseId));
 const exercise=projects[role].map(id=>exercises.find(e=>e.id===id)).find(e=>e&&!passed.has(e.id));
 if(exercise)actions.push({title:"Build: "+exercise.title,reason:"Attempt a project task and execute its published sample tests.",
   path:"/practice?exercise="+encodeURIComponent(exercise.id),kind:"project"});
 if(!readTrackChecks().some(c=>c.trackId===track.id))actions.push({
   title:"Check "+track.name,reason:"Try three introductory answer-key questions to identify gaps.",
   path:"/skill-test",kind:"recheck"});
 return actions.slice(0,4);
}
