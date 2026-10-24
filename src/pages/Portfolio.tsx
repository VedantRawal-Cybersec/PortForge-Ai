import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { clearPortfolio, getPortfolio, type PortfolioEntry } from "@/lib/portfolio";
import { ArrowRight, BookOpen, Briefcase, Code2, Mic, Trash2, Download, Eye, Search } from "lucide-react";
import { getProfile } from "@/lib/profile";
import { buildPortfolioSite, portfolioThemes, type PortfolioTheme } from "@/lib/portfolioSite";
import ProfileBuilder from "@/components/ProfileBuilder";
import ShowcaseEditor from "@/components/ShowcaseEditor";
import { getShowcaseProjects } from "@/lib/showcaseProjects";
import { exercises, getPractice } from "@/lib/practice";
import { getProjectInterviews } from "@/lib/projectJourney";
import { FlaskConical, MessageSquareText } from "lucide-react";

export default function Portfolio() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [authoredProjects, setAuthoredProjects] = useState(getShowcaseProjects);
  useEffect(() => {
    const reload = () => setAuthoredProjects(getShowcaseProjects());
    window.addEventListener("portforge:showcase-projects", reload);
    return () => window.removeEventListener("portforge:showcase-projects", reload);
  }, []);
  const [profile, setProfile] = useState(getProfile);
  const [theme, setTheme] = useState<PortfolioTheme>("minimal");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [filter, setFilter] = useState<"all" | PortfolioEntry["type"]>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const update = () => setProfile(getProfile());
    window.addEventListener("portforge:profile", update);
    return () => window.removeEventListener("portforge:profile", update);
  }, []);

  function exportSite(preview: boolean) {
    const html = buildPortfolioSite(profile, entries, theme, authoredProjects);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    if (preview) {
      const link = document.createElement("a");
      link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 120000);
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = "portforge-portfolio-" + theme + ".html";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  useEffect(() => {
    const refresh = () => setEntries(getPortfolio());
    refresh();
    window.addEventListener("portfolio:update", refresh);
    return () => window.removeEventListener("portfolio:update", refresh);
  }, []);

  const [practice,setPractice]=useState(getPractice);
  const [stories,setStories]=useState(getProjectInterviews);
  useEffect(()=>{const p=()=>setPractice(getPractice());const s=()=>setStories(getProjectInterviews());window.addEventListener("portforge:practice",p);window.addEventListener("portforge:project-interview",s);return()=>{window.removeEventListener("portforge:practice",p);window.removeEventListener("portforge:project-interview",s)};},[]);
  const skills = new Set(entries.filter((entry) => entry.type === "skill").map((entry) => entry.skill)).size;
  const projects = entries.filter((entry) => entry.type === "project").length;
  const interviews = entries.filter((entry) => entry.type === "interview").length;
  const visibleEntries = entries.filter(entry =>
    (filter === "all" || entry.type === filter) &&
    [entry.title, entry.skill, entry.verdict].some(value =>
      value.toLowerCase().includes(query.trim().toLowerCase())
    )
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <header className="pf-module-intro flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-led-cyan font-mono mb-2">YOUR WORK. YOUR PROGRESS.</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your work, beautifully presented.</h1>
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

      <ProfileBuilder />
      <ShowcaseEditor />
      <section className="panel p-5 md:p-7 space-y-5" aria-labelledby="portfolio-studio-title">
        <div>
          <p className="font-mono text-xs tracking-widest text-led-cyan">PORTFOLIO STUDIO · LOCAL EXPORT</p>
          <h2 id="portfolio-studio-title" className="text-2xl sm:text-3xl font-bold mt-2">Turn your progress into a beautiful website.</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-2xl">
            Choose a look, preview it and download an editable standalone HTML portfolio.
            This is a file you control, not a published website. Only data you have saved here is included.
          </p>
        </div>
        <div role="group" aria-label="Portfolio export style" className="grid sm:grid-cols-3 gap-3">
          {portfolioThemes.map(option => (
            <button key={option.id} type="button" onClick={() => setTheme(option.id)}
              aria-pressed={theme === option.id}
              className={`rounded-xl text-left border p-4 transition-colors ${theme === option.id ? "border-led-cyan bg-led-cyan/10" : "border-border bg-surface-2 hover:border-led-cyan/40"}`}>
              <div className={`h-12 rounded-lg mb-3 border ${option.id === "minimal" ? "bg-[#f8f9f7] border-[#dae0e2]" : option.id === "editorial" ? "bg-[#f4efe6] border-[#ddcfbe]" : "bg-[#0c1117] border-[#29404c]"}`}/>
              <strong className="text-sm block">{option.title}</strong>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-background/70 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-2/60">
            <div>
              <p className="text-sm font-bold">Live portfolio preview</p>
              <p className="text-[11px] text-muted-foreground">Updates when you save your profile or change style</p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden" role="group" aria-label="Preview device size">
              <button type="button" aria-pressed={previewDevice === "desktop"} onClick={() => setPreviewDevice("desktop")}
                className={"px-3 py-2 text-xs font-bold " + (previewDevice === "desktop" ? "bg-led-cyan text-background" : "bg-surface-2 text-muted-foreground")}>
                Desktop
              </button>
              <button type="button" aria-pressed={previewDevice === "mobile"} onClick={() => setPreviewDevice("mobile")}
                className={"px-3 py-2 text-xs font-bold " + (previewDevice === "mobile" ? "bg-led-cyan text-background" : "bg-surface-2 text-muted-foreground")}>
                Mobile
              </button>
            </div>
          </div>
          <div className="bg-surface-3/50 p-3 sm:p-5 min-h-[360px] overflow-x-auto flex justify-center">
            <iframe title="Preview of your locally generated portfolio"
              sandbox=""
              referrerPolicy="no-referrer"
              srcDoc={buildPortfolioSite(profile, entries, theme, authoredProjects)}
              style={{width: previewDevice === "mobile" ? "360px" : "100%", height: "490px", maxWidth: previewDevice === "mobile" ? "360px" : "100%"}}
              className="border border-border rounded-xl bg-white shadow-xl transition-[width] duration-300"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => exportSite(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold hover:border-led-cyan/50">
            <Eye className="size-4"/> Open in new tab
          </button>
          <button type="button" onClick={() => exportSite(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-3 text-sm font-bold hover:bg-led-cyan">
            <Download className="size-4"/> Download portfolio HTML
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Exported activity labels identify AI-assisted and self-tracked work. There are no verified certificates,
          online publishing, public URLs or automatic cloud backups in this feature.
        </p>
      </section>
      <p className="text-sm text-muted-foreground">Keep a backup of your work. <Link to="/my-data" className="text-led-cyan hover:underline">Export, restore or delete locally saved progress</Link>.</p>
      <section className="grid md:grid-cols-2 gap-4" aria-label="Independent project evidence">
        <div className="panel p-5 sm:p-6 space-y-3">
          <h2 className="text-xl font-bold flex gap-2 items-center"><FlaskConical className="size-5 text-led-cyan"/> Independent challenge work</h2>
          <p className="text-sm text-muted-foreground">Results from your own locally saved coding exercises, separate from AI-assessed activity.</p>
          {practice.length===0?<p className="text-sm text-muted-foreground">No independent challenges saved yet.</p>:<div className="space-y-2">{practice.slice(0,6).map(p=><div key={p.exerciseId} className="flex justify-between gap-3 border border-border rounded-lg p-3 text-sm"><span>{exercises.find(e=>e.id===p.exerciseId)?.title||"Practice task"}</span><span className="text-led-cyan shrink-0">{p.passed}/{p.total} tests</span></div>)}</div>}
          <Link to="/practice" className="text-led-cyan text-sm inline-flex gap-2 items-center">Open practice lab <ArrowRight className="size-4"/></Link>
        </div>
        <div className="panel p-5 sm:p-6 space-y-3">
          <h2 className="text-xl font-bold flex gap-2 items-center"><MessageSquareText className="size-5 text-led-cyan"/> Project interview stories</h2>
          <p className="text-sm text-muted-foreground">Structured explanations of projects you attempted. These are self-written practice notes.</p>
          {stories.length===0?<p className="text-sm text-muted-foreground">No project interviews saved yet.</p>:<div className="space-y-2">{stories.slice(0,6).map(s=><div key={s.exerciseId} className="flex justify-between gap-3 border border-border rounded-lg p-3 text-sm"><span>{exercises.find(e=>e.id===s.exerciseId)?.title||"Project interview"}</span><span className="text-led-cyan shrink-0">{s.answers.filter(a=>a.trim().length>=40).length}/4 answers</span></div>)}</div>}
          <Link to="/project-interview" className="text-led-cyan text-sm inline-flex gap-2 items-center">Practice my explanation <ArrowRight className="size-4"/></Link>
        </div>
      </section>

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
          <div className="flex flex-wrap gap-3 items-center">
            <label className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true"/>
              <span className="sr-only">Search portfolio activities</span>
              <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by project, skill or feedback"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm"/>
            </label>
            <label className="sr-only" htmlFor="portfolio-entry-filter">Filter activity type</label>
            <select id="portfolio-entry-filter" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
              <option value="all">All activity</option><option value="project">Projects</option>
              <option value="skill">Skill tests</option><option value="interview">Interviews</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">{visibleEntries.length} of {entries.length} activities shown</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleEntries.map((entry) => (
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
          {visibleEntries.length === 0 && <p className="text-sm text-muted-foreground">No saved activities match the search or filter.</p>}
        </section>
      )}
    </div>
  );
}
