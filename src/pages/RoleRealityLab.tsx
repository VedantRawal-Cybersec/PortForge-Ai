import {useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {ArrowRight,CheckCircle2,Download,RotateCcw,ShieldCheck} from "lucide-react";
import {toast} from "sonner";
import {
 realityRoles,realityScenarios,getRealityScenario,evaluateReality,readRealityResults,
 saveRealityResult,realityReport,type RealityRole,type RealityResult
} from "@/lib/roleReality";

export default function RoleRealityLab(){
 const [searchParams,setSearchParams]=useSearchParams();
 const initial=searchParams.get("role");
 const [role,setRole]=useState<RealityRole>(realityRoles.some(r=>r.id===initial)?initial as RealityRole:"frontend");
 const [scenarioId,setScenarioId]=useState<string|null>(null);
 const [answers,setAnswers]=useState<number[]>([]);
 const [choice,setChoice]=useState<number|null>(null);
 const [explain,setExplain]=useState(false);
 const [reflection,setReflection]=useState("");
 const [result,setResult]=useState<RealityResult|null>(null);
 const [history,setHistory]=useState(readRealityResults);
 const scenario=scenarioId?getRealityScenario(scenarioId):null;
 const current=scenario?.steps[answers.length]||null;
 const last=scenario&&answers.length?scenario.steps[answers.length-1]:null;
 const finished=!!scenario&&answers.length===scenario.steps.length;
 const previousRoleResults=history.filter(x=>x.role===role);
 const correct=answers.filter((a,i)=>scenario?.steps[i].correct===a).length;
 function chooseRole(id:RealityRole){
   setRole(id);setSearchParams({role:id},{replace:true});
   setScenarioId(null);setAnswers([]);setChoice(null);setExplain(false);setResult(null);setReflection("");
 }
 function begin(id:string){
   setScenarioId(id);setAnswers([]);setChoice(null);setExplain(false);setReflection("");setResult(null);
 }
 function submit(){
   if(!scenario||!current||choice===null||explain)return;
   setAnswers(a=>[...a,choice]);setExplain(true);
 }
 function next(){setChoice(null);setExplain(false);}
 function complete(){
   if(!scenario||!finished)return;
   try{
     const nextResult=evaluateReality(scenario.id,answers,reflection);
     saveRealityResult(nextResult);setHistory(readRealityResults());setResult(nextResult);
     toast.success("Role simulation saved privately on this device.");
   }catch{toast.error("Your browser could not save this simulation. Download the report to keep your work.");}
 }
 function download(){
   if(!result)return;
   const url=URL.createObjectURL(new Blob([realityReport(result)],{type:"text/plain;charset=utf-8"}));
   const anchor=document.createElement("a");anchor.href=url;anchor.download="portforge-role-reality-"+result.role+".txt";
   document.body.appendChild(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
   <header className="space-y-3 max-w-4xl">
     <span className="chip chip-cyan">PORTFORGE · ROLE REALITY LAB</span>
     <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Try the work before choosing the career.</h1>
     <p className="text-muted-foreground text-lg leading-relaxed">
       Experience realistic decisions made by frontend developers, data analysts and defensive security analysts. Learn what each role involves, receive clear feedback, and leave with a practical project to try.
     </p>
     <p className="text-xs text-muted-foreground">Fictional workplace simulations. Locally checked choices are not a validated assessment of career aptitude or professional ability. No third-party services or real business systems are contacted.</p>
   </header>
   <section className="grid md:grid-cols-3 gap-3" aria-label="Explore technical careers">
     {realityRoles.map(r=><button type="button" key={r.id} onClick={()=>chooseRole(r.id)}
       aria-pressed={role===r.id}
       className={"text-left rounded-xl border p-4 sm:p-5 space-y-2 hover:border-led-cyan/70 "+(role===r.id?"border-led-cyan bg-led-cyan/10":"border-border bg-surface-2/20")}>
       <span aria-hidden="true" className="text-3xl">{r.icon}</span>
       <h2 className="text-lg font-bold">{r.title}</h2>
       <p className="text-sm text-muted-foreground">{r.summary}</p>
       <span className="text-xs text-led-cyan">{history.filter(x=>x.role===r.id).length} practice sessions saved</span>
     </button>)}
   </section>
   {!scenario?<section className="panel p-5 sm:p-7 space-y-5" aria-labelledby="choose-scenario">
     <div className="flex flex-wrap gap-3 items-center justify-between">
       <div><h2 id="choose-scenario" className="text-2xl font-bold">Choose a realistic work assignment</h2>
         <p className="text-sm text-muted-foreground mt-2">Each scenario involves three decisions and a specific project or report that you can build afterwards.</p></div>
       <Link to="/oracle" className="text-sm font-bold text-led-cyan">Compare career pathways <ArrowRight size={15} className="inline"/></Link>
     </div>
     <div className="grid md:grid-cols-2 gap-4">
       {realityScenarios.filter(s=>s.role===role).map(s=><div key={s.id} className="border border-border rounded-xl p-5 space-y-3">
         <p className="text-xs font-mono text-led-cyan">~{s.duration} MIN · 3 DECISIONS</p>
         <h3 className="font-bold text-lg">{s.title}</h3>
         <p className="text-sm text-muted-foreground leading-relaxed">{s.setting}</p>
         <div className="bg-surface-2/50 rounded-lg p-3 space-y-1">
           <p className="text-xs font-bold">A real-world deliverable to attempt</p>
           <p className="text-xs text-muted-foreground">{s.deliverable}</p>
         </div>
         <button type="button" onClick={()=>begin(s.id)}
           className="bg-foreground text-background rounded-lg font-bold px-4 py-3 inline-flex gap-2 items-center">
           Start scenario <ArrowRight size={15}/>
         </button>
       </div>)}
     </div>
     {previousRoleResults.length>0&&<div className="border-t border-border pt-4">
       <h3 className="font-bold text-sm mb-3">Your recent {realityRoles.find(r=>r.id===role)?.title} sessions</h3>
       <div className="grid sm:grid-cols-2 gap-3">
         {previousRoleResults.slice(0,4).map(x=><div key={x.id} className="border border-border rounded-lg p-3">
           <p className="font-semibold text-sm">{getRealityScenario(x.scenarioId)?.title}</p>
           <p className="text-xs text-muted-foreground">{x.correct}/{x.answers.length} locally correct · {new Date(x.completedAt).toLocaleDateString()}</p>
         </div>)}
       </div>
     </div>}
   </section>:<section className="panel p-5 sm:p-8 space-y-5" aria-labelledby="active-scenario">
     <div className="flex flex-wrap gap-3 justify-between">
       <div>
         <span className="text-xs font-mono text-led-cyan">{realityRoles.find(r=>r.id===scenario.role)?.title.toUpperCase()}</span>
         <h2 id="active-scenario" className="text-2xl sm:text-3xl font-bold mt-2">{scenario.title}</h2>
       </div>
       <button type="button" onClick={()=>setScenarioId(null)} className="text-xs rounded-lg border border-border px-4 py-2 h-fit">Back to scenarios</button>
     </div>
     <p className="text-sm text-muted-foreground leading-relaxed">{scenario.setting}</p>
     <div className="flex items-center justify-between gap-3">
       <span className="font-semibold text-sm">Decision {Math.min(3,answers.length+1)} of 3</span>
       <span className="text-sm text-muted-foreground">{correct}/{answers.length} correct so far</span>
     </div>
     <div className="h-2 bg-surface-3 rounded-full overflow-hidden" role="progressbar" aria-label="Role reality progress" aria-valuenow={answers.length} aria-valuemin={0} aria-valuemax={3}>
       <div className="h-full bg-led-cyan transition-all" style={{width:(answers.length/3*100)+"%"}}/>
     </div>
     {explain&&last?<div role="status" className="space-y-4">
       <span className={"chip "+(last.correct===answers[answers.length-1]?"chip-green":"chip-amber")}>
         {last.correct===answers[answers.length-1]?"Recommended choice":"Review your reasoning"}
       </span>
       <h3 className="text-xl font-bold">{last.prompt}</h3>
       <p className="text-sm"><strong>Your decision:</strong> {last.choices[answers[answers.length-1]]}</p>
       {answers[answers.length-1]!==last.correct&&<p className="text-sm"><strong>Recommended decision:</strong> {last.choices[last.correct]}</p>}
       <p className="rounded-xl border border-led-cyan/30 bg-led-cyan/5 p-4 text-sm leading-relaxed">{last.explanation}</p>
       <button type="button" onClick={next} className="bg-foreground text-background rounded-xl px-5 py-3 font-semibold">
         {finished?"Reflect on this experience":"Continue to next decision"} <ArrowRight size={15} className="inline"/>
       </button>
     </div>:finished?<div className="space-y-4" role="status">
       <CheckCircle2 size={32} className="text-led-green"/>
       <h3 className="font-bold text-2xl">Scenario complete: {correct} of 3 recommended decisions</h3>
       <p className="text-sm text-muted-foreground">This is an educational case study based on simulated choices. A real project and tests are still needed to demonstrate technical skills.</p>
       <div className="border border-led-cyan/30 rounded-xl bg-led-cyan/5 p-4">
         <h4 className="font-bold">Build an actual deliverable</h4>
         <p className="text-sm mt-2">{scenario.deliverable}</p>
       </div>
       <label className="block space-y-2 text-sm font-bold">
         <span>Your reflection (optional)</span>
         <textarea rows={4} value={reflection} onChange={e=>setReflection(e.target.value)} maxLength={1200}
           placeholder="What surprised you? What would you want to learn before doing this in real life?"
           className="w-full rounded-xl border border-border bg-background p-3 font-normal text-sm"/>
       </label>
       {!result?<button type="button" onClick={complete}
         className="rounded-lg bg-foreground text-background px-5 py-3 font-bold">Save my simulation</button>:
         <div className="space-y-3">
           <p className="text-sm text-led-green font-semibold">Simulation saved locally. Add the actual deliverable to your portfolio only after completing it.</p>
           <div className="flex gap-2 flex-wrap">
             <button type="button" onClick={download} className="rounded-lg border border-border px-4 py-3 inline-flex items-center gap-2 font-semibold text-sm"><Download size={15}/> Download decision report</button>
             <Link to="/workspace" className="rounded-lg border border-border px-4 py-3 text-sm font-semibold">Build in Workspace</Link>
             <Link to="/portfolio" className="rounded-lg border border-border px-4 py-3 text-sm font-semibold">Document real work</Link>
           </div>
         </div>}
       <button type="button" onClick={()=>{setScenarioId(null);setResult(null);setAnswers([]);}}
         className="text-sm text-led-cyan underline inline-flex gap-2 items-center"><RotateCcw size={15}/> Explore another assignment</button>
     </div>:current?<div className="space-y-4">
       <h3 className="text-xl font-bold leading-snug">{current.prompt}</h3>
       <fieldset className="space-y-2">
         <legend className="text-xs text-muted-foreground font-semibold mb-2">How would you respond?</legend>
         {current.choices.map((item,i)=><label key={item} className={"flex items-start gap-3 rounded-xl border p-4 cursor-pointer text-sm "+(choice===i?"border-led-cyan bg-led-cyan/10":"border-border hover:border-led-cyan/40")}>
           <input type="radio" name="role-reality-choice" checked={choice===i} onChange={()=>setChoice(i)} className="mt-1 accent-led-cyan"/>
           <span>{item}</span>
         </label>)}
       </fieldset>
       <button type="button" onClick={submit} disabled={choice===null}
         className="bg-foreground text-background rounded-xl px-5 py-3 font-bold disabled:opacity-40">Check decision</button>
     </div>:null}
   </section>}
   <section className="border-t border-border pt-5 flex flex-wrap gap-4 items-start justify-between">
     <div className="max-w-2xl">
       <div className="flex gap-2 items-center text-sm font-semibold"><ShieldCheck size={16} className="text-led-cyan"/> Privacy and evidence</div>
       <p className="text-xs text-muted-foreground mt-2">Your decisions and reflection are stored in browser-local data and may be included in your own backup. PortForge does not claim to have externally reviewed or certified this simulation.</p>
     </div>
     <Link to="/my-data" className="text-sm text-led-cyan underline">Manage my data</Link>
   </section>
 </div>;
}