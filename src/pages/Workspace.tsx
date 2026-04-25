import { useState } from "react";
import { Panel, ScoreBar } from "@/components/Panel";
import { addToPortfolio } from "@/lib/portfolio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Play, Save, Send, Terminal } from "lucide-react";

type Lang = "javascript" | "python";
type PEval = {
  scores: { logic: number; quality: number; structure: number; creativity: number };
  level: "Beginner"|"Intermediate"|"Strong"; verdict: string;
  whatWentWrong: string; improvedCode: string;
  resources: { title: string; why: string; kind: "free"|"paid"; url: string }[];
  upgrades: { tier: "beginner"|"intermediate"|"advanced"; name: string; description: string }[];
};

const STARTER: Record<Lang, string> = {
  javascript: `// Build something. Run it. Submit for AI grading.
function fizzbuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(i);
  }
  return out;
}
console.log(fizzbuzz(15).join(', '));
`,
  python: `# Build something. Run it. Submit for AI grading.
def fizzbuzz(n):
    out = []
    for i in range(1, n+1):
        if i % 15 == 0: out.append('FizzBuzz')
        elif i % 3 == 0: out.append('Fizz')
        elif i % 5 == 0: out.append('Buzz')
        else: out.append(i)
    return out

print(', '.join(map(str, fizzbuzz(15))))
`,
};

export default function Workspace() {
  const [lang, setLang] = useState<Lang>("javascript");
  const [code, setCode] = useState(STARTER.javascript);
  const [desc, setDesc] = useState("FizzBuzz implementation");
  const [output, setOutput] = useState<string[]>([]);
  const [evalData, setEvalData] = useState<PEval | null>(null);
  const [loading, setLoading] = useState(false);

  function changeLang(l: Lang) { setLang(l); setCode(STARTER[l]); setOutput([]); }

  function run() {
    setOutput([]);
    if (lang === "python") {
      setOutput(["[INFO] Python execution requires server runtime. JS runs natively."]);
      return;
    }
    const logs: string[] = [];
    const orig = console.log;
    console.log = (...a: any[]) => logs.push(a.map((x) => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" "));
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      setOutput(logs.length ? logs : ["[OK] No output."]);
    } catch (e) {
      setOutput([`[ERROR] ${e instanceof Error ? e.message : String(e)}`]);
    } finally { console.log = orig; }
  }

  function save() {
    localStorage.setItem("aero_workspace", JSON.stringify({ lang, code, desc }));
    toast.success("Saved locally");
  }

  async function submit() {
    if (!code.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("ai-evaluate", {
      body: { mode: "project_evaluate", code, description: desc },
    });
    setLoading(false);
    if (error || data?.error) { toast.error(data?.error ?? "Eval failed"); return; }
    setEvalData(data);
    addToPortfolio({
      type: "project", title: desc || "Untitled Project", skill: lang,
      level: data.level, scores: data.scores, verdict: data.verdict,
    });
    toast.success("Project added to portfolio");
  }

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-10 grid lg:grid-cols-12 gap-6">
      {/* CENTER — Editor */}
      <section className="lg:col-span-8 space-y-4">
        <Panel label="WORKSPACE" status={`MOD 03 // ${lang.toUpperCase()}`} statusVariant="cyan">
          <div className="p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="Project description (e.g. A todo CRUD app)"
                className="flex-1 min-w-[200px] bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-led-cyan/50"
              />
              <div className="flex border border-border rounded overflow-hidden">
                {(["javascript","python"] as const).map((l) => (
                  <button key={l} onClick={() => changeLang(l)} className={`px-3 py-2 text-xs font-mono tracking-wider ${lang === l ? "bg-led-cyan/10 text-led-cyan" : "text-muted-foreground hover:bg-surface-2"}`}>
                    {l === "javascript" ? "JS" : "PY"}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={code} onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[420px] bg-background border border-border rounded p-4 text-sm font-mono leading-relaxed focus:outline-none focus:border-led-cyan/50 resize-none"
            />

            <div className="flex gap-2 flex-wrap">
              <button onClick={run} className="bg-foreground text-background font-bold text-sm px-4 py-2.5 rounded hover:bg-led-green transition-colors inline-flex items-center gap-2">
                <Play className="size-4" /> RUN
              </button>
              <button onClick={save} className="border border-border bg-surface-2 text-sm px-4 py-2.5 rounded hover:border-led-cyan/50 inline-flex items-center gap-2">
                <Save className="size-4" /> SAVE
              </button>
              <button onClick={submit} disabled={loading} className="ml-auto bg-led-cyan text-background font-bold text-sm px-5 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                SUBMIT FOR GRADING
              </button>
            </div>
          </div>
        </Panel>

        <Panel label="CONSOLE" status="OUTPUT" statusVariant="green">
          <div className="p-5">
            <div className="bg-background border border-border rounded p-4 min-h-[120px] font-mono text-xs leading-relaxed">
              {output.length === 0 ? <span className="text-muted-foreground">— Run code to see output —</span> :
                output.map((l, i) => (
                  <div key={i} className={l.startsWith("[ERROR]") ? "text-led-alert" : l.startsWith("[INFO]") ? "text-led-amber" : "text-foreground"}>
                    <span className="text-muted-foreground mr-2">{i + 1}</span>{l}
                  </div>
                ))
              }
            </div>
          </div>
        </Panel>
      </section>

      {/* RIGHT — Eval */}
      <aside className="lg:col-span-4 space-y-4">
        <Panel label="AI GRADER" status={evalData ? "GRADED" : "STANDBY"} statusVariant={evalData ? "green" : "cyan"}>
          <div className="p-5 space-y-4">
            {!evalData && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                <Terminal className="size-8 mx-auto mb-3 text-led-cyan" />
                Submit code for structured AI grading.
              </p>
            )}
            {evalData && (
              <div className="space-y-4 animate-fade-up">
                <div className="flex items-center justify-between">
                  <span className={`chip ${evalData.level === "Strong" ? "chip-green" : evalData.level === "Intermediate" ? "chip-amber" : "chip-alert"}`}>{evalData.level}</span>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">VERIFIED</span>
                </div>
                <p className="text-sm font-semibold leading-snug">{evalData.verdict}</p>
                <div className="space-y-2">
                  <ScoreBar label="Logic" value={evalData.scores.logic} variant="cyan" />
                  <ScoreBar label="Code Quality" value={evalData.scores.quality} variant="violet" />
                  <ScoreBar label="Structure" value={evalData.scores.structure} variant="green" />
                  <ScoreBar label="Creativity" value={evalData.scores.creativity} variant="amber" />
                </div>
                <div className="p-3 rounded border border-led-alert/30 bg-led-alert/5">
                  <div className="text-[10px] font-mono tracking-widest text-led-alert uppercase mb-1">❌ ISSUES</div>
                  <p className="text-xs leading-relaxed">{evalData.whatWentWrong}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-green uppercase mb-2">✅ IMPROVED</div>
                  <pre className="bg-background border border-border rounded p-3 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{evalData.improvedCode}</pre>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-cyan uppercase mb-2">📘 RESOURCES</div>
                  <div className="space-y-2">
                    {evalData.resources.map((r) => (
                      <a key={r.title} href={r.url} target="_blank" rel="noreferrer" className="block p-2 rounded border border-border bg-surface-2 hover:border-led-cyan/40 text-xs">
                        <div className="font-semibold flex items-center justify-between">
                          {r.title}
                          <span className={`chip text-[9px] ${r.kind === "free" ? "chip-green" : "chip-amber"}`}>{r.kind}</span>
                        </div>
                        <div className="text-muted-foreground text-[11px] mt-1">{r.why}</div>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-violet uppercase mb-2">🚀 UPGRADES</div>
                  {evalData.upgrades.map((u) => {
                    const dot = u.tier === "beginner" ? "🟢" : u.tier === "intermediate" ? "🟡" : "🔴";
                    return (
                      <div key={u.name} className="p-2 rounded border border-border bg-surface-2 mb-2 text-xs">
                        <div className="font-semibold">{dot} {u.name}</div>
                        <div className="text-muted-foreground text-[11px] mt-1">{u.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </aside>
    </div>
  );
}
