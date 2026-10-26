import {getLearningTrack,tracks} from "./academy";
export const TRACK_CHECKS_KEY="portforge_track_checks_v1";
export type TrackCheckRecord={id:string;trackId:string;completedAt:number;answers:number[];correct:number};
function validRecord(value:unknown):value is TrackCheckRecord{
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const r=value as Record<string,unknown>;
 const t=typeof r.trackId==="string"?getLearningTrack(r.trackId):null;
 return !!t&&typeof r.id==="string"&&r.id.length<100&&
  typeof r.completedAt==="number"&&Number.isFinite(r.completedAt)&&r.completedAt>0&&
  Array.isArray(r.answers)&&r.answers.length===3&&
  r.answers.every((x:unknown,i:number)=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<t.lessons[i].choices.length)&&
  typeof r.correct==="number"&&r.correct===t.lessons.slice(0,3).filter((l,i)=>l.correct===r.answers[i]).length;
}
export function readTrackChecks():TrackCheckRecord[]{
 try{
  const raw:unknown=JSON.parse(localStorage.getItem(TRACK_CHECKS_KEY)||"[]");
  return Array.isArray(raw)?raw.slice(0,60).filter(validRecord):[];
 }catch{return [];}
}
export function evaluateTrackCheck(trackId:string,answers:number[]):TrackCheckRecord{
 const track=getLearningTrack(trackId);
 if(!track||answers.length!==3||
    !answers.every((x,i)=>Number.isInteger(x)&&x>=0&&x<track.lessons[i].choices.length))
   throw Error("Finish every question using the available answer choices.");
 return {id:crypto.randomUUID(),trackId,completedAt:Date.now(),answers:answers.slice(),
   correct:track.lessons.slice(0,3).filter((l,i)=>l.correct===answers[i]).length};
}
export function saveTrackCheck(result:TrackCheckRecord):void{
 if(!validRecord(result))throw Error("Invalid saved check.");
 localStorage.setItem(TRACK_CHECKS_KEY,JSON.stringify([result,...readTrackChecks()].slice(0,60)));
 window.dispatchEvent(new Event("portforge:track-checks"));
}
export function trackCheckSummary():{attempted:number;average:number;latest:TrackCheckRecord|null;distinctTracks:number}{
 const history=readTrackChecks();
 return {attempted:history.length,
   average:history.length?Math.round(history.reduce((n,r)=>n+r.correct/r.answers.length,0)*100/history.length):0,
   latest:history[0]||null,distinctTracks:new Set(history.map(r=>r.trackId)).size};
}
export function exportTrackCheck(result:TrackCheckRecord):string{
 const track=getLearningTrack(result.trackId);
 if(!track)throw Error("Learning track is no longer available.");
 return ["PORTFORGE — INTRODUCTORY TRACK CHECK","Track: "+track.name,
  "Locally checked practice; not a verified professional skill certification.",
  "Date: "+new Date(result.completedAt).toISOString(),
  "Answers correct: "+result.correct+"/"+result.answers.length,
  ...track.lessons.slice(0,3).map((l,i)=>[String(i+1)+". "+l.prompt,
     "Your answer: "+l.choices[result.answers[i]],
     "Expected: "+l.choices[l.correct],
     "Explanation: "+l.why,"Try: "+track.deliverable].join("\n"))].join("\n\n");
}
export const trackCheckCount=tracks.length;
