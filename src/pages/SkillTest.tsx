import { useState } from "react";
import { Panel, ScoreBar } from "@/components/Panel";
import { ModuleIntro } from "@/components/ModuleIntro";
import AIAccountNotice from "@/components/AIAccountNotice";
import { SkillAutocomplete } from "@/components/SkillAutocomplete";
import { addToPortfolio } from "@/lib/portfolio";
import { offlineSkillPrompt } from "@/lib/offlineCoach";
import { createGuidedAssessment, saveGuidedAssessment, readGuidedAssessments, makeGuidedSummary, type GuidedAssessment } from "@/lib/guidedAssessments";
import { practiceLevels, levelGuidance, type PracticeLevel } from "@/lib/practiceLevels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, BookOpen, Download, ExternalLink, Loader2, Lightbulb, Rocket, Sparkles, Zap } from "lucide-react";

type Stage = "input" | "question" | "answering" | "evaluating" | "result" | "offline-result";
type Eval = {
  scores: { logic: number; clarity: number; depth: number };
  level: "Beginner"|"Intermediate"|"Strong";
  verdict: string;
  whatWentWrong: string;
  idealAnswer: string;
  resources: { title: string; why: string; kind: "free"|"paid"; url: string }[];
  projects: { tier: "beginner"|"intermediate"|"advanced"; name: string; description: string; improves: string }[];
  probeFollowUp: string;
};

export default function SkillTest() {
  const [stage, setStage] = useState<Stage>("input");
  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState<PracticeLevel>("beginner");
  const [honesty, setHonesty] = useState<"green"|"amber"|"alert">("green");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evalData, setEvalData] = useState<Eval | null>(null);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineIndex, setOfflineIndex] = useState(0);
  const [guided, setGuided] = useState<GuidedAssessment | null>(null);
  const [history, setHistory] = useState(readGuidedAssessments);
  const [hintOpen, setHintOpen] = useState(false);

  async function startTest(e: React.FormEvent) {
    e.preventDefault();
    if (!skill.trim() || loading) return;
    setLoading(true);
    setOfflineMode(false);
    setOfflineIndex(0);
    setStage("question");
    try {
      const { data, error } = await supabase.functions.invoke("ai-evaluate", {
        body: { mode: "question", skill: skill.trim().slice(0, 100), difficulty },
      });
      if (error || data?.error || typeof data?.question !== "string" || !data.question.trim()) {
        throw new Error(data?.error || "A valid question was not returned. Try again.");
      }
      setQuestion(data.question);
      setAnswer("");
      setStage("answering");
    } catch (error) {
      setOfflineMode(true);
      setGuided(createGuidedAssessment(skill,difficulty));
      setQuestion(offlineSkillPrompt(skill, 0, difficulty).question);
      setAnswer("");
      setStage("answering");
      toast.info("AI is unavailable. Switched to guided offline practice—no automatic grading.");
    } finally {
      setLoading(false);
    }
  }

  function startOfflinePractice() {
    if (!skill.trim()) { toast.error("Choose a skill first."); return; }
    setOfflineMode(true);
    setOfflineIndex(0);
    setGuided(createGuidedAssessment(skill,difficulty));
    setHintOpen(false);
    setQuestion(offlineSkillPrompt(skill, 0, difficulty).question);
    setAnswer("");
    setEvalData(null);
    setStage("answering");
  }

  async function submitAnswer() {
    if (!answer.trim() || loading) return;
    if (offlineMode) {
      const base=guided ?? createGuidedAssessment(skill,difficulty);
      const updated:GuidedAssessment={...base,
        answers:[...base.answers,{question,answer:answer.slice(0,8000),criteriaMet:[]}].slice(0,3),
        complete:offlineIndex===2};
      try{saveGuidedAssessment(updated);setHistory(readGuidedAssessments());}
      catch{toast.error("Could not store the session in this browser. Copy your answer to keep it.");}
      setGuided(updated);setStage("offline-result");
      return;
    }
    setStage("evaluating");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-evaluate", {
        body: { mode: "evaluate", skill, question, answer: answer.trim().slice(0, 8000), difficulty },
      });
      if (error || data?.error) throw new Error(data?.error || "The evaluation service is unavailable.");
      if (!data?.scores || !["logic", "clarity", "depth"].every(key =>
        typeof data.scores[key] === "number" && Number.isFinite(data.scores[key]) &&
        data.scores[key] >= 0 && data.scores[key] <= 5
      ) || !["Beginner", "Intermediate", "Strong"].includes(data.level) ||
        typeof data.verdict !== "string" || typeof data.idealAnswer !== "string" ||
        !Array.isArray(data.resources) || !Array.isArray(data.projects)) {
        throw new Error("The AI response was incomplete. Your answer is preserved; please retry.");
      }
      const clean: Eval = {
        ...data,
        resources: data.resources.filter((r: {url?: unknown}) =>
          typeof r.url === "string" && /^https:\/\/[^\s]+$/i.test(r.url)
        ).slice(0, 6),
        projects: data.projects.slice(0, 3),
      };
      setEvalData(clean);
      try {
        const entry = addToPortfolio({
          type: "skill", title: skill, skill,
          level: clean.level, scores: clean.scores, verdict: clean.verdict,
        });
        setHash(entry.hash);
      } catch { toast.info("Evaluation finished, but this device could not save its portfolio entry."); }
      setStage("result");
    } catch (error) {
      setOfflineMode(true);
      const base=createGuidedAssessment(skill,difficulty);
      const updated={...base,answers:[{question,answer:answer.slice(0,8000),criteriaMet:[]}]};
      setGuided(updated);
      try{saveGuidedAssessment(updated);setHistory(readGuidedAssessments());}catch{}
      setStage("offline-result");
      toast.info("AI grading is unavailable. Review the guided checklist instead; your answer is preserved.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStage("input"); setSkill(""); setQuestion(""); setAnswer(""); setEvalData(null); setHash(""); setOfflineMode(false); setOfflineIndex(0); setGuided(null); setHintOpen(false);
  }

  function toggleSelfCheck(criterion:string,checked:boolean){
    if(!guided)return;
    const answers=guided.answers.map((a,i)=>i===offlineIndex?{
      ...a,criteriaMet:checked?[...new Set([...a.criteriaMet,criterion])]:a.criteriaMet.filter(c=>c!==criterion),
    }:a);
    const next={...guided,answers};setGuided(next);
    try{saveGuidedAssessment(next);setHistory(readGuidedAssessments());}catch{}
  }
  function exportPracticeReport(){
    if(!guided)return;
    const url=URL.createObjectURL(new Blob([makeGuidedSummary(guided)],{type:"text/plain;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download="portforge-"+difficulty+"-practice.txt";
    link.click();window.setTimeout(()=>URL.revokeObjectURL(url),3000);
  }

  async function probe() {
    if (!evalData) return;
    setOfflineMode(false);
    setStage("answering"); setQuestion(evalData.probeFollowUp); setAnswer(""); setEvalData(null);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-7 sm:py-10 grid lg:grid-cols-12 gap-5 sm:gap-6">
      <ModuleIntro eyebrow="01 / ASSESS" title="Test your skills. Know your next move."
        description="Answer a focused question, understand your gaps and leave with a practical improvement plan. AI feedback is advisory, not a professional certification."
        highlights={["Choose a topic", "Answer with context", "Improve with feedback"]} icon={<BookOpen size={16}/>} />
      <div className="lg:col-span-12"><AIAccountNotice /></div>
      {/* LEFT — Input */}
      <aside className="lg:col-span-3">
        <Panel label="PARAMETERS" status="MOD 01" statusVariant="cyan">
          <div className="p-5 space-y-5">
            <form onSubmit={startTest} className="space-y-3">
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Target Skill</label>
              <SkillAutocomplete
                label="Target skill or topic"
                value={skill}
                onChange={setSkill}
                disabled={stage !== "input"}
                placeholder="e.g. Python, React hooks, SQL joins…"
                className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30 transition-all disabled:opacity-50"
              />
              <div className="space-y-2">
                <label htmlFor="skill-difficulty" className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Question difficulty
                </label>
                <select id="skill-difficulty" value={difficulty}
                  onChange={e => setDifficulty(e.target.value as PracticeLevel)}
                  disabled={stage !== "input" || loading}
                  className="w-full min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {practiceLevels.map(level => <option key={level} value={level}>{levelGuidance[level].label}</option>)}
                </select>
                <p className="text-xs text-muted-foreground">{levelGuidance[difficulty].description}</p>
              </div>
              <div role="group" aria-label="Try a suggested skill" className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "SQL", "Communication"].map(example => (
                  <button key={example} type="button" disabled={stage !== "input"}
                    onClick={() => setSkill(example)}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs hover:border-led-cyan/60 disabled:opacity-50">
                    {example}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={stage !== "input" || !skill.trim() || loading}
                className="w-full bg-foreground text-background font-bold text-sm py-3 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                INITIATE PROBE
              </button>
              <p className="text-xs text-muted-foreground">The guided mode now offers three progressively different questions, optional hints and a saved reflection report—no AI service needed.</p>
              <button type="button" onClick={startOfflinePractice}
                disabled={stage !== "input" || !skill.trim() || loading}
                className="w-full border border-border bg-surface-2 rounded-lg py-3 text-xs font-semibold hover:border-led-cyan/50 disabled:opacity-50">
                PRACTISE WITHOUT AI · NO GRADES
              </button>
            </form>

            <div className="pt-4 border-t border-border space-y-3">
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Self-assessed confidence</label>
              <div className="flex gap-1.5">
                {(["green","amber","alert"] as const).map((v) => (
                  <button key={v} onClick={() => setHonesty(v)} className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-wider border transition-all ${
                    honesty === v ? `chip-${v} border-current` : "border-border bg-surface-2 text-muted-foreground"
                  }`}>{v === "green" ? "🟢 OWN" : v === "amber" ? "🟡 LEARN" : "🔴 GUESS"}</button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">For reflection only; this does not change your selected question difficulty or score.</p>
            </div>

            {history.length>0 && <div className="border-t border-border pt-3 space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase">Recent guided practice</p>
              {history.slice(0,3).map(h=><div key={h.id} className="rounded-lg border border-border p-2">
                <p className="text-xs font-semibold break-words">{h.topic} · {h.difficulty}</p>
                <p className="text-[11px] text-muted-foreground">{h.answers.length}/3 answers · {h.complete?"Completed":"In progress"}</p>
              </div>)}
            </div>}
            {(stage === "result" || stage === "offline-result") && (
              <button onClick={reset} className="w-full mt-4 border border-border bg-surface-2 text-foreground text-sm py-2.5 rounded hover:border-led-cyan/50 transition-colors font-mono tracking-wider text-xs">
                NEW PROBE
              </button>
            )}
          </div>
        </Panel>
      </aside>

      {/* CENTER — Interaction */}
      <section className="lg:col-span-6">
        <Panel
          label={offlineMode ? "GUIDED OFFLINE PRACTICE" : "AI EVALUATION PROTOCOL"}
          status={stage === "input" ? "STANDBY" : stage === "result" || stage === "offline-result" ? "COMPLETE" : "ACTIVE"}
          statusVariant={stage === "result" || stage === "offline-result" ? "green" : "cyan"}
          className={stage !== "input" && stage !== "result" ? "scanline" : ""}
        >
          <div className="p-8 min-h-[400px]">
            {stage === "input" && (
              <div className="text-center py-16 animate-fade-in">
                <div className="size-16 mx-auto rounded-full bg-surface-2 border border-border flex items-center justify-center mb-6">
                  <Sparkles className="size-7 text-led-cyan" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Awaiting target skill.</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Type a skill, technology, or topic on the left. The AI will probe with one precise question.</p>
              </div>
            )}

            {stage === "question" && (
              <div className="text-center py-16 animate-fade-in">
                <Loader2 className="size-8 animate-spin mx-auto text-led-cyan mb-4" />
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Generating question…</p>
              </div>
            )}

            {(stage === "answering" || stage === "evaluating") && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-led-cyan uppercase mb-2">// QUESTION</div>
                  <p className="text-2xl font-bold leading-snug text-balance">{question}</p>
                </div>
                {offlineMode&&<div className="space-y-2">
                  <p className="text-xs text-led-cyan font-semibold">Question {offlineIndex+1} of 3 · {levelGuidance[difficulty].label} · no automatic score</p>
                  <button type="button" onClick={()=>setHintOpen(v=>!v)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-semibold">
                    {hintOpen?"Hide planning hint":"Show a planning hint"}
                  </button>
                  {hintOpen&&<div className="rounded-lg border border-led-cyan/25 p-3 text-xs leading-relaxed text-muted-foreground">
                    Begin with a definition, give one real example, then explain how you would check it. Your selected difficulty determines the depth expected.
                  </div>}
                </div>}
                <div>
                  <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2 block">Your Answer</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); void submitAnswer(); } }}
                    maxLength={8000}
                    disabled={stage === "evaluating"}
                    rows={8}
                    placeholder="Type your answer. Be specific. Show reasoning."
                    className="w-full bg-background border border-border rounded p-4 text-sm font-mono leading-relaxed focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30"
                  />
                  <div className="flex flex-wrap justify-between gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Explain your reasoning, include an example, and mention trade-offs.</span>
                    <span className="tabular-nums">{levelGuidance[difficulty].label} · {answer.length}/8000 · Ctrl/⌘ + Enter</span>
                  </div>
                  <button
                    onClick={submitAnswer}
                    disabled={stage === "evaluating" || !answer.trim()}
                    className="mt-3 bg-foreground text-background font-bold text-sm px-5 py-2.5 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {stage === "evaluating" ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                    {offlineMode ? "REVIEW MY ANSWER" : "SUBMIT FOR GRADING"}
                  </button>
                </div>
              </div>
            )}

            {stage === "offline-result" && (
              <div className="space-y-5 animate-fade-in" role="status">
                <span className="chip chip-amber">GUIDED PRACTICE · NOT AI-GRADED</span>
                <h2 className="text-xl sm:text-2xl font-bold">Review your {difficulty} answer.</h2>
                <p className="text-sm text-muted-foreground">The AI service is unavailable. Your response remains on this device for this session; no score, level, certificate or peer ranking has been assigned.</p>
                <div className="rounded-xl border border-border bg-surface-2/60 p-4">
                  <p className="text-xs text-led-cyan font-mono mb-2">YOUR ANSWER</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{answer}</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <h3 className="font-bold mb-3">Self-review checklist</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {offlineSkillPrompt(skill, offlineIndex, difficulty).checklist.map(item => <li key={item} className="list-none -ml-5">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" aria-label={"Self-review "+item} className="mt-1 accent-led-cyan"
                          checked={guided?.answers[offlineIndex]?.criteriaMet.includes(item)??false}
                          onChange={e=>toggleSelfCheck(item,e.target.checked)}/>
                        <span>{item}</span>
                      </label>
                    </li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <h3 className="font-bold mb-2">A useful next project</h3>
                  <p className="text-sm text-muted-foreground">{offlineSkillPrompt(skill, offlineIndex, difficulty).exampleTask}</p>
                </div>
                {guided&&<button type="button" onClick={exportPracticeReport}
                  className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-3 text-sm font-semibold">
                  <Download size={16}/> Download practice notes
                </button>}
                {offlineIndex < 2 ? <button type="button" onClick={() => {
                  const next = offlineIndex + 1;
                  setOfflineIndex(next);
                  setHintOpen(false);
                  setQuestion(offlineSkillPrompt(skill, next, difficulty).question);
                  setAnswer("");
                  setStage("answering");
                }} className="w-full border border-led-cyan/40 rounded-lg p-3 font-bold text-sm hover:bg-led-cyan/10">
                  Continue to question {offlineIndex+2} of 3
                </button>:<p className="text-sm text-led-green font-bold">Three-question guided session completed. Your reflections are saved locally where permitted.</p>}
              </div>
            )}

            {stage === "result" && evalData && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[10px] tracking-widest text-led-green uppercase">// EVALUATION COMPLETE</div>
                    <span className={`chip ${evalData.level === "Strong" ? "chip-green" : evalData.level === "Intermediate" ? "chip-amber" : "chip-alert"}`}>
                      LEVEL: {evalData.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xl font-semibold leading-snug text-balance">{evalData.verdict}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 panel p-5 bg-surface-1/50">
                  <ScoreBar label="Logic" value={evalData.scores.logic} variant="cyan" />
                  <ScoreBar label="Clarity" value={evalData.scores.clarity} variant="violet" />
                  <ScoreBar label="Depth" value={evalData.scores.depth} variant="green" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="panel p-5 border-led-alert/30">
                    <div className="flex items-center gap-2 mb-2 text-led-alert">
                      <span className="text-base">❌</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase">What Went Wrong</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{evalData.whatWentWrong}</p>
                  </div>
                  <div className="panel p-5 border-led-green/30">
                    <div className="flex items-center gap-2 mb-2 text-led-green">
                      <span className="text-base">✅</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase">Ideal Answer</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{evalData.idealAnswer}</p>
                  </div>
                </div>

                {/* Resources */}
                <div className="panel p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="size-4 text-led-cyan" />
                    <span className="font-mono text-[11px] tracking-widest uppercase font-bold">LEARNING RESOURCES</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {evalData.resources.map((r) => (
                      <a key={r.title} href={r.url} target="_blank" rel="noreferrer" className="block p-4 rounded border border-border bg-surface-2 hover:border-led-cyan/50 transition-colors group">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-semibold text-sm leading-tight">{r.title}</span>
                          <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-led-cyan shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{r.why}</p>
                        <span className={`chip ${r.kind === "free" ? "chip-green" : "chip-amber"} text-[9px]`}>{r.kind.toUpperCase()}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="panel p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket className="size-4 text-led-violet" />
                    <span className="font-mono text-[11px] tracking-widest uppercase font-bold">PROJECT PATH</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {evalData.projects.map((p) => {
                      const dot = p.tier === "beginner" ? "🟢" : p.tier === "intermediate" ? "🟡" : "🔴";
                      return (
                        <div key={p.name} className="p-4 rounded border border-border bg-surface-2">
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">{dot} {p.tier}</div>
                          <h4 className="font-bold text-sm mb-1">{p.name}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{p.description}</p>
                          <p className="text-[11px] text-led-cyan font-mono">→ {p.improves}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={probe} className="w-full border border-led-cyan/40 bg-led-cyan/5 text-led-cyan font-bold text-sm py-3 rounded hover:bg-led-cyan/10 transition-colors inline-flex items-center justify-center gap-2">
                  <Lightbulb className="size-4" /> PROBE ME — Harder Follow-up
                </button>
              </div>
            )}
          </div>
        </Panel>
      </section>

      {/* RIGHT — Live readout */}
      <aside className="lg:col-span-3 space-y-4">
        <Panel label="LIVE READOUT" status="LOCAL" statusVariant="cyan">
          <div className="p-5 space-y-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Skill</div>
              <div className="font-bold">{skill || "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Honesty</div>
              <span className={`chip chip-${honesty}`}>{honesty.toUpperCase()}</span>
            </div>
            {evalData && (
              <>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Level</div>
                  <span className={`chip ${evalData.level === "Strong" ? "chip-green" : evalData.level === "Intermediate" ? "chip-amber" : "chip-alert"}`}>{evalData.level}</span>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Local reference (not a certificate)</div>
                  <div className="font-mono text-xs bg-surface-2 border border-border rounded px-2 py-1.5 text-led-cyan">#{hash}</div>
                </div>
              </>
            )}
          </div>
        </Panel>

        <Panel label="SUPPORT SIGNALS" statusVariant="cyan">
          <div className="p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Skill Decay</span>
              <span className="text-muted-foreground">Practice regularly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Peer rank</span>
              <span className="text-muted-foreground">Not ranked</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Blind Spot</span>
              <span className="text-led-amber">{evalData ? "See feedback above" : "Take a test first"}</span>
            </div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}
