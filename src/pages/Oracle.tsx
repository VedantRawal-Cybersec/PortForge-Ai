import { useState } from "react";
import { Panel } from "@/components/Panel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Target, TrendingUp } from "lucide-react";

type OracleResp = {
  role: string;
  requiredSkills: string[];
  roadmap: { step: string; detail: string }[];
  gaps: string[];
  verdict: string;
};

export default function Oracle() {
  const [role, setRole] = useState("");
  const [known, setKnown] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OracleResp | null>(null);

  async function run() {
    if (!role.trim()) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("ai-evaluate", {
      body: { mode: "oracle", skill: role, answer: known },
    });
    setLoading(false);
    if (error || res?.error) { toast.error(res?.error ?? "Oracle failed"); return; }
    setData(res);
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-10 grid lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-4">
        <Panel label="ORACLE" status="MOD_04" statusVariant="cyan">
          <div className="p-5 space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase block mb-2">Target_Role</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. ML Engineer at Google" className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-led-cyan focus:ring-1 focus:ring-led-cyan/30" />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase block mb-2">Known_Skills (optional)</label>
              <textarea value={known} onChange={(e) => setKnown(e.target.value)} rows={4} placeholder="React, Python, SQL…" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-led-cyan/50" />
            </div>
            <button onClick={run} disabled={loading || !role.trim()} className="w-full bg-foreground text-background font-bold text-sm py-3 rounded hover:bg-led-cyan transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Target className="size-4" />}
              CONSULT_ORACLE
            </button>
          </div>
        </Panel>
      </aside>

      <section className="lg:col-span-8">
        <Panel label="JOB_INTELLIGENCE" status={data ? "READY" : "STANDBY"} statusVariant={data ? "green" : "cyan"}>
          <div className="p-6 min-h-[420px]">
            {!data && !loading && (
              <div className="text-center py-16">
                <TrendingUp className="size-10 mx-auto text-led-cyan mb-4" />
                <p className="text-muted-foreground">Pick a role. Get required skills, gaps, and a roadmap.</p>
              </div>
            )}
            {loading && <div className="text-center py-16"><Loader2 className="size-8 animate-spin mx-auto text-led-cyan" /></div>}
            {data && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-led-cyan uppercase mb-1">// ROLE</div>
                  <h2 className="text-2xl font-bold">{data.role}</h2>
                  <p className="text-muted-foreground mt-2 text-sm">{data.verdict}</p>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">Required_Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {data.requiredSkills.map((s) => <span key={s} className="chip">{s}</span>)}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-widest text-led-alert uppercase mb-3">⚠️ Gaps_Detected</div>
                  <div className="flex flex-wrap gap-2">
                    {data.gaps.map((g) => <span key={g} className="chip chip-alert">{g}</span>)}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] tracking-widest text-led-green uppercase mb-3">📍 Roadmap</div>
                  <div className="space-y-2">
                    {data.roadmap.map((r, i) => (
                      <div key={i} className="p-4 rounded border border-border bg-surface-2 flex gap-4">
                        <div className="font-mono text-2xl text-led-cyan/40 font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                        <div>
                          <div className="font-bold text-sm">{r.step}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}
