import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { publicPublication, type Publication } from "@/lib/publication";

export default function PublicPortfolio() {
  const { slug="" }=useParams<{slug:string}>();
  const [value,setValue]=useState<Publication|null>(null);
  const [status,setStatus]=useState<"loading"|"ready"|"missing"|"error">("loading");
  useEffect(()=>{
    let active=true;
    setStatus("loading");
    void publicPublication(slug).then(p=>{
      if(active){setValue(p);setStatus(p?"ready":"missing");}
    }).catch(()=>{if(active)setStatus("error");});
    return ()=>{active=false;};
  },[slug]);
  if(status==="loading")return <div className="max-w-4xl mx-auto p-10" role="status">Loading published portfolio…</div>;
  if(status!=="ready"||!value)return <div className="max-w-3xl mx-auto px-5 py-20 space-y-4">
    <h1 className="text-3xl font-bold">{status==="error"?"Portfolio unavailable":"This portfolio is not published"}</h1>
    <p className="text-muted-foreground">The owner may have unpublished it, or the link may be incorrect.</p>
    <Link to="/" className="text-led-cyan underline">Return to PortForge</Link>
  </div>;
  const d=value.document;
  const editorial=value.theme==="editorial";
  const minimal=value.theme==="minimal";
  return <article className={editorial?"bg-[#f4efe6] text-[#28231f] min-h-[70vh]":minimal?"bg-[#fafafa] text-[#1b2625] min-h-[70vh]":"bg-[#0c1117] text-[#e9f8f4] min-h-[70vh]"}>
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-10">
      <header className="border-b border-current/20 pb-9">
        <p className="text-xs uppercase tracking-[.22em] opacity-60 font-mono">Personal portfolio · {d.focus || "Projects"}</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 break-words">{d.name}</h1>
        <p className="text-xl sm:text-2xl font-semibold mt-4">{d.headline || "Projects and practical work"}</p>
        {d.bio&&<p className="text-base sm:text-lg leading-relaxed mt-5 opacity-80 max-w-3xl whitespace-pre-wrap">{d.bio}</p>}
      </header>
      <section aria-labelledby="published-work" className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 id="published-work" className="text-2xl sm:text-3xl font-bold flex gap-2 items-center"><BriefcaseBusiness className="size-6"/> Selected work</h2>
          <span className="text-xs opacity-70">{d.projects.length} owner-described projects</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {d.projects.map((p,i)=><section key={i} className="border border-current/20 rounded-2xl p-5 sm:p-7 space-y-4">
            <span className="text-[10px] uppercase tracking-widest opacity-65">Self-reported project {i+1}</span>
            <h3 className="text-xl sm:text-2xl font-bold break-words">{p.title}</h3>
            <p className="leading-relaxed opacity-90 whitespace-pre-wrap break-words">{p.summary}</p>
            {p.challenge&&<div><h4 className="text-xs font-bold uppercase tracking-wide opacity-65">Problem</h4><p className="text-sm mt-1 whitespace-pre-wrap break-words">{p.challenge}</p></div>}
            {p.approach&&<div><h4 className="text-xs font-bold uppercase tracking-wide opacity-65">Approach</h4><p className="text-sm mt-1 whitespace-pre-wrap break-words">{p.approach}</p></div>}
            {p.validation&&<div><h4 className="text-xs font-bold uppercase tracking-wide opacity-65">Testing and evidence</h4><p className="text-sm mt-1 whitespace-pre-wrap break-words">{p.validation}</p></div>}
            {p.role&&<p className="text-sm"><strong>Contribution:</strong> {p.role}</p>}
            {p.outcome&&<p className="text-sm"><strong>Outcome:</strong> {p.outcome}</p>}
            {p.technologies&&<p className="text-xs font-semibold opacity-80">Tools: {p.technologies}</p>}
            {p.projectUrl&&<a href={p.projectUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex gap-1.5 items-center underline underline-offset-4 font-semibold text-sm">View project <ArrowUpRight size={16}/></a>}
          </section>)}
        </div>
      </section>
      <footer className="pt-7 border-t border-current/20 text-xs opacity-70 flex items-center gap-2">
        <ShieldCheck size={14}/> This page contains owner-described work; PortForge has not independently verified its claims.
      </footer>
    </div>
  </article>;
}
