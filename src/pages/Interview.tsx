import { useEffect, useRef, useState } from "react";
import { Panel, ScoreBar } from "@/components/Panel";
import { SkillAutocomplete } from "@/components/SkillAutocomplete";
import { addToPortfolio } from "@/lib/portfolio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mic, MicOff, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

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
  const [micLevel, setMicLevel] = useState(0);
  const [useBrowserTTS, setUseBrowserTTS] = useState(false);
  const [muted, setMuted] = useState(false);

  const recogRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const silenceSinceRef = useRef<number | null>(null);
  const autoSubmitRef = useRef<number | null>(null);

  // Browser TTS fallback
  function browserSpeak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) { resolve(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1; u.pitch = 1; u.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => /Google.*English|Samantha|Daniel|Microsoft.*Aria/i.test(v.name)) || voices.find(v => v.lang.startsWith("en"));
      if (preferred) u.voice = preferred;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function speak(text: string) {
    if (muted) return;
    setSpeaking(true);
    try {
      if (useBrowserTTS) {
        await browserSpeak(text);
        setSpeaking(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("tts", { body: { text } });
      if (error || !data?.audioContent || data?.error) {
        // Fallback to browser TTS on any failure (401, quota, etc.)
        if (!useBrowserTTS) {
          setUseBrowserTTS(true);
          toast.info("Switched to browser voice (ElevenLabs unavailable)");
        }
        await browserSpeak(text);
        setSpeaking(false);
        return;
      }
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = async () => { await browserSpeak(text); setSpeaking(false); };
      await audio.play();
    } catch {
      await browserSpeak(text);
      setSpeaking(false);
    }
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
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

  // Mic visualizer + auto-submit on silence
  function startMicMonitor(stream: MediaStream) {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    silenceSinceRef.current = null;

    const tick = () => {
      analyser.getByteFrequencyData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i];
      const avg = sum / buf.length;
      const level = Math.min(100, (avg / 128) * 100);
      setMicLevel(level);

      // Auto-submit after 2.2s of silence (if we have content)
      if (level < 6) {
        if (silenceSinceRef.current == null) silenceSinceRef.current = performance.now();
        else if (performance.now() - silenceSinceRef.current > 2200) {
          if ((transcriptRef.current + " " + interimRef.current).trim().length > 8 && !autoSubmitRef.current) {
            autoSubmitRef.current = window.setTimeout(() => { autoSubmitRef.current = null; submitAnswer(); }, 50);
          }
        }
      } else {
        silenceSinceRef.current = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }

  function stopMicMonitor() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    setMicLevel(0);
  }

  // Refs to read latest values inside RAF loop
  const transcriptRef = useRef("");
  const interimRef = useRef("");
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { interimRef.current = interim; }, [interim]);

  async function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported. Use the text fallback."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startMicMonitor(stream);
    } catch {
      toast.error("Microphone permission denied");
      return;
    }
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
    r.onerror = () => { setListening(false); stopMicMonitor(); };
    r.onend = () => { setListening(false); stopMicMonitor(); };
    r.start();
    recogRef.current = r;
    setListening(true);
  }

  function stopListening() {
    recogRef.current?.stop();
    setListening(false);
    stopMicMonitor();
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
    stopSpeaking(); stopListening();
    setStarted(false); setEvals([]); setQuestion(""); setTranscript(""); setInterim(""); setLoad(20); setQIndex(0);
  }

  useEffect(() => () => { stopSpeaking(); stopListening(); }, []);

  // Preload voices for browser TTS
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

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

            {/* Voice controls */}
            <div className="pt-3 border-t border-border space-y-2">
              <button
                onClick={() => setMuted(m => { if (!m) stopSpeaking(); return !m; })}
                className="w-full flex items-center justify-between text-xs font-mono tracking-wider px-3 py-2 rounded border border-border bg-surface-2 hover:border-led-cyan/50"
              >
                <span className="inline-flex items-center gap-2">
                  {muted ? <VolumeX className="size-3.5 text-led-alert" /> : <Volume2 className="size-3.5 text-led-cyan" />}
                  {muted ? "MUTED" : "VOICE ON"}
                </span>
                <span className="text-muted-foreground">{useBrowserTTS ? "BROWSER" : "AI"}</span>
              </button>
              <label className="flex items-center justify-between text-[11px] text-muted-foreground px-1 cursor-pointer">
                <span>Use browser voice</span>
                <input type="checkbox" checked={useBrowserTTS} onChange={(e) => setUseBrowserTTS(e.target.checked)} className="accent-led-cyan" />
              </label>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-3 border-t border-border">
              3 questions. Voice or text. Auto-submits after 2s silence.
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
                    <div className="flex items-center gap-2">
                      {speaking && (
                        <span className="chip chip-amber text-[10px]">
                          <Volume2 className="size-3" /> SPEAKING
                        </span>
                      )}
                      {!speaking && question && (
                        <button onClick={() => speak(question)} disabled={muted} className="chip text-[10px] hover:border-led-cyan/50 disabled:opacity-40">
                          <Volume2 className="size-3" /> REPLAY
                        </button>
                      )}
                      {speaking && (
                        <button onClick={stopSpeaking} className="chip text-[10px] hover:border-led-alert/50">
                          STOP
                        </button>
                      )}
                    </div>
                  </div>
                  {loadingQ ? <Loader2 className="size-5 animate-spin text-led-cyan" /> : (
                    <p className="text-2xl font-bold leading-snug text-balance">{question}</p>
                  )}
                </div>

                {/* Mic + visualizer */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    {listening && (
                      <>
                        <div
                          className="absolute inset-0 rounded-full bg-led-cyan/20 transition-transform duration-100"
                          style={{ transform: `scale(${1 + micLevel / 80})` }}
                        />
                        <div
                          className="absolute inset-0 rounded-full bg-led-cyan/10 transition-transform duration-150"
                          style={{ transform: `scale(${1 + micLevel / 50})` }}
                        />
                      </>
                    )}
                    <button
                      onClick={listening ? stopListening : startListening}
                      disabled={loadingE || speaking}
                      className={`relative size-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                        listening
                          ? "bg-led-alert/20 border-2 border-led-alert glow-cyan"
                          : "bg-surface-2 border-2 border-border hover:border-led-cyan hover:bg-led-cyan/10"
                      }`}
                    >
                      {listening ? <MicOff className="size-9 text-led-alert" /> : <Mic className="size-9 text-led-cyan" />}
                    </button>
                  </div>

                  {/* Live mic level bars */}
                  {listening && (
                    <div className="flex items-end gap-1 h-8 mt-4">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const threshold = (i + 1) * 6;
                        const active = micLevel > threshold;
                        return (
                          <div
                            key={i}
                            className="w-1 rounded-full transition-all duration-75"
                            style={{
                              height: active ? `${Math.min(32, 8 + (micLevel - threshold))}px` : "4px",
                              background: active ? "hsl(var(--led-cyan))" : "hsl(var(--border))",
                              opacity: active ? 1 : 0.4,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mt-3">
                    {speaking ? "AI is speaking…" : listening ? "Listening · auto-submits on silence" : "Tap to speak"}
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
