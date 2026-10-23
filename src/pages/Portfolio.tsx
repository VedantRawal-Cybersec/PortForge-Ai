import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { clearPortfolio, getPortfolio, type PortfolioEntry } from "@/lib/portfolio";
import { ArrowRight, BookOpen, Briefcase, Code2, Mic, Trash2 } from "lucide-react";

export default function Portfolio() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(getPortfolio());
    refresh();
    window.addEventListener("portfolio:update", refresh);
    return () => window.removeEventListener("portfolio:update", refresh);
  }, []);

  const skills = new Set(entries.filter((entry) => entry.type === "skill").map((entry) => entry.skill)).size;
  const projects = entries.filter((entry) => entry.type === "project").length;
  const interviews = entries.filter((entry) => entry.type === "interview").length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-led-cyan font-mono mb-2">YOUR WORK. YOUR PROGRESS.</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Portfolio</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">Track assessments, interview practice, and projects in one personal space. Your portfolio grows from the work you do here.</p>
        </div>
        {entries.length > 0 && (
          <button type="button" onClick={() => { if (window.confirm("Clear all locally saved portfolio entries?")) clearPortfolio(); }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-led-alert/50 text-sm">
            <Trash2 className="size-4" aria-hidden="true" /> Clear local entries
          </button>
        )}
      </header>

      <div className="rounded-lg border border-led-amber/25 bg-led-amber/5 px-4 py-3 text-sm text-muted-foreground" role="note">
        <strong className="text-foreground">Storage notice:</strong> Entries are currently saved only in this browser on this device. They are AI-assisted assessments, not independently verified credentials. Account sync and external verification are not available yet.
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="My activity summary">
        {[
          { label: "Total activities", value: entries.length },
          { label: "Skills assessed", value: skills },
          { label: "Projects reviewed", value: projects },
          { label: "Interviews completed", value: interviews },
        ].map((metric) => (
          <div key={metric.label} className="panel p-5">
            <div className="text-sm text-muted-foreground">{metric.label}</div>
            <div className="text-3xl font-bold mt-2 tabular-nums">{metric.value}</div>
          </div>
        ))}
      </section>

      {entries.length === 0 ? (
        <Panel label="GET STARTED">
          <div className="p-6 md:p-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Your portfolio starts with your first step.</h2>
              <p className="text-muted-foreground leading-relaxed">No experience or existing projects needed. Choose an activity to create your first portfolio entry.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mt-7">
              {[
                { to: "/skill-test", title: "Assess a skill", desc: "Try a question and receive structured feedback.", icon: BookOpen },
                { to: "/workspace", title: "Work on a project", desc: "Write code and submit your work for AI review.", icon: Code2 },
                { to: "/interview", title: "Practice an interview", desc: "Answer questions with voice or text input.", icon: Mic },
              ].map(({ to, title, desc, icon: Icon }) => (
                <Link key={to} to={to} className="rounded-xl border border-border bg-surface-2 p-5 hover:border-led-cyan/40 transition-colors group">
                  <Icon className="size-6 text-led-cyan mb-4" aria-hidden="true" />
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  <ArrowRight className="size-4 text-led-cyan mt-4 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
                </Link>
              ))}
            </div>
          </div>
        </Panel>
      ) : (
        <section aria-labelledby="entries-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="entries-heading" className="text-2xl font-bold">My activity and evidence</h2>
            <Link to="/workspace" className="text-led-cyan text-sm font-semibold hover:underline">Add a project →</Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <article key={entry.id} className="panel p-5">
                <div className="flex items-center gap-2 text-xs text-led-cyan uppercase tracking-wider mb-3">
                  {entry.type === "project" ? <Code2 className="size-4" aria-hidden="true"/> : entry.type === "interview" ? <Mic className="size-4" aria-hidden="true"/> : <Briefcase className="size-4" aria-hidden="true"/>}
                  {entry.type} · AI-assessed
                </div>
                <h3 className="text-xl font-bold">{entry.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{entry.skill} · {entry.level}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">{entry.verdict}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {Object.entries(entry.scores).slice(0, 4).map(([label, value]) => (
                    <span key={label} className="chip text-xs">{label}: {typeof value === "number" ? value.toFixed(1) : String(value)}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-5 pt-4 border-t border-border">
                  Recorded {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
