import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, AudioLines, BadgeCheck, BookOpen, BriefcaseBusiness,
  ChevronRight, Code2, Compass, FileCode2, Layers3, Mic2,
  MousePointer2, ShieldCheck, Sparkles, WandSparkles,
} from "lucide-react";

const tools = [
  {
    id: "01", title: "Skill Test", route: "/skill-test", icon: BadgeCheck,
    eyebrow: "Discover what you know", color: "cyan",
    desc: "Answer a focused question. Understand what is strong, what needs work, and what to practise next.",
    heading: "Understand your strengths.",
    detail: "Choose any topic, write your own answer and receive structured, clearly labelled AI feedback.",
    metrics: ["Clear evaluation rubric", "Specific improvement steps", "Save your progress"],
  },
  {
    id: "02", title: "Interview", route: "/interview", icon: Mic2,
    eyebrow: "Build your confidence", color: "violet",
    desc: "Practise real interview questions at your pace with voice or typing — without pressure.",
    heading: "Get comfortable explaining your work.",
    detail: "Listen to a question, respond by voice or text, and decide when you are ready to continue.",
    metrics: ["Voice and text", "Review each response", "Helpful follow-ups"],
  },
  {
    id: "03", title: "Workspace", route: "/workspace", icon: FileCode2,
    eyebrow: "Make something real", color: "cyan",
    desc: "Write code, run isolated JavaScript examples, improve your approach and save your drafts.",
    heading: "Make progress, not just plans.",
    detail: "Create a practice project in your chosen language and review the quality of your solution.",
    metrics: ["Draft autosave", "JavaScript sandbox", "Advisory AI reviews"],
  },
  {
    id: "04", title: "Oracle", route: "/oracle", icon: Compass,
    eyebrow: "Find your direction", color: "amber",
    desc: "Choose a career path, break it into achievable steps, and track the milestones you finish.",
    heading: "Know exactly what to learn next.",
    detail: "Start with a curated roadmap or request an AI-assisted plan for your target career.",
    metrics: ["Actionable milestones", "Track real progress", "Export your roadmap"],
  },
  {
    id: "05", title: "Portfolio", route: "/portfolio", icon: BriefcaseBusiness,
    eyebrow: "Show your journey", color: "green",
    desc: "Bring your work, assessments and projects together in a carefully presented personal portfolio.",
    heading: "Turn your effort into a story.",
    detail: "Choose a visual theme, preview your personal portfolio and download a standalone HTML website.",
    metrics: ["Beautiful layouts", "Local HTML export", "Your data, your control"],
  },
] as const;

export default function Landing() {
  const [active, setActive] = useState(0);
  const selected = tools[active];

  return (
    <div className="pf-home">
      <section className="pf-hero">
        <div className="pf-hero-light" aria-hidden="true"/>
        <div className="pf-hero-grid" aria-hidden="true"/>
        <div className="pf-shell pf-hero-layout">
          <div className="pf-hero-copy">
            <p className="pf-eyebrow"><span className="pf-signal" aria-hidden="true"/> YOUR WORK. YOUR POTENTIAL. <span className="pf-eyebrow-line"/></p>
            <h1>Don't just learn.<span>Show what you can do<span className="pf-period">.</span></span></h1>
            <p className="pf-hero-description">
              A more useful way to grow your skills, practise interviews, build real projects
              and turn what you've learned into a portfolio worth sharing.
            </p>
            <div className="pf-hero-actions">
              <Link className="pf-primary-action" to="/dashboard">Start building your future <ArrowRight size={18}/></Link>
              <Link className="pf-secondary-action" to="/portfolio">Explore Portfolio Studio <ChevronRight size={17}/></Link>
            </div>
            <div className="pf-hero-reassurance">
              <span><ShieldCheck size={16}/> Start free, no account required for local practice</span>
              <span><MousePointer2 size={15}/> Your first step, your pace</span>
            </div>
          </div>

          <div className="pf-showcase" aria-label="Interactive preview of PortForge tools">
            <div className="pf-showcase-header"><span className="pf-window-dots" aria-hidden="true"><i/><i/><i/></span><span>PORTFORGE / YOUR WORKSPACE</span><span className="pf-preview-status">INTERACTIVE PREVIEW</span></div>
            <div className="pf-showcase-body">
              <div className="pf-preview-tabs" role="tablist" aria-label="Preview a core tool">
                {tools.map((tool, i) => {
                  const Icon = tool.icon;
                  return <button key={tool.id} type="button" role="tab" aria-selected={active === i} tabIndex={active === i ? 0 : -1}
                    className={active === i ? "pf-preview-tab pf-preview-tab-active" : "pf-preview-tab"} onClick={() => setActive(i)}>
                    <Icon size={15}/><span>{tool.title}</span>
                  </button>;
                })}
              </div>
              <div className="pf-showcase-stage" role="tabpanel">
                <div className="pf-stage-topline"><span>WORKSPACE / {selected.id}</span><span><span className="pf-stage-star">✦</span> YOUR NEXT STEP</span></div>
                <div className="pf-stage-icon"><selected.icon size={31}/></div>
                <span className="pf-stage-kicker">{selected.eyebrow}</span>
                <h2 key={selected.id}>{selected.heading}</h2>
                <p>{selected.detail}</p>
                <div className="pf-stage-highlights">
                  {selected.metrics.map(item => <span key={item}><BadgeCheck size={14}/>{item}</span>)}
                </div>
                <Link to={selected.route} className="pf-stage-cta">Open {selected.title}<ArrowRight size={16}/></Link>
              </div>
            </div>
            <div className="pf-showcase-footer"><span>01 — 05 / YOUR CORE TOOLS</span><span>DEMO CONTENT • NOT YOUR PERSONAL RESULTS</span></div>
            <div className="pf-orbit pf-orbit-one" aria-hidden="true"/>
            <div className="pf-orbit pf-orbit-two" aria-hidden="true"/>
          </div>
        </div>
        <div className="pf-shell pf-hero-bottom"><span>LEARN WITH PURPOSE</span><span>BUILD WITH CLARITY</span><span>PROGRESS WITH PROOF</span><span className="pf-line-scroll">EXPLORE THE PLATFORM <span aria-hidden="true">↓</span></span></div>
      </section>

      <section className="pf-tools-section pf-shell" aria-labelledby="pf-tools-title">
        <div className="pf-section-heading">
          <div><p className="pf-eyebrow"><span className="pf-signal" aria-hidden="true"/> ONE CONNECTED WORKSPACE</p>
            <h2 id="pf-tools-title">Five tools.<br/><em>One bigger ambition.</em></h2>
          </div>
          <p>Everything is designed around one outcome: knowing what you can do,
            improving what you cannot yet do, and making your progress visible.</p>
        </div>
        <div className="pf-tool-grid">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link to={tool.route} key={tool.id} className={"pf-tool-card pf-accent-" + tool.color}>
                <div className="pf-tool-card-top"><span className="pf-tool-icon"><Icon size={23}/></span><span className="pf-tool-index">{tool.id} / 05</span></div>
                <span className="pf-tool-eyebrow">{tool.eyebrow}</span>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <span className="pf-tool-link">Explore tool <ArrowRight size={16}/></span>
                <span className="pf-tool-glow" aria-hidden="true"/>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pf-shell pf-process-section">
        <div className="pf-process-card">
          <div>
            <p className="pf-eyebrow"><span className="pf-signal" aria-hidden="true"/> BUILT FOR THE WAY YOU GROW</p>
            <h2>Progress should feel <em>possible.</em></h2>
            <p>Start without prior experience. Build confidence with one useful action at a time.
              No complicated setup, inflated scores or invented achievements.</p>
            <Link to="/dashboard" className="pf-inline-action">Choose your starting point <ArrowRight size={17}/></Link>
          </div>
          <div className="pf-process-steps">
            <div><span><BookOpen size={21}/></span><strong>01. Discover</strong><p>Find your skills and the next thing to learn.</p></div>
            <div><span><Code2 size={21}/></span><strong>02. Practice</strong><p>Build, solve problems and learn to explain your decisions.</p></div>
            <div><span><Layers3 size={21}/></span><strong>03. Present</strong><p>Organise your work and create a portfolio in your own style.</p></div>
          </div>
        </div>
      </section>

      <section className="pf-shell pf-trust-section" aria-label="Responsible and transparent learning">
        <div><ShieldCheck size={23}/><strong>Your work stays yours</strong><p>Practice and portfolio records are saved in your browser for now. Export backups to keep them safe.</p></div>
        <div><AudioLines size={23}/><strong>Learn your way</strong><p>Speak or type interview answers; review feedback at your own pace.</p></div>
        <div><WandSparkles size={23}/><strong>AI with clear boundaries</strong><p>AI feedback is advisory. We do not claim self-assessed activities are certified credentials.</p></div>
      </section>

      <section className="pf-shell pf-final-section">
        <div className="pf-final-panel">
          <div className="pf-final-glow" aria-hidden="true"/>
          <p className="pf-eyebrow"><span className="pf-signal" aria-hidden="true"/> THE NEXT CHAPTER STARTS HERE</p>
          <h2>Make something you're <em>proud to show.</em></h2>
          <p>Start with one skill, one project, or one conversation. PortForge helps you turn the next step into real progress.</p>
          <div className="pf-hero-actions"><Link to="/dashboard" className="pf-primary-action">Open your workspace <ArrowRight size={18}/></Link>
            <Link to="/skill-test" className="pf-secondary-action">Try a skill test <ChevronRight size={17}/></Link></div>
        </div>
      </section>
    </div>
  );
}
