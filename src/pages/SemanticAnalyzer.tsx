import { useState } from "react";
import { tokenize } from "@/lib/compiler/lexer";
import { performSemanticAnalysis } from "@/lib/compiler/semantic";
import { SymbolTableView } from "@/components/features/SymbolTableView";
import { SAMPLE_PROGRAMS } from "@/lib/sampleCode";
import type { Language, SemanticResult } from "@/types";
import { BrainCircuit, Play, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SemanticAnalyzerPage() {
  const [code, setCode] = useState(SAMPLE_PROGRAMS.c["Basic Variables"]);
  const [lang, setLang] = useState<Language>("c");
  const [result, setResult] = useState<SemanticResult | null>(null);

  const handleAnalyze = () => {
    const tokens = tokenize(code, lang);
    setResult(performSemanticAnalysis(tokens.tokens, code, lang));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary" />Semantic Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Type checking, scope analysis, symbol table construction, and semantic error detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select value={lang} onChange={e => setLang(e.target.value as Language)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {(["c","cpp","python"] as Language[]).map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <select onChange={e => setCode(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {Object.entries(SAMPLE_PROGRAMS[lang] ?? {}).map(([n]) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={14}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Analyze Semantics
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm font-medium",
              result.errors.length === 0
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400")}>
              {result.errors.length === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {result.errors.length === 0 ? `Semantic analysis complete — ${result.symbolTable.length} symbols found` : `${result.errors.length} semantic error(s) detected`}
            </div>

            <div>
              <p className="section-header"><BrainCircuit className="w-4 h-4" />Symbol Table</p>
              <SymbolTableView symbols={result.symbolTable} />
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <p className="section-header text-destructive"><AlertTriangle className="w-4 h-4" />Semantic Errors</p>
                {result.errors.map((err, i) => (
                  <div key={i} className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm">
                    <p className="font-semibold text-destructive">Line {err.line}: {err.message}</p>
                    {err.cause && <p className="text-xs text-muted-foreground mt-1">Cause: {err.cause}</p>}
                    {err.suggestion && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Fix: {err.suggestion}</p>}
                  </div>
                ))}
              </div>
            )}

            {result.warnings.slice(0, 5).length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Warnings</p>
                {result.warnings.slice(0, 5).map((w, i) => (
                  <p key={i} className="text-xs text-amber-700 dark:text-amber-300 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">⚠ {w}</p>
                ))}
              </div>
            )}

            {/* Concepts */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-2">
              <p className="text-sm font-semibold text-foreground">What was analyzed?</p>
              {[
                "Variable declarations and types extracted",
                "Scope tracking (global → block levels)",
                "Duplicate declaration detection",
                "Usage tracking per identifier",
                "Unused variable warnings generated",
              ].map((p, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />{p}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
            <div>
              <BrainCircuit className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Enter code and click Analyze Semantics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
