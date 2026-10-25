import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, BarChart3, ShieldCheck } from "lucide-react";
import { getLearning, tracks } from "@/lib/academy";
import { getPortfolio } from "@/lib/portfolio";
import { exercises, getPractice } from "@/lib/practice";
export default function SkillDNA(){
 const [learning,setLearning]=useState(getLearning);
 const [entries,setEntries]=useState(getPortfolio);
 const [challenges,setChallenges]=useState(getPractice);
 const [trackSearch,setTrackSearch]=useState("");
 const [trackLimit,setTrackLimit]=useState(12);
 useEffect(()=>{
  const sync=()=>{setLearning(getLearning());setEntries(getPortfolio());setChallenges(getPractice());};
  window.addEventListener("portforge:progress",sync);window.addEventListener("portfolio:update",sync);window.addEventListener("portforge:practice",sync);
  return ()=>{window.removeEventListener("portforge:progress",sync);window.removeEventListener("portfolio:update",sync);window.removeEventListener("portforge:practice",sync);};
 },[]);
 const skills=useMemo(()=>entries.filter(x=>x.type==="skill"),[entries]);
 const domains=tracks.map(t=>{
   const completed=t.lessons.filter(l=>learning.passed.includes(l.id)).length;
   return {...t,completed,percent:Math.round((completed/t.lessons.length)*100)};
 });
 const filteredDomains=domains.filter(d=>[d.name,d.category,d.description].join(" ").toLowerCase().includes(trackSearch.toLowerCase().trim()));
 const practice=Array.from(new Set(skills.map(s=>s.skill))).slice(0,12);
 return <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
   <header className="max-w-3xl space-y-3">
     <div className="chip chip-cyan"><BrainCircuit className="size-4"/> SKILL DNA</div>
     <h1 className="text-4xl md:text-5xl font-bold tracking-tight">See how your skills are growing.</h1>
     <p className="text-lg text-muted-foreground leading-relaxed">Your skill map reflects lessons you completed and practice activities recorded in this browser. It is not an employment qualification or independently validated competency score.</p>
   </header>
   <section className="space-y-4" aria-label="Learning track progress map">
     <div className="panel p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
       <div><h2 className="font-bold text-lg">Learning track map</h2>
         <p className="text-xs text-muted-foreground">{filteredDomains.length} matching tracks · {domains.length} total · results reflect completed local lessons</p></div>
       <input type="search" value={trackSearch} onChange={e=>{setTrackSearch(e.target.value);setTrackLimit(12);}}
         aria-label="Search skill map tracks" placeholder="Find a skill to review"
         className="min-h-11 rounded-lg border border-border bg-background px-4 py-2.5 text-sm w-full sm:w-72"/>
     </div>
     <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {filteredDomains.slice(0,trackLimit).map(d=><div key={d.id} className="panel p-6 space-y-4">
      <div className="flex items-center justify-between"><span aria-hidden="true" className="text-2xl">{d.icon}</span><span className="text-xs text-muted-foreground font-mono">{d.completed}/{d.lessons.length}</span></div>
      <h2 className="font-bold text-lg">{d.name}</h2>
      <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden" role="progressbar" aria-label={d.name+" lesson completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={d.percent}><div style={{width:d.percent+"%"}} className="bg-led-cyan h-full rounded-full transition-all"/></div>
      <p className="text-xs text-muted-foreground">{d.percent}% of guided lessons completed</p>
      <Link className="text-led-cyan text-sm inline-flex items-center gap-2" to={"/learn?track="+encodeURIComponent(d.id)}>Practice this track <ArrowRight className="size-4"/></Link>
    </div>)}
     </div>
     {filteredDomains.length===0&&<p className="text-sm text-muted-foreground">No matching tracks. Try another topic.</p>}
     {filteredDomains.length>trackLimit&&<button type="button" onClick={()=>setTrackLimit(n=>n+12)}
       className="border border-border rounded-xl px-5 py-3 text-sm font-bold hover:border-led-cyan/60">
       Show more skills ({filteredDomains.length-trackLimit} remaining)
     </button>}
   </section>
   <section className="panel p-5 sm:p-8 space-y-5" aria-label="Independent coding practice progress">
    <div><h2 className="text-2xl font-bold">Independent challenge evidence</h2><p className="text-sm text-muted-foreground mt-2">Actual exercise test cases completed locally. Results are useful feedback, not third-party certification.</p></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{exercises.map(e=>{
      const attempt=challenges.find(a=>a.exerciseId===e.id);
      const p=attempt&&attempt.total>0?Math.round(attempt.passed/attempt.total*100):0;
      return <Link key={e.id} to="/practice" className="rounded-xl bg-surface-2 border border-border p-4 hover:border-led-cyan/50 transition-colors"><div className="flex justify-between gap-2"><h3 className="font-semibold text-sm">{e.title}</h3><span className="text-xs font-mono text-led-cyan">{attempt?.passed||0}/{attempt?.total||e.tests.length}</span></div><p className="text-xs text-muted-foreground mt-2">{e.topic}</p><div className="h-2 mt-4 rounded-full bg-surface-3 overflow-hidden"><div className="h-full bg-led-cyan rounded-full" style={{width:p+"%"}}/></div></Link>;
    })}</div>
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
