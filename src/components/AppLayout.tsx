import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Briefcase, Code2, Mic, Target, LayoutDashboard, GraduationCap, Moon, Sun, FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/practice", label: "Practice", icon: FlaskConical },
  { to: "/skill-test", label: "Skill test", icon: BookOpen },
  { to: "/interview", label: "Interview", icon: Mic },
  { to: "/workspace", label: "Workspace", icon: Code2 },
  { to: "/oracle", label: "Career paths", icon: Target },
  { to: "/portfolio", label: "My portfolio", icon: Briefcase },
];

export default function AppLayout() {
  const location = useLocation();
  const [theme,setTheme] = useState<"dark"|"light">(()=>{try{return localStorage.getItem("portforge_theme")==="light"?"light":"dark";}catch{return "dark";}});
  useEffect(()=>{document.documentElement.classList.toggle("light",theme==="light");document.documentElement.classList.toggle("dark",theme==="dark");try{localStorage.setItem("portforge_theme",theme);}catch{}},[theme]);
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/90 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 min-h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-bold text-lg tracking-tight whitespace-nowrap" aria-label="PortForge AI home">
            Port<span className="text-led-cyan">Forge</span> AI
          </Link>
          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => "rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm transition-colors " + (isActive ? "bg-led-cyan/10 text-led-cyan" : "text-muted-foreground hover:text-foreground hover:bg-surface-2")}>
                <Icon className="size-4" aria-hidden="true" />{label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" aria-label={theme==="dark"?"Switch to light mode":"Switch to dark mode"} title={theme==="dark"?"Light mode":"Dark mode"} onClick={()=>setTheme(v=>v==="dark"?"light":"dark")} className="inline-flex size-10 items-center justify-center rounded-lg border border-border hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-led-cyan">
              {theme==="dark"?<Sun className="size-5" aria-hidden="true"/>:<Moon className="size-5" aria-hidden="true"/>}
            </button>
            <Link to="/dashboard" className="hidden sm:inline-flex rounded-lg bg-foreground text-background px-4 py-2 text-sm font-bold hover:bg-led-cyan transition-colors">Get started</Link>
          </div>
        </div>
        <nav aria-label="Mobile navigation" className="xl:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => "rounded-lg px-3 py-2.5 flex items-center shrink-0 gap-1.5 text-xs transition-colors " + (isActive ? "bg-led-cyan/10 text-led-cyan" : "text-muted-foreground hover:text-foreground")}>
              <Icon className="size-4" aria-hidden="true"/>{label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main key={location.pathname} className="flex-1 animate-fade-in" id="main-content"><Outlet /></main>
      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <span className="text-sm text-muted-foreground">© 2026 PortForge AI</span>
          <div className="flex flex-wrap gap-4 items-center"><Link to="/data-use" className="text-xs text-led-cyan hover:underline">Data use &amp; AI limitations</Link><span className="text-xs text-muted-foreground">Learn · Practice · Build · Grow</span></div>
        </div>
      </footer>
    </div>
  );
}
