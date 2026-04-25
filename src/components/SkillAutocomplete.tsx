import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  // Languages
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Rust", "Ruby",
  "PHP", "Swift", "Kotlin", "Scala", "R", "Dart", "Lua", "Perl", "Haskell", "Elixir",
  "SQL", "Bash", "PowerShell", "MATLAB", "Objective-C",
  // Frontend
  "React", "React Hooks", "Next.js", "Vue", "Vue 3", "Svelte", "SvelteKit", "Angular",
  "Solid.js", "Remix", "Astro", "HTML5", "CSS3", "Tailwind CSS", "Sass", "Redux",
  "Zustand", "TanStack Query", "Webpack", "Vite", "Three.js", "D3.js",
  // Backend
  "Node.js", "Express", "NestJS", "Fastify", "Django", "Flask", "FastAPI", "Spring Boot",
  "Ruby on Rails", "Laravel", "ASP.NET", "GraphQL", "REST APIs", "gRPC", "WebSockets",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Firebase",
  "Supabase", "Cassandra", "Elasticsearch", "Neo4j", "Prisma", "SQL Joins",
  // Cloud / DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins",
  "GitHub Actions", "CI/CD", "Linux", "Nginx", "Cloudflare", "Vercel", "Netlify",
  // AI / ML / Data
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
  "Pandas", "NumPy", "LangChain", "LLMs", "Prompt Engineering", "OpenAI API",
  "Computer Vision", "NLP", "Reinforcement Learning", "Data Engineering",
  // Mobile
  "React Native", "Flutter", "Swift UI", "Jetpack Compose", "iOS Development",
  "Android Development",
  // Roles
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer",
  "Data Scientist", "ML Engineer", "AI Engineer", "Mobile Developer", "Cloud Engineer",
  "SRE", "Security Engineer", "Product Manager", "UI/UX Designer", "QA Engineer",
  "Software Architect", "Game Developer", "Blockchain Developer", "Embedded Engineer",
];

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

export function SkillAutocomplete({ value, onChange, disabled, placeholder, className = "", onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = value.trim()
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()).slice(0, 8)
    : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setActiveIdx(0); }, [value]);

  function pick(s: string) {
    onChange(s);
    setOpen(false);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (open && matches.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i + 1) % matches.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => (i - 1 + matches.length) % matches.length); return; }
      if (e.key === "Tab" || (e.key === "Enter" && matches[activeIdx])) {
        e.preventDefault();
        pick(matches[activeIdx]);
        return;
      }
      if (e.key === "Escape") { setOpen(false); return; }
    }
    if (e.key === "Enter" && onSubmit) { onSubmit(); }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && matches.length > 0 && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 panel max-h-64 overflow-auto animate-fade-in">
          {matches.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                i === activeIdx ? "bg-led-cyan/10 text-led-cyan" : "hover:bg-surface-2"
              }`}
            >
              <span className="font-medium">{highlight(s, value)}</span>
              {i === activeIdx && <span className="font-mono text-[9px] text-muted-foreground tracking-widest">↵ TAB</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-led-cyan font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
