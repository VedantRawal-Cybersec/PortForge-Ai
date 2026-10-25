import type { LearnerProfile } from "./profile";
import type { ShowcaseProject } from "./showcaseProjects";
import { safeProjectUrl } from "./showcaseProjects";
import { escapePortfolioHtml } from "./portfolioSite";

export const RESUME_KEY = "portforge_resume_v1";
export type ResumeStyle = "ats" | "modern" | "editorial" | "executive";
export type ResumeTypography = "sans" | "serif" | "humanist";
export type ResumeDensity = "comfortable" | "compact";
export type ResumeItem = { id:string; heading:string; subheading:string; date:string; description:string };
export type ResumeData = {
  name:string; headline:string; email:string; phone:string; location:string;
  website:string; linkedin:string; summary:string; skills:string;
  education:ResumeItem[]; experience:ResumeItem[];
  projects:ResumeItem[]; certifications:string; activities:string;
  targetRole:string; targetDescription:string;
  style:ResumeStyle; typography:ResumeTypography; density:ResumeDensity; accent:string;
};
const accents = ["#0f766e","#1d4ed8","#6d28d9","#9a3412","#111827"] as const;
export const resumeStyles: {id:ResumeStyle;title:string;description:string}[] = [
  {id:"ats",title:"Essential ATS",description:"Simple, single-column structure and familiar headings"},
  {id:"modern",title:"Modern Professional",description:"Confident typography with restrained blue or teal accents"},
  {id:"editorial",title:"Editorial Serif",description:"Elegant, sophisticated headings and generous whitespace"},
  {id:"executive",title:"Executive Minimal",description:"Strong hierarchy and understated professional styling"},
];
const item = (heading="",description="",subheading="",date=""):ResumeItem => ({
  id:typeof crypto!=="undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())+Math.random(),
  heading,subheading,date,description,
});
export const blankResume:ResumeData={
  name:"",headline:"",email:"",phone:"",location:"",website:"",linkedin:"",
  summary:"",skills:"",education:[],experience:[],projects:[],certifications:"",activities:"",
  targetRole:"",targetDescription:"",style:"ats",typography:"sans",density:"comfortable",accent:"#0f766e",
};
const clip=(v:unknown,n:number)=>typeof v==="string"?v.trim().slice(0,n):"";
function cleanItem(raw:unknown):ResumeItem|null{
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
  const x=raw as Record<string,unknown>;
  return {id:clip(x.id,80)||item().id,heading:clip(x.heading,140),subheading:clip(x.subheading,180),
    date:clip(x.date,90),description:clip(x.description,2500)};
}
export function cleanResume(raw:unknown):ResumeData{
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return {...blankResume};
  const x=raw as Record<string,unknown>;
  const fields: (keyof ResumeData)[]=["name","headline","email","phone","location","website","linkedin","summary",
    "skills","certifications","activities","targetRole","targetDescription"];
  const r={...blankResume};
  for(const field of fields)(r as unknown as Record<string,unknown>)[field]=clip(x[field],field==="targetDescription"?9000:field==="summary"?1300:field==="skills"?1200:1100);
  for(const field of ["education","experience","projects"] as const){
    r[field]=Array.isArray(x[field])?x[field].slice(0,24).map(cleanItem).filter((p):p is ResumeItem=>Boolean(p)):[];
  }
  r.style=resumeStyles.some(s=>s.id===x.style)?x.style as ResumeStyle:"ats";
  r.typography=["sans","serif","humanist"].includes(String(x.typography))?x.typography as ResumeTypography:"sans";
  r.density=x.density==="compact"?"compact":"comfortable";
  r.accent=accents.includes(x.accent as typeof accents[number])?x.accent as string:blankResume.accent;
  return r;
}
export function getResume():ResumeData{
  try{return cleanResume(JSON.parse(localStorage.getItem(RESUME_KEY)||"null"));}catch{return {...blankResume};}
}
export function saveResume(data:ResumeData):void{
  localStorage.setItem(RESUME_KEY,JSON.stringify(cleanResume(data)));
  window.dispatchEvent(new Event("portforge:resume"));
}
export function newResumeItem():ResumeItem{return item();}
export function importPortfolioToResume(current:ResumeData,profile:LearnerProfile,projects:ShowcaseProject[]):ResumeData{
  const copy=cleanResume(current);
  copy.name ||= profile.name.trim().slice(0,100);
  copy.headline ||= profile.headline.trim().slice(0,150);
  copy.summary ||= profile.bio.trim().slice(0,1000);
  copy.website ||= (profile.links.find(link=>safeProjectUrl(link))||"");
  if(!copy.skills.trim()){
    copy.skills=[...new Set(projects.flatMap(p=>p.technologies.split(",").map(t=>t.trim())).filter(Boolean))].slice(0,25).join(", ");
  }
  const existing=new Set(copy.projects.map(p=>p.heading.toLowerCase()));
  for(const p of projects){
    if(copy.projects.length>=16)break;
    if(existing.has(p.title.trim().toLowerCase()))continue;
    copy.projects.push(item(p.title,p.summary+(p.outcome?"\nOutcome: "+p.outcome:"")+(p.validation?"\nTested: "+p.validation:""),
      [p.role,p.technologies,safeProjectUrl(p.projectUrl)].filter(Boolean).join(" · "),""));
    existing.add(p.title.trim().toLowerCase());
  }
  return cleanResume(copy);
}
export type ResumeGuidance={label:string;ok:boolean;detail:string};
export function resumeGuidance(r:ResumeData):ResumeGuidance[]{
  return [
    {label:"Identity and contact",ok:Boolean(r.name.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)),
      detail:"Include your real name and a working email address."},
    {label:"Target and summary",ok:Boolean(r.headline.trim()&&r.summary.trim().length>=50),
      detail:"State your target role and explain your genuine strengths in two or three sentences."},
    {label:"Real project evidence",ok:r.projects.some(p=>p.heading.trim()&&p.description.trim().length>=30),
      detail:"Describe a real project, what you did, and an actual result or test."},
    {label:"Skills and tools",ok:r.skills.trim().split(/[,\n;]/).filter(Boolean).length>=3,
      detail:"List relevant skills you genuinely have used or learned."},
    {label:"Education or experience",ok:r.education.some(e=>e.heading.trim())||r.experience.some(e=>e.heading.trim()),
      detail:"Add your studies, internship, employment or other relevant experience."},
    {label:"Clarity and document quality",ok:r.summary.length<900&&r.projects.every(p=>p.description.length<=1000),
      detail:"Keep sections concise, accurate and readable. Longer content may create extra pages."},
  ];
}
const tokens=(s:string)=>new Set((s.toLowerCase().match(/[a-z][a-z+#.\d-]{2,}/g)||[]).filter(w=>!new Set([
  "and","the","with","for","that","are","you","from","this","have","will","your","their","using",
  "experience","skills","team","work","strong","role","ability","required","preferred","candidate",
  "knowledge","develop","working","understanding","including","years","responsible","looking","our",
]).has(w)));
export function matchResumeKeywords(r:ResumeData):{found:string[];missing:string[]}{
  const required=[...tokens(r.targetDescription)].slice(0,60);
  const supplied=tokens([r.skills,r.summary,...r.projects.flatMap(p=>[p.heading,p.description,p.subheading]),
    ...r.experience.flatMap(p=>[p.heading,p.description,p.subheading])].join(" "));
  return {found:required.filter(w=>supplied.has(w)),missing:required.filter(w=>!supplied.has(w))};
}
const esc=escapePortfolioHtml;
const textlines=(input:string)=>input.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,14);
function section(items:ResumeItem[],title:string){
  const visible=items.filter(p=>p.heading||p.description);
  return visible.length?'<section class="res-section"><h2>'+title+'</h2>'+visible.map(p=>
    '<div class="entry"><div class="entry-top"><strong>'+esc(p.heading)+'</strong><time>'+esc(p.date)+'</time></div>'+
    (p.subheading?'<div class="entry-sub">'+esc(p.subheading)+'</div>':'')+
    (p.description?'<div class="entry-desc">'+textlines(p.description).map(line=>
      '<p>'+esc(line)+'</p>').join("")+'</div>':'')+'</div>').join("")+'</section>':"";
}
const safeLink=(input:string)=>{
  try{const u=new URL(input.trim());return u.protocol==="https:"&&!u.username&&!u.password?u.href:"";}catch{return "";}
};
/** Standalone printable resume with all user-controlled strings escaped and no external assets. */
export function buildResumeHtml(source:ResumeData):string{
  const r=cleanResume(source);
  const theme=r.style;
  const font=r.typography==="serif"?"Georgia, 'Times New Roman', serif":
    r.typography==="humanist"?"'Trebuchet MS', Verdana, sans-serif":"Arial, Helvetica, sans-serif";
  const accent=theme==="ats"?"#111827":r.accent;
  const pad=r.density==="compact"?"17mm":"20mm";
  const urls=[r.website,r.linkedin].map(safeLink).filter(Boolean);
  const contact=[r.email,r.phone,r.location].filter(Boolean).map(esc);
  for(const link of urls)contact.push('<a href="'+esc(link)+'" rel="noreferrer noopener">'+esc(link.replace(/^https:\/\//,""))+'</a>');
  const sec=(title:string,body:string)=>body?'<section class="res-section"><h2>'+title+'</h2>'+body+'</section>':"";
  const summary=sec("Profile",r.summary?'<p class="summary">'+esc(r.summary)+'</p>':"");
  const skills=sec("Skills",r.skills?'<p>'+esc(r.skills)+'</p>':"");
  const certs=sec("Certifications & Training",r.certifications?textlines(r.certifications).map(x=>'<p>'+esc(x)+'</p>').join(""):"");
  const activities=sec("Activities",r.activities?textlines(r.activities).map(x=>'<p>'+esc(x)+'</p>').join(""):"");
  const klass="style-"+theme;
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>'+
    '<meta name="viewport" content="width=device-width, initial-scale=1"/>'+
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\';">'+
    '<title>'+esc(r.name||"My Resume")+' — Resume</title><style>'+
    '@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:'+font+
    ';background:#e7eaee;color:#202632;font-size:10.4pt;line-height:1.43}'+
    '.page{width:210mm;min-height:297mm;margin:20px auto;padding:'+pad+';background:#fff;box-shadow:0 14px 50px #10233e20}'+
    '.head{border-bottom:2px solid '+accent+';padding-bottom:14px;margin-bottom:20px}h1{font-size:29pt;line-height:1.08;margin:0;letter-spacing:-.035em;color:#141d29}'+
    '.role{font-size:11.5pt;color:'+accent+';font-weight:700;margin-top:7px}.contact{display:flex;flex-wrap:wrap;gap:4px 13px;font-size:9pt;color:#4d5662;margin-top:10px}'+
    '.contact span{overflow-wrap:anywhere}a{color:inherit;text-decoration:none;overflow-wrap:anywhere}h2{font-size:10pt;font-family:Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:'+accent+
    ';margin:0 0 10px;padding-bottom:5px;border-bottom:1px solid #cdd3db}.res-section{margin:0 0 18px;break-inside:auto}'+
    '.entry{margin:0 0 12px;break-inside:avoid}.entry-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px}'+
    '.entry strong{font-size:10.5pt}.entry time{font-size:9pt;color:#64707e;white-space:nowrap}.entry-sub{font-size:9.5pt;color:#56616e;margin:2px 0 4px}'+
    '.entry-desc p,.res-section>p{margin:3px 0;white-space:pre-wrap;overflow-wrap:anywhere}.summary{line-height:1.52}'+
    '.style-modern .head{border-top:5px solid '+accent+';padding-top:18px}.style-modern h1{font-size:30pt}'+
    '.style-editorial h1{font-size:33pt;font-weight:400;letter-spacing:-.04em}.style-editorial .head{border-bottom:1px solid '+accent+'}.style-editorial h2{letter-spacing:.08em;font-size:11pt}'+
    '.style-executive .head{padding-bottom:22px}.style-executive h1{font-size:28pt;letter-spacing:.015em}.style-executive h2{border-left:3px solid '+accent+';padding-left:9px;border-bottom:0}'+
    (r.density==="compact"?'.res-section{margin-bottom:12px}.entry{margin-bottom:8px}.page{font-size:9.8pt}':"")+
    '@media(max-width:850px){.page{width:100%;min-height:0;margin:0 auto;padding:24px;box-shadow:none}.entry-top{flex-wrap:wrap}}'+
    '@media print{html,body{background:#fff}.page{width:auto;min-height:0;margin:0;padding:'+pad+';box-shadow:none}a{text-decoration:none}'+
    'h1,h2,.entry-top{break-after:avoid}.res-section,.entry{break-inside:avoid}}'+
    '</style></head><body><main class="page '+klass+'"><header class="head"><h1>'+esc(r.name||"Your name")+'</h1>'+
    (r.headline?'<div class="role">'+esc(r.headline)+'</div>':'')+
    '<div class="contact">'+contact.map(x=>'<span>'+x+'</span>').join("")+'</div></header>'+
    summary+section(r.experience,"Experience")+section(r.projects,"Selected Projects")+section(r.education,"Education")+
    skills+certs+activities+'</main></body></html>';
}
export function buildResumePlainText(source:ResumeData):string{
  const r=cleanResume(source);
  const lines=[r.name,r.headline,[r.email,r.phone,r.location,r.website,r.linkedin].filter(Boolean).join(" | "),r.summary];
  for(const [heading,items] of [["EXPERIENCE",r.experience],["PROJECTS",r.projects],["EDUCATION",r.education]] as const){
    if(items.length){lines.push("\n"+heading);for(const p of items)lines.push([p.heading,p.subheading,p.date,p.description].filter(Boolean).join("\n"));}
  }
  if(r.skills)lines.push("\nSKILLS\n"+r.skills);
  if(r.certifications)lines.push("\nCERTIFICATIONS\n"+r.certifications);
  if(r.activities)lines.push("\nACTIVITIES\n"+r.activities);
  return lines.filter(Boolean).join("\n\n").slice(0,50000);
}
