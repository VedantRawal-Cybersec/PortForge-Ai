/** User-authored portfolio projects, saved only in this browser. No remote verification is implied. */
export const SHOWCASE_KEY = "portforge_showcase_projects_v1";
export const MAX_SHOWCASE_PROJECTS = 24;

export interface ShowcaseProject {
  id: string;
  title: string;
  summary: string;
  technologies: string;
  role: string;
  outcome: string;
  projectUrl: string;
  createdAt: number;
  updatedAt: number;
}
export type ShowcaseDraft = Pick<ShowcaseProject, "title" | "summary" | "technologies" | "role" | "outcome" | "projectUrl">;
export const emptyShowcaseDraft: ShowcaseDraft = {
  title: "", summary: "", technologies: "", role: "", outcome: "", projectUrl: "",
};
const limits = { title: 100, summary: 1200, technologies: 180, role: 140, outcome: 400, projectUrl: 600 };
const fields = Object.keys(limits) as (keyof ShowcaseDraft)[];

function safeText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
export function safeProjectUrl(value: unknown): string {
  if (!value) return "";
  if (typeof value !== "string") return "";
  try {
    const u = new URL(value.trim());
    return u.protocol === "https:" && !u.username && !u.password ? u.href : "";
  } catch { return ""; }
}
export function validShowcaseDraft(value: ShowcaseDraft): boolean {
  return value.title.trim().length >= 3
    && value.summary.trim().length >= 10
    && (!value.projectUrl.trim() || Boolean(safeProjectUrl(value.projectUrl)));
}
export function getShowcaseProjects(): ShowcaseProject[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(SHOWCASE_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.slice(0, MAX_SHOWCASE_PROJECTS).filter((raw): raw is Record<string, unknown> =>
      !!raw && typeof raw === "object" && !Array.isArray(raw)
      && typeof raw.id === "string" && typeof raw.title === "string" &&
      typeof raw.summary === "string"
    ).map(raw => ({
      id: safeText(raw.id, 80),
      title: safeText(raw.title, limits.title),
      summary: safeText(raw.summary, limits.summary),
      technologies: safeText(raw.technologies, limits.technologies),
      role: safeText(raw.role, limits.role),
      outcome: safeText(raw.outcome, limits.outcome),
      projectUrl: safeProjectUrl(raw.projectUrl),
      createdAt: Number.isFinite(raw.createdAt) ? Number(raw.createdAt) : Date.now(),
      updatedAt: Number.isFinite(raw.updatedAt) ? Number(raw.updatedAt) : Date.now(),
    })).filter(project => project.title.length >= 3);
  } catch { return []; }
}
export function saveShowcaseProject(draft: ShowcaseDraft, existingId?: string): ShowcaseProject {
  if (!validShowcaseDraft(draft)) throw new Error("Add a title and project description, and use an HTTPS link if provided.");
  const all = getShowcaseProjects();
  const existing = existingId ? all.find(p => p.id === existingId) : undefined;
  if (existingId && !existing) throw new Error("The original project could not be found.");
  if (!existing && all.length >= MAX_SHOWCASE_PROJECTS) throw new Error("You have reached the limit of 24 local portfolio projects.");
  const cleaned = {} as ShowcaseDraft;
  for (const field of fields) cleaned[field] = safeText(draft[field], limits[field]);
  cleaned.projectUrl = safeProjectUrl(draft.projectUrl);
  const current: ShowcaseProject = {
    ...cleaned,
    id: existing?.id || crypto.randomUUID(),
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };
  const next = existing ? all.map(p => p.id === existing.id ? current : p) : [current, ...all];
  localStorage.setItem(SHOWCASE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("portforge:showcase-projects"));
  return current;
}
export function deleteShowcaseProject(id: string): void {
  localStorage.setItem(SHOWCASE_KEY, JSON.stringify(getShowcaseProjects().filter(p => p.id !== id)));
  window.dispatchEvent(new Event("portforge:showcase-projects"));
}
