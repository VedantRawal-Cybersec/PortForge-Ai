import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, PlayCircle, RotateCcw, Sparkles } from "lucide-react";
import { getLearning, saveLearning, tracks, totalLessons, trackCategories } from "@/lib/academy";

export default function Learn() {
  const [record,setRecord]=useState(getLearning);
  const [params,setParams]=useSearchParams();
  const requestedTrack=params.get("track");
  const [activeTrack,setActiveTrack]=useState(()=>tracks.some(t=>t.id===requestedTrack)?requestedTrack!:tracks[0].id);
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All tracks");
  const [pageSize,setPageSize]=useState(12);
  const browse=useMemo(()=>{
    const query=search.trim().toLowerCase();
    return tracks.filter(t=>(category==="All tracks"||t.category===category)&&
      (!query||[t.name,t.description,t.category,t.deliverable,...t.lessons.map(l=>l.title)].join(" ").toLowerCase().includes(query)));
  },[search,category]);
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [showHint,setShowHint]=useState(false);
  useEffect(()=>{
    if(requestedTrack&&tracks.some(t=>t.id===requestedTrack)){
      setActiveTrack(requestedTrack);setIndex(0);setSelected(null);setShowHint(false);
    }
  },[requestedTrack]);

  const track=tracks.find(t=>t.id===activeTrack)||tracks[0];
  const lesson=track.lessons[Math.min(index,track.lessons.length-1)];
  const passed=record.passed.includes(lesson.id);
  const finished=useMemo(()=>new Set(record.passed).size,[record.passed]);
  const progress=Math.round((finished/totalLessons())*100);
  const chooseTrack=(id:string)=>{
    setActiveTrack(id);setIndex(0);setSelected(null);setShowHint(false);
    setParams({track:id},{replace:true});
  };
  const chooseLesson=(i:number)=>{setIndex(i);setSelected(null);setShowHint(false);};
  const check=(choice:number)=>{
    if(selected!==null)return;
    setSelected(choice);
    const updated={passed:record.passed.slice(),attempts:{...record.attempts,[lesson.id]:(record.attempts[lesson.id]||0)+1}};
    if(choice===lesson.correct&&!updated.passed.includes(lesson.id))updated.passed.push(lesson.id);
    setRecord(updated);saveLearning(updated);
  };
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-7">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div className="max-w-3xl">
          <div className="inline-flex gap-2 items-center text-led-cyan font-mono text-xs mb-3 tracking-widest"><Sparkles className="size-4"/> LEARNING ACADEMY</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Learn from the very beginning.</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">Explore {tracks.length} introductory learning tracks with {totalLessons()} short lessons, examples, knowledge checks and practical project suggestions. Your completed lessons stay on this device.</p>
          <p className="text-xs text-muted-foreground mt-2">These are introductory learning pathways—not complete professional certifications or expert-calibrated assessments. Build and test real projects to develop deeper ability.</p>
        </div>
        <Link className="inline-flex items-center gap-2 text-sm text-led-cyan hover:underline" to="/dashboard">My dashboard <ArrowRight className="size-4"/></Link>
      </header>
      <div className="panel p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between gap-3 mb-2"><strong className="text-sm">Your learning progress</strong><span className="font-mono text-sm text-led-cyan">{finished}/{totalLessons()} lessons</span></div>
          <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden"><div className="h-full rounded-full bg-led-cyan transition-all duration-500" style={{width:progress+"%"}} /></div>
        </div>
        <span className="text-sm text-muted-foreground">Practice first. Mastery takes repetition.</span>
      </div>
      <section className="panel p-4 sm:p-5 space-y-4" aria-label="Find a learning track">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 block space-y-2"><span className="text-sm font-semibold">Find a learning track</span>
            <input type="search" value={search} onChange={e=>{setSearch(e.target.value);setPageSize(12);}}
              placeholder="Search Python, security, data, cloud, UX…" aria-label="Search learning tracks"
              className="w-full min-h-12 px-4 py-3 rounded-xl border border-border bg-background text-sm"/>
          </label>
          <label className="sm:w-64 block space-y-2"><span className="text-sm font-semibold">Category</span>
            <select value={category} onChange={e=>{setCategory(e.target.value);setPageSize(12);}}
              aria-label="Filter learning tracks by category"
              className="w-full min-h-12 px-4 py-3 rounded-xl border border-border bg-background text-sm">
              {trackCategories.map(name=><option value={name} key={name}>{name}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">Showing {Math.min(pageSize,browse.length)} of {browse.length} matching tracks · {tracks.length} total</p>
          {(search||category!=="All tracks")&&<button type="button" onClick={()=>{setSearch("");setCategory("All tracks");setPageSize(12);}}
            className="text-sm text-led-cyan underline">Clear filters</button>}
        </div>
      </section>
      <section aria-label="Learning tracks" className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {browse.slice(0,pageSize).map(t=>{const count=t.lessons.filter(l=>record.passed.includes(l.id)).length;return (
          <button key={t.id} type="button" onClick={()=>chooseTrack(t.id)} aria-pressed={activeTrack===t.id} className={"text-left panel p-5 hover:border-led-cyan/40 transition-all "+(activeTrack===t.id?"border-led-cyan/60 shadow-[0_0_24px_-16px_hsl(var(--led-cyan))]":"")}>
            <span className="text-2xl" aria-hidden="true">{t.icon}</span>
            <h2 className="font-bold text-lg mt-3">{t.name}</h2>
            <span className="inline-block text-[10px] font-mono text-led-cyan uppercase mt-2">{t.category||"Learning"}</span>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2 min-h-10">{t.description}</p>
            <p className="text-xs font-mono text-led-cyan mt-4">{count}/{t.lessons.length} COMPLETED</p>
          </button>
        )})}
      </section>
      {browse.length===0&&<div role="status" className="panel p-6 text-sm text-muted-foreground">No matching tracks yet. Try a related skill, clear filters or choose a broader category.</div>}
      {browse.length>pageSize&&<div className="flex justify-center">
        <button type="button" onClick={()=>setPageSize(n=>n+12)}
          className="border border-border rounded-xl px-6 py-3 min-h-12 font-bold text-sm hover:border-led-cyan/60">
          Show more learning tracks ({browse.length-pageSize} remaining)
        </button>
      </div>}
      <section className="panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" aria-label="Selected learning path">
        <div><span className="text-xs text-muted-foreground">Currently studying</span>
          <h2 className="text-lg font-bold">{track.icon} {track.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">{track.description}</p></div>
        <span className="chip chip-cyan">{track.lessons.filter(l=>record.passed.includes(l.id)).length}/{track.lessons.length} lessons completed</span>
      </section>
      <div className="grid lg:grid-cols-[minmax(230px,0.7fr)_minmax(0,1.7fr)] gap-5">
        <aside className="panel p-4 h-fit">
          <h2 className="font-bold text-lg px-2 py-3">Course outline</h2>
          <nav aria-label={track.name+" lessons"} className="space-y-2">
            {track.lessons.map((l,i)=>(
              <button key={l.id} type="button" onClick={()=>chooseLesson(i)} aria-current={index===i?"step":undefined} className={"w-full flex items-center gap-3 text-left rounded-lg p-3 transition-colors "+(index===i?"bg-led-cyan/10 border border-led-cyan/30":"hover:bg-surface-2 border border-transparent")}>
                <span className="size-9 rounded-lg bg-surface-3 flex items-center justify-center text-xs font-bold shrink-0">{record.passed.includes(l.id)?<CheckCircle2 className="size-5 text-led-green"/>:i+1}</span>
                <span className="flex-1"><span className="font-semibold block text-sm">{l.title}</span><span className="text-xs text-muted-foreground">{l.minutes} min · {record.passed.includes(l.id)?"Completed":"To learn"}</span></span>
              </button>
            ))}
          </nav>
        </aside>
        <article className="panel p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <span className="chip chip-cyan">LESSON {index+1} OF {track.lessons.length}</span>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-2"><BookOpen className="size-4"/> About {lesson.minutes} min</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h2>
            <p className="mt-3 text-muted-foreground">{lesson.summary}</p>
          </div>
          <div className="border border-border rounded-xl bg-surface-2 p-5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><PlayCircle className="size-4 text-led-cyan"/> The concept</h3>
            <p className="leading-relaxed text-sm sm:text-base">{lesson.concept}</p>
            <p className="mt-4 border-l-2 border-led-cyan/50 pl-4 text-sm text-muted-foreground">{lesson.example}</p>
          </div>
          <section aria-label="Knowledge check" className="space-y-4">
            <div className="flex justify-between items-center gap-3"><h3 className="text-lg font-bold">Check your understanding</h3><span className="text-xs text-muted-foreground">One question · Unlimited review</span></div>
            <p className="text-base font-medium">{lesson.prompt}</p>
            <div className="space-y-2">
              {lesson.choices.map((answer,i)=>(
                <button type="button" key={answer} onClick={()=>check(i)} disabled={selected!==null} className={"w-full text-left rounded-xl p-4 border transition-colors "+(selected===null?"border-border bg-surface-2 hover:border-led-cyan/60":i===lesson.correct?"border-led-green/60 bg-led-green/10":i===selected?"border-led-alert/60 bg-led-alert/10":"border-border bg-surface-2 opacity-70")}>
                  <span className="inline-flex size-6 items-center justify-center mr-3 rounded-md bg-background text-xs font-mono">{String.fromCharCode(65+i)}</span>{answer}
                </button>
              ))}
            </div>
            {selected!==null&&<div aria-live="polite" className="rounded-xl bg-surface-2 border border-border p-4">
              <p className={"font-semibold "+(selected===lesson.correct?"text-led-green":"text-led-amber")}>{selected===lesson.correct?"Correct — lesson completed.":"Not quite. Review the explanation and try again."}</p>
              <p className="text-sm mt-2 text-muted-foreground leading-relaxed">{lesson.why}</p>
              {selected!==lesson.correct&&<button onClick={()=>setSelected(null)} type="button" className="inline-flex items-center gap-2 text-sm text-led-cyan mt-3 hover:underline"><RotateCcw className="size-4"/> Try again</button>}
            </div>}
            {!showHint&&selected===null&&<button type="button" className="text-led-cyan inline-flex gap-2 items-center text-sm hover:underline" onClick={()=>setShowHint(true)}><Lightbulb className="size-4"/> Need a hint?</button>}
            {showHint&&selected===null&&<div className="text-sm text-muted-foreground border border-led-amber/30 bg-led-amber/5 p-4 rounded-lg"><strong>Hint:</strong> {lesson.hint}</div>}
          </section>
          {track.deliverable&&<section className="border border-led-cyan/25 bg-led-cyan/5 rounded-xl p-4 space-y-3" aria-label="Put your learning into practice">
            <h3 className="font-bold text-sm">Put this track into practice</h3>
            <p className="text-sm text-muted-foreground">{track.deliverable}</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/workspace" className="text-sm font-semibold text-led-cyan hover:underline">Build something in Workspace</Link>
              <Link to="/portfolio" className="text-sm font-semibold text-led-cyan hover:underline">Document genuine work in Portfolio</Link>
              {track.resourceUrl&&<a href={track.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-led-cyan hover:underline">Additional external roadmap</a>}
            </div>
            {track.resourceUrl&&<p className="text-xs text-muted-foreground">External learning reference. PortForge lessons are original introductory material; external roadmaps are separately maintained.</p>}
          </section>}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border">
            <button type="button" disabled={index===0} onClick={()=>chooseLesson(index-1)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg disabled:opacity-40"><ArrowLeft className="size-4"/> Previous</button>
            {passed&&index===track.lessons.length-1?<Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-led-cyan text-background font-semibold">View progress <ArrowRight className="size-4"/></Link>:<button type="button" disabled={!passed||index===track.lessons.length-1} onClick={()=>chooseLesson(index+1)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-led-cyan text-background font-semibold disabled:opacity-40">Next lesson <ArrowRight className="size-4"/></button>}
          </div>
        </article>
      </div>
    </div>
  );
}
