import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, ClipboardCheck, Save, Mic, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { exercises, getPractice, findPractice } from "@/lib/practice";
import { getProjectInterviews, interviewPrompts, saveProjectInterview } from "@/lib/projectJourney";

export default function ProjectInterview(){
 const [query,setQuery]=useSearchParams();
 const saved=getPractice();
 const selected=query.get("exercise")||saved[0]?.exerciseId||exercises[0].id;
 const exercise=exercises.find(e=>e.id===selected)||exercises[0];
 const attempt=findPractice(exercise.id);
 const existing=getProjectInterviews().find(x=>x.exerciseId===exercise.id);
 const [index,setIndex]=useState(0);
 const [answers,setAnswers]=useState<Record<string,string[]>>(()=>Object.fromEntries(exercises.map(e=>[e.id,getProjectInterviews().find(x=>x.exerciseId===e.id)?.answers||["","","",""]])));
 const [notice,setNotice]=useState("");
 const notes=answers[exercise.id]||["","","",""];
 const count=notes.filter(x=>x.trim().length>=40).length;
 const guidance=interviewPrompts[index];
 const progress=useMemo(()=>Math.round(count/interviewPrompts.length*100),[count]);
 const switchTo=(id:string)=>{setQuery({exercise:id});setIndex(0);setNotice("");};
 function persist(){
  try{
   saveProjectInterview({id:existing?.id||crypto.randomUUID(),exerciseId:exercise.id,answers:notes,createdAt:existing?.createdAt||Date.now(),updatedAt:Date.now()});
   setNotice("Interview rehearsal saved on this device.");
   toast.success("Your practice has been saved.");
  }catch{setNotice("Unable to save. Please copy your notes.");}
 }
 return <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-10 space-y-7">
  <header className="space-y-3"><span className="chip chip-cyan"><Mic className="size-4"/> PROJECT-TO-INTERVIEW COACH</span><h1 className="text-4xl md:text-5xl font-bold tracking-tight">Explain what you built.</h1><p className="text-muted-foreground leading-relaxed max-w-3xl">Use your real practice project to prepare four interview stories. Clear reasoning matters more than memorized answers.</p></header>
  <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.65fr)] gap-5">
   <section className="panel p-5 sm:p-7 space-y-5">
    <label className="block text-sm font-semibold" htmlFor="selected-project">Select your practice project</label>
    <select id="selected-project" className="w-full bg-background border border-border rounded-lg p-3" value={exercise.id} onChange={e=>switchTo(e.target.value)}>
     {exercises.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}
    </select>
    {!attempt&&<div className="border border-led-amber/40 rounded-lg p-4 text-sm">You haven't started this challenge yet. <Link to="/practice" className="text-led-cyan underline">Try it first</Link> so you can describe genuine work.</div>}
    <div className="flex justify-between gap-3 items-center"><span className="chip chip-cyan">QUESTION {index+1} OF {interviewPrompts.length}</span><span className="text-sm text-muted-foreground">{count}/{interviewPrompts.length} substantial responses</span></div>
    <div className="h-2 bg-surface-3 rounded-full overflow-hidden"><div className="h-full bg-led-cyan transition-all" style={{width:progress+"%"}}/></div>
    <div><h2 className="text-2xl font-bold">{guidance.title}</h2><p className="leading-relaxed mt-3">{guidance.question}</p></div>
    <label htmlFor="interview-response" className="block text-sm font-semibold">Your answer</label>
    <textarea id="interview-response" rows={8} maxLength={2000} value={notes[index]||""} onChange={e=>setAnswers(old=>({...old,[exercise.id]:old[exercise.id].map((a,i)=>i===index?e.target.value:a)}))} placeholder="Explain in your own words, with a concrete example…" className="w-full bg-background border border-border rounded-lg p-4 text-sm leading-relaxed"/>
    <div className="rounded-lg bg-led-cyan/5 border border-led-cyan/25 p-4"><h3 className="font-bold text-sm mb-2"><BookOpen className="size-4 inline mr-2"/>Answer checklist</h3><p className="text-muted-foreground text-sm">{guidance.guidance}</p><p className="text-xs text-muted-foreground mt-2">Answers under 40 characters remain marked incomplete. This is only a completeness prompt, not AI evaluation.</p></div>
    <div className="flex gap-3 flex-wrap justify-between">
     <button type="button" disabled={index===0} onClick={()=>setIndex(i=>i-1)} className="border border-border px-4 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-40"><ArrowLeft className="size-4"/> Previous</button>
     <button type="button" onClick={persist} className="border border-border px-4 py-3 rounded-lg inline-flex items-center gap-2"><Save className="size-4"/> Save answers</button>
     {index<interviewPrompts.length-1?<button type="button" onClick={()=>setIndex(i=>i+1)} className="bg-foreground text-background rounded-lg px-4 py-3 font-semibold inline-flex items-center gap-2">Next <ArrowRight className="size-4"/></button>:<Link to="/portfolio" className="bg-led-cyan text-background rounded-lg px-4 py-3 font-semibold inline-flex items-center gap-2">My portfolio <ArrowRight className="size-4"/></Link>}
    </div>{notice&&<p role="status" className="text-sm text-led-green">{notice}</p>}
   </section>
   <aside className="space-y-5">
    <section className="panel p-5 space-y-3"><h2 className="text-xl font-bold">Your project evidence</h2><p className="text-xs text-muted-foreground">Only work saved on this browser appears here.</p>{attempt?<><p className="text-sm font-semibold">{exercise.title}</p><div className="chip">{attempt.passed}/{attempt.total} practice tests passed</div><pre className="text-xs overflow-auto max-h-64 bg-background border border-border rounded-lg p-3">{attempt.code}</pre><p className="text-sm text-muted-foreground whitespace-pre-wrap">{attempt.reflection||"No project reflection saved yet."}</p></>:<p className="text-sm text-muted-foreground">Complete or save a challenge to connect real code here.</p>}<Link className="text-led-cyan text-sm inline-flex gap-2 items-center" to="/practice">Open practice lab <ArrowRight className="size-4"/></Link></section>
    <section className="panel p-5 space-y-3"><h2 className="text-xl font-bold"><ClipboardCheck className="size-5 inline mr-2 text-led-cyan"/>What this improves</h2><p className="text-sm text-muted-foreground leading-relaxed">Your ability to explain problem framing, implementation choices, testing and iteration. No employer score or certification is issued.</p></section>
   </aside>
  </div>
 </div>;
}
