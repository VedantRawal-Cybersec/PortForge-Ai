import {useMemo,useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight,CheckCircle2,Download,RotateCcw} from "lucide-react";
import {getLearningTrack,tracks,trackCategories} from "@/lib/academy";
import {evaluateTrackCheck,exportTrackCheck,readTrackChecks,saveTrackCheck,type TrackCheckRecord} from "@/lib/trackChecks";

export default function TrackQuickChecks(){
 const [search,setSearch]=useState("");
 const [category,setCategory]=useState("All tracks");
 const [trackId,setTrackId]=useState("python");
 const [answers,setAnswers]=useState<{trackId:string;values:number[]}|null>(null);
 const [selected,setSelected]=useState<number|null>(null);
 const [review,setReview]=useState(false);
 const [error,setError]=useState("");
 const [result,setResult]=useState<TrackCheckRecord|null>(null);
 const [history,setHistory]=useState(readTrackChecks);
 const matching=useMemo(()=>tracks.filter(t=>
  (category==="All tracks"||t.category===category)&&
  (!search.trim()||[t.name,t.description,t.category].join(" ").toLowerCase().includes(search.trim().toLowerCase()))),[search,category]);
 const picked=matching.some(t=>t.id===trackId)?trackId:matching[0]?.id||"";
 const track=answers?getLearningTrack(answers.trackId):getLearningTrack(picked);
 const current=answers&&track?track.lessons[answers.values.length]:null;
 const previous=answers&&track&&answers.values.length>0?track.lessons[answers.values.length-1]:null;
 const lastIndex=answers?.values.at(-1);
 const completed=!!answers&&answers.values.length===3;
 function start(){
  if(!picked)return;
  setAnswers({trackId:picked,values:[]});setSelected(null);setReview(false);setResult(null);setError("");
 }
 function answer(){
  if(!answers||!current||selected===null||review)return;
  const next={...answers,values:[...answers.values,selected]};
  setAnswers(next);setReview(true);setError("");
  if(next.values.length===3){
   try{
    const checked=evaluateTrackCheck(next.trackId,next.values);
    saveTrackCheck(checked);
    setResult(checked);setHistory(readTrackChecks());
   }catch(e){setError(e instanceof Error?e.message:"Could not save this check.");}
  }
 }
 function next(){setReview(false);setSelected(null);}
 function download(){
  if(!result)return;
  const url=URL.createObjectURL(new Blob([exportTrackCheck(result)],{type:"text/plain;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download="portforge-"+result.trackId+"-review.txt";
  link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <section className="panel p-5 sm:p-7 space-y-5" aria-labelledby="every-track-title">
  <div className="flex flex-wrap justify-between gap-3 items-start">
   <div className="max-w-2xl">
    <span className="chip chip-cyan">ALL 69 LEARNING TRACKS · NO AI REQUIRED</span>
    <h2 id="every-track-title" className="text-2xl sm:text-3xl font-bold mt-3 tracking-tight">
     Check your understanding in any field.
    </h2>
    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">Pick a subject and answer three objective introductory questions. Get explanations, an actionable project, downloadable notes, and a history of your practice on this device.</p>
   </div>
   <span className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground">Introductory review · not certification</span>
  </div>
  {!answers?<>
   <div className="grid sm:grid-cols-2 gap-3">
    <label className="space-y-2 block text-sm font-semibold"><span>Search a topic</span>
     <input type="search" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search quick-check tracks"
      placeholder="Python, React, cloud security, UX…" className="w-full min-h-12 rounded-xl border border-border bg-background p-3 text-sm"/>
    </label>
    <label className="space-y-2 block text-sm font-semibold"><span>Category</span>
     <select value={category} onChange={e=>setCategory(e.target.value)}
      aria-label="Filter quick-check tracks" className="w-full min-h-12 rounded-xl border border-border bg-background p-3 text-sm">
      {trackCategories.map(cat=><option key={cat} value={cat}>{cat}</option>)}
     </select>
    </label>
   </div>
   <label className="space-y-2 block text-sm font-semibold"><span>Select a learning track</span>
    <select value={picked} onChange={e=>setTrackId(e.target.value)} aria-label="Objective check learning track"
      disabled={!matching.length} className="w-full min-h-12 rounded-xl border border-border bg-background p-3 text-sm">
      {!matching.length?<option value="">No matching learning tracks</option>:
       matching.map(t=><option key={t.id} value={t.id}>{t.name} · {t.category}</option>)}
    </select>
   </label>
   {track&&<div className="border border-border rounded-xl p-4 space-y-1">
    <h3 className="font-bold text-lg">{track.icon} {track.name}</h3>
    <p className="text-sm text-muted-foreground">{track.description}</p>
    <p className="text-xs text-led-cyan mt-2">3 short questions · approximately 4 minutes · answer-key checked</p>
   </div>}
   {!matching.length&&<p role="status" className="text-sm text-muted-foreground">No matching track. Try a different search or category.</p>}
   <button type="button" disabled={!picked} onClick={start}
    className="bg-foreground text-background rounded-xl px-5 py-3 min-h-12 font-bold disabled:opacity-40">
    Begin track check <ArrowRight size={16} className="inline ml-1"/>
   </button>
   {history.length>0&&<div className="border-t border-border pt-4 space-y-2">
     <h3 className="font-bold text-sm">Your recent track checks</h3>
     <div className="grid sm:grid-cols-3 gap-2">
      {history.slice(0,3).map(h=><div className="rounded-lg border border-border p-3" key={h.id}>
        <p className="font-semibold text-sm">{getLearningTrack(h.trackId)?.name||h.trackId}</p>
        <p className="text-xs text-muted-foreground mt-1">{h.correct}/{h.answers.length} locally correct · {new Date(h.completedAt).toLocaleDateString()}</p>
      </div>)}
     </div>
   </div>}
  </>:<div className="space-y-4" aria-live="polite">
   <div className="flex justify-between items-center gap-3 flex-wrap">
    <p className="text-sm font-bold">{track?.icon} {track?.name}</p>
    <span className="text-xs font-mono text-muted-foreground">{answers.values.length}/3 answered</span>
   </div>
   <div className="bg-surface-3 h-2 rounded-full overflow-hidden" aria-label="Track check progress">
    <div className="bg-led-cyan h-full transition-[width]" style={{width:100*answers.values.length/3+"%"}}/>
   </div>
   {review&&previous&&lastIndex!==undefined?<div role="status" className="space-y-3">
    <span className={"chip "+(lastIndex===previous.correct?"chip-green":"chip-amber")}>
      {lastIndex===previous.correct?"Correct":"Needs review"}
    </span>
    <h3 className="text-xl font-bold">{previous.prompt}</h3>
    <p className="text-sm"><strong>Your answer:</strong> {previous.choices[lastIndex]}</p>
    {lastIndex!==previous.correct&&<p className="text-sm"><strong>Expected answer:</strong> {previous.choices[previous.correct]}</p>}
    <p className="rounded-xl border border-border p-4 bg-surface-2/50 text-sm">{previous.why}</p>
    <button type="button" onClick={next} className="bg-foreground text-background font-bold px-5 py-3 rounded-xl">
      {completed?"See track results":"Next question"} <ArrowRight size={15} className="inline ml-1"/>
    </button>
   </div>:completed&&result?<div role="status" className="space-y-4">
    <CheckCircle2 className="size-9 text-led-green"/>
    <h3 className="font-bold text-2xl">Track review: {result.correct}/3 correct</h3>
    <p className="text-sm text-muted-foreground">You answered three introductory questions. This is practice evidence, not a complete assessment of professional skill.</p>
    {track?.deliverable&&<div className="border border-led-cyan/30 bg-led-cyan/5 rounded-xl p-4">
      <h4 className="font-bold text-sm">Build something next</h4><p className="text-sm mt-2">{track.deliverable}</p>
    </div>}
    <div className="flex flex-wrap gap-2">
     <button type="button" onClick={download} className="rounded-lg border border-border px-4 py-3 font-semibold text-sm"><Download size={15} className="inline mr-1"/> Download review</button>
     <Link to={"/learn?track="+encodeURIComponent(answers.trackId)} className="rounded-lg bg-foreground text-background px-4 py-3 font-semibold text-sm">Review lessons</Link>
     <Link to="/workspace" className="border border-border rounded-lg px-4 py-3 text-sm font-semibold">Open Workspace</Link>
    </div>
    <button type="button" onClick={()=>{setAnswers(null);setResult(null);setReview(false);}} className="text-led-cyan underline text-sm inline-flex items-center gap-2">
      <RotateCcw size={15}/> Check another track
    </button>
   </div>:current?<div className="space-y-4">
    <span className="chip chip-cyan">QUESTION {answers.values.length+1} / 3</span>
    <h3 className="text-xl font-bold">{current.prompt}</h3>
    <fieldset className="space-y-2">
     <legend className="font-semibold text-xs text-muted-foreground mb-2">Select one answer</legend>
     {current.choices.map((item,i)=><label key={item} className={"flex cursor-pointer gap-3 border rounded-xl p-4 text-sm "+(selected===i?"border-led-cyan bg-led-cyan/10":"border-border hover:border-led-cyan/40")}>
       <input type="radio" name="all-track-check-answer" className="mt-1 accent-led-cyan"
        checked={selected===i} onChange={()=>setSelected(i)}/>{item}
     </label>)}
    </fieldset>
    <button type="button" onClick={answer} disabled={selected===null} className="bg-foreground text-background px-5 py-3 rounded-xl font-bold disabled:opacity-40">
      Check answer
    </button>
    <p className="text-xs text-muted-foreground">You can also study the full lesson in the Learn academy. Results are saved after all three questions.</p>
   </div>:null}
   {error&&<p role="alert" className="text-sm text-red-500">{error}</p>}
  </div>}
 </section>;
}
