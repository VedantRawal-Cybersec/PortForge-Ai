import {useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight,CheckCircle2,Circle} from "lucide-react";
import {flagshipOverview,type FlagshipId} from "@/lib/flagshipOutcomes";

export default function FlagshipOutcomes(){
 const [tracks]=useState(flagshipOverview);
 const [active,setActive]=useState<FlagshipId>("frontend");
 const selection=tracks.find(t=>t.id===active)!;
 return <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
  <header className="space-y-3">
   <span className="chip chip-cyan">PORTFORGE / PROJECT READINESS</span>
   <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Know what is actually finished.</h1>
   <p className="text-muted-foreground max-w-3xl leading-relaxed">Progress through a flagship role using saved introductory lessons, browser-executed sample coding tests, and your own project documentation. Every milestone links to a specific action.</p>
   <p className="text-xs text-muted-foreground">This is a local checklist, not an employability, certification or independent project-verification score. Saved attempts and authored portfolio details can be edited or imported.</p>
  </header>
  <section aria-label="Flagship learning programs" className="grid md:grid-cols-3 gap-3">
   {tracks.map(t=><button key={t.id} type="button" aria-pressed={active===t.id} onClick={()=>setActive(t.id)}
     className={"text-left border rounded-xl p-5 space-y-3 "+(active===t.id?"border-led-cyan bg-led-cyan/10":"border-border hover:border-led-cyan/50")}>
     <h2 className="font-bold text-lg">{t.title}</h2>
     <p className="text-xs text-muted-foreground">{t.project}</p>
     <div className="flex justify-between text-xs"><span>{t.passed} of {t.total} milestones</span><span>{t.finished?"Checklist complete":"In progress"}</span></div>
     <div className="h-2 bg-surface-3 rounded-full overflow-hidden" role="progressbar" aria-label={t.title+" checklist progress"} aria-valuemin={0} aria-valuemax={t.total} aria-valuenow={t.passed}>
       <div className="h-full bg-led-cyan" style={{width:(t.total?t.passed/t.total*100:0)+"%"}}/>
     </div>
   </button>)}
  </section>
  <section className="panel p-5 sm:p-7 space-y-5" aria-labelledby="flagship-checklist-title">
   <div>
    <h2 id="flagship-checklist-title" className="text-2xl font-bold">{selection.title} milestone checklist</h2>
    <p className="text-muted-foreground text-sm mt-2">{selection.project}</p>
   </div>
   <div className="space-y-3">
    {selection.steps.map((step,i)=><article key={step.id} className="flex gap-3 rounded-xl border border-border p-4">
      <span className="shrink-0 mt-1">{step.complete?<CheckCircle2 size={22} className="text-led-green"/>:<Circle size={22} className="text-muted-foreground"/>}</span>
      <div className="min-w-0 flex-1 space-y-2">
       <div className="flex justify-between flex-wrap gap-2">
        <h3 className="font-bold">{i+1}. {step.title}</h3>
        <span className={"text-xs font-semibold "+(step.complete?"text-led-green":"text-muted-foreground")}>{step.complete?"Recorded locally":"Not yet completed"}</span>
       </div>
       <p className="text-sm text-muted-foreground">{step.description}</p>
       <p className="text-xs">{step.evidence}</p>
       <Link to={step.link} className="text-led-cyan font-semibold text-sm inline-flex items-center gap-2">
        {step.complete?"Review evidence":"Do this milestone"} <ArrowRight size={14}/>
       </Link>
      </div>
    </article>)}
   </div>
   <p className="text-xs text-muted-foreground border-t border-border pt-4">Finishing every step means these particular local checklist conditions were met—not that a whole career is mastered. Real projects may require substantial additional work, code review and independently reproduced tests.</p>
  </section>
 </div>;
}