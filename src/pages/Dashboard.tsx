import { useEffect, useMemo, useState } from "react";
import { readKnowledgeSessions, knowledgeSummary } from "@/lib/knowledgeChecks";
import {trackCheckSummary} from "@/lib/trackChecks";
import {getProofSummary} from "@/lib/proofEngine";
import {learningActions,reviewOverview} from "@/lib/masteryJourney";
import {readRealityResults} from "@/lib/roleReality";
import { Link } from "react-router-dom";
import { BookOpen, BrainCircuit, Briefcase, Code2, Mic, Target, ArrowRight, Save, CheckCircle2, ChartNoAxesCombined, Trophy, FlaskConical, MessageSquareText, ShieldCheck } from "lucide-react";
import { getProfile, saveProfile, type LearnerProfile } from "@/lib/profile";
import { getLearning, tracks, totalLessons } from "@/lib/academy";
import { getPortfolio } from "@/lib/portfolio";
import { getCareerPlan } from "@/lib/careerPlans";
import { exercises, getPractice } from "@/lib/practice";
const actions = [
  {to:"/learn",title:"Learn something new",desc:"Short lessons from the basics",icon:BookOpen},
  {to:"/practice",title:"Independent practice",desc:"Solve challenges and run repeatable tests",icon:FlaskConical},
  {to:"/project-interview",title:"Project interview",desc:"Explain code you actually wrote",icon:MessageSquareText},
  {to:"/skill-test",title:"Test my skills",desc:"Get feedback on an answer",icon:BrainCircuit},
  {to:"/workspace",title:"Build a project",desc:"Practice code and review your work",icon:Code2},
  {to:"/interview",title:"Practice interviews",desc:"Prepare with spoken or typed answers",icon:Mic},
  {to:"/oracle",title:"Plan a career",desc:"Explore skills and target roles",icon:Target},
  {to:"/portfolio",title:"My portfolio",desc:"Review my practice and projects",icon:Briefcase},
  {to:"/skill-dna",title:"Skill DNA",desc:"Explore progress across learning tracks",icon:ChartNoAxesCombined},
  {to:"/missions",title:"Career Missions",desc:"Follow hands-on project challenges",icon:Trophy},
  {to:"/role-lab",title:"Try a real career",desc:"Explore six guided workplace scenarios",icon:Target},
  {to:"/proof",title:"Proof of work",desc:"See exactly which outcomes you have demonstrated",icon:ShieldCheck}
];
export default function Dashboard(){
  const [profile,setProfile]=useState<LearnerProfile>(getProfile);
  const [saved,setSaved]=useState(false);
  const [progress,setProgress]=useState(()=>getLearning());
  const [entries,setEntries]=useState(()=>getPortfolio());
  const [career,setCareer]=useState(getCareerPlan);
  const [practice,setPractice]=useState(getPractice);
  useEffect(()=>{
    const sync=()=>{setProgress(getLearning());setEntries(getPortfolio());setCareer(getCareerPlan());setPractice(getPractice());};
    window.addEventListener("portforge:progress",sync);window.addEventListener("portfolio:update",sync);window.addEventListener("portforge:career",sync);window.addEventListener("portforge:practice",sync);
    return ()=>{window.removeEventListener("portforge:progress",sync);window.removeEventListener("portfolio:update",sync);window.removeEventListener("portforge:career",sync);window.removeEventListener("portforge:practice",sync);};
  },[]);
  const completed=useMemo(()=>new Set(progress.passed).size,[progress.passed]);
  const recommended=tracks.find(t=>t.id===profile.focus)||tracks[0];
  const done=recommended.lessons.filter(l=>progress.passed.includes(l.id)).length;
  const next=recommended.lessons.find(l=>!progress.passed.includes(l.id));
  const submit=(event:React.FormEvent)=>{event.preventDefault();saveProfile(profile);setSaved(true);};
  const update=(key:keyof LearnerProfile,value:string)=>{setProfile(prev=>({...prev,[key]:value}));setSaved(false);};
  const knowledge=knowledgeSummary(readKnowledgeSessions());
  const trackChecks=trackCheckSummary();
  const proof=getProofSummary();
  const roleCount=readRealityResults().length;
  const reviewed=reviewOverview();
  const nextActions=learningActions(profile.focus);
  return <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
    <header className="max-w-4xl space-y-3">
      <div className="chip chip-cyan">MY LEARNING SPACE</div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{profile.name.trim()?"Welcome back, "+profile.name.trim()+".":"Your next step starts here."}</h1>
      <p className="text-muted-foreground text-lg leading-relaxed">Pick a direction, learn one concept, practice it and turn your work into a portfolio. You can start without experience.</p>
    </header>
    <section className="panel p-5 sm:p-6 space-y-4 border-led-cyan/25" aria-labelledby="dashboard-next-step">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono tracking-widest text-led-cyan">YOUR NEXT REAL STEP</span>
          <h2 id="dashboard-next-step" className="text-2xl font-bold mt-2">
            {proof.lessons===0?"Explore a technical career before choosing it":
              proof.testedExercises===0?"Turn your learning into tested practical work":
              proof.authoredProjects===0?"Document the project you genuinely built":
              "Explain and present your practical work"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {proof.lessons===0?"Try a realistic workplace scenario to discover what the role involves.":
              proof.testedExercises===0?"Run a small code exercise with real sample tests rather than relying on multiple-choice scores.":
              proof.authoredProjects===0?"Once you have completed and tested a real project, write a case study about the work.":
              "Review your evidence and practise discussing your actual design decisions."}
          </p>
        </div>
        <Link to={proof.lessons===0?"/role-lab":proof.testedExercises===0?"/practice":proof.authoredProjects===0?"/portfolio":"/proof"}
          className="rounded-lg bg-foreground text-background px-5 py-3 text-sm font-bold whitespace-nowrap inline-flex gap-2 items-center">
          Continue my journey <ArrowRight size={16}/>
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-border p-3"><strong className="text-lg block">{proof.testedExercises}</strong> Exercises with all recorded sample tests passed</div>
        <div className="rounded-lg border border-border p-3"><strong className="text-lg block">{roleCount}</strong> Fictional workplace simulations completed</div>
        <div className="rounded-lg border border-border p-3"><strong className="text-lg block">{proof.authoredProjects}</strong> User-authored project case studies</div>
      </div>
      <Link className="text-led-cyan text-sm font-semibold inline-flex items-center gap-2" to="/proof">
        View my evidence and its limitations <ArrowRight size={15}/>
      </Link>
    </section>
    <section className="panel p-5 sm:p-6 space-y-4" aria-labelledby="dashboard-study-plan">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div><h2 id="dashboard-study-plan" className="text-xl font-bold">Your practical study plan</h2>
          <p className="text-xs text-muted-foreground mt-1">{reviewed.due} concepts ready to review · {reviewed.scheduled} future reviews. Actions derive from your local learning and practice, not AI-generated mastery claims.</p></div>
        <Link to="/learn" className="text-sm text-led-cyan font-bold">Open academy <ArrowRight size={15} className="inline"/></Link>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {nextActions.map(action=><Link to={action.path} key={action.path}
          className="border border-border hover:border-led-cyan/50 rounded-xl p-4 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-mono text-led-cyan">{action.kind}</span>
          <h3 className="font-bold text-sm">{action.title}</h3>
          <p className="text-xs text-muted-foreground">{action.reason}</p>
          <span className="text-xs text-led-cyan">Continue <ArrowRight size={13} className="inline"/></span>
        </Link>)}
      </div>
    </section>
    <section className="panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-[10px] font-mono tracking-widest text-led-cyan">OBJECTIVE PRACTICE ACROSS ALL TRACKS</p>
        <h2 className="text-xl font-bold mt-2">{trackChecks.attempted} completed quick checks · {trackChecks.distinctTracks} learning tracks</h2>
        <p className="text-sm text-muted-foreground mt-2">{trackChecks.attempted
          ?"Average correct answers: "+trackChecks.average+"% across your saved three-question attempts. This is not a professional skill rating."
          :"Take a short answer-key check in any of the 69 topics to identify what to learn next."}</p>
      </div>
      <Link to="/skill-test" className="rounded-xl bg-foreground text-background px-4 py-3 font-bold text-sm whitespace-nowrap">
        Check a topic <ArrowRight size={16} className="inline ml-1"/>
      </Link>
    </section>
    <section className="panel p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-bold">Knowledge checks and your next action</h2>
          <p className="text-xs text-muted-foreground mt-1">Practice answers checked locally, not a verified professional qualification.</p></div>
        <Link to="/skill-test" className="rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-bold">Start a quick check</Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {knowledge.map(k=><div key={k.topic} className="border border-border rounded-xl p-3">
          <strong className="text-sm">{k.title}</strong>
          <p className="text-xs text-muted-foreground mt-1">{k.attempts?k.correct+" / "+k.attempts+" locally correct":"Not started yet"}</p>
          <p className="text-xs text-led-cyan mt-1">{k.recommended}</p>
        </div>)}
      </div>
    </section>
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
          <Link to={"/learn?track="+encodeURIComponent(recommended.id)} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg mt-6 bg-foreground text-background font-bold">Continue learning <ArrowRight className="size-4"/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 sm:p-7 border-t border-border">
          <div><div className="text-3xl font-extrabold">{completed}/{totalLessons()}</div><div className="text-sm text-muted-foreground mt-1">Lessons completed</div></div>
          <div><div className="text-3xl font-extrabold">{entries.length}</div><div className="text-sm text-muted-foreground mt-1">Portfolio activities</div></div>
        </div>
        <p className="text-xs text-muted-foreground px-7 pb-5 flex items-center gap-2"><CheckCircle2 className="size-4"/> Real activity only. No simulated achievements.</p>
      </section>
    </div>
    <section className="grid lg:grid-cols-2 gap-5">
      <div className="panel p-5 sm:p-7">
        <p className="font-mono text-xs tracking-widest text-led-cyan">INDEPENDENT WORK</p>
        <h2 className="text-2xl font-bold mt-3">Move from learning to building.</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Your practice test results are self-tracked evidence, not certified credentials.</p>
        <div className="text-3xl font-bold mt-5">{practice.filter(x=>x.total>0&&x.total===x.passed).length}/{exercises.length}<span className="text-sm text-muted-foreground font-normal ml-2">challenges passed</span></div>
        <Link to="/practice" className="inline-flex gap-2 mt-5 items-center text-led-cyan text-sm font-semibold">Continue independent practice <ArrowRight className="size-4"/></Link>
      </div>
      <div className="panel p-5 sm:p-7">
        <p className="font-mono text-xs tracking-widest text-led-cyan">YOUR CAREER DIRECTION</p>
        <h2 className="text-2xl font-bold mt-3">{career?.role||"Explore a career path"}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{career?.overview||"Choose a role and build a milestone roadmap at your own pace."}</p>
        {career&&<p className="text-sm font-semibold mt-4">{career.checked.length}/{career.steps.length} milestones self-tracked</p>}
        <Link to="/oracle" className="inline-flex gap-2 mt-5 items-center text-led-cyan text-sm font-semibold">{career?"Continue my roadmap":"Explore career paths"} <ArrowRight className="size-4"/></Link>
      </div>
    </section>
    <section className="space-y-5">
      <div><h2 className="text-2xl md:text-3xl font-bold">Explore your workspace</h2><p className="text-muted-foreground mt-2">Everything connects to your learning journey.</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{actions.map(({to,title,desc,icon:Icon})=><Link to={to} key={to} className="panel p-5 group hover:border-led-cyan/50 transition-all hover:-translate-y-1"><span className="size-11 bg-led-cyan/10 rounded-xl flex items-center justify-center mb-5"><Icon className="size-5 text-led-cyan"/></span><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-muted-foreground mt-2">{desc}</p><span className="inline-flex gap-2 items-center text-led-cyan text-sm mt-5">Open <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform"/></span></Link>)}</div>
    </section>
  </div>;
}
