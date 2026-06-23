import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { clearPortfolio, getDecayIcon, getPortfolio, type PortfolioEntry } from "@/lib/portfolio";
import { Activity, Brain, Briefcase, Code2, ExternalLink, FileText, Mic, ShieldCheck, Target, Trash2, Zap } from "lucide-react";

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
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-1">// MOD 05</div>
          <h1 className="text-4xl font-bold tracking-tight">Verified Proof Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Organized cybersecurity project proof, capability mapping, and recruiter-readable evidence for Vedant Rawal.
          </p>
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

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <Panel label="PROFILE SUMMARY" statusVariant="green">
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-led-cyan/10 border border-led-cyan/30 flex items-center justify-center">
                <ShieldCheck className="size-6 text-led-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Cybersecurity Student | Threat Intelligence & SOC Foundations</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Focused on defensive cybersecurity, vulnerability management, web security, AI-assisted cyber analysis, threat-intelligence automation, and proof-based internship readiness.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {capabilityMap.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-surface-2 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="size-4 text-led-cyan" />
                    <h3 className="font-bold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel label="PUBLIC LINKS" statusVariant="cyan">
          <div className="p-6 space-y-3">
            <a href="https://www.linkedin.com/in/vedant-rawal-416529363" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4 hover:border-led-cyan/50 transition-colors">
              <div>
                <div className="font-bold text-sm">LinkedIn Profile</div>
                <div className="text-xs text-muted-foreground">Professional cybersecurity profile</div>
              </div>
              <ExternalLink className="size-4 text-led-cyan" />
            </a>
            <Link to="/skill-test" className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4 hover:border-led-cyan/50 transition-colors">
              <div>
                <div className="font-bold text-sm">Skill Test Engine</div>
                <div className="text-xs text-muted-foreground">Generate verified skill entries</div>
              </div>
              <Zap className="size-4 text-led-cyan" />
            </Link>
            <div className="rounded-lg border border-led-amber/30 bg-led-amber/5 p-4">
              <div className="font-mono text-[10px] tracking-widest text-led-amber uppercase mb-1">GitHub note</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The old GitHub profile card has been removed from the public website feed. Add only clean, recruiter-ready repository links here after each repo has a strong README, screenshots, and reports.
              </p>
            </div>
          </div>
        </Panel>
      </section>

      <section>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-1">// PROJECT PROOF</div>
            <h2 className="text-2xl font-bold tracking-tight">Live cybersecurity project panel</h2>
          </div>
          <Link to="/workspace" className="font-mono text-xs text-muted-foreground hover:text-led-cyan tracking-widest">ADD PROJECT →</Link>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <a key={project.title} href={project.href} target="_blank" rel="noreferrer" className="panel p-5 group hover:border-led-cyan/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center">
                  <project.icon className="size-5 text-led-cyan" />
                </div>
                <ExternalLink className="size-4 text-muted-foreground group-hover:text-led-cyan" />
              </div>
              <div className="font-mono text-[10px] tracking-widest text-led-cyan uppercase mb-2">{project.type}</div>
              <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-led-cyan transition-colors">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="chip text-[10px] text-muted-foreground border-border/80">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

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
            <h3 className="font-bold mb-2">No verified skill-test entries yet.</h3>
            <p className="text-muted-foreground text-sm mb-6">Run a skill test, voice interview, or submit a project to generate hash-stamped skill evidence.</p>
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

const capabilityMap = [
  {
    title: "Threat Intelligence",
    desc: "CVE tracking, daily cyber briefings, IOC thinking, CISA KEV awareness, and concise defender-focused summaries.",
    icon: Activity,
  },
  {
    title: "SOC Foundations",
    desc: "Alert summarization, security reporting, incident-response concepts, and evidence-first portfolio entries.",
    icon: ShieldCheck,
  },
  {
    title: "Web Security",
    desc: "Authorized website review, security header awareness, input validation concepts, OWASP awareness, and remediation notes.",
    icon: Code2,
  },
  {
    title: "Automation + AI",
    desc: "AI-assisted analysis, briefing automation, structured outputs, and practical security workflow design.",
    icon: Brain,
  },
];

const projects = [
  {
    type: "Live Project",
    title: "Sentinel AI",
    desc: "Authorized web security review project focused on exposure awareness, security posture checks, and remediation-oriented reporting.",
    href: "https://sentinelweb-scan.lovable.app",
    tags: ["Web Security", "Exposure Review", "Reporting"],
    icon: ShieldCheck,
  },
  {
    type: "Live Project",
    title: "Threat Forge",
    desc: "Web application security learning project focused on input validation awareness, XSS risk concepts, and responsible testing workflows.",
    href: "https://zip-repl--abbygoeated.replit.app",
    tags: ["OWASP", "XSS Awareness", "VAPT Foundations"],
    icon: Code2,
  },
  {
    type: "Live Project",
    title: "IMMUNEFIN AI",
    desc: "AI-assisted cybersecurity project for structured analysis, cyber defense support, and security decision-support learning.",
    href: "https://sju-chi.vercel.app",
    tags: ["AI Security", "Analysis", "Defense"],
    icon: Brain,
  },
  {
    type: "Workflow Proof",
    title: "Daily Cyber Briefing",
    desc: "Threat-intelligence automation concept for collecting trusted updates, filtering important items, and producing concise defensive briefings.",
    href: "/portfolio",
    tags: ["Threat Intel", "Automation", "CVE Tracking"],
    icon: FileText,
  },
];
