import type { LearnerProfile } from "./profile";
import type { PortfolioEntry } from "./portfolio";

export type PortfolioTheme = "minimal" | "editorial" | "night";

export const portfolioThemes: { id: PortfolioTheme; title: string; description: string }[] = [
  { id: "minimal", title: "Minimal", description: "Clean, precise and recruiter-friendly" },
  { id: "editorial", title: "Editorial", description: "Warm, elegant and typography-led" },
  { id: "night", title: "Night Studio", description: "Bold, dark and technology-focused" },
];

export function escapePortfolioHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] || char));
}

function externalLink(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

/**
 * Export of the user's own locally recorded work. No cloud hosting, remote
 * scripts, unverifiable seals or claimed independent certifications.
 * All user and AI-originated text is escaped before being put into markup.
 */
export function buildPortfolioSite(
  profile: LearnerProfile,
  entries: PortfolioEntry[],
  theme: PortfolioTheme,
): string {
  const selected = portfolioThemes.some(item => item.id === theme) ? theme : "minimal";
  const name = escapePortfolioHtml(profile.name.trim() || "My Portfolio");
  const headline = escapePortfolioHtml(profile.headline.trim() || "Learning, building and growing");
  const bio = escapePortfolioHtml(profile.bio.trim() || "A collection of projects and learning experiences.");
  const projects = entries.filter(e => e.type === "project").slice(0, 24);
  const practice = entries.filter(e => e.type !== "project").slice(0, 24);
  const skills = [...new Set(entries.filter(e => e.type === "skill").map(e => e.skill.trim()).filter(Boolean))].slice(0, 24);
  const links = profile.links.map(externalLink).filter((url): url is string => !!url).slice(0, 8);
  const safeText = (text: unknown) => escapePortfolioHtml(text);
  const projectHtml = projects.length
    ? projects.map(e => `<article class="project">
        <div class="eyebrow">AI-reviewed practice · ${safeText(e.skill)}</div>
        <h3>${safeText(e.title)}</h3>
        <p>${safeText(e.verdict)}</p>
        <div class="footnote">Recorded ${new Date(Number.isFinite(e.createdAt) ? e.createdAt : 0).toLocaleDateString("en-US", { year: "numeric", month: "short" })}. Feedback is advisory.</div>
      </article>`).join("\n")
    : '<div class="empty">No saved project reviews yet. Add projects as you build them.</div>';
  const skillsHtml = skills.length
    ? skills.map(s => `<span class="tag">${safeText(s)}</span>`).join("\n")
    : '<span class="muted">Skills will appear here as you add your work.</span>';
  const evidenceHtml = practice.length
    ? practice.map(e => `<li><strong>${safeText(e.title)}</strong><span>${e.type === "interview" ? "Interview practice" : "Skill assessment"} · AI-assisted, self-tracked</span></li>`).join("\n")
    : '<li class="muted">No practice summaries saved yet.</li>';
  const linksHtml = links.map((url, i) => `<a href="${safeText(url)}" target="_blank" rel="noopener noreferrer">External link ${i + 1} ↗</a>`).join("\n");
  const themes: Record<PortfolioTheme, string> = {
    minimal: ":root{--bg:#f8f9f7;--ink:#181c22;--muted:#59626d;--card:#fff;--line:#dae0e2;--accent:#0f766e;--font:system-ui,-apple-system,Segoe UI,sans-serif}",
    editorial: ":root{--bg:#f4efe6;--ink:#342923;--muted:#74675c;--card:#fffaf2;--line:#ddcfbe;--accent:#9b582f;--font:Georgia,Times New Roman,serif}",
    night: ":root{--bg:#0c1117;--ink:#edf7f8;--muted:#a1b2bd;--card:#111d25;--line:#29404c;--accent:#34d6db;--font:system-ui,-apple-system,Segoe UI,sans-serif}",
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<meta name="description" content="${safeText(profile.headline || "Personal portfolio")}">
<title>${name} — Portfolio</title>
<style>
${themes[selected]}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);line-height:1.65}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
main,header,footer{max-width:1080px;margin:auto;padding:0 30px}header{padding-top:32px;display:flex;justify-content:space-between;gap:18px;align-items:center}nav{display:flex;gap:22px;flex-wrap:wrap}nav a{font-size:13px;color:var(--muted)}
.hero{padding:120px 0 90px}.eyebrow{color:var(--accent);font-family:system-ui,sans-serif;text-transform:uppercase;font-size:12px;letter-spacing:.14em;font-weight:700}h1{font-size:clamp(3.4rem,9vw,7rem);letter-spacing:-.065em;line-height:.98;margin:22px 0 30px;max-width:950px}h2{font-size:clamp(2rem,4vw,3rem);letter-spacing:-.05em;line-height:1.1;margin:0 0 24px}h3{font-size:24px;line-height:1.25;margin:12px 0}p{color:var(--muted)}.lead{font-size:clamp(1.15rem,2.2vw,1.55rem);max-width:720px}.section{padding:62px 0;border-top:1px solid var(--line)}.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px}.project{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px;overflow-wrap:anywhere}.footnote{font-size:12px;color:var(--muted);margin-top:26px}.tags{display:flex;flex-wrap:wrap;gap:10px}.tag{border:1px solid var(--line);border-radius:99px;padding:8px 15px;font-size:13px}.evidence{padding:0;list-style:none}.evidence li{padding:12px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.evidence span{font-size:13px;color:var(--muted)}.links{display:flex;flex-wrap:wrap;gap:18px}.empty{border:1px dashed var(--line);padding:28px;border-radius:12px;color:var(--muted)}footer{border-top:1px solid var(--line);padding-top:24px;padding-bottom:55px;font-size:12px;color:var(--muted)}
@media(max-width:620px){main,header,footer{padding-left:18px;padding-right:18px}header{align-items:flex-start;flex-direction:column}.hero{padding:65px 0}.section{padding:45px 0}.project{padding:22px}.evidence li{display:block}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
@media print{body{background:#fff;color:#111}nav{display:none}.hero{padding:45px 0}section{break-inside:avoid}.project{break-inside:avoid}a{color:#111}}
</style>
</head><body>
<header><strong>${name}</strong><nav aria-label="Sections"><a href="#work">Projects</a><a href="#skills">Skills</a><a href="#about">About</a></nav></header>
<main>
<section class="hero" id="top"><div class="eyebrow">Personal portfolio</div><h1>${name}</h1><p class="lead">${headline}</p></section>
<section class="section" id="work"><div class="eyebrow">Selected work</div><h2>Projects & experience</h2><div class="projects">${projectHtml}</div></section>
<section class="section" id="skills"><div class="eyebrow">Learning record</div><h2>Skills explored</h2><div class="tags">${skillsHtml}</div></section>
<section class="section" id="about"><div class="eyebrow">Introduction</div><h2>About me</h2><p class="lead">${bio}</p><div class="links">${linksHtml}</div></section>
<section class="section"><div class="eyebrow">Personal practice</div><h2>Learning activities</h2><ul class="evidence">${evidenceHtml}</ul></section>
</main>
<footer>Portfolio compiled from locally saved user information and AI-assisted practice. Entries are self-reported or AI-reviewed; they are not independently verified credentials. Edit the source records to update this export.</footer>
</body></html>`;
}
