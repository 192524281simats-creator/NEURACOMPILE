import { useState } from "react";
import { Dumbbell, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const PROBLEMS = [
  {
    id: 1, topic: "FIRST Sets", difficulty: "beginner",
    question: "Given the grammar: A → aB | ε, compute FIRST(A).",
    hint: "Consider what terminals can start strings derived from A.",
    answer: "{a, ε}",
    explanation: "FIRST(A) = {a} from the production A → aB (since 'a' is the first terminal), plus ε because A → ε is a production."
  },
  {
    id: 2, topic: "Token Classification", difficulty: "beginner",
    question: "Classify each: int, studentName, =, 42, ;",
    hint: "Check against keyword list, identifier rules, operator list, etc.",
    answer: "int=KEYWORD, studentName=IDENTIFIER, ==OPERATOR, 42=CONSTANT, ;=SYMBOL",
    explanation: "'int' is a reserved keyword in C. 'studentName' follows identifier rules (letter+alphanums). '=' is an assignment operator. '42' is a numeric constant. ';' is a statement terminator symbol."
  },
  {
    id: 3, topic: "TAC Generation", difficulty: "intermediate",
    question: "Generate Three Address Code for: x = a + b * c",
    hint: "Respect operator precedence. Multiplication before addition.",
    answer: "t1 = b * c\nt2 = a + t1\nx = t2",
    explanation: "TAC respects precedence: multiply first (t1 = b * c), then add (t2 = a + t1), then assign (x = t2). Each instruction has at most 2 operands and 1 result."
  },
  {
    id: 4, topic: "Optimization", difficulty: "intermediate",
    question: "Apply constant folding to: x = 2 * 3; y = x + 10;",
    hint: "Evaluate constant expressions at compile time, then propagate.",
    answer: "x = 6\ny = 16",
    explanation: "2 * 3 = 6 (constant folding). After x = 6 is known, substitute x in y = x + 10 → y = 6 + 10 = 16 (constant propagation + folding)."
  },
  {
    id: 5, topic: "Left Recursion Elimination", difficulty: "advanced",
    question: "Eliminate left recursion from: A → Aa | b",
    hint: "Use the transformation A → bA', A' → aA' | ε",
    answer: "A → b A'\nA' → a A' | ε",
    explanation: "The left-recursive grammar A → Aa | b is transformed by introducing A'. The new grammar: A → bA' and A' → aA' | ε generates the same language without left recursion."
  },
  {
    id: 6, topic: "Follow Sets", difficulty: "intermediate",
    question: "For grammar E → T E' ; E' → + T E' | ε ; T → id, compute FOLLOW(E').",
    hint: "What can come after E'? Look at where E' appears in productions.",
    answer: "FOLLOW(E') = {$, )}",
    explanation: "FOLLOW(E') = FOLLOW(E) = {$, )} because E' appears at the end of E → T E'. If there's an enclosing production like S → (E), then ')' is also in FOLLOW(E)."
  },
];

export default function PracticePage() {
  const [selected, setSelected] = useState(PROBLEMS[0]);
  const [attempt, setAttempt] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => setSubmitted(true);
  const handleNext = () => {
    const idx = PROBLEMS.indexOf(selected);
    const next = PROBLEMS[(idx + 1) % PROBLEMS.length];
    setSelected(next);
    setAttempt("");
    setSubmitted(false);
    setShowHint(false);
  };

  const isCorrect = submitted && attempt.trim().toLowerCase().replace(/\s+/g, "").includes(selected.answer.toLowerCase().replace(/\s+/g, "").slice(0, 10));

  const DIFF_COLORS: Record<string, string> = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Dumbbell className="w-6 h-6 text-primary" />Practice Problems</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Work through compiler design problems with hints and explanations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Problem list */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Problems</p>
          {PROBLEMS.map(p => (
            <button key={p.id} onClick={() => { setSelected(p); setAttempt(""); setSubmitted(false); setShowHint(false); }}
              className={cn("w-full text-left p-3 rounded-xl border transition-all",
                selected.id === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card")}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs text-muted-foreground">#{p.id}</span>
                <span className={cn("badge-pill text-xs", DIFF_COLORS[p.difficulty])}>{p.difficulty}</span>
              </div>
              <p className="text-xs font-medium text-foreground">{p.topic}</p>
            </button>
          ))}
        </div>

        {/* Problem workspace */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("badge-pill", DIFF_COLORS[selected.difficulty])}>{selected.difficulty}</span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{selected.topic}</span>
            </div>
            <p className="text-base font-medium text-foreground leading-relaxed">{selected.question}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Your Answer</label>
            <textarea value={attempt} onChange={e => setAttempt(e.target.value)} disabled={submitted} rows={4}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-60" />
          </div>

          <div className="flex gap-2">
            {!submitted ? (
              <>
                <button onClick={() => setShowHint(s => !s)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
                  {showHint ? "Hide Hint" : "💡 Show Hint"}
                </button>
                <button onClick={handleSubmit} disabled={!attempt.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all">
                  Submit Answer
                </button>
              </>
            ) : (
              <button onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
                <RefreshCw className="w-4 h-4" /> Next Problem
              </button>
            )}
          </div>

          {showHint && !submitted && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
              💡 Hint: {selected.hint}
            </div>
          )}

          {submitted && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-primary/30 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-semibold text-foreground">Expected Answer</p>
                </div>
                <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400 whitespace-pre">{selected.answer}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">📖 Explanation</p>
                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">{selected.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
