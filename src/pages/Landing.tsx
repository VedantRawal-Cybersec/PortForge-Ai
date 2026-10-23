import { Link } from "react-router-dom";
import { ArrowRight, Brain, Briefcase, CheckCircle2, Code2, Mic, Sparkles, Target, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-24 relative">
          <div className="flex items-center gap-2 mb-8 animate-fade-in">
            <span className="chip chip-cyan">
              <span className="led-dot animate-blink" /> YOUR SKILLS. YOUR FUTURE.
            </span>
            <span className="chip text-muted-foreground">LEARN • BUILD • GROW</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-balance animate-fade-up">
            Learn it. Build it.<br />
            <span className="bg-gradient-to-r from-led-cyan via-foreground to-led-violet bg-clip-text text-transparent">
              Explain it.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
            Start from any level. Learn concepts, solve independent challenges, and turn your own projects into stories you can confidently discuss. AI-powered feedback is available where supported.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 bg-foreground text-background font-bold text-sm px-6 py-3.5 rounded-md hover:bg-led-cyan hover:text-background transition-all duration-300 shadow-[0_0_0_1px_hsl(var(--foreground)),0_8px_24px_-4px_hsl(var(--led-cyan)/0.3)] hover:shadow-[0_0_0_1px_hsl(var(--led-cyan)),0_12px_32px_-4px_hsl(var(--led-cyan)/0.5)]"
            >
              START MY LEARNING JOURNEY
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 border border-border bg-surface-1 text-foreground font-bold text-sm px-6 py-3.5 rounded-md hover:border-led-cyan/50 hover:bg-surface-2 transition-all"
            >
              <Code2 className="size-4" /> TRY A PRACTICE CHALLENGE
            </Link>
          </div>


        </div>
      </section>

      {/* Modules */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// MODULES</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Your toolkit for lasting progress.</h2>
          </div>
          <Link to="/dashboard" className="hidden md:inline font-mono text-xs text-muted-foreground hover:text-led-cyan tracking-widest">VIEW ALL →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <Link
              key={m.title}
              to={m.to}
              className="panel p-6 group hover:border-led-cyan/40 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="size-10 rounded-md bg-surface-2 border border-border flex items-center justify-center group-hover:bg-led-cyan/10 group-hover:border-led-cyan/40 transition-colors">
                  <m.icon className="size-5 text-foreground group-hover:text-led-cyan transition-colors" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">{m.code}</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
              <div className="flex items-center gap-2 text-led-cyan font-mono text-[11px] tracking-widest">
                LAUNCH <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Principle */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="panel p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative max-w-3xl">
            <Sparkles className="size-6 text-led-cyan mb-6" />
            <p className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.2] text-balance">
              "Portfolios show what you <span className="line-through text-muted-foreground">claim</span>.
              Build something you understand and <span className="text-led-cyan">explain what you learned</span>."
            </p>
            <p className="mt-6 text-muted-foreground font-mono text-xs tracking-widest uppercase">— Core Principle</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// FLOW</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">From practice to progress.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="panel p-6 relative">
              <div className="font-mono text-5xl font-bold text-led-cyan/20 absolute top-4 right-5">0{i+1}</div>
              <div className="size-8 rounded bg-led-cyan/10 border border-led-cyan/30 flex items-center justify-center mb-4">
                <s.icon className="size-4 text-led-cyan" />
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Universal starting points — no personal portfolio content */}
      <section className="max-w-[1400px] mx-auto px-6 py-20" aria-labelledby="getting-started-heading">
        <div className="mb-10 max-w-3xl">
          <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// YOUR STARTING POINT</div>
          <h2 id="getting-started-heading" className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Start where you are. Build what comes next.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            You do not need a degree, a polished resume, or previous experience to begin. Choose a goal and explore the tools at your own pace.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {startingPaths.map((path) => (
            <Link key={path.title} to={path.to} className="panel group p-6 hover:border-led-cyan/40 hover:-translate-y-1 transition-all duration-300">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-led-cyan/10 border border-led-cyan/20 mb-5">
                <path.icon className="size-5 text-led-cyan" aria-hidden="true" />
              </span>
              <h3 className="font-bold text-xl mb-2">{path.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{path.desc}</p>
              <span className="inline-flex items-center gap-2 text-led-cyan text-sm font-semibold">{path.action}<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Honest, product-centered portfolio overview */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="panel p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] items-center gap-8">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// YOUR WORK, YOUR STORY</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Turn practice into a portfolio.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Keep track of your skill assessments, interviews, and project reviews. Build a body of work you can explain and develop over time.
            </p>
          </div>
          <Link to="/portfolio" className="inline-flex justify-center items-center gap-2 rounded-lg bg-foreground text-background py-3.5 px-5 font-semibold hover:bg-led-cyan transition-colors">
            Explore my portfolio <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="panel p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to make progress?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Start with a skill test. Two minutes. Personalized feedback. A clear next step.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-foreground text-background font-bold text-sm px-7 py-3.5 rounded-md hover:bg-led-cyan transition-colors">
              <Zap className="size-4" /> GET STARTED
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const modules = [
  { code: "MOD 00", title: "Learning Academy", desc: "Start from zero with short lessons and quizzes. Follow your progress as you grow.", icon: Sparkles, to: "/learn" },
  { code: "MOD 01", title: "Micro Skill Test", desc: "Input a skill, get one precise question, get structured AI grading on logic, clarity, and depth.", icon: Brain, to: "/skill-test" },
  { code: "MOD 02", title: "Interview Simulator", desc: "Practice answering role-specific questions with voice or text and review AI-assisted feedback.", icon: Mic, to: "/interview" },
  { code: "MOD 03", title: "Project Workspace", desc: "Edit many languages and run isolated JavaScript examples. Request AI-assisted reviews when available.", icon: Code2, to: "/workspace" },
  { code: "MOD 04", title: "Career Explorer", desc: "Explore beginner-friendly role roadmaps, save milestones and optionally request AI-based suggestions.", icon: Target, to: "/oracle" },
  { code: "MOD 05", title: "My Portfolio", desc: "Keep your own assessments, code challenges and project stories locally until cloud sync is available.", icon: Briefcase, to: "/portfolio" },
  { code: "MOD 06", title: "Independent Practice Lab", desc: "Solve challenges independently, run repeatable JavaScript tests and reflect on your decisions.", icon: Code2, to: "/practice" },
  { code: "MOD 07", title: "Project Interview Coach", desc: "Explain code you personally wrote: decisions, edge cases, fixes and next improvements.", icon: Mic, to: "/project-interview" },
];

const steps = [
  { title: "LEARN", desc: "Begin with a short explanation, example and a knowledge check.", icon: Brain },
  { title: "BUILD", desc: "Write a solution yourself, run tests and refine it.", icon: Code2 },
  { title: "EXPLAIN", desc: "Connect your actual project to an interview story and future learning goals.", icon: CheckCircle2 },
];


const startingPaths = [
  { title: "I'm starting from zero", desc: "Not sure where to begin? Try a simple skill assessment and discover what to learn next.", action: "Start learning", icon: Brain, to: "/learn" },
  { title: "I want to build projects", desc: "Experiment with code, get feedback, and gradually develop real work to show.", action: "Try independent practice", icon: Code2, to: "/practice" },
  { title: "I'm preparing for my career", desc: "Explore target roles, identify gaps, and practice answering interview questions.", action: "Explore career paths", icon: Briefcase, to: "/oracle" },
];
