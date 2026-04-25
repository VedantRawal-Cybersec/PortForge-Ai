import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  label?: string;
  status?: string;
  statusVariant?: "cyan" | "green" | "amber" | "alert";
}

export function Panel({ children, className = "", label, status, statusVariant = "cyan" }: PanelProps) {
  const statusClass =
    statusVariant === "green" ? "chip-green" :
    statusVariant === "amber" ? "chip-amber" :
    statusVariant === "alert" ? "chip-alert" : "chip-cyan";
  return (
    <section className={`panel relative overflow-hidden ${className}`}>
      {(label || status) && (
        <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-1/60">
          {label && (
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground">
              {label}
            </h2>
          )}
          {status && <span className={`chip ${statusClass} text-[10px]`}>{status}</span>}
        </header>
      )}
      {children}
    </section>
  );
}

export function ScoreBar({ label, value, max = 5, variant = "cyan" }: { label: string; value: number; max?: number; variant?: "cyan" | "green" | "amber" | "alert" | "violet" }) {
  const pct = (value / max) * 100;
  const colorMap = {
    cyan: "hsl(var(--led-cyan))",
    green: "hsl(var(--led-green))",
    amber: "hsl(var(--led-amber))",
    alert: "hsl(var(--led-alert))",
    violet: "hsl(var(--led-violet))",
  } as const;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums">{value}<span className="text-muted-foreground">/{max}</span></span>
      </div>
      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: colorMap[variant], boxShadow: `0 0 8px ${colorMap[variant]}` }}
        />
      </div>
    </div>
  );
}
