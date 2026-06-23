import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

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
              <span className="led-dot animate-blink" /> SYSTEM LIVE v1.0
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
              INITIATE SCAN
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 border border-border bg-surface-1 text-foreground font-bold text-sm px-6 py-3.5 rounded-md hover:border-led-cyan/50 hover:bg-surface-2 transition-all"
            >
              <Mic className="size-4" /> VOICE INTERVIEW
            </Link>
          </div>

          {/* Telemetry strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {[
              { k: "QUESTIONS GRADED", v: "12.4K", c: "led-cyan" },
              { k: "AVG LATENCY", v: "1.8s", c: "led-green" },
              { k: "VOICE SESSIONS", v: "3.2K", c: "led-amber" },
              { k: "VERIFIED SKILLS", v: "8.7K", c: "led-violet" },
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
          <Link to="/skill-test" className="hidden md:inline font-mono text-xs text-muted-foreground hover:text-led-cyan tracking-widest">VIEW ALL →</Link>
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

      {/* Connected Proof Feed */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-led-cyan uppercase mb-2">// CONNECTED PROOF FEED</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Profiles, projects, and proof in one place.</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
              A recruiter-ready feed that connects Vedant's public profiles, live cybersecurity projects, and portfolio proof without making visitors search across multiple platforms.
            </p>
          </div>
          <Link to="/portfolio" className="inline-flex w-fit items-center gap-2 border border-led-cyan/40 bg-led-cyan/10 text-led-cyan font-bold text-sm px-5 py-3 rounded-md hover:bg-led-cyan hover:text-background transition-all">
            VIEW FULL PORTFOLIO <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {proofFeed.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="panel group overflow-hidden hover:border-led-cyan/50 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative h-36 border-b border-border overflow-hidden bg-surface-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80`} />
                <div className="absolute inset-0 grid-bg opacity-25" />
                <div className="absolute left-5 bottom-5 flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-background/80 backdrop-blur border border-white/10 flex items-center justify-center shadow-[0_0_30px_-10px_hsl(var(--led-cyan))]">
                    <item.icon className="size-6 text-led-cyan" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest text-white/70 uppercase">{item.type}</div>
                    <div className="text-xl font-bold text-white">{item.initials}</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-led-cyan transition-colors">{item.title}</h3>
                  <ExternalLink className="size-4 text-muted-foreground group-hover:text-led-cyan shrink-0 transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="chip text-[10px] text-muted-foreground border-border/80">{tag}</span>
                  ))}
                </div>
              </div>
            </a>
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
              <Zap className="size-4" /> START FREE SCAN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const modules = [
  { code: "MOD 01", title: "Micro Skill Test", desc: "Input a skill, get one precise question, get structured AI grading on logic, clarity, and depth.", icon: Brain, to: "/skill-test" },
  { code: "MOD 02", title: "Voice Interview", desc: "Real-time AI interviewer with cognitive load tracking. Voice in, voice out, full transcript.", icon: Mic, to: "/interview" },
  { code: "MOD 03", title: "Project Workspace", desc: "Build, run, and submit code. Receive structured AI evaluation and project upgrade paths.", icon: Code2, to: "/workspace" },
  { code: "MOD 04", title: "Job Oracle", desc: "Pick a target role. See required skills, your gaps, and a tailored learning roadmap.", icon: Target, to: "/oracle" },
  { code: "MOD 05", title: "Live Portfolio", desc: "Verified skills auto-update. Hash-stamped, exportable, real proof recruiters can verify.", icon: Briefcase, to: "/portfolio" },
  { code: "MOD 06", title: "Learning Engine", desc: "When you fail, you learn. Curated free + paid resources and graded project upgrades.", icon: CheckCircle2, to: "/skill-test" },
];

const steps = [
  { title: "PROBE", desc: "Pick any skill. The AI generates one precise, role-relevant question.", icon: Brain },
  { title: "EVALUATE", desc: "Structured grading: logic, clarity, depth — plus level and a one-line verdict.", icon: Zap },
  { title: "PROVE", desc: "Strong answers verify into your portfolio. Weak answers unlock learning paths.", icon: CheckCircle2 },
];

const proofFeed = [
  {
    type: "LinkedIn Profile",
    title: "Vedant Rawal on LinkedIn",
    initials: "VR",
    desc: "Cybersecurity student profile focused on threat intelligence, SOC foundations, vulnerability management, web security, and security automation.",
    href: "https://www.linkedin.com/in/vedant-rawal-416529363",
    icon: Linkedin,
    gradient: "from-led-cyan/70 via-blue-500/40 to-surface-1",
    tags: ["LinkedIn", "Cybersecurity", "Profile"],
  },
  {
    type: "GitHub Profile",
    title: "Brute Code GitHub Proof",
    initials: "GH",
    desc: "Public project base for cybersecurity tools, automation workflows, portfolio experiments, and proof-based learning repositories.",
    href: "https://github.com/demovedu1345-beep",
    icon: Github,
    gradient: "from-led-violet/70 via-purple-500/40 to-surface-1",
    tags: ["GitHub", "Projects", "Proof"],
  },
  {
    type: "Live Project",
    title: "Sentinel AI Web Security Scanner",
    initials: "SA",
    desc: "Defensive web security scanner-style project for authorized website review, exposure analysis, and remediation-oriented reporting.",
    href: "https://sentinelweb-scan.lovable.app",
    icon: ShieldCheck,
    gradient: "from-led-green/70 via-emerald-500/35 to-surface-1",
    tags: ["Web Security", "Exposure Review", "Reporting"],
  },
  {
    type: "Live Project",
    title: "Threat Forge XSS Scanner",
    initials: "TF",
    desc: "Focused web application security project around XSS risk awareness, input validation issues, and ethical testing workflows.",
    href: "https://zip-repl--abbygoeated.replit.app",
    icon: Code2,
    gradient: "from-led-amber/70 via-orange-500/35 to-surface-1",
    tags: ["XSS", "OWASP", "VAPT"],
  },
  {
    type: "Live Project",
    title: "IMMUNEFIN AI",
    initials: "IA",
    desc: "AI + cybersecurity project aligned with cyber defense support, structured analysis, and security decision-support workflows.",
    href: "https://sju-chi.vercel.app",
    icon: Brain,
    gradient: "from-led-cyan/60 via-led-violet/45 to-surface-1",
    tags: ["AI Security", "Defense", "Analysis"],
  },
  {
    type: "Portfolio Route",
    title: "Verified Live Portfolio",
    initials: "PF",
    desc: "Internal portfolio route for verified skills, project proof, recruiter-friendly evidence, and career-readiness signals.",
    href: "/portfolio",
    icon: FileText,
    gradient: "from-foreground/40 via-led-cyan/30 to-surface-1",
    tags: ["Portfolio", "Resume", "Recruiter Proof"],
  },
];
