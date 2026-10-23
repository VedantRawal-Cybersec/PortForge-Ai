export type LearnerProfile = { name:string; goal:string; level:"new"|"learning"|"experienced"; focus:string; headline:string; bio:string; links:string[]; visibility:"private"|"public"; };
const KEY="portforge_profile_v2";
export const defaultProfile:LearnerProfile={name:"",goal:"explore",level:"new",focus:"digital",headline:"",bio:"",links:[],visibility:"private"};
export function getProfile():LearnerProfile {
  try { const obj=JSON.parse(localStorage.getItem(KEY)||"{}");return {...defaultProfile,...obj,links:Array.isArray(obj.links)?obj.links:[]};}
  catch{return {...defaultProfile};}
}
export function saveProfile(value:LearnerProfile) {localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new Event("portforge:profile"));}
