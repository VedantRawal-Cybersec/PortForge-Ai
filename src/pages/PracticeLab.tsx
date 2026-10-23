import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Save, Lightbulb, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { exercises, assessExercise, findPractice, getPractice, savePractice, type TestResult } from "@/lib/practice";

export default function PracticeLab(){
 const [id,setId]=useState(exercises[0].id);
 const exercise=exercises.find(e=>e.id===id)||exercises[0];
 const [drafts,setDrafts]=useState<Record<string,string>>(()=>Object.fromEntries(exercises.map(e=>[e.id,findPractice(e.id)?.code||e.starter])));
 const [notes,setNotes]=useState<Record<string,string>>(()=>Object.fromEntries(exercises.map(e=>[e.id,findPractice(e.id)?.reflection||""])));
 const [history,setHistory]=useState(getPractice);
 const [results,setResults]=useState<TestResult[]>([]);
 const [running,setRunning]=useState(false);
 const [hint,setHint]=useState(false);
 const [error,setError]=useState("");
 const code=drafts[id]||"";
 const completed=history.filter(h=>h.total>0&&h.passed===h.total).length;
 const select=(next:string)=>{setId(next);setResults([]);setError("");setHint(false);};
 function save(r?:TestResult[]){
  const old=findPractice(id);
  const latest=r||old?.results||[];
  try{savePractice({id:old?.id||crypto.randomUUID(),exerciseId:id,code,reflection:notes[id]||"",results:latest,passed:latest.filter(t=>t.pass).length,total:latest.length,updatedAt:Date.now()});setHistory(getPractice());return true;}
  catch{toast.error("Your browser could not save this activity.");return false;}
 }
 async function run(){
  setRunning(true);setResults([]);setError("");
  try{const value=await assessExercise(exercise,code);setResults(value.results);save(value.results);toast.info("Completed "+value.results.filter(x=>x.pass).length+" of "+value.results.length+" test cases.");}
  catch(e){setError(e instanceof Error?e.message:"Unable to run tests.");}
  finally{setRunning(false);}
 }
 return <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-7">
   <header><span className="chip chip-cyan">INDEPENDENT PRACTICE LAB</span><h1 className="text-4xl md:text-5xl font-bold mt-4">Build it yourself.</h1><p className="text-muted-foreground mt-3 max-w-3xl">Solve realistic small challenges, run repeatable tests, and describe your work. The focus is understanding—not copying generated solutions.</p></header>
   <div className="panel p-4 flex flex-wrap justify-between gap-3"><strong>Challenges passed: {completed} / {exercises.length}</strong><Link to="/skill-dna" className="text-led-cyan inline-flex gap-2 items-center">View learning progress <ArrowRight className="size-4"/></Link></div>
   <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-5">
    <aside className="panel p-4 h-fit space-y-2"><h2 className="font-bold mb-4">Choose a challenge</h2>{exercises.map(e=>{const h=history.find(x=>x.exerciseId===e.id);return <button type="button" key={e.id} onClick={()=>select(e.id)} aria-pressed={e.id===id} className={"block w-full text-left rounded-lg p-3 border "+(e.id===id?"border-led-cyan bg-led-cyan/10":"border-transparent hover:bg-surface-2")}><strong className="text-sm">{e.title}</strong><span className="block text-xs text-muted-foreground mt-1">{h&&h.total>0&&h.passed===h.total?<CheckCircle2 className="size-3 inline text-led-green"/>:null} {e.level} · {e.topic}</span></button>})}</aside>
    <div className="space-y-5 min-w-0">
     <section className="panel p-5 md:p-7 space-y-4"><span className="chip">{exercise.level}</span><h2 className="text-2xl font-bold">{exercise.title}</h2><p className="text-muted-foreground">{exercise.brief}</p>
      <button type="button" className="inline-flex gap-2 items-center text-led-cyan text-sm" onClick={()=>setHint(x=>!x)}><Lightbulb className="size-4"/>{hint?"Hide hint":"Need a hint?"}</button>{hint&&<div role="note" className="rounded-lg border border-led-amber/40 p-4 text-sm">{exercise.hint}</div>}
      <label htmlFor="solution" className="block font-semibold text-sm">Your JavaScript solution</label><textarea id="solution" aria-label="Your JavaScript solution" spellCheck={false} value={code} onChange={e=>setDrafts(p=>({...p,[id]:e.target.value}))} maxLength={12000} className="bg-background w-full min-h-64 rounded-lg border border-border p-4 font-mono text-sm"/>
      <div className="flex gap-3 flex-wrap"><button type="button" disabled={running} onClick={run} className="bg-foreground text-background rounded-lg px-5 py-3 font-semibold inline-flex items-center gap-2 disabled:opacity-50"><Play className="size-4"/>{running?"Checking…":"Run practice tests"}</button><button type="button" onClick={()=>{if(save())toast.success("Draft saved.");}} className="border border-border rounded-lg px-5 py-3 inline-flex gap-2 items-center"><Save className="size-4"/> Save draft</button></div>
      <p className="text-xs text-muted-foreground">Sandboxed self-practice, not a verified professional assessment. Save your work on this device.</p>
     </section>
     <section aria-live="polite" className="panel p-5 md:p-7 space-y-4"><h2 className="text-xl font-bold">Test feedback</h2>{results.length===0?<p className="text-muted-foreground text-sm">Run tests to check your work against multiple cases.</p>:<div className="grid sm:grid-cols-2 gap-3">{results.map((r,i)=><div key={i} className="rounded-lg border border-border p-4"><h3 className="font-semibold text-sm">{r.pass?<CheckCircle2 className="text-led-green size-4 inline mr-2"/>:<XCircle className="text-led-alert size-4 inline mr-2"/>}{r.label}</h3>{!r.pass&&<div className="text-xs font-mono mt-3 break-all"><p>Expected: {r.expected}</p><p>Actual: {r.actual}</p></div>}</div>)}</div>}{error&&<p role="alert" className="text-led-alert text-sm">{error}</p>}</section>
     <section className="panel p-5 md:p-7 space-y-4"><h2 className="text-xl font-bold">Explain your work</h2><p className="text-muted-foreground text-sm">What did you try? Which test was difficult? How did you improve your code?</p><textarea aria-label="Project reflection" maxLength={2000} rows={4} value={notes[id]||""} onChange={e=>setNotes(n=>({...n,[id]:e.target.value}))} className="w-full rounded-lg border border-border bg-background p-4" placeholder="I first tried… then I tested…"/><div className="flex flex-wrap gap-3"><button className="rounded-lg border border-border px-4 py-3 inline-flex items-center gap-2" onClick={()=>{if(save(results.length?results:undefined))toast.success("Notes saved.");}}><Save className="size-4"/> Save notes</button><Link to={"/project-interview?exercise="+encodeURIComponent(id)} className="rounded-lg bg-led-cyan text-background font-semibold px-4 py-3 inline-flex gap-2 items-center">Project interview <ArrowRight className="size-4"/></Link></div></section>
    </div>
   </div>
 </div>;
}
