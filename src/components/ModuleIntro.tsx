import type { ReactNode } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: readonly string[];
  icon: ReactNode;
};

export function ModuleIntro({ eyebrow, title, description, highlights, icon }: Props) {
  return (
    <section className="pf-module-intro" aria-label={title + " overview"}>
      <div>
        <span className="pf-module-intro-eyebrow">{icon}<span>{eyebrow}</span></span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="pf-module-actions" aria-label="Workflow benefits">
        {highlights.map(text => <span key={text}><CheckCircle2 size={14} className="text-led-cyan" aria-hidden="true"/>{text}</span>)}
      </div>
    </section>
  );
}
