import { useState } from "react";
import { VIVA_QUESTIONS } from "@/lib/vivaData";
import { MessageSquare, ChevronDown, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const TOPICS = ["All", ...new Set(VIVA_QUESTIONS.map(q => q.topic))];

export default function VivaPage() {
  const [topic, setTopic] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mode, setMode] = useState<"browse" | "practice">("browse");
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filtered = topic === "All" ? VIVA_QUESTIONS : VIVA_QUESTIONS.filter(q => q.topic === topic);
  const shuffle = () => { setPracticeIdx(Math.floor(Math.random() * filtered.length)); setShowAnswer(false); };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6 text-primary" />Viva Preparation</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Prepare for oral examinations with curated Compiler Design viva questions</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["browse","practice"].map(m => (
            <button key={m} onClick={() => { setMode(m as typeof mode); setShowAnswer(false); }}
              className={cn("px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setTopic(t); setPracticeIdx(0); setShowAnswer(false); }}
              className={cn("px-2.5 py-1 rounded-full text-xs border transition-all",
                topic === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:bg-primary/5")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {mode === "browse" && (
        <div className="space-y-2">
          {filtered.map(q => (
            <div key={q.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-accent transition-colors">
                <div>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted mr-2">{q.topic}</span>
                  <span className="text-sm font-medium text-foreground">{q.question}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform", expanded === q.id && "rotate-180")} />
              </button>
              {expanded === q.id && (
                <div className="border-t border-border p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">Answer</p>
                    <p className="text-sm text-foreground leading-relaxed">{q.answer}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Key insight</p>
                    <p className="text-xs text-blue-800 dark:text-blue-300">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === "practice" && filtered.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {practiceIdx + 1} of {filtered.length}</span>
            <button onClick={shuffle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-xs">
              <Shuffle className="w-3.5 h-3.5" /> Random
            </button>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted mb-3 inline-block">{filtered[practiceIdx].topic}</span>
            <p className="text-base font-medium text-foreground leading-relaxed mt-2">{filtered[practiceIdx].question}</p>
          </div>

          {!showAnswer ? (
            <button onClick={() => setShowAnswer(true)}
              className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all">
              Reveal Answer
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-card border border-primary/30">
                <p className="text-xs font-semibold text-primary mb-2">Answer</p>
                <p className="text-sm text-foreground leading-relaxed">{filtered[practiceIdx].answer}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Key insight</p>
                <p className="text-xs text-blue-800 dark:text-blue-300">{filtered[practiceIdx].explanation}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => { setPracticeIdx(i => Math.max(0, i - 1)); setShowAnswer(false); }} disabled={practiceIdx === 0}
              className="flex-1 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-accent transition-all disabled:opacity-40">
              ← Previous
            </button>
            <button onClick={() => { setPracticeIdx(i => Math.min(filtered.length - 1, i + 1)); setShowAnswer(false); }} disabled={practiceIdx === filtered.length - 1}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-40">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
