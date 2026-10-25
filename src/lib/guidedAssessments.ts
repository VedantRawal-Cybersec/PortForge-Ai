import type {PracticeLevel} from "./practiceLevels";
const KEY="portforge_guided_assessments_v1";
export interface GuidedAssessment{
  id:string;topic:string;difficulty:PracticeLevel;createdAt:number;
  answers:{question:string;answer:string;criteriaMet:string[]}[];
  complete:boolean;
}
export function readGuidedAssessments():GuidedAssessment[]{
  try{
    const data:unknown=JSON.parse(localStorage.getItem(KEY)||"[]");
    if(!Array.isArray(data))return [];
    return data.slice(0,30).filter((x):x is GuidedAssessment=>
      !!x&&typeof x==="object"&&!Array.isArray(x)&&
      typeof x.id==="string"&&typeof x.topic==="string"&&
      ["beginner","intermediate","advanced"].includes(x.difficulty)&&
      Array.isArray(x.answers)&&x.answers.length<=3
    ).map(x=>({...x,topic:x.topic.slice(0,120),answers:x.answers.map(a=>({
      question:typeof a.question==="string"?a.question.slice(0,500):"",
      answer:typeof a.answer==="string"?a.answer.slice(0,8000):"",
      criteriaMet:Array.isArray(a.criteriaMet)?a.criteriaMet.filter((y:unknown)=>typeof y==="string").slice(0,8):[],
    }))}));
  }catch{return [];}
}
export function saveGuidedAssessment(a:GuidedAssessment){
  const entries=readGuidedAssessments();
  if(a.answers.length>3)throw Error("A practice session has up to three questions.");
  const now={...a,topic:a.topic.slice(0,120),answers:a.answers.map(x=>({
    question:x.question.slice(0,500),answer:x.answer.slice(0,8000),
    criteriaMet:x.criteriaMet.slice(0,8),
  }))};
  const out=[now,...entries.filter(x=>x.id!==a.id)].slice(0,30);
  localStorage.setItem(KEY,JSON.stringify(out));
  window.dispatchEvent(new Event("portforge:guided-assessment"));
}
export function createGuidedAssessment(topic:string,difficulty:PracticeLevel):GuidedAssessment{
  return {id:crypto.randomUUID(),topic:topic.slice(0,120),difficulty,createdAt:Date.now(),answers:[],complete:false};
}
export function makeGuidedSummary(a:GuidedAssessment):string{
  const head=`PortForge guided self-practice\nTopic: ${a.topic}\nDifficulty: ${a.difficulty}\nStatus: ${a.complete?"Completed":"In progress"}\nSelf-assessed only — no AI scoring or certification.\n`;
  return head+a.answers.map((s,i)=>`\nQuestion ${i+1}: ${s.question}\nMy answer:\n${s.answer}\nSelf-checked criteria:\n${s.criteriaMet.map(x=>"- "+x).join("\n")||"None marked"}\n`).join("\n");
}
