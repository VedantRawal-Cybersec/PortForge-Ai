import { useEffect, useRef, useState } from "react";
import { Panel, ScoreBar } from "@/components/Panel";
import { SkillAutocomplete } from "@/components/SkillAutocomplete";
import { addToPortfolio } from "@/lib/portfolio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mic, MicOff, Play, RotateCcw, Volume2 } from "lucide-react";

type IEval = {
  scores: { logic: number; clarity: number; depth: number; confidence: number };
  verdict: string; feedback: string; idealAnswer: string; cognitiveLoadDelta: number;
};

declare global { interface Window { webkitSpeechRecognition: any; SpeechRecognition: any; } }

export default function Interview() {
  const [skill, setSkill] = useState("");
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [load, setLoad] = useState(20);
  const [evals, setEvals] = useState<IEval[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const recogRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function speak(text: string) {
    setSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke("tts", { body: { text } });
      if (error || !data?.audioContent) { setSpeaking(false); return; }
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch { setSpeaking(false); }
  }

  async function startInterview() {
    if (!skill.trim()) { toast.error("Enter a skill first"); return; }
    setStarted(true);
    await nextQuestion(0);
  }

  async function nextQuestion(index: number) {
    setLoadingQ(true); setQIndex(index); setTranscript(""); setInterim("");
    const { data, error } = await supabase.functions.invoke("ai-evaluate", { body: { mode: "interview_question", skill, index: index + 1 } });
    setLoadingQ(false);
    if (error || data?.error) { toast.error(data?.error ?? "Question fetch failed"); return; }
    setQuestion(data.question);
    speak(data.question);
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported. Use the text fallback."); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => {
      let f = "", i = "";
      for (let k = e.resultIndex; k < e.results.length; k++) {
        const t = e.results[k][0].transcript;
        if (e.results[k].isFinal) f += t; else i += t;
      }
      if (f) setTranscript((p) => (p + " " + f).trim());
      setInterim(i);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  }

  function stopListening() {
    recogRef.current?.stop();
    setListening(false);
  }

  async function submitAnswer() {
    const ans = (transcript + " " + interim).trim();
    if (!ans) { toast.error("No answer recorded"); return; }
    stopListening();
    setLoadingE(true);
    const { data, error } = await supabase.functions.invoke("ai-evaluate", {
      body: { mode: "interview_evaluate", skill, question, answer: ans },
    });
    setLoadingE(false);
    if (error || data?.error) { toast.error(data?.error ?? "Eval failed"); return; }
    const ev: IEval = data;
    setEvals((p) => [...p, ev]);
    setLoad((l) => Math.max(0, Math.min(100, l + ev.cognitiveLoadDelta)));
    if (qIndex + 1 < 3) {
      setTimeout(() => nextQuestion(qIndex + 1), 1200);
    } else {
      // Finalize portfolio entry
      const avg = (a: number, b: number, c: number, d: number) => Math.round(((a + b + c + d) / 4) * 10) / 10;
      const all = [...evals, ev];
      const aL = all.reduce((s, x) => s + x.scores.logic, 0) / all.length;
      const aC = all.reduce((s, x) => s + x.scores.clarity, 0) / all.length;
      const aD = all.reduce((s, x) => s + x.scores.depth, 0) / all.length;
      const aCo = all.reduce((s, x) => s + x.scores.confidence, 0) / all.length;
      const overall = avg(aL, aC, aD, aCo);
      const level = overall >= 4 ? "Strong" : overall >= 2.5 ? "Intermediate" : "Beginner";
      addToPortfolio({
        type: "interview", title: `Voice Interview: ${skill}`, skill,
        level: level as any, scores: { logic: aL, clarity: aC, depth: aD, confidence: aCo }, verdict: ev.verdict,
      });
      toast.success("Interview saved to portfolio");
    }
  }

  function retry() { setTranscript(""); setInterim(""); }
  function reset() {
    audioRef.current?.pause(); stopListening();
    setStarted(false); setEvals([]); setQuestion(""); setTranscript(""); setInterim(""); setLoad(20); setQIndex(0);
  }

  const avgConf = evals.length ? evals.reduce((s, x) => s + x.scores.confidence, 0) / evals.length : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-12 gap-6">
      {/* LEFT */}
      <aside className="lg:col-span-3">
        <Panel label="INTERVIEW SETUP" status="MOD 02" statusVariant="cyan">
          <div className="p-5 space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase block mb-2">Role / Skill</label>
              <SkillAutocomplete
                value={skill} onChange={setSkill} disabled={started}
                placeholder="e.g. Frontend Developer, Python…"
                className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30 disabled:opacity-50"
              />
            </div>
            {!started ? (
              <button onClick={startInterview} disabled={!skill.trim()} className="w-full bg-foreground text-background font-bold text-sm py-3 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
                <Play className="size-4" /> START INTERVIEW
              </button>
            ) : (
              <button onClick={reset} className="w-full border border-border bg-surface-2 text-sm py-2.5 rounded hover:border-led-alert/50 transition-colors font-mono tracking-wider text-xs">
                END SESSION
              </button>
            )}
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-3 border-t border-border">
              3 questions. Voice or text. Real-time scoring.
            </p>
          </div>
        </Panel>
      </aside>

      {/* CENTER */}
      <section className="lg:col-span-6">
        <Panel
          label="VOICE PROTOCOL"
          status={!started ? "STANDBY" : speaking ? "AI SPEAKING" : listening ? "RECORDING" : "READY"}
          statusVariant={listening ? "alert" : speaking ? "amber" : "cyan"}
          className={started ? "scanline" : ""}
        >
          <div className="p-8 min-h-[460px] flex flex-col">
            {/* Cognitive load top */}
            {started && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">🧠 Cognitive Load</span>
                  <span className="font-mono text-xs tabular-nums">{Math.round(load)}%</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${load}%`, background: load > 70 ? "hsl(var(--led-alert))" : load > 40 ? "hsl(var(--led-amber))" : "hsl(var(--led-green))" }} />
                </div>
              </div>
            )}

            {!started && (
              <div className="text-center my-auto py-12">
                <div className="size-20 mx-auto rounded-full bg-surface-2 border border-border flex items-center justify-center mb-6">
                  <Mic className="size-9 text-led-cyan" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Voice interview ready.</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Set a role on the left. Allow microphone. The AI will speak first.</p>
              </div>
            )}

            {started && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-[10px] tracking-widest text-led-cyan uppercase">// QUESTION {qIndex + 1}/3</div>
                    {speaking && (
                      <span className="chip chip-amber text-[10px]">
                        <Volume2 className="size-3" /> AI SPEAKING
                      </span>
                    )}
                  </div>
                  {loadingQ ? <Loader2 className="size-5 animate-spin text-led-cyan" /> : (
                    <p className="text-2xl font-bold leading-snug text-balance">{question}</p>
                  )}
                </div>

                {/* Mic */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <button
                    onClick={listening ? stopListening : startListening}
                    disabled={loadingE || speaking}
                    className={`size-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                      listening
                        ? "bg-led-alert/20 border-2 border-led-alert glow-cyan animate-pulse"
                        : "bg-surface-2 border-2 border-border hover:border-led-cyan hover:bg-led-cyan/10"
                    }`}
                  >
                    {listening ? <MicOff className="size-9 text-led-alert" /> : <Mic className="size-9 text-led-cyan" />}
                  </button>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mt-3">
                    {listening ? "Tap to stop" : "Tap to speak"}
                  </span>
                </div>

                {/* Transcript */}
                <div className="mt-6">
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Live Transcript</div>
                  <div className="bg-background border border-border rounded p-4 min-h-[80px] font-mono text-sm leading-relaxed">
                    {transcript || <span className="text-muted-foreground">{listening ? "Listening…" : "—"}</span>}
                    {interim && <span className="text-led-cyan/70"> {interim}</span>}
                  </div>
                  {!listening && (transcript || interim) && (
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={3}
                      placeholder="Edit transcript or type fallback…"
                      className="w-full mt-2 bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-led-cyan/50"
                    />
                  )}
                  <div className="flex gap-2 mt-3">
                    <button onClick={submitAnswer} disabled={loadingE || (!transcript.trim() && !interim.trim())} className="flex-1 bg-foreground text-background font-bold text-sm py-2.5 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
                      {loadingE ? <Loader2 className="size-4 animate-spin" /> : <>SUBMIT ANSWER</>}
                    </button>
                    <button onClick={retry} disabled={loadingE} className="border border-border bg-surface-2 px-4 py-2.5 rounded hover:border-led-cyan/50 inline-flex items-center gap-2 text-sm">
                      <RotateCcw className="size-4" /> RETRY
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Panel>
      </section>

      {/* RIGHT — Live evals */}
      <aside className="lg:col-span-3 space-y-4">
        <Panel label="LIVE EVALUATION" status={`${evals.length}/3`} statusVariant={evals.length === 3 ? "green" : "cyan"}>
          <div className="p-5 space-y-4">
            {evals.length === 0 && <p className="text-xs text-muted-foreground">Awaiting first answer…</p>}
            {evals.map((e, i) => (
              <div key={i} className="space-y-2 pb-3 border-b border-border last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-led-cyan uppercase">Q {i + 1}</span>
                  <span className="text-xs text-muted-foreground">{e.verdict}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <ScoreBar label="Logic" value={e.scores.logic} variant="cyan" />
                  <ScoreBar label="Clarity" value={e.scores.clarity} variant="violet" />
                  <ScoreBar label="Depth" value={e.scores.depth} variant="green" />
                  <ScoreBar label="Confidence" value={e.scores.confidence} variant="amber" />
                </div>
                <button onClick={() => speak(e.idealAnswer)} className="w-full text-left p-2 rounded border border-led-violet/30 bg-led-violet/5 hover:bg-led-violet/10 transition-colors">
                  <div className="font-mono text-[9px] tracking-widest text-led-violet uppercase mb-1">💣 INTERVIEW STEALER</div>
                  <div className="text-[11px] leading-relaxed">{e.idealAnswer}</div>
                </button>
              </div>
            ))}
          </div>
        </Panel>

        {evals.length === 3 && (
          <Panel label="SESSION SUMMARY" status="DONE" statusVariant="green">
            <div className="p-5 text-sm space-y-2">
              <p>Avg confidence: <span className="font-mono text-led-amber">{avgConf.toFixed(1)}/5</span></p>
              <p className="text-muted-foreground text-xs">Saved to portfolio with hash stamp.</p>
            </div>
          </Panel>
        )}
      </aside>
    </div>
  );
}
