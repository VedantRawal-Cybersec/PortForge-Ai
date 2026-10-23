import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardCheck, RotateCcw, Trophy } from "lucide-react";
type Mission={id:string;name:string;category:string;level:string;why:string;steps:string[];deliverable:string;to:string};
const MISSIONS:Mission[]=[
 {id:"m1",name:"Understand your digital footprint",category:"Digital skills",level:"Beginner",why:"Learn how to identify and protect basic online information.",steps:["Write down three types of information you should keep private.","Explain what HTTPS means in your own words.","Enable multi-factor authentication on an account you own, if available."],deliverable:"One short safety checklist written in your own words.",to:"/learn"},
 {id:"m2",name:"Create your first functioning program",category:"Coding",level:"Beginner",why:"Turn variables and loops into a small project.",steps:["Create a program with a variable.","Use a condition or loop.","Test it with three different inputs and record the result."],deliverable:"Code, test cases, and a two-sentence explanation.",to:"/workspace"},
 {id:"m3",name:"Challenge an AI-generated claim",category:"AI literacy",level:"Beginner",why:"Develop a habit of independent validation.",steps:["Find a factual AI-generated statement.","Compare it against an authoritative primary source.","Write down what was correct, unsupported, or outdated."],deliverable:"A brief citation-based verification note.",to:"/learn"},
 {id:"m4",name:"Build a project case study",category:"Portfolio",level:"Intermediate",why:"Show process and evidence instead of buzzwords.",steps:["Describe the problem you tried to solve.","Explain your contribution and show a screenshot or code excerpt.","Describe tests, limitations and one improvement."],deliverable:"A project story with clear evidence and honest limitations.",to:"/portfolio"},
 {id:"m5",name:"Practice a real interview answer",category:"Career",level:"Beginner",why:"Learn to communicate experience with structure.",steps:["Choose one experience or class project.","Structure the story using Situation, Task, Action and Result.","Record or type an answer, then reflect on one improvement."],deliverable:"A concise interview answer you can explain truthfully.",to:"/interview"},
 {id:"m6",name:"Map your next career step",category:"Career",level:"Beginner",why:"Turn a vague aspiration into an actionable plan.",steps:["Compare two real job descriptions for a role.","List skills they share and highlight those you need.","Choose one small learning or project goal for this week."],deliverable:"A role comparison and a specific next action.",to:"/oracle"}
];
type Progress=Record<string,string[]>;
const KEY="portforge_missions_v1";
function read():Progress{try{const x=JSON.parse(localStorage.getItem(KEY)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{};}catch{return {};}}
export default function Missions(){
 const [progress,setProgress]=useState<Progress>(read);
 const [expanded,setExpanded]=useState("m2");
 const change=(mission:string,step:string)=>{
  const existing=progress[mission]||[];
  const next={...progress,[mission]:existing.includes(step)?existing.filter(x=>x!==step):[...existing,step]};
  setProgress(next);localStorage.setItem(KEY,JSON.stringify(next));
 };
 const total=MISSIONS.filter(m=>m.steps.every(s=>(progress[m.id]||[]).includes(s))).length;
 return <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
   <header className="max-w-3xl space-y-4"><span className="chip chip-cyan"><Trophy className="size-4"/> CAREER MISSIONS</span><h1 className="text-4xl md:text-5xl font-bold tracking-tight">Create real work, one mission at a time.</h1><p className="text-muted-foreground text-lg leading-relaxed">Practice with guided challenges, tangible deliverables and clear steps. Mark completed tasks yourself; these are not verified certificates.</p></header>
   <div className="panel p-5 flex flex-wrap justify-between gap-4 items-center">
      <div><p className="text-sm text-muted-foreground">Self-tracked missions completed</p><p className="text-3xl font-bold mt-1">{total} <span className="text-base font-normal text-muted-foreground">/ {MISSIONS.length}</span></p></div>
      <Link className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 hover:border-led-cyan/50" to="/dashboard">Back to dashboard <ArrowRight className="size-4"/></Link>
   </div>
   <section aria-label="Hands-on missions" className="grid md:grid-cols-2 gap-4">
    {MISSIONS.map(m=>{
      const done=(progress[m.id]||[]).filter(x=>m.steps.includes(x)).length;
      const open=expanded===m.id;
      return <article className="panel overflow-hidden" key={m.id}>
       <button type="button" onClick={()=>setExpanded(open?"":m.id)} aria-expanded={open} className="w-full text-left p-6 flex flex-col gap-4 hover:bg-surface-2/50 transition-colors">
        <div className="flex justify-between gap-3"><span className="chip chip-cyan">{m.category}</span><span className="chip">{m.level}</span></div>
        <div><h2 className="text-xl font-bold">{m.name}</h2><p className="text-sm text-muted-foreground mt-2">{m.why}</p></div>
        <div className="flex justify-between gap-3 items-center text-xs font-mono"><span>{done} / {m.steps.length} STEPS CHECKED</span><span className="text-led-cyan">{open?"HIDE DETAILS":"VIEW MISSION"} ↓</span></div>
        <div className="h-2 bg-surface-3 rounded-full overflow-hidden"><div className="h-full bg-led-cyan transition-all" style={{width:(done/m.steps.length*100)+"%"}} /></div>
       </button>
       {open&&<div className="border-t border-border p-6 space-y-4">
         <p className="text-xs font-mono tracking-widest text-led-cyan">YOUR CHECKLIST</p>
         {m.steps.map((step,i)=><label key={step} className="flex gap-3 cursor-pointer rounded-lg border border-border bg-surface-2 p-3"><input type="checkbox" className="accent-cyan-500 mt-1" checked={(progress[m.id]||[]).includes(step)} onChange={()=>change(m.id,step)}/><span className="text-sm leading-relaxed">{i+1}. {step}</span></label>)}
         <div className="rounded-lg p-4 bg-led-cyan/5 border border-led-cyan/20 text-sm"><strong className="block mb-2"><ClipboardCheck className="size-4 inline mr-2"/>Deliverable</strong>{m.deliverable}</div>
         <div className="flex flex-wrap justify-between items-center gap-3"><Link to={m.to} className="inline-flex items-center gap-2 text-led-cyan text-sm">Open related tool <ArrowRight className="size-4"/></Link>{done>0&&<button type="button" onClick={()=>{const next={...progress,[m.id]:[]};setProgress(next);localStorage.setItem(KEY,JSON.stringify(next));}} className="inline-flex gap-2 text-sm items-center text-muted-foreground hover:text-foreground"><RotateCcw className="size-4"/> Reset checklist</button>}</div>
         {done===m.steps.length&&<p className="flex items-center gap-2 text-led-green text-sm" role="status"><CheckCircle2 className="size-4"/> Self-tracked mission completed. Keep your evidence for your portfolio.</p>}
       </div>}
      </article>;
    })}
   </section>
 </div>;
}
