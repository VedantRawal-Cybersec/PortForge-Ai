import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, BrainCircuit, Briefcase, Code2, Mic, Target, ArrowRight, Save, CheckCircle2, ChartNoAxesCombined, Trophy } from "lucide-react";
import { getProfile, saveProfile, type LearnerProfile } from "@/lib/profile";
import { getLearning, tracks, totalLessons } from "@/lib/academy";
import { getPortfolio } from "@/lib/portfolio";
const actions = [
  {to:"/learn",title:"Learn something new",desc:"Short lessons from the basics",icon:BookOpen},
  {to:"/skill-test",title:"Test my skills",desc:"Get feedback on an answer",icon:BrainCircuit},
  {to:"/workspace",title:"Build a project",desc:"Practice code and review your work",icon:Code2},
  {to:"/interview",title:"Practice interviews",desc:"Prepare with spoken or typed answers",icon:Mic},
  {to:"/oracle",title:"Plan a career",desc:"Explore skills and target roles",icon:Target},
  {to:"/portfolio",title:"My portfolio",desc:"Review my practice and projects",icon:Briefcase},
  {to:"/skill-dna",title:"Skill DNA",desc:"Explore progress across learning tracks",icon:ChartNoAxesCombined},
  {to:"/missions",title:"Career Missions",desc:"Follow hands-on project challenges",icon:Trophy}
];
export default function Dashboard(){
  const [profile,setProfile]=useState<LearnerProfile>(getProfile);
  const [saved,setSaved]=useState(false);
  const [progress,setProgress]=useState(()=>getLearning());
  const [entries,setEntries]=useState(()=>getPortfolio());
  useEffect(()=>{
    const sync=()=>{setProgress(getLearning());setEntries(getPortfolio());};
    window.addEventListener("portforge:progress",sync);window.addEventListener("portfolio:update",sync);
    return ()=>{window.removeEventListener("portforge:progress",sync);window.removeEventListener("portfolio:update",sync);};
  },[]);
  const completed=useMemo(()=>new Set(progress.passed).size,[progress.passed]);
  const recommended=tracks.find(t=>t.id===profile.focus)||tracks[0];
  const done=recommended.lessons.filter(l=>progress.passed.includes(l.id)).length;
  const next=recommended.lessons.find(l=>!progress.passed.includes(l.id));
  const submit=(event:React.FormEvent)=>{event.preventDefault();saveProfile(profile);setSaved(true);};
  const update=(key:keyof LearnerProfile,value:string)=>{setProfile(prev=>({...prev,[key]:value}));setSaved(false);};
  return <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
    <header className="max-w-4xl space-y-3">
      <div className="chip chip-cyan">MY LEARNING SPACE</div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{profile.name.trim()?"Welcome back, "+profile.name.trim()+".":"Your next step starts here."}</h1>
      <p className="text-muted-foreground text-lg leading-relaxed">Pick a direction, learn one concept, practice it and turn your work into a portfolio. You can start without experience.</p>
    </header>
    <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
      <section className="panel p-5 sm:p-7">
        <h2 className="text-2xl font-bold mb-2">Personalize your journey</h2>
        <p className="text-sm text-muted-foreground mb-6">Your answers stay in this browser until account-backed sync is available.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="block text-sm font-medium mb-2">What should we call you? <span className="text-muted-foreground">(optional)</span></span><input maxLength={55} autoComplete="nickname" value={profile.name} onChange={e=>update("name",e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-led-cyan" placeholder="Your name"/></label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="block text-sm font-medium mb-2">Your current level</span><select value={profile.level} onChange={e=>update("level",e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3"><option value="new">Brand new — guide me</option><option value="learning">Some knowledge</option><option value="experienced">Experienced</option></select></label>
            <label className="block"><span className="block text-sm font-medium mb-2">My goal</span><select value={profile.goal} onChange={e=>update("goal",e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3"><option value="explore">Explore different skills</option><option value="projects">Build real projects</option><option value="career">Get career ready</option><option value="upskill">Advance in my field</option></select></label>
          </div>
          <label className="block"><span className="block text-sm font-medium mb-2">Start with a topic</span><select value={profile.focus} onChange={e=>update("focus",e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3">{tracks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
          <div className="flex items-center justify-between gap-3"><span aria-live="polite" className="text-xs text-led-green">{saved?"Preferences saved locally.":""}</span><button type="submit" className="inline-flex items-center gap-2 px-5 py-3 bg-led-cyan text-background font-semibold rounded-lg"><Save className="size-4"/> Save preferences</button></div>
        </form>
      </section>
      <section className="panel overflow-hidden">
        <div className="p-5 sm:p-7 bg-gradient-to-br from-led-cyan/10 via-led-violet/5 to-transparent">
          <p className="font-mono text-xs text-led-cyan tracking-widest">RECOMMENDED NEXT STEP</p>
          <h2 className="text-2xl font-bold mt-4">{next?next.title:"Your selected track is complete!"}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{next?next.summary:"Try another track or use a skill test to practice your knowledge."}</p>
          <div className="mt-6 flex justify-between text-sm"><span>{recommended.name}</span><span>{done} of {recommended.lessons.length}</span></div>
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden mt-2"><div className="h-full bg-led-cyan rounded-full" style={{width:(done/recommended.lessons.length*100)+"%"}}/></div>
          <Link to="/learn" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg mt-6 bg-foreground text-background font-bold">Continue learning <ArrowRight className="size-4"/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:p-7 border-t border-border">
          <div><div className="text-3xl font-extrabold">{completed}/{totalLessons()}</div><div className="text-sm text-muted-foreground mt-1">Lessons completed</div></div>
          <div><div className="text-3xl font-extrabold">{entries.length}</div><div className="text-sm text-muted-foreground mt-1">Portfolio activities</div></div>
        </div>
        <p className="text-xs text-muted-foreground px-7 pb-5 flex items-center gap-2"><CheckCircle2 className="size-4"/> Real activity only. No simulated achievements.</p>
      </section>
    </div>
    <section className="space-y-5">
      <div><h2 className="text-2xl md:text-3xl font-bold">Explore your workspace</h2><p className="text-muted-foreground mt-2">Everything connects to your learning journey.</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{actions.map(({to,title,desc,icon:Icon})=><Link to={to} key={to} className="panel p-5 group hover:border-led-cyan/50 transition-all hover:-translate-y-1"><span className="size-11 bg-led-cyan/10 rounded-xl flex items-center justify-center mb-5"><Icon className="size-5 text-led-cyan"/></span><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-muted-foreground mt-2">{desc}</p><span className="inline-flex gap-2 items-center text-led-cyan text-sm mt-5">Open <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform"/></span></Link>)}</div>
    </section>
  </div>;
}
