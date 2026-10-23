import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, BarChart3, ShieldCheck } from "lucide-react";
import { getLearning, tracks } from "@/lib/academy";
import { getPortfolio } from "@/lib/portfolio";
export default function SkillDNA(){
 const [learning,setLearning]=useState(getLearning);
 const [entries,setEntries]=useState(getPortfolio);
 useEffect(()=>{
  const sync=()=>{setLearning(getLearning());setEntries(getPortfolio());};
  window.addEventListener("portforge:progress",sync);window.addEventListener("portfolio:update",sync);
  return ()=>{window.removeEventListener("portforge:progress",sync);window.removeEventListener("portfolio:update",sync);};
 },[]);
 const skills=useMemo(()=>entries.filter(x=>x.type==="skill"),[entries]);
 const domains=tracks.map(t=>{
   const completed=t.lessons.filter(l=>learning.passed.includes(l.id)).length;
   return {...t,completed,percent:Math.round((completed/t.lessons.length)*100)};
 });
 const practice=Array.from(new Set(skills.map(s=>s.skill))).slice(0,12);
 return <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
   <header className="max-w-3xl space-y-3">
     <div className="chip chip-cyan"><BrainCircuit className="size-4"/> SKILL DNA</div>
     <h1 className="text-4xl md:text-5xl font-bold tracking-tight">See how your skills are growing.</h1>
     <p className="text-lg text-muted-foreground leading-relaxed">Your skill map reflects lessons you completed and practice activities recorded in this browser. It is not an employment qualification or independently validated competency score.</p>
   </header>
   <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {domains.map(d=><div key={d.id} className="panel p-6 space-y-4">
      <div className="flex items-center justify-between"><span aria-hidden="true" className="text-2xl">{d.icon}</span><span className="text-xs text-muted-foreground font-mono">{d.completed}/{d.lessons.length}</span></div>
      <h2 className="font-bold text-lg">{d.name}</h2>
      <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden" role="progressbar" aria-label={d.name+" lesson completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={d.percent}><div style={{width:d.percent+"%"}} className="bg-led-cyan h-full rounded-full transition-all"/></div>
      <p className="text-xs text-muted-foreground">{d.percent}% of guided lessons completed</p>
      <Link className="text-led-cyan text-sm inline-flex items-center gap-2" to="/learn">Practice this track <ArrowRight className="size-4"/></Link>
    </div>)}
   </section>
   <div className="grid lg:grid-cols-2 gap-5">
    <section className="panel p-6 md:p-8">
      <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="size-6 text-led-cyan"/> Recent skill assessments</h2>
      <p className="text-muted-foreground text-sm mt-2">Assessment scores are AI-produced estimates. Use the feedback as a learning tool, not as certified proof.</p>
      {practice.length===0?<div className="mt-6 rounded-xl bg-surface-2 border border-border p-6"><p className="text-sm text-muted-foreground">No practice entries yet. Try a skill assessment to get your first feedback record.</p><Link className="mt-4 inline-flex text-led-cyan gap-2 items-center" to="/skill-test">Try a skill test <ArrowRight className="size-4"/></Link></div>:<div className="mt-5 space-y-3">{practice.map(name=>{
       const examples=skills.filter(e=>e.skill===name);const latest=examples[0];
       const scores=Object.values(latest.scores).filter((x):x is number=>typeof x==="number");
       const avg=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
       return <div key={name} className="p-4 rounded-lg border border-border bg-surface-2"><div className="flex justify-between gap-3 mb-2"><span className="font-semibold text-sm">{name}</span><span className="text-xs text-muted-foreground">{examples.length} attempt(s) · {avg.toFixed(1)}/5</span></div><div className="h-2 bg-surface-3 rounded-full overflow-hidden"><div className="h-full bg-led-violet" style={{width:Math.max(0,Math.min(100,avg/5*100))+"%"}} /></div></div>;
    })}</div>}
    </section>
    <section className="panel p-6 md:p-8">
      <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="size-6 text-led-cyan"/> Next best actions</h2>
      <div className="space-y-4 mt-6">
        <div className="rounded-lg border border-border bg-surface-2 p-4"><h3 className="font-semibold">Learn before you assess</h3><p className="text-muted-foreground text-sm mt-2">Complete a guided lesson, then try a related skill question to reinforce the concept.</p><Link className="inline-flex gap-2 items-center text-led-cyan mt-3 text-sm" to="/learn">Open academy <ArrowRight className="size-4"/></Link></div>
        <div className="rounded-lg border border-border bg-surface-2 p-4"><h3 className="font-semibold">Build something small</h3><p className="text-muted-foreground text-sm mt-2">Turn your knowledge into a project and explain your decisions honestly.</p><Link className="inline-flex gap-2 items-center text-led-cyan mt-3 text-sm" to="/missions">Explore missions <ArrowRight className="size-4"/></Link></div>
        <div className="rounded-lg border border-border bg-surface-2 p-4"><h3 className="font-semibold">Reflect on your evidence</h3><p className="text-muted-foreground text-sm mt-2">Review recorded work in your personal portfolio. Do not overstate unverified achievements.</p><Link className="inline-flex gap-2 items-center text-led-cyan mt-3 text-sm" to="/portfolio">My portfolio <ArrowRight className="size-4"/></Link></div>
      </div>
    </section>
   </div>
 </div>;
}
