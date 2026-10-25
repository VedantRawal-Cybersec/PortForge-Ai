import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Check, Edit3, ExternalLink, FolderPlus, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  deleteShowcaseProject, emptyShowcaseDraft, getShowcaseProjects,
  MAX_SHOWCASE_PROJECTS, saveShowcaseProject, reorderShowcaseProject, projectCompleteness, type ShowcaseDraft, type ShowcaseProject,
} from "@/lib/showcaseProjects";

export default function ShowcaseEditor() {
  const [projects, setProjects] = useState<ShowcaseProject[]>(getShowcaseProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ShowcaseDraft>({ ...emptyShowcaseDraft });
  useEffect(() => {
    const refresh = () => setProjects(getShowcaseProjects());
    window.addEventListener("portforge:showcase-projects", refresh);
    return () => window.removeEventListener("portforge:showcase-projects", refresh);
  }, []);

  const change = (field: keyof ShowcaseDraft, value: string) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  const startNew = () => {
    setEditingId(null);
    setDraft({ ...emptyShowcaseDraft });
    setEditing(true);
  };
  const startEdit = (project: ShowcaseProject) => {
    setEditingId(project.id);
    setDraft({
      title: project.title, summary: project.summary,
      challenge: project.challenge, approach: project.approach, validation: project.validation,
      technologies: project.technologies, role: project.role,
      outcome: project.outcome, projectUrl: project.projectUrl,
    });
    setEditing(true);
  };
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      saveShowcaseProject(draft, editingId || undefined);
      setEditing(false);
      setEditingId(null);
      setDraft({ ...emptyShowcaseDraft });
      toast.success("Portfolio project saved on this device.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Project could not be saved.");
    }
  };
  const remove = (project: ShowcaseProject) => {
    if (!window.confirm("Remove " + project.title + " from this device? This does not delete any external code or website.")) return;
    try {
      deleteShowcaseProject(project.id);
      if (editingId === project.id) {
        setEditing(false);
        setEditingId(null);
      }
      toast.success("Local project removed.");
    } catch { toast.error("This browser could not remove the saved project."); }
  };

  return (
    <section className="panel p-5 md:p-7 space-y-5" aria-labelledby="showcase-editor-title">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="font-mono text-xs text-led-cyan tracking-widest">PROJECT LIBRARY</p>
          <h2 id="showcase-editor-title" className="text-2xl sm:text-3xl font-bold mt-2">Projects worth showing.</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mt-2">
            Add projects directly, without a skill test. Describe what you made, what you contributed
            and what you achieved. These entries are self-reported, not verified by PortForge.
          </p>
        </div>
        {!editing && <button type="button" onClick={startNew} disabled={projects.length >= MAX_SHOWCASE_PROJECTS}
          className="inline-flex gap-2 items-center rounded-xl bg-led-cyan px-4 py-3 font-semibold text-sm text-background disabled:opacity-45">
          <Plus size={17}/> Add a project
        </button>}
      </div>
      <p className="text-xs text-muted-foreground">{projects.length}/{MAX_SHOWCASE_PROJECTS} personal projects stored locally.</p>
      {editing && (
        <form onSubmit={save} className="rounded-xl border border-led-cyan/30 p-4 sm:p-6 bg-surface-2/60 space-y-4" aria-label={editingId ? "Edit project" : "New project"}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">{editingId ? "Edit your project" : "Tell the story behind your project"}</h3>
            <button type="button" aria-label="Close project editor" onClick={() => setEditing(false)}
              className="p-2 rounded-lg border border-border hover:bg-surface-3"><X size={17}/></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-semibold sm:col-span-2">Project title *
              <input required minLength={3} maxLength={100} value={draft.title} onChange={e => change("title",e.target.value)}
                placeholder="e.g. Task tracking dashboard" className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">What did you build? *
              <textarea required minLength={10} maxLength={1200} rows={4} value={draft.summary} onChange={e => change("summary",e.target.value)}
                placeholder="Explain the problem, how your project works and why it matters." className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
            <div className="sm:col-span-2 space-y-3 rounded-xl border border-border bg-background/40 p-4">
              <p className="text-sm font-bold">Turn this into a stronger case study</p>
              <p className="text-xs text-muted-foreground">Optional, but detailed context helps readers understand and trust the work. Only report facts you can support.</p>
              <label className="block text-sm font-semibold">Problem or challenge
                <textarea maxLength={800} rows={3} value={draft.challenge} onChange={e => change("challenge",e.target.value)}
                  placeholder="Who needed this, and what problem were you solving?" className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
              </label>
              <label className="block text-sm font-semibold">Approach and decisions
                <textarea maxLength={1000} rows={3} value={draft.approach} onChange={e => change("approach",e.target.value)}
                  placeholder="What approach did you take, and why? Mention one meaningful trade-off." className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
              </label>
              <label className="block text-sm font-semibold">Testing or supporting evidence
                <textarea maxLength={800} rows={3} value={draft.validation} onChange={e => change("validation",e.target.value)}
                  placeholder="What did you actually test or observe? Include limitations, not fabricated results." className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
              </label>
            </div>
            <label className="block text-sm font-semibold">Technologies
              <input maxLength={180} value={draft.technologies} onChange={e => change("technologies",e.target.value)}
                placeholder="React, TypeScript, PostgreSQL" className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
            <label className="block text-sm font-semibold">Your contribution
              <input maxLength={140} value={draft.role} onChange={e => change("role",e.target.value)}
                placeholder="Designed and developed the frontend" className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">Outcome or what you learned
              <textarea maxLength={400} rows={2} value={draft.outcome} onChange={e => change("outcome",e.target.value)}
                placeholder="Describe a real result or something you learned. Avoid invented numbers." className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">Project or source link (HTTPS)
              <input type="url" maxLength={600} value={draft.projectUrl} onChange={e => change("projectUrl",e.target.value)}
                placeholder="https://github.com/..." className="block mt-2 w-full rounded-lg bg-background border border-border p-3 font-normal"/>
            </label>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Case-study completeness (filled fields, not a quality score)</span>
              <span className="tabular-nums">{projectCompleteness(draft)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-background mt-2 overflow-hidden">
              <div className="h-full bg-led-cyan transition-[width]" style={{width:projectCompleteness(draft)+"%"}}/>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex gap-2 items-center rounded-xl bg-foreground text-background px-5 py-3 text-sm font-bold">
              <Check size={16}/> Save project
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-5 py-3 rounded-xl border border-border text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}
      {!editing && projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface-2/30 px-6 py-10 text-center">
          <FolderPlus className="mx-auto text-led-cyan mb-3" size={29}/>
          <h3 className="text-lg font-bold">Your first project belongs here.</h3>
          <p className="text-sm text-muted-foreground mt-2">Add a title and description to see it appear in the live portfolio preview.</p>
          <button type="button" onClick={startNew} className="mt-5 rounded-xl bg-led-cyan text-background px-5 py-3 font-semibold text-sm">Create your first project</button>
        </div>
      )}
      {projects.length > 0 && <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <article key={project.id} className="rounded-xl border border-border bg-surface-2/40 p-5 space-y-3">
            <div className="flex gap-2 justify-between items-start">
              <span className="chip chip-cyan text-[10px]">SELF-REPORTED</span>
              <div className="flex gap-2">
                <button type="button" disabled={index === 0} aria-label={"Move " + project.title + " up"}
                  onClick={() => { try { reorderShowcaseProject(project.id, -1); } catch { toast.error("Could not reorder projects."); } }}
                  className="p-2 rounded-lg border border-border disabled:opacity-30"><ArrowUp size={15}/></button>
                <button type="button" disabled={index === projects.length-1} aria-label={"Move " + project.title + " down"}
                  onClick={() => { try { reorderShowcaseProject(project.id, 1); } catch { toast.error("Could not reorder projects."); } }}
                  className="p-2 rounded-lg border border-border disabled:opacity-30"><ArrowDown size={15}/></button>
                <button type="button" aria-label={"Edit " + project.title} onClick={() => startEdit(project)}
                  className="p-2 rounded-lg hover:bg-surface-3 border border-border"><Edit3 size={15}/></button>
                <button type="button" aria-label={"Delete " + project.title} onClick={() => remove(project)}
                  className="p-2 rounded-lg hover:bg-surface-3 border border-border text-led-alert"><Trash2 size={15}/></button>
              </div>
            </div>
            <h3 className="text-xl font-bold break-words">{project.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">{project.summary}</p>
            {project.challenge && <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap"><strong>Challenge:</strong> {project.challenge}</p>}
            {project.approach && <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap"><strong>Approach:</strong> {project.approach}</p>}
            {project.validation && <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap"><strong>Evidence:</strong> {project.validation}</p>}
            {project.technologies && <p className="text-xs text-led-cyan break-words">{project.technologies}</p>}
            {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex gap-1.5 items-center text-sm text-led-cyan hover:underline">Open project <ExternalLink size={14}/></a>}
          </article>
        ))}
      </div>}
    </section>
  );
}
