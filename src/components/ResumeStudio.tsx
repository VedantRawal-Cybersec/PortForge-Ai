import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Download, ExternalLink, FileText, Plus, Printer, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { LearnerProfile } from "@/lib/profile";
import type { ShowcaseProject } from "@/lib/showcaseProjects";
import {
  buildResumeHtml, buildResumePlainText, getResume, importPortfolioToResume,
  matchResumeKeywords, newResumeItem, resumeGuidance, resumeStyles, saveResume,
  type ResumeData, type ResumeItem,
} from "@/lib/resumeStudio";

type Props = { profile:LearnerProfile; projects:ShowcaseProject[] };
type Collection = "education" | "experience" | "projects";
const labels:Record<Collection,{title:string;heading:string;sub:string;date:string;detail:string}>={
  education:{title:"Education",heading:"Qualification or degree",sub:"Institution / focus",date:"Year or dates",detail:"Coursework, achievements and relevant learning"},
  experience:{title:"Experience",heading:"Role or position",sub:"Organization",date:"Dates",detail:"Contributions and real outcomes, one point per line"},
  projects:{title:"Projects",heading:"Project title",sub:"Technologies / your role / project URL",date:"Date (optional)",detail:"What you built, tested and actually achieved"},
};
function exportBlob(body:string,filename:string,type:string){
  const uri=URL.createObjectURL(new Blob([body],{type}));
  const link=document.createElement("a");link.href=uri;link.download=filename;
  document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(uri),2000);
}
export default function ResumeStudio({profile,projects}:Props){
  const [resume,setResume]=useState<ResumeData>(getResume);
  const [active,setActive]=useState<"content"|"design"|"target">("content");
  const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
  const html=useMemo(()=>buildResumeHtml(resume),[resume]);
  const checks=useMemo(()=>resumeGuidance(resume),[resume]);
  const matched=useMemo(()=>matchResumeKeywords(resume),[resume]);
  const fulfilled=checks.filter(c=>c.ok).length;
  useEffect(()=>{
    const timer=window.setTimeout(()=>{try{saveResume(resume);}catch{/* Browser denies persistence; manual export remains available. */}},650);
    return()=>window.clearTimeout(timer);
  },[resume]);
  function field<K extends keyof ResumeData>(key:K,value:ResumeData[K]){
    setResume(old=>({...old,[key]:value}));
  }
  function editEntry(section:Collection,index:number,patch:Partial<ResumeItem>){
    setResume(old=>({...old,[section]:old[section].map((item,i)=>i===index?{...item,...patch}:item)}));
  }
  function addEntry(section:Collection){
    setResume(old=>({...old,[section]:old[section].length>=24?old[section]:[...old[section],newResumeItem()]}));
  }
  function removeEntry(section:Collection,index:number){
    setResume(old=>({...old,[section]:old[section].filter((_,i)=>i!==index)}));
  }
  function importWork(){
    setResume(old=>importPortfolioToResume(old,profile,projects));
    toast.success("Imported available profile fields and new project case studies. Existing edits were preserved.");
  }
  function openPrint(){
    const url=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));
    const tab=window.open(url,"_blank","noopener,noreferrer");
    if(!tab){toast.error("Your browser blocked the printable tab. Download the HTML resume instead.");}
    else toast.info("In the printable tab, use Ctrl/⌘ + P and select Save as PDF.");
    window.setTimeout(()=>URL.revokeObjectURL(url),120000);
  }
  const inp=(label:string,key:keyof ResumeData,placeholder:string,kind:"input"|"textarea"="input")=>{
    const value=resume[key];
    if(typeof value!=="string")return null;
    return <label key={String(key)} className="block text-sm font-semibold space-y-2">
      <span>{label}</span>
      {kind==="textarea"?<textarea rows={key==="targetDescription"?6:3} value={value}
        maxLength={key==="targetDescription"?9000:1400} placeholder={placeholder}
        onChange={e=>field(key,e.target.value as never)} className="w-full border border-border bg-background rounded-xl p-3 font-normal text-sm leading-relaxed"/>:
        <input value={value} maxLength={500} type={key==="email"?"email":"text"} placeholder={placeholder}
          onChange={e=>field(key,e.target.value as never)} className="w-full border border-border bg-background rounded-xl p-3 font-normal text-sm"/>}
    </label>;
  };
  const group=(key:Collection)=>{
    const l=labels[key];
    return <div key={key} className="space-y-3 border-t border-border pt-5">
      <div className="flex gap-2 justify-between items-center">
        <h3 className="font-bold text-lg">{l.title}</h3>
        <button type="button" disabled={resume[key].length>=24} onClick={()=>addEntry(key)}
          className="border border-border rounded-lg px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40">
          <Plus size={14}/> Add entry
        </button>
      </div>
      {resume[key].length===0&&<p className="text-sm text-muted-foreground">Nothing added yet. This section is omitted from the exported resume.</p>}
      {resume[key].map((entry,i)=><div key={entry.id} className="rounded-xl border border-border bg-surface-2/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <strong className="text-xs text-muted-foreground">{l.title} {i+1}</strong>
          <button type="button" onClick={()=>removeEntry(key,i)} aria-label={"Remove "+l.title+" entry "+(i+1)}
            className="rounded-md border border-border p-2 text-led-alert"><Trash2 size={14}/></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {(["heading","subheading","date"] as const).map((field,iField)=><label key={field} className="space-y-1 text-xs font-medium">
            <span>{[l.heading,l.sub,l.date][iField]}</span>
            <input value={entry[field]} maxLength={field==="subheading"?180:140}
              onChange={e=>editEntry(key,i,{[field]:e.target.value})}
              className="block bg-background border border-border rounded-lg p-2.5 w-full text-sm"/>
          </label>)}
        </div>
        <label className="block text-xs font-semibold space-y-2"><span>{l.detail}</span>
          <textarea value={entry.description} maxLength={2500} rows={3}
            onChange={e=>editEntry(key,i,{description:e.target.value})}
            placeholder="Specific actions, evidence and outcomes only; do not invent statistics."
            className="w-full border border-border rounded-lg bg-background p-3 text-sm font-normal"/>
        </label>
      </div>)}
    </div>;
  };
  return <section className="panel p-4 sm:p-6 md:p-8 space-y-6" aria-labelledby="resume-studio-title">
    <div className="flex gap-4 flex-wrap items-start justify-between">
      <div className="space-y-2 max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-led-cyan">RÉSUMÉ STUDIO · PRIVATE BY DEFAULT</p>
        <h2 id="resume-studio-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">Design a résumé you're ready to send.</h2>
        <p className="text-sm text-muted-foreground">Four professional layouts with real content editing, print styling and job-specific guidance. Import your existing work; nothing is invented or published.</p>
      </div>
      <button type="button" onClick={importWork} className="inline-flex items-center gap-2 rounded-xl bg-led-cyan text-background px-4 py-3 font-semibold text-sm">
        <Sparkles size={16}/> Bring in my projects
      </button>
    </div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.07fr)] gap-6">
      <div className="space-y-5 min-w-0">
        <div className="grid grid-cols-3 rounded-xl border border-border bg-surface-2 p-1" role="tablist" aria-label="Resume editor sections">
          {([["content","Content"],["design","Templates"],["target","Job match"]] as const).map(([id,label])=>
            <button role="tab" key={id} type="button" aria-selected={active===id} onClick={()=>setActive(id)}
              className={"py-3 rounded-lg text-xs sm:text-sm font-bold "+(active===id?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground")}>{label}</button>)}
        </div>
        {active==="content"&&<div role="tabpanel" className="space-y-5">
          <p className="text-sm text-muted-foreground">Start with your real contact details. For a student résumé, projects can matter more than employment history.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {inp("Full name","name","Your name")}
            {inp("Target role / headline","headline","Junior Software Engineer")}
            {inp("Email","email","name@example.com")}
            {inp("Phone (optional)","phone","+91 ...")}
            {inp("Location (optional)","location","Bengaluru, India")}
            {inp("Portfolio website","website","https://...")}
            {inp("LinkedIn URL","linkedin","https://linkedin.com/in/...")}
          </div>
          {inp("Professional summary","summary","Who you are, which technologies you actually use, and what you have built.","textarea")}
          {inp("Skills (comma separated)","skills","JavaScript, SQL, Git, testing","textarea")}
          {group("projects")}{group("experience")}{group("education")}
          {inp("Training and certifications (one per line)","certifications","Only qualifications you genuinely earned.","textarea")}
          {inp("Leadership, volunteering, activities (optional)","activities","Relevant involvement or achievements.","textarea")}
        </div>}
        {active==="design"&&<div role="tabpanel" className="space-y-5">
          <div role="group" aria-label="Resume template" className="grid sm:grid-cols-2 gap-3">
            {resumeStyles.map(style=><button key={style.id} type="button" onClick={()=>field("style",style.id)}
              aria-pressed={resume.style===style.id}
              className={"text-left rounded-xl border p-4 "+(resume.style===style.id?"border-led-cyan bg-led-cyan/10":"border-border bg-surface-2/40")}>
              <span className={"block h-16 rounded-lg mb-3 border p-2 "+(style.id==="editorial"?"bg-[#faf5ee]":style.id==="executive"?"bg-[#f1f3f6]":"bg-white")}>
                <span className={"block h-2 w-20 rounded-sm "+(style.id==="ats"?"bg-[#1f2937]":style.id==="editorial"?"bg-[#9a3412]":"bg-[#1d4ed8]")}/>
                <span className="block h-1 w-28 bg-slate-300 rounded-sm mt-2"/><span className="block h-1 w-20 bg-slate-200 mt-2 rounded-sm"/>
              </span>
              <strong className="block text-sm">{style.title}</strong>
              <span className="text-xs text-muted-foreground">{style.description}</span>
            </button>)}
          </div>
          <label className="block text-sm font-bold space-y-2"><span>Typography</span>
            <select value={resume.typography} onChange={e=>field("typography",e.target.value as ResumeData["typography"])}
              className="w-full border border-border bg-background rounded-lg p-3">
              <option value="sans">Modern sans · Arial</option><option value="serif">Editorial serif · Georgia</option>
              <option value="humanist">Humanist · Trebuchet</option>
            </select>
          </label>
          <label className="block text-sm font-bold space-y-2"><span>Spacing</span>
            <select value={resume.density} onChange={e=>field("density",e.target.value as ResumeData["density"])}
              className="w-full border border-border bg-background rounded-lg p-3">
              <option value="comfortable">Comfortable · more breathing room</option>
              <option value="compact">Compact · fit more details</option>
            </select>
          </label>
          <div className="space-y-2"><p className="text-sm font-bold">Professional accent</p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Resume accent color">
              {["#0f766e","#1d4ed8","#6d28d9","#9a3412","#111827"].map(color=>
                <button type="button" key={color} onClick={()=>field("accent",color)} aria-label={"Accent "+color}
                  aria-pressed={resume.accent===color} style={{background:color}}
                  className={"size-11 rounded-xl "+(resume.accent===color?"ring-2 ring-offset-2 ring-led-cyan ring-offset-background":"")}/>)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Essential ATS uses a monochrome, single-column format. These layouts are designed for readability but no template guarantees acceptance by applicant tracking systems.</p>
        </div>}
        {active==="target"&&<div role="tabpanel" className="space-y-5">
          {inp("Role you are applying for","targetRole","Frontend Developer")}
          {inp("Paste job description (kept on this device)","targetDescription","Job responsibilities and required skills…","textarea")}
          {resume.targetDescription.trim()?<div className="space-y-3">
            <p className="text-sm font-semibold">Literal keyword comparison — not a hiring prediction or ATS score</p>
            <p className="text-xs text-muted-foreground">{matched.found.length} mentioned · {matched.missing.length} not present in your current draft. These words are simply extracted from your pasted description, not independently assessed skills.</p>
            <div className="flex flex-wrap gap-2">{matched.found.slice(0,25).map(w=><span key={w} className="chip chip-green">{w}</span>)}</div>
            <h3 className="font-semibold text-sm">Relevant words to review</h3>
            <div className="flex flex-wrap gap-2">{matched.missing.slice(0,30).map(w=><span key={w} className="chip">{w}</span>)}</div>
            <p className="text-xs text-muted-foreground">Only add a skill or responsibility if it accurately reflects your experience. Keyword stuffing reduces credibility.</p>
          </div>:<p className="text-sm text-muted-foreground">Paste a real job description for a simple, transparent comparison. PortForge will not invent missing qualifications.</p>}
        </div>}
        <div className="border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between"><h3 className="font-bold text-sm">Résumé checklist</h3>
            <span className="text-xs text-led-cyan">{fulfilled}/{checks.length} completed</span></div>
          {checks.map(c=><div key={c.label} className="flex gap-2 items-start">
            {c.ok?<CheckCircle2 size={16} className="text-led-green shrink-0 mt-0.5"/>:<Circle size={16} className="text-muted-foreground shrink-0 mt-0.5"/>}
            <div><p className="text-sm font-medium">{c.label}</p>{!c.ok&&<p className="text-xs text-muted-foreground">{c.detail}</p>}</div>
          </div>)}
          <p className="text-xs text-muted-foreground">Checklist measures form completeness and practical readability signals, not employability or ATS approval.</p>
        </div>
      </div>
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2"><div>
          <p className="font-bold text-sm">Print-ready preview</p>
          <p className="text-xs text-muted-foreground">A4 layout · changes update as you type</p></div>
          <div className="flex rounded-lg overflow-hidden border border-border" role="group" aria-label="Resume preview width">
            <button type="button" aria-pressed={device==="desktop"} onClick={()=>setDevice("desktop")} className={"px-3 py-2 text-xs "+(device==="desktop"?"bg-led-cyan text-background":"bg-surface-2")}>Full</button>
            <button type="button" aria-pressed={device==="mobile"} onClick={()=>setDevice("mobile")} className={"px-3 py-2 text-xs "+(device==="mobile"?"bg-led-cyan text-background":"bg-surface-2")}>Mobile</button>
          </div></div>
        <div className="rounded-xl bg-surface-3/50 border border-border overflow-x-auto p-2 sm:p-4 flex justify-center">
          <iframe title="Live preview of editable resume" sandbox="" referrerPolicy="no-referrer" srcDoc={html}
            style={{width:device==="mobile"?"360px":"100%",maxWidth:device==="mobile"?"360px":"100%",height:device==="mobile"?"510px":"690px"}}
            className="bg-white rounded-md shadow-xl border border-border"/>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <button type="button" onClick={openPrint} className="rounded-xl bg-foreground text-background px-4 py-3 text-sm font-semibold flex justify-center gap-2 items-center">
            <Printer size={16}/> Print / Save PDF
          </button>
          <button type="button" onClick={()=>exportBlob(html,"portforge-resume-"+resume.style+".html","text/html;charset=utf-8")}
            className="rounded-xl border border-border px-4 py-3 text-sm font-semibold flex justify-center items-center gap-2">
            <Download size={16}/> Download HTML
          </button>
          <button type="button" onClick={()=>exportBlob(buildResumePlainText(resume),"portforge-resume.txt","text/plain;charset=utf-8")}
            className="rounded-xl border border-border px-4 py-3 text-sm font-semibold sm:col-span-2 flex justify-center items-center gap-2">
            <FileText size={16}/> Download plain text
          </button>
        </div>
        <p className="text-xs text-muted-foreground">The PDF option opens a printable tab. In that tab choose Print → Save as PDF. The preview does not publish your contact details. Exported HTML contains no third-party scripts, fonts or network calls.</p>
        <p className="text-xs text-muted-foreground flex gap-1 items-start"><ExternalLink size={13} className="shrink-0 mt-0.5"/> Actual generated PDF appearance and ATS parsing depend on the browser and recruiting software. Review the saved file before submitting.</p>
      </div>
    </div>
  </section>;
}
