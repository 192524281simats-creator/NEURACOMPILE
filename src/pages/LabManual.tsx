import { useState } from "react";
import { LAB_EXPERIMENTS } from "@/lib/labData";
import { useProgress } from "@/hooks/useProgress";
import { ScrollText, ChevronDown, CheckCircle2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = ["Aim", "Theory", "Algorithm", "Program", "Expected Output", "Viva Questions"];

export default function LabManualPage() {
  const [selected, setSelected] = useState(LAB_EXPERIMENTS[0]);
  const [section, setSection] = useState("Aim");
  const { progress, completeLab } = useProgress();

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ScrollText className="w-6 h-6 text-primary" />Lab Manual</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Interactive Compiler Design laboratory experiments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Experiment list */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Experiments</p>
          {LAB_EXPERIMENTS.map(exp => {
            const done = progress.labsCompleted.includes(exp.id);
            return (
              <button key={exp.id} onClick={() => { setSelected(exp); setSection("Aim"); }}
                className={cn("w-full text-left p-3 rounded-xl border transition-all",
                  selected.id === exp.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent bg-card")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Exp {exp.id}</p>
                    <p className="text-sm font-medium text-foreground leading-tight">{exp.title}</p>
                  </div>
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Experiment content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Experiment {selected.id}</p>
              <h2 className="text-lg font-bold text-foreground">{selected.title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selected.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{t}</span>
                ))}
              </div>
            </div>
            {!progress.labsCompleted.includes(selected.id) && (
              <button onClick={() => completeLab(selected.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:opacity-80 transition-opacity shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
              </button>
            )}
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setSection(s)} className={cn("tab-btn text-xs whitespace-nowrap", section === s && "active")}>{s}</button>
            ))}
          </div>

          {/* Section content */}
          <div className="rounded-xl border border-border bg-card p-5">
            {section === "Aim" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Aim
                </p>
                <p className="text-sm text-foreground leading-relaxed">{selected.aim}</p>
              </div>
            )}
            {section === "Theory" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theory</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.theory}</p>
              </div>
            )}
            {section === "Algorithm" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Algorithm</p>
                <ol className="space-y-2">
                  {selected.algorithm.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {section === "Program" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Program</p>
                <div className="code-output text-xs bg-navy-950 dark:bg-black/40 text-emerald-400 dark:text-emerald-300 whitespace-pre-wrap">
                  {selected.program}
                </div>
              </div>
            )}
            {section === "Expected Output" && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sample Input</p>
                  <div className="code-output text-xs">{selected.sampleInput}</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expected Output</p>
                  <div className="code-output text-xs text-emerald-600 dark:text-emerald-400">{selected.expectedOutput}</div>
                </div>
              </div>
            )}
            {section === "Viva Questions" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Viva Questions</p>
                <div className="space-y-2">
                  {selected.vivaQuestions.map((q, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted">
                      <span className="text-primary font-bold text-sm shrink-0">Q{i+1}.</span>
                      <p className="text-sm text-foreground">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
