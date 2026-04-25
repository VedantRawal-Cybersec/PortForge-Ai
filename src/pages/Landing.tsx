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
              <span className="led-dot animate-blink" /> SYSTEM_LIVE_v1.0
            </span>
            <span className="chip text-muted-foreground">PROOF-BASED PORTFOLIO AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-balance animate-fade-up">
            Don't claim skills.<br />
            <span className="bg-gradient-to-r from-led-cyan via-foreground to-led-violet bg-clip-text text-transparent">
              Prove them.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
            A career launch system that <span className="text-foreground font-medium">tests, evaluates, and trains</span> you in real time —
            voice interviews, project grading, and verified portfolios that recruiters can trust.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link
              to="/skill-test"
              className="group inline-flex items-center gap-2 bg-foreground text-background font-bold text-sm px-6 py-3.5 rounded-md hover:bg-led-cyan hover:text-background transition-all duration-300 shadow-[0_0_0_1px_hsl(var(--foreground)),0_8px_24px_-4px_hsl(var(--led-cyan)/0.3)] hover:shadow-[0_0_0_1px_hsl(var(--led-cyan)),0_12px_32px_-4px_hsl(var(--led-cyan)/0.5)]"
            >
              INITIATE_SCAN
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 border border-border bg-surface-1 text-foreground font-bold text-sm px-6 py-3.5 rounded-md hover:border-led-cyan/50 hover:bg-surface-2 transition-all"
            >
              <Mic className="size-4" /> VOICE_INTERVIEW
            </Link>
          </div>

          {/* Telemetry strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {[
              { k: "QUESTIONS_GRADED", v: "12.4K", c: "led-cyan" },
              { k: "AVG_LATENCY", v: "1.8s", c: "led-green" },
              { k: "VOICE_SESSIONS", v: "3.2K", c: "led-amber" },
              { k: "VERIFIED_SKILLS", v: "8.7K", c: "led-violet" },
            ].map((s) => (
              <div key={s.k} className="panel p-4">
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">{s.k}</div>
                <div className={`text-2xl font-bold tabular-nums text-${s.c}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// MODULES</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Five engines. One system.</h2>
          </div>
          <Link to="/skill-test" className="hidden md:inline font-mono text-xs text-muted-foreground hover:text-led-cyan tracking-widest">VIEW_ALL →</Link>
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
              This shows what you can <span className="text-led-cyan">prove</span>."
            </p>
            <p className="mt-6 text-muted-foreground font-mono text-xs tracking-widest uppercase">— Core Principle</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// FLOW</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">From input to verified.</h2>
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

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="panel p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to deploy?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Start with a skill test. Two minutes. Real grading. Real proof.</p>
            <Link to="/skill-test" className="inline-flex items-center gap-2 bg-foreground text-background font-bold text-sm px-7 py-3.5 rounded-md hover:bg-led-cyan transition-colors">
              <Zap className="size-4" /> START_FREE_SCAN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const modules = [
  { code: "MOD_01", title: "Micro Skill Test", desc: "Input a skill, get one precise question, get structured AI grading on logic, clarity, and depth.", icon: Brain, to: "/skill-test" },
  { code: "MOD_02", title: "Voice Interview", desc: "Real-time AI interviewer with cognitive load tracking. Voice in, voice out, full transcript.", icon: Mic, to: "/interview" },
  { code: "MOD_03", title: "Project Workspace", desc: "Build, run, and submit code. Receive structured AI evaluation and project upgrade paths.", icon: Code2, to: "/workspace" },
  { code: "MOD_04", title: "Job Oracle", desc: "Pick a target role. See required skills, your gaps, and a tailored learning roadmap.", icon: Target, to: "/oracle" },
  { code: "MOD_05", title: "Live Portfolio", desc: "Verified skills auto-update. Hash-stamped, exportable, real proof recruiters can verify.", icon: Briefcase, to: "/portfolio" },
  { code: "MOD_06", title: "Learning Engine", desc: "When you fail, you learn. Curated free + paid resources and graded project upgrades.", icon: CheckCircle2, to: "/skill-test" },
];

const steps = [
  { title: "PROBE", desc: "Pick any skill. The AI generates one precise, role-relevant question.", icon: Brain },
  { title: "EVALUATE", desc: "Structured grading: logic, clarity, depth — plus level and a one-line verdict.", icon: Zap },
  { title: "PROVE", desc: "Strong answers verify into your portfolio. Weak answers unlock learning paths.", icon: CheckCircle2 },
];
