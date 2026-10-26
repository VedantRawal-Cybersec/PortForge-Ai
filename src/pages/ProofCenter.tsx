import {useMemo,useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight,ClipboardCheck,Download,FlaskConical,ShieldCheck} from "lucide-react";
import {getProofSummary,exportProofSummary,type ProofKind} from "@/lib/proofEngine";

const labels:Record<ProofKind,string>={
 "lesson":"Introductory lesson","answer-key":"Answer-key check","browser-test":"Locally run code tests",
 "simulation":"Role simulation","authored":"Self-authored case study"
};
export default function ProofCenter(){
 const [proof]=useState(getProofSummary);
 const [category,setCategory]=useState<"all"|ProofKind>("all");
 const [limit,setLimit]=useState(16);
 const [query,setQuery]=useState("");
 const entries=useMemo(()=>proof.entries.filter(p=>
   (category==="all"||category===p.kind)&&
   (!query.trim()||[p.title,p.detail].join(" ").toLowerCase().includes(query.trim().toLowerCase()))),
   [proof,category,query]);
 const metrics=[
  {label:"Lessons completed",value:proof.lessons,desc:"Local answer checks"},
  {label:"Topic checks",value:proof.trackAttempts,desc:"Introductory multiple choice"},
  {label:"Exercises tested",value:proof.testedExercises,desc:"Recorded sample tests all pass"},
  {label:"Role simulations",value:proof.roleSimulations,desc:"Fictional workplace decisions"},
  {label:"Case studies",value:proof.authoredProjects,desc:"User-authored, not verified"},
 ];
 function download(){
   const url=URL.createObjectURL(new Blob([exportProofSummary(proof)],{type:"text/markdown;charset=utf-8"}));
   const anchor=document.createElement("a");anchor.href=url;anchor.download="portforge-personal-evidence.md";
   document.body.appendChild(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 return <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-7">
   <header className="flex flex-wrap justify-between gap-4 items-start">
     <div className="max-w-4xl space-y-3">
       <span className="chip chip-cyan">PORTFORGE · PROOF OF WORK</span>
       <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">See what you've actually practised.</h1>
       <p className="text-lg text-muted-foreground leading-relaxed">
         Your learning, practice tests, career trials, and portfolio projects in one understandable record—without inflated skill scores.
       </p>
     </div>
     <button type="button" onClick={download}
       className="inline-flex gap-2 items-center rounded-xl border border-border px-4 py-3 font-bold text-sm hover:border-led-cyan/60">
       <Download size={16}/> Export my evidence
     </button>
   </header>
   <section className="panel p-5 sm:p-6 border-led-cyan/25" aria-labelledby="proof-limits">
     <div className="flex gap-3 items-start">
       <ShieldCheck size={20} className="shrink-0 text-led-cyan"/>
       <div>
         <h2 id="proof-limits" className="font-bold">What this evidence can and cannot show</h2>
         <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
           Records are collected from this browser. Introductory answers are checked against stored answer keys; some JavaScript exercises have browser-run sample tests; workplace scenarios are fictional; project entries are self-authored. Local records can be modified or imported, and no result shown here is independently signed, proctored, or certified.
         </p>
       </div>
     </div>
   </section>
   <section aria-label="Learning evidence counts" className="grid grid-cols-2 lg:grid-cols-5 gap-3">
     {metrics.map(m=><div key={m.label} className="panel p-4 space-y-1">
       <p className="text-3xl font-extrabold tabular-nums">{m.value}</p>
       <p className="text-sm font-bold">{m.label}</p>
       <p className="text-xs text-muted-foreground">{m.desc}</p>
     </div>)}
   </section>
   <section className="panel p-5 sm:p-6 space-y-4" aria-labelledby="proof-history">
     <div className="flex flex-wrap gap-3 items-center justify-between">
       <div>
         <h2 id="proof-history" className="text-2xl font-bold">Evidence and provenance</h2>
         <p className="text-xs text-muted-foreground mt-1">{entries.length} matching local records, with newer timestamps shown first.</p>
       </div>
       <Link to="/role-lab" className="text-sm text-led-cyan inline-flex items-center gap-2 font-bold">
         Try a career simulation <ArrowRight size={15}/>
       </Link>
     </div>
     <div className="grid sm:grid-cols-2 gap-3">
       <label className="block space-y-2 text-sm font-semibold">
         <span>Search your activity</span>
         <input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(16);}}
           placeholder="Find a concept, project or scenario" aria-label="Search learning evidence"
           className="w-full rounded-lg border border-border bg-background p-3"/>
       </label>
       <label className="block space-y-2 text-sm font-semibold">
         <span>Evidence type</span>
         <select value={category} onChange={e=>{setCategory(e.target.value as "all"|ProofKind);setLimit(16);}}
           aria-label="Filter evidence type" className="w-full rounded-lg border border-border bg-background p-3">
           <option value="all">All evidence types</option>
           {Object.entries(labels).map(([key,title])=><option key={key} value={key}>{title}</option>)}
         </select>
       </label>
     </div>
     {entries.length===0?<div className="border border-border rounded-xl p-6 text-center space-y-3">
       <ClipboardCheck className="size-9 text-led-cyan mx-auto"/>
       <h3 className="text-lg font-bold">No matching evidence yet</h3>
       <p className="text-sm text-muted-foreground">Start with an introductory lesson or a practical activity. Your results will appear here once recorded on this device.</p>
       <div className="flex gap-3 justify-center flex-wrap">
         <Link to="/learn" className="border border-border px-4 py-2.5 rounded-lg text-sm">Explore learning</Link>
         <Link to="/practice" className="bg-foreground text-background px-4 py-2.5 rounded-lg text-sm">Run sample tests</Link>
       </div>
     </div>:<div className="grid lg:grid-cols-2 gap-3">
       {entries.slice(0,limit).map(entry=><article key={entry.id} className="border border-border rounded-xl p-4 space-y-2">
         <div className="flex flex-wrap justify-between gap-2">
           <span className="chip chip-cyan">{labels[entry.kind]}</span>
           {entry.recordedAt&&<time className="text-xs text-muted-foreground" dateTime={new Date(entry.recordedAt).toISOString()}>
             {new Date(entry.recordedAt).toLocaleDateString()}</time>}
         </div>
         <h3 className="font-bold text-base">{entry.title}</h3>
         <p className="text-sm text-muted-foreground">{entry.detail}</p>
         <Link to={entry.link} className="inline-flex gap-1 items-center text-sm text-led-cyan font-semibold">
           Open original activity <ArrowRight size={14}/>
         </Link>
       </article>)}
     </div>}
     {entries.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+16)}
       className="border border-border rounded-xl px-5 py-3 text-sm font-semibold">
       Show more records ({entries.length-limit} remaining)
     </button>}
   </section>
   <section className="panel p-5 sm:p-6 flex flex-wrap gap-3 items-center justify-between">
     <div>
       <h2 className="font-bold">Turn practice into presentable work.</h2>
       <p className="text-sm text-muted-foreground mt-1">Document real project objectives, genuine tests and actual outcomes. Never present a simulated task as work completed for an employer.</p>
     </div>
     <Link to="/portfolio" className="inline-flex gap-2 items-center rounded-lg bg-foreground text-background px-4 py-3 font-semibold text-sm">
       <FlaskConical size={15}/> Open Portfolio
     </Link>
   </section>
 </div>;
}