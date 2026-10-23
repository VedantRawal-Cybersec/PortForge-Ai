import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Target, BookOpen, ArrowRight, CheckCircle2, Save, BriefcaseBusiness } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { starterCareers, getCareerPlan, saveCareerPlan, type SavedCareer } from "@/lib/careerPlans";

export default function Oracle(){
 const [plan,setPlan]=useState<SavedCareer|null>(getCareerPlan);
 const [selected,setSelected]=useState(starterCareers[0].id);
 const [customRole,setCustomRole]=useState("");
 const [known,setKnown]=useState("");
 const [loading,setLoading]=useState(false);
 const [message,setMessage]=useState("");
 function persist(next:SavedCareer){
  try{saveCareerPlan(next);setPlan(next);setMessage("Career plan saved on this device.");}
  catch{setMessage("Your browser cannot save changes right now.");}
 }
 function useTemplate(){
  const chosen=starterCareers.find(p=>p.id===selected)||starterCareers[0];
  persist({role:chosen.role,overview:chosen.overview,skills:chosen.skills,steps:chosen.steps,checked:[],source:"curated",savedAt:Date.now()});
 }
 async function custom(){
  if(!customRole.trim())return;
  setLoading(true);setMessage("");
  try{
   const {data,error}=await supabase.functions.invoke("ai-evaluate",{body:{mode:"oracle",skill:customRole.trim().slice(0,120),answer:known.slice(0,700)}});
   if(error||data?.error)throw new Error("The AI service could not generate a roadmap.");
   if(!Array.isArray(data.roadmap)||!Array.isArray(data.requiredSkills))throw new Error("The AI service returned an incomplete roadmap.");
   persist({role:String(data.role||customRole).slice(0,140),overview:String(data.verdict||"AI-assisted starting suggestion"),skills:data.requiredSkills.map((x:unknown)=>String(x)).slice(0,30),steps:data.roadmap.map((r:{step?:string;detail?:string})=>({title:String(r.step||"Career milestone"),description:String(r.detail||"")})).slice(0,12),checked:[],source:"ai",savedAt:Date.now()});
   toast.success("Custom roadmap saved.");
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to load AI roadmap. You can use the curated options.");}
  finally{setLoading(false);}
 }
 function check(index:number){
  if(!plan)return;
  const checked=plan.checked.includes(index)?plan.checked.filter(n=>n!==index):[...plan.checked,index];
  persist({...plan,checked});
 }
 return <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-10 space-y-8">
  <header className="max-w-3xl space-y-3"><span className="chip chip-cyan"><BriefcaseBusiness className="size-4"/> CAREER EXPLORER</span><h1 className="text-4xl md:text-5xl font-bold tracking-tight">Turn a role into a practical plan.</h1><p className="text-muted-foreground text-lg leading-relaxed">Start with a researched-skill example pathway, adapt it to your interests, and track milestones. These are learning suggestions, not real-time job vacancies or verified salary forecasts.</p></header>
  <div className="grid lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.35fr)] gap-5">
   <aside className="space-y-5">
    <section className="panel p-5 sm:p-6 space-y-4"><h2 className="text-xl font-bold">Choose a starting career</h2>
     <label htmlFor="career-role" className="block text-sm font-semibold">Curated beginner roadmap</label>
     <select id="career-role" className="w-full rounded-lg border border-border bg-background p-3" value={selected} onChange={e=>setSelected(e.target.value)}>{starterCareers.map(c=><option key={c.id} value={c.id}>{c.role}</option>)}</select>
     <button type="button" className="bg-foreground text-background rounded-lg px-5 py-3 w-full font-bold inline-flex justify-center gap-2 items-center" onClick={useTemplate}><Target className="size-4"/> Use this learning path</button>
     <p className="text-xs text-muted-foreground">This path works without AI. Steps are illustrative, not individual job requirements.</p>
    </section>
    <section className="panel p-5 sm:p-6 space-y-4"><h2 className="text-xl font-bold">Explore another role with AI</h2>
     <label className="block text-sm font-medium" htmlFor="custom-career">Target role</label><input id="custom-career" className="w-full p-3 border border-border bg-background rounded-lg" value={customRole} onChange={e=>setCustomRole(e.target.value)} maxLength={120} placeholder="e.g. Sustainability analyst"/>
     <label className="block text-sm font-medium" htmlFor="known-skills">What you already know (optional)</label><textarea id="known-skills" rows={3} maxLength={700} className="w-full p-3 bg-background border border-border rounded-lg" placeholder="Your relevant skills" value={known} onChange={e=>setKnown(e.target.value)}/>
     <button type="button" disabled={loading||!customRole.trim()} onClick={custom} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 bg-led-cyan text-background font-bold disabled:opacity-50">{loading?<Loader2 className="size-4 animate-spin"/>:<Target className="size-4"/>}{loading?"Generating…":"Suggest a custom roadmap"}</button>
     <p className="text-xs text-muted-foreground">Depends on the configured AI service. Verify role requirements with current employer listings and reputable occupational sources.</p>
    </section>
   </aside>
   <section className="panel p-5 sm:p-8 space-y-6" aria-live="polite">
    {!plan?<div className="py-16 text-center"><BookOpen className="size-10 mx-auto text-led-cyan mb-4"/><h2 className="text-2xl font-bold">Your career journey starts here.</h2><p className="text-muted-foreground mt-3">Choose a starting role to build a saved learning roadmap.</p></div>:<>
     <div className="flex items-center justify-between gap-3 flex-wrap"><span className="chip chip-cyan">{plan.source==="ai"?"AI-generated suggestion":"Curated starter path"}</span><span className="text-xs text-muted-foreground">{plan.checked.length}/{plan.steps.length} self-tracked milestones</span></div>
     <div><h2 className="text-3xl font-bold">{plan.role}</h2><p className="text-muted-foreground mt-3 leading-relaxed">{plan.overview}</p></div>
     <div><h3 className="font-bold mb-3">Skills to explore</h3><div className="flex flex-wrap gap-2">{plan.skills.map((s,i)=><span className="chip" key={i}>{s}</span>)}</div></div>
     <div><h3 className="text-xl font-bold mb-4">Your action plan</h3><div className="space-y-3">{plan.steps.map((s,i)=><label key={i} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-surface-2 cursor-pointer"><input type="checkbox" className="mt-1 accent-cyan-500" checked={plan.checked.includes(i)} onChange={()=>check(i)} aria-label={"Completed "+s.title}/><span className="flex-1"><strong className="block">{s.title}</strong><span className="text-sm text-muted-foreground leading-relaxed mt-2 block">{s.description}</span></span>{plan.checked.includes(i)&&<CheckCircle2 className="size-5 text-led-green shrink-0"/>}</label>)}</div></div>
     <div className="p-4 border border-led-cyan/30 bg-led-cyan/5 rounded-lg flex flex-wrap gap-3 justify-between items-center"><div><strong className="text-sm">Continue with practical work</strong><p className="text-xs text-muted-foreground mt-1">Connect learning, practice and project explanation.</p></div><Link to="/practice" className="inline-flex gap-2 items-center bg-foreground text-background rounded-lg px-4 py-3 text-sm font-semibold">Practice a skill <ArrowRight className="size-4"/></Link></div>
    </>}
    {message&&<p role="status" className="text-xs text-muted-foreground flex items-center gap-2"><Save className="size-4"/>{message}</p>}
   </section>
  </div>
 </div>;
}
