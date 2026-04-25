import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Activity, Brain, Briefcase, Code2, Mic, Target } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/skill-test", label: "SKILL TEST", icon: Brain },
  { to: "/interview", label: "INTERVIEW", icon: Mic },
  { to: "/workspace", label: "WORKSPACE", icon: Code2 },
  { to: "/oracle", label: "ORACLE", icon: Target },
  { to: "/portfolio", label: "PORTFOLIO", icon: Briefcase },
];

export default function AppLayout() {
  const loc = useLocation();
  const [latency] = useState(() => 8 + Math.floor(Math.random() * 12));
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Telemetry header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="led-dot animate-blink" />
            </div>
            <span className="font-mono text-xs tracking-[0.25em] font-bold uppercase">
              Port<span className="text-led-cyan">Forge</span> AI
            </span>
            <span className="hidden md:inline font-mono text-[10px] text-muted-foreground tracking-widest">// PROOF-BASED PORTFOLIO AI</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-mono text-[11px] tracking-widest px-3 py-2 rounded transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-led-cyan/10 text-led-cyan border border-led-cyan/30 shadow-[inset_0_0_8px_hsl(var(--led-cyan)/0.1)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2 border border-transparent"
                  }`
                }
              >
                <Icon className="size-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 font-mono text-[10px] tracking-wider text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Activity className="size-3 text-led-green" />
              <span>{latency}ms</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <span>{time}</span>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="lg:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-mono text-[10px] tracking-widest px-2.5 py-1.5 rounded shrink-0 flex items-center gap-1.5 ${
                  isActive ? "bg-led-cyan/10 text-led-cyan border border-led-cyan/30" : "text-muted-foreground border border-transparent"
                }`
              }
            >
              <Icon className="size-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main key={loc.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span>PortForge AI © 2026 // Proof &gt; Claim</span>
          <span className="text-led-cyan">SYS NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}
