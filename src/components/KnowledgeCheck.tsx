import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, RotateCcw, Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  topics, knowledgeItems, createKnowledgeSession, questionForSession, answerKnowledge,
  readKnowledgeSessions, saveKnowledgeSession, knowledgeReport, type TopicId, type Difficulty, type KnowledgeSession,
} from "@/lib/knowledgeChecks";

const levels:Difficulty[]=["beginner","intermediate","advanced"];
export default function KnowledgeCheck(){
  const [topic,setTopic]=useState<TopicId>("frontend");
  const [level,setLevel]=useState<Difficulty>("beginner");
  const [session,setSession]=useState<KnowledgeSession|null>(null);
  const [history,setHistory]=useState(readKnowledgeSessions);
  const [selected,setSelected]=useState<number|null>(null);
  const [review,setReview]=useState(false);
  const [failure,setFailure]=useState("");
  const current=useMemo(()=>session?questionForSession(session):null,[session]);
  const last=session?.answers.at(-1);
  const lastItem=last?knowledgeItems.find(q=>q.id===last.itemId):null;
  const complete=!!session&&(session.completedAt>0||(!current&&!review));
  const correct=session?.answers.filter(x=>x.correct).length||0;
  function start(reuse?:KnowledgeSession){
    setSession(reuse||createKnowledgeSession(topic,level));
    setReview(false);setSelected(null);setFailure("");
  }
  function submit(){
    if(!session||!current||selected===null||review)return;
    try{
      const updated=answerKnowledge(session,current,selected);
      saveKnowledgeSession(updated);
      setSession(updated);setHistory(readKnowledgeSessions());setReview(true);setFailure("");
    }catch(e){setFailure(e instanceof Error?e.message:"Could not record your response.");}
  }
  function continueSession(){
    setReview(false);setSelected(null);
  }
  function download(){
    if(!session||!session.answers.length)return;
    const uri=URL.createObjectURL(new Blob([knowledgeReport(session)],{type:"text/plain;charset=utf-8"}));
    const element=document.createElement("a");element.href=uri;element.download="portforge-knowledge-check.txt";
    element.click();window.setTimeout(()=>URL.revokeObjectURL(uri),1000);
  }
  return <section className="panel p-5 sm:p-7 space-y-5" aria-labelledby="knowledge-check-title">
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div className="max-w-2xl">
        <span className="chip chip-cyan">INSTANT PRACTICE · NO AI REQUIRED</span>
        <h2 id="knowledge-check-title" className="text-2xl sm:text-3xl font-bold tracking-tight mt-3">Find what you understand. Practise what you don't.</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Six answer-key questions that adapt between accessible difficulty bands. See why an answer works, what to try next, and keep private practice records on this device.</p>
      </div>
      <span className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-2">Curated practice · not a certification</span>
    </div>
    {!session ? <>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-semibold space-y-2"><span>Choose a learning track</span>
          <select value={topic} onChange={e=>setTopic(e.target.value as TopicId)}
            className="w-full min-h-12 rounded-xl border border-border bg-background px-3 py-2 text-sm" aria-label="Quick check learning track">
            {topics.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          <span className="block font-normal text-xs text-muted-foreground">{topics.find(t=>t.id===topic)?.description}</span>
        </label>
        <label className="block text-sm font-semibold space-y-2"><span>Where should we start?</span>
          <select value={level} onChange={e=>setLevel(e.target.value as Difficulty)}
            className="w-full min-h-12 rounded-xl border border-border bg-background px-3 py-2 text-sm" aria-label="Quick check starting level">
            {levels.map(l=><option key={l} value={l}>{l[0].toUpperCase()+l.slice(1)}</option>)}
          </select>
          <span className="block font-normal text-xs text-muted-foreground">Difficulty can change as answers are checked. This is practice, not psychometric testing.</span>
        </label>
      </div>
      <button type="button" onClick={()=>start()} className="inline-flex gap-2 items-center bg-foreground text-background font-bold rounded-xl px-5 py-3 min-h-12 hover:bg-led-cyan">
        Begin six-question check <ArrowRight size={16}/>
      </button>
      {history.length>0&&<div className="border-t border-border pt-4 space-y-3">
        <h3 className="text-sm font-bold">Continue or review a previous practice session</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {history.slice(0,4).map(old=><button type="button" key={old.id}
            onClick={()=>start(old)} className="border border-border hover:border-led-cyan/50 rounded-xl p-3 text-left">
            <span className="font-semibold text-sm">{topics.find(t=>t.id===old.topic)?.title||old.topic}</span>
            <span className="block text-xs text-muted-foreground">{old.started} · {old.answers.length}/6 answered · {old.completedAt?"Finished":"Continue"}</span>
          </button>)}
        </div>
      </div>}
    </> : <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-sm">{topics.find(t=>t.id===session.topic)?.title}</strong>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{session.answers.length} / 6 answered · {correct} correct</span>
      </div>
      <div aria-label="Quick check progress" className="bg-surface-3 h-2 rounded-full overflow-hidden">
        <div className="bg-led-cyan h-full transition-[width]" style={{width:Math.min(100,session.answers.length/6*100)+"%"}}/>
      </div>
      {review&&lastItem&&last? <div className="space-y-4" role="status">
        <span className={"chip "+(last.correct?"chip-green":"chip-amber")}>{last.correct?"Correct":"Needs review"} · {last.difficulty}</span>
        <h3 className="text-xl font-bold">{lastItem.question}</h3>
        <p className="text-sm"><strong>Your answer:</strong> {lastItem.options[last.selected]}</p>
        {!last.correct&&<p className="text-sm"><strong>Correct answer:</strong> {lastItem.options[lastItem.answer]}</p>}
        <p className="rounded-xl border border-border bg-surface-2/40 p-4 text-sm leading-relaxed">{lastItem.explanation}</p>
        <div className="text-sm"><strong>Try next:</strong> {lastItem.practice}</div>
        {session.answers.length<6?<button type="button" onClick={continueSession}
          className="rounded-xl px-5 py-3 font-bold bg-foreground text-background">Next question <ArrowRight size={15} className="inline"/></button>:
          <button type="button" onClick={continueSession} className="rounded-xl px-5 py-3 font-bold bg-foreground text-background">View summary</button>}
      </div>:complete?<div className="space-y-4" role="status">
        <CheckCircle2 className="size-9 text-led-green"/>
        <h3 className="text-2xl font-bold">Practice complete: {correct} of {session.answers.length} correct</h3>
        <p className="text-sm text-muted-foreground">Locally checked multiple-choice answers, not a standardized qualification or employment-readiness rating. Review the explanations and apply the concept in a real project.</p>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={download} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-3 font-semibold text-sm"><Download size={16}/> Download practice notes</button>
          <Link to="/workspace" className="rounded-lg bg-foreground text-background px-4 py-3 font-semibold text-sm">Build a project</Link>
          <Link to="/oracle" className="rounded-lg border border-border px-4 py-3 font-semibold text-sm">Explore career paths</Link>
        </div>
        <button type="button" onClick={()=>setSession(null)} className="text-sm text-led-cyan underline inline-flex items-center gap-2"><RotateCcw size={15}/> Start another check</button>
      </div>:current?<div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-cyan">Question {session.answers.length+1} / 6</span>
          <span className="chip">{current.difficulty} · {current.concept}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold leading-snug">{current.question}</h3>
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold text-muted-foreground mb-3">Choose one answer</legend>
          {current.options.map((option,i)=><label key={option} className={"flex items-start gap-3 cursor-pointer rounded-xl border px-4 py-3 min-h-12 "+(selected===i?"border-led-cyan bg-led-cyan/10":"border-border hover:bg-surface-2")}>
            <input type="radio" name="knowledge-answer" checked={selected===i} onChange={()=>setSelected(i)} className="mt-1 accent-led-cyan"/>
            <span className="text-sm">{option}</span>
          </label>)}
        </fieldset>
        <button type="button" disabled={selected===null} onClick={submit} className="bg-foreground text-background rounded-xl px-5 py-3 min-h-12 font-bold disabled:opacity-40">Check my answer</button>
        <p className="text-xs text-muted-foreground">No timer or external services. One primary concept per question.</p>
      </div>:null}
      {failure&&<p role="alert" className="text-sm text-led-alert">{failure}</p>}
      <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-2"><Target size={14}/> Your local practice history can be exported from My Data. It is not independently verified.</div>
    </div>}
  </section>;
}
