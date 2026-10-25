import { useState } from "react";
import { Link } from "react-router-dom";
import AIAccountNotice from "@/components/AIAccountNotice";
import { Loader2, Target, BookOpen, ArrowRight, CheckCircle2, Save, BriefcaseBusiness } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { starterCareers, getCareerPlan, saveCareerPlan, makeCuratedCareerPlan, type SavedCareer } from "@/lib/careerPlans";
import { practiceLevels, levelGuidance, type PracticeLevel } from "@/lib/practiceLevels";

export default function Oracle(){
 const [plan,setPlan]=useState<SavedCareer|null>(getCareerPlan);
 const [selected,setSelected]=useState(starterCareers[0].id);
 const [customRole,setCustomRole]=useState("");
 const [known,setKnown]=useState("");
 const [difficulty,setDifficulty]=useState<PracticeLevel>("beginner");
 const [loading,setLoading]=useState(false);
 const [message,setMessage]=useState("");
 function persist(next:SavedCareer){
  try{saveCareerPlan(next);setPlan(next);setMessage("Career plan saved on this device.");}
  catch{setMessage("Your browser cannot save changes right now.");}
 }
 function useTemplate(){
  const chosen=starterCareers.find(p=>p.id===selected)||starterCareers[0];
  if(plan?.checked.length && !window.confirm("Replace your current roadmap? This will reset its checked milestones."))return;
  persist(makeCuratedCareerPlan(chosen,difficulty,known));
 }
 async function custom(){
  if(!customRole.trim())return;
  setLoading(true);setMessage("");
  try{
   const {data,error}=await supabase.functions.invoke("ai-evaluate",{body:{mode:"oracle",skill:customRole.trim().slice(0,120),answer:known.slice(0,700),difficulty}});
   if(error||data?.error)throw new Error("The AI service could not generate a roadmap.");
   if(!Array.isArray(data.roadmap)||!Array.isArray(data.requiredSkills))throw new Error("The AI service returned an incomplete roadmap.");
   if(plan?.checked.length && !window.confirm("Replace the current roadmap and reset completed milestones?"))return;
   persist({role:String(data.role||customRole).slice(0,140),overview:String(data.verdict||"AI-assisted starting suggestion"),skills:data.requiredSkills.map((x:unknown)=>String(x)).slice(0,30),steps:data.roadmap.map((r:{step?:string;detail?:string})=>({title:String(r.step||"Career milestone"),description:String(r.detail||"")})).slice(0,12),checked:[],source:"ai",savedAt:Date.now(),difficulty,knownSkills:known.toLowerCase().split(/[,;\n]/).map(x=>x.trim()).filter(Boolean).slice(0,20)});
   toast.success("Custom roadmap saved.");
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to load AI roadmap. You can use the curated options.");}
  finally{setLoading(false);}
 }
 function downloadPlan(){
  if(!plan)return;
  const lines=[
    "# "+plan.role,
    "",
    plan.overview,
    "",
    "## Skills to develop",
    ...plan.skills.map(s=>"- "+s),
    "",
    "## Milestones",
    ...plan.steps.map((s,i)=>(plan.checked.includes(i)?"- [x] ":"- [ ] ")+s.title+" — "+s.description),
    "",
    "PortForge AI learning plan. Self-tracked, not a certified qualification."
  ];
  const blob=new Blob([lines.join("\n")],{type:"text/markdown;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;anchor.download="portforge-career-roadmap.md";anchor.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const completed=plan?.checked.filter(i=>i>=0&&i<plan.steps.length).length||0;
 const progress=plan?.steps.length?Math.round(100*completed/plan.steps.length):0;
 const nextStep=plan?.steps.findIndex((_,i)=>!plan.checked.includes(i))??-1;
 function check(index:number){
  if(!plan)return;
  const checked=plan.checked.includes(index)?plan.checked.filter(n=>n!==index):[...plan.checked,index];
  persist({...plan,checked});
 }
 return <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-10 space-y-8">
  <header className="max-w-3xl space-y-3"><span className="chip chip-cyan"><BriefcaseBusiness className="size-4"/> CAREER EXPLORER</span><h1 className="text-4xl md:text-5xl font-bold tracking-tight">Turn a role into a practical plan.</h1><p className="text-muted-foreground text-lg leading-relaxed">Start with a researched-skill example pathway, adapt it to your interests, and track milestones. These are learning suggestions, not real-time job vacancies or verified salary forecasts.</p></header>
  <AIAccountNotice />
  <div className="grid lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.35fr)] gap-5">
   <aside className="space-y-5">
    <section className="panel p-5 sm:p-6 space-y-3">
      <h2 className="text-xl font-bold">Make the roadmap fit you</h2>
      <label htmlFor="oracle-level" className="block text-sm font-semibold">Your current experience</label>
      <select id="oracle-level" value={difficulty} onChange={e=>setDifficulty(e.target.value as PracticeLevel)}
        className="w-full min-h-11 border border-border rounded-lg bg-background p-3">
        {practiceLevels.map(level=><option key={level} value={level}>{levelGuidance[level].label}</option>)}
      </select>
      <p className="text-xs text-muted-foreground">{levelGuidance[difficulty].description}</p>
      <label className="block text-sm font-medium" htmlFor="known-skills">What you already know (optional)</label>
      <textarea id="known-skills" rows={3} maxLength={700} className="w-full p-3 bg-background border border-border rounded-lg"
        placeholder="e.g. HTML, JavaScript, Git (separate with commas)" value={known} onChange={e=>setKnown(e.target.value)}/>
      <p className="text-xs text-muted-foreground">Self-reported skills personalize suggestions; they do not count as verified qualifications.</p>
    </section>
    <section className="panel p-5 sm:p-6 space-y-4"><h2 className="text-xl font-bold">Choose a starting career</h2>
     <label htmlFor="career-role" className="block text-sm font-semibold">Curated beginner roadmap</label>
     <select id="career-role" className="w-full rounded-lg border border-border bg-background p-3" value={selected} onChange={e=>setSelected(e.target.value)}>{starterCareers.map(c=><option key={c.id} value={c.id}>{c.role}</option>)}</select>
     <button type="button" className="bg-foreground text-background rounded-lg px-5 py-3 w-full font-bold inline-flex justify-center gap-2 items-center" onClick={useTemplate}><Target className="size-4"/> Use this learning path</button>
     <p className="text-xs text-muted-foreground">Personalized {difficulty}-level plan with a role-specific project deliverable. Works without AI.</p>
    </section>
    <section className="panel p-5 sm:p-6 space-y-4"><h2 className="text-xl font-bold">Explore another role with AI</h2>
     <label className="block text-sm font-medium" htmlFor="custom-career">Target role</label><input id="custom-career" className="w-full p-3 border border-border bg-background rounded-lg" value={customRole} onChange={e=>setCustomRole(e.target.value)} maxLength={120} placeholder="e.g. Sustainability analyst"/>
     <button type="button" disabled={loading||!customRole.trim()} onClick={custom} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 bg-led-cyan text-background font-bold disabled:opacity-50">{loading?<Loader2 className="size-4 animate-spin"/>:<Target className="size-4"/>}{loading?"Generating…":"Suggest a custom roadmap"}</button>
     <p className="text-xs text-muted-foreground">Depends on the configured AI service. Verify role requirements with current employer listings and reputable occupational sources.</p>
    </section>
   </aside>
   <section className="panel p-5 sm:p-8 space-y-6" aria-live="polite">
    {!plan?<div className="py-16 text-center"><BookOpen className="size-10 mx-auto text-led-cyan mb-4"/><h2 className="text-2xl font-bold">Your career journey starts here.</h2><p className="text-muted-foreground mt-3">Choose a starting role to build a saved learning roadmap.</p></div>:<>
     <div className="flex items-center justify-between gap-3 flex-wrap"><span className="chip chip-cyan">{plan.source==="ai"?"AI-generated suggestion":"Curated starter path"}</span><span className="text-xs text-muted-foreground">{completed}/{plan.steps.length} self-tracked milestones</span></div>
     <div><h2 className="text-3xl font-bold">{plan.role}</h2><p className="text-muted-foreground mt-3 leading-relaxed">{plan.overview}</p></div>
     <div className="rounded-xl border border-led-cyan/25 bg-led-cyan/5 p-4 sm:p-5 space-y-3">
       <div className="flex justify-between gap-3 items-center">
         <span className="font-semibold text-sm">Your roadmap progress</span>
         <span className="text-sm font-mono text-led-cyan">{progress}%</span>
       </div>
       <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Roadmap completed" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
         <div className="h-full rounded-full bg-led-cyan transition-all duration-300" style={{width:progress+"%"}}/>
       </div>
       {nextStep>=0?<div>
         <p className="text-xs uppercase tracking-wide text-muted-foreground">Your next milestone</p>
         <p className="text-base font-bold mt-1">{plan.steps[nextStep].title}</p>
         <p className="text-sm text-muted-foreground mt-1">{plan.steps[nextStep].description}</p>
       </div>:<p className="text-sm text-led-green">You have checked all milestones. Consider creating a new project to demonstrate these skills.</p>}
       <button type="button" onClick={downloadPlan} className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:border-led-cyan/60">
         Download my roadmap (.md)
       </button>
     </div>
     <div>
        <h3 className="font-bold mb-2">Skills to explore</h3>
        <p className="text-xs text-muted-foreground mb-3">Already know a skill? It is highlighted for planning only; this does not automatically mark milestones complete.</p>
        <div className="flex flex-wrap gap-2">{plan.skills.map((s,i)=><span className={"chip " + ((plan.knownSkills || []).some(k=>k===s.toLowerCase()) ? "chip-green" : "")} key={i}>{s}{(plan.knownSkills || []).some(k=>k===s.toLowerCase()) ? " · familiar" : ""}</span>)}</div>
      </div>
     <div><h3 className="text-xl font-bold mb-4">Your action plan</h3><div className="space-y-3">{plan.steps.map((s,i)=><label key={i} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-surface-2 cursor-pointer"><input type="checkbox" className="mt-1 accent-cyan-500" checked={plan.checked.includes(i)} onChange={()=>check(i)} aria-label={"Completed "+s.title}/><span className="flex-1"><strong className="block">{s.title}</strong><span className="text-sm text-muted-foreground leading-relaxed mt-2 block">{s.description}</span></span>{plan.checked.includes(i)&&<CheckCircle2 className="size-5 text-led-green shrink-0"/>}</label>)}</div></div>
     <div className="p-4 border border-led-cyan/30 bg-led-cyan/5 rounded-lg space-y-3">
       <strong className="text-sm">Work on your next milestone</strong>
       <p className="text-xs text-muted-foreground">Choose the activity that helps you make progress, then return to mark it complete once you have evidence.</p>
       <div className="flex gap-2 flex-wrap">
         <Link to="/skill-test" className="inline-flex gap-1 items-center rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold">Test a skill <ArrowRight className="size-3"/></Link>
         <Link to="/workspace" className="inline-flex gap-1 items-center rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-semibold">Build a project <ArrowRight className="size-3"/></Link>
         <Link to="/portfolio" className="inline-flex gap-1 items-center rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold">Document evidence <ArrowRight className="size-3"/></Link>
       </div>
     </div>
    </>}
    {message&&<p role="status" className="text-xs text-muted-foreground flex items-center gap-2"><Save className="size-4"/>{message}</p>}
   </section>
  </div>
 </div>;
}
