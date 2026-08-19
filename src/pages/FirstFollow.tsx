import { useState } from "react";
import { computeFirstFollow, parseGrammar, SAMPLE_GRAMMARS } from "@/lib/compiler";
import type { FirstFollowResult } from "@/types";
import { Calculator, Play, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_GRAMMAR = `E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | id`;

export default function FirstFollowPage() {
  const [grammar, setGrammar] = useState(DEFAULT_GRAMMAR);
  const [result, setResult] = useState<FirstFollowResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleCompute = () => {
    const g = parseGrammar(grammar);
    if (g.nonTerminals.length === 0) return;
    setResult(computeFirstFollow(g));
  };

  const grammar2 = result ? parseGrammar(grammar) : null;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator className="w-6 h-6 text-primary" />FIRST & FOLLOW Calculator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter a context-free grammar to compute FIRST sets, FOLLOW sets, and the LL(1) parsing table</p>
      </div>

      {/* Sample grammars */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SAMPLE_GRAMMARS).map(([name, g]) => (
          <button key={name} onClick={() => { setGrammar(g); setResult(null); }}
            className="px-3 py-1.5 rounded-full text-xs border border-border hover:border-primary hover:bg-primary/5 transition-all">
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Grammar Input */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Grammar (one production per line)</label>
            <textarea value={grammar} onChange={e => setGrammar(e.target.value)} rows={8}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="E -> T E'&#10;E' -> + T E' | ε&#10;T -> F T'&#10;..." />
          </div>
          <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-muted">
            <p className="font-medium">Format guide:</p>
            <p>• Use <code>-&gt;</code> between LHS and RHS</p>
            <p>• Separate alternatives with <code>|</code></p>
            <p>• Use <code>ε</code> or <code>eps</code> for empty production</p>
            <p>• Separate symbols with spaces</p>
          </div>
          <button onClick={handleCompute}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Compute FIRST & FOLLOW
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* LL(1) status */}
            <div className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm font-medium",
              result.isLL1 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400")}>
              {result.isLL1 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              {result.isLL1 ? "Grammar is LL(1) — No conflicts detected" : `Not LL(1) — ${result.conflicts.length} conflict(s) found`}
            </div>

            {/* FIRST sets */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2 bg-muted border-b border-border">
                <p className="text-sm font-semibold text-foreground">FIRST Sets</p>
              </div>
              <div className="divide-y divide-border">
                {Object.entries(result.first).filter(([k]) => grammar2?.nonTerminals.includes(k)).map(([nt, set]) => (
                  <div key={nt} className="flex items-center gap-3 px-4 py-2">
                    <span className="font-mono font-semibold text-sm text-primary w-12 shrink-0">FIRST({nt})</span>
                    <span className="text-sm text-muted-foreground">= </span>
                    <span className="text-sm font-mono">{"{"}{[...set].join(", ")}{"}"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOLLOW sets */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2 bg-muted border-b border-border">
                <p className="text-sm font-semibold text-foreground">FOLLOW Sets</p>
              </div>
              <div className="divide-y divide-border">
                {Object.entries(result.follow).map(([nt, set]) => (
                  <div key={nt} className="flex items-center gap-3 px-4 py-2">
                    <span className="font-mono font-semibold text-sm text-violet-600 dark:text-violet-400 w-14 shrink-0">FOLLOW({nt})</span>
                    <span className="text-sm text-muted-foreground">= </span>
                    <span className="text-sm font-mono">{"{"}{[...set].join(", ")}{"}"}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.nullable.size > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Nullable symbols: </span>
                <span className="font-mono">{[...result.nullable].join(", ")}</span>
              </div>
            )}

            {/* Steps accordion */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setShowSteps(s => !s)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                <span className="text-sm font-semibold">Computation Steps ({result.steps.length})</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showSteps && "rotate-180")} />
              </button>
              {showSteps && (
                <div className="border-t border-border max-h-48 overflow-auto">
                  {result.steps.map((step, i) => (
                    <div key={i} className="px-4 py-1.5 text-xs font-mono text-muted-foreground border-b border-border/50 last:border-0">
                      <span className="text-primary mr-2">Step {i+1}:</span>{step}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Parsing table */}
            {Object.keys(result.parsingTable).length > 0 && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <button onClick={() => setShowTable(s => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                  <span className="text-sm font-semibold">LL(1) Parsing Table</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showTable && "rotate-180")} />
                </button>
                {showTable && (
                  <div className="border-t border-border overflow-auto">
                    <table className="text-xs font-mono w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">NT \\ T</th>
                          {[...new Set(Object.values(result.parsingTable).flatMap(row => Object.keys(row)))].map(t => (
                            <th key={t} className="px-3 py-2">{t}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.parsingTable).map(([nt, row]) => (
                          <tr key={nt} className="border-t border-border">
                            <td className="px-3 py-1.5 font-semibold text-primary">{nt}</td>
                            {[...new Set(Object.values(result.parsingTable).flatMap(r => Object.keys(r)))].map(t => (
                              <td key={t} className="px-3 py-1.5 text-center text-muted-foreground">
                                {row[t] ? <span className="text-foreground">{nt} → {row[t]}</span> : "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {result.conflicts.length > 0 && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 space-y-1">
                <p className="text-xs font-semibold text-destructive">Conflicts:</p>
                {result.conflicts.map((c, i) => <p key={i} className="text-xs text-destructive/80">{c}</p>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
