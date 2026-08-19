import { useState } from "react";
import { generateTAC } from "@/lib/compiler/tac";
import { optimize } from "@/lib/compiler/optimizer";
import { OptimizationView } from "@/components/features/OptimizationView";
import { Gauge, Play, Zap } from "lucide-react";

const EXAMPLES = [
  { label: "Constant Folding", code: "int x = 10 * 5;\nint y = x + 3;\nreturn y;" },
  { label: "Algebraic Simplification", code: "int x = 10 * 5;\nint y = x + 0;\nint z = y * 1;\nreturn z;" },
  { label: "Full Optimization", code: "int a = 2 * 3;\nint b = a + 0;\nint c = b * 1;\nint d = a + b;\nreturn d;" },
  { label: "Dead Code", code: "int x = 10;\nint dead = 99;\nint y = x + 5;\nreturn y;" },
];

const CONCEPTS = [
  { name: "Constant Folding", desc: "Evaluates constant expressions at compile time. x = 3 * 4 → x = 12", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "Algebraic Simplification", desc: "Uses mathematical identities. x + 0 = x, x * 1 = x, x * 0 = 0", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  { name: "Constant Propagation", desc: "Substitutes known constant values into expressions", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { name: "Dead Code Elimination", desc: "Removes unreachable code and unused temporaries", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  { name: "Common Subexpression Elimination", desc: "Reuses already-computed expression values", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
];

export default function OptimizationLabPage() {
  const [code, setCode] = useState(EXAMPLES[2].code);
  const [result, setResult] = useState<ReturnType<typeof optimize> | null>(null);

  const handleOptimize = () => {
    const tac = generateTAC(code);
    setResult(optimize(tac));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gauge className="w-6 h-6 text-primary" />Optimization Lab</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Apply machine-independent optimizations and see the before/after comparison</p>
      </div>

      {/* Concept pills */}
      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map(c => (
          <div key={c.name} className={`px-3 py-1.5 rounded-full text-xs font-medium ${c.color}`} title={c.desc}>{c.name}</div>
        ))}
      </div>

      {/* Example buttons */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map(ex => (
          <button key={ex.label} onClick={() => { setCode(ex.code); setResult(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border hover:border-primary hover:bg-primary/5 transition-all">
            <Zap className="w-3 h-3" />{ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Source Code</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={10}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button onClick={handleOptimize}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Generate & Optimize
          </button>
        </div>

        <div>
          {result ? (
            <OptimizationView result={result} />
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-border text-center">
              <div>
                <Gauge className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Click Generate & Optimize to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimization concepts detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONCEPTS.map(c => (
          <div key={c.name} className="p-3 rounded-xl border border-border bg-card">
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${c.color}`}>{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
