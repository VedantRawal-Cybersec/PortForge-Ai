import { useState } from "react";
import { Panel, ScoreBar } from "@/components/Panel";
import { addToPortfolio } from "@/lib/portfolio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, BookOpen, ExternalLink, Loader2, Lightbulb, Rocket, Sparkles, Zap } from "lucide-react";

type Stage = "input" | "question" | "answering" | "evaluating" | "result";
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
  const [honesty, setHonesty] = useState<"green"|"amber"|"alert">("green");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evalData, setEvalData] = useState<Eval | null>(null);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");

  async function startTest(e: React.FormEvent) {
    e.preventDefault();
    if (!skill.trim()) return;
    setLoading(true); setStage("question");
    const { data, error } = await supabase.functions.invoke("ai-evaluate", { body: { mode: "question", skill } });
    setLoading(false);
    if (error || data?.error) { toast.error(data?.error ?? "Failed to fetch question"); setStage("input"); return; }
    setQuestion(data.question);
    setStage("answering");
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setStage("evaluating"); setLoading(true);
    const { data, error } = await supabase.functions.invoke("ai-evaluate", {
      body: { mode: "evaluate", skill, question, answer },
    });
    setLoading(false);
    if (error || data?.error) { toast.error(data?.error ?? "Eval failed"); setStage("answering"); return; }
    setEvalData(data);
    const entry = addToPortfolio({
      type: "skill", title: skill, skill,
      level: data.level, scores: data.scores, verdict: data.verdict,
    });
    setHash(entry.hash);
    setStage("result");
  }

  function reset() {
    setStage("input"); setSkill(""); setQuestion(""); setAnswer(""); setEvalData(null); setHash("");
  }

  async function probe() {
    if (!evalData) return;
    setStage("answering"); setQuestion(evalData.probeFollowUp); setAnswer(""); setEvalData(null);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-12 gap-6">
      {/* LEFT — Input */}
      <aside className="lg:col-span-3">
        <Panel label="PARAMETERS" status="MOD_01" statusVariant="cyan">
          <div className="p-5 space-y-5">
            <form onSubmit={startTest} className="space-y-3">
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Target_Skill</label>
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                disabled={stage !== "input"}
                placeholder="e.g. React hooks, SQL joins…"
                className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={stage !== "input" || !skill.trim() || loading}
                className="w-full bg-foreground text-background font-bold text-sm py-3 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                INITIATE_PROBE
              </button>
            </form>

            <div className="pt-4 border-t border-border space-y-3">
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Honesty_Slider</label>
              <div className="flex gap-1.5">
                {(["green","amber","alert"] as const).map((v) => (
                  <button key={v} onClick={() => setHonesty(v)} className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-wider border transition-all ${
                    honesty === v ? `chip-${v} border-current` : "border-border bg-surface-2 text-muted-foreground"
                  }`}>{v === "green" ? "🟢 OWN" : v === "amber" ? "🟡 LEARN" : "🔴 GUESS"}</button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Self-rate before you answer. Logged with your evaluation.</p>
            </div>

            {stage === "result" && (
              <button onClick={reset} className="w-full mt-4 border border-border bg-surface-2 text-foreground text-sm py-2.5 rounded hover:border-led-cyan/50 transition-colors font-mono tracking-wider text-xs">
                NEW_PROBE
              </button>
            )}
          </div>
        </Panel>
      </aside>

      {/* CENTER — Interaction */}
      <section className="lg:col-span-6">
        <Panel
          label="AI_EVALUATION_PROTOCOL"
          status={stage === "input" ? "STANDBY" : stage === "result" ? "COMPLETE" : "ACTIVE"}
          statusVariant={stage === "result" ? "green" : "cyan"}
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
                <div>
                  <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2 block">Your_Answer</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={stage === "evaluating"}
                    rows={8}
                    placeholder="Type your answer. Be specific. Show reasoning."
                    className="w-full bg-background border border-border rounded p-4 text-sm font-mono leading-relaxed focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30"
                  />
                  <button
                    onClick={submitAnswer}
                    disabled={stage === "evaluating" || !answer.trim()}
                    className="mt-3 bg-foreground text-background font-bold text-sm px-5 py-2.5 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {stage === "evaluating" ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                    SUBMIT_FOR_GRADING
                  </button>
                </div>
              </div>
            )}

            {stage === "result" && evalData && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[10px] tracking-widest text-led-green uppercase">// EVALUATION_COMPLETE</div>
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
                      <span className="font-mono text-[10px] tracking-widest uppercase">What_Went_Wrong</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{evalData.whatWentWrong}</p>
                  </div>
                  <div className="panel p-5 border-led-green/30">
                    <div className="flex items-center gap-2 mb-2 text-led-green">
                      <span className="text-base">✅</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase">Ideal_Answer</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{evalData.idealAnswer}</p>
                  </div>
                </div>

                {/* Resources */}
                <div className="panel p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="size-4 text-led-cyan" />
                    <span className="font-mono text-[11px] tracking-widest uppercase font-bold">LEARNING_RESOURCES</span>
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
                    <span className="font-mono text-[11px] tracking-widest uppercase font-bold">PROJECT_PATH</span>
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
                  <Lightbulb className="size-4" /> PROBE_ME — Harder Follow-up
                </button>
              </div>
            )}
          </div>
        </Panel>
      </section>

      {/* RIGHT — Live readout */}
      <aside className="lg:col-span-3 space-y-4">
        <Panel label="LIVE_READOUT" status="SYNCED" statusVariant="green">
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
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Hash_Stamp</div>
                  <div className="font-mono text-xs bg-surface-2 border border-border rounded px-2 py-1.5 text-led-cyan">#{hash}</div>
                </div>
              </>
            )}
          </div>
        </Panel>

        <Panel label="SUPPORT_SIGNALS" statusVariant="cyan">
          <div className="p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Skill Decay</span>
              <span>🔥 fresh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Peer rank (sim)</span>
              <span className="font-mono text-led-cyan">Top 38%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Blind Spot</span>
              <span className="text-led-amber">{skill ? "related skills →" : "—"}</span>
            </div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}
