import { forwardRef, useEffect, useState } from "react";
import { Panel } from "@/components/Panel";
import { clearPortfolio, getDecayIcon, getPortfolio, type PortfolioEntry } from "@/lib/portfolio";
import { Briefcase, Brain, Code2, Mic, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);

  useEffect(() => {
    const update = () => setEntries(getPortfolio());
    update();
    window.addEventListener("portfolio:update", update);
    return () => window.removeEventListener("portfolio:update", update);
  }, []);

  const verifiedSkills = new Set(entries.map((e) => e.skill));
  const strongCount = entries.filter((e) => e.level === "Strong").length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-1">// MOD 05</div>
          <h1 className="text-4xl font-bold tracking-tight">Live Portfolio</h1>
          <p className="text-muted-foreground mt-1 text-sm">Hash-stamped, verified. Updates after every test.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/skill-test" className="border border-border bg-surface-2 px-4 py-2 rounded text-sm hover:border-led-cyan/50">+ Add via Skill Test</Link>
          {entries.length > 0 && (
            <button onClick={() => { if (confirm("Clear all portfolio entries?")) clearPortfolio(); }} className="border border-border bg-surface-2 px-3 py-2 rounded text-sm hover:border-led-alert/50 inline-flex items-center gap-2">
              <Trash2 className="size-3.5" /> Clear
            </button>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat k="TOTAL ENTRIES" v={entries.length} c="led-cyan" />
        <Stat k="VERIFIED SKILLS" v={verifiedSkills.size} c="led-violet" />
        <Stat k="STRONG LEVEL" v={strongCount} c="led-green" />
        <Stat k="THIS WEEK" v={entries.filter((e) => Date.now() - e.createdAt < 7 * 86400000).length} c="led-amber" />
      </div>

      {entries.length === 0 ? (
        <Panel label="EMPTY" statusVariant="amber">
          <div className="p-12 text-center">
            <Briefcase className="size-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-bold mb-2">No verified skills yet.</h3>
            <p className="text-muted-foreground text-sm mb-6">Run a skill test, voice interview, or submit a project.</p>
            <Link to="/skill-test" className="inline-flex items-center gap-2 bg-foreground text-background font-bold text-sm px-5 py-2.5 rounded hover:bg-led-cyan transition-colors">START FIRST PROBE</Link>
          </div>
        </Panel>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((e, i) => (
            <article key={e.id} className="panel p-5 group hover:border-led-cyan/40 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded bg-surface-2 border border-border flex items-center justify-center">
                  {e.type === "skill" ? <Brain className="size-4 text-led-cyan" /> :
                   e.type === "interview" ? <Mic className="size-4 text-led-violet" /> :
                   <Code2 className="size-4 text-led-green" />}
                </div>
                <span className={`chip text-[9px] ${e.level === "Strong" ? "chip-green" : e.level === "Intermediate" ? "chip-amber" : "chip-alert"}`}>{e.level}</span>
              </div>
              <h3 className="font-bold text-base leading-tight mb-1">{e.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{e.verdict}</p>

              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {Object.entries(e.scores).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="text-center p-1.5 rounded bg-surface-2 border border-border">
                    <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">{k.slice(0, 4)}</div>
                    <div className="text-sm font-bold tabular-nums">{Number(v).toFixed(1)}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="font-mono text-[10px] text-led-cyan tracking-wider">#{e.hash}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{getDecayIcon(e.createdAt)} {new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const Stat = forwardRef<HTMLDivElement, { k: string; v: number; c: string }>(function Stat(
  { k, v, c },
  ref
) {
  return (
    <div ref={ref} className="panel p-4">
      <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">{k}</div>
      <div className={`text-2xl font-bold tabular-nums text-${c}`}>{v}</div>
    </div>
  );
});
