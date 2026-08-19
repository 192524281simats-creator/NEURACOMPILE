import { useState, Suspense, lazy } from "react";
import type { Language, CompilerPipelineResult } from "@/types";
import { runFullPipeline } from "@/lib/compiler";
import { SAMPLE_PROGRAMS } from "@/lib/sampleCode";
import { useProgress } from "@/hooks/useProgress";
import { TokenTable } from "@/components/features/TokenTable";
import { SymbolTableView } from "@/components/features/SymbolTableView";
import { TACView } from "@/components/features/TACView";
import { OptimizationView } from "@/components/features/OptimizationView";
import { TreeVisualizer } from "@/components/features/TreeVisualizer";
import { PipelineProgress } from "@/components/features/PipelineProgress";
import { cn } from "@/lib/utils";
import { Zap, RefreshCw, CheckCircle2 } from "lucide-react";

const MonacoEditor = lazy(() => import("@monaco-editor/react").then(m => ({ default: m.default })));

const PHASES = [
  { id: "lexical", label: "Lexical Analysis", emoji: "🔤", desc: "Source code → Tokens" },
  { id: "syntax", label: "Parse Tree", emoji: "🌲", desc: "Tokens → Parse Tree" },
  { id: "ast", label: "AST", emoji: "🧩", desc: "Parse Tree → AST" },
  { id: "semantic", label: "Semantic Analysis", emoji: "🔍", desc: "AST → Symbol Table" },
  { id: "tac", label: "Three Address Code", emoji: "📝", desc: "AST → TAC" },
  { id: "optimization", label: "Optimization", emoji: "⚡", desc: "TAC → Optimized TAC" },
  { id: "target", label: "Target Code", emoji: "🖥️", desc: "TAC → Assembly" },
];

const LANG_OPTIONS: Language[] = ["c", "cpp", "python", "lex"];

export default function CompilerXRay() {
  const [lang, setLang] = useState<Language>("c");
  const [code, setCode] = useState(SAMPLE_PROGRAMS.c["Basic Variables"]);
  const [result, setResult] = useState<CompilerPipelineResult | null>(null);
  const [activePhase, setActivePhase] = useState("lexical");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const { recordRun } = useProgress();
  const isDark = document.documentElement.classList.contains("dark");

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setCompleted([]);
    setActivePhase("lexical");

    // Animate through phases
    const phases = PHASES.map(p => p.id);
    const r = runFullPipeline(code, lang);

    for (let i = 0; i < phases.length; i++) {
      await new Promise(res => setTimeout(res, 180));
      setActivePhase(phases[i]);
      setCompleted(prev => [...prev, phases[Math.max(0, i - 1)]]);
    }
    await new Promise(res => setTimeout(res, 180));
    setCompleted(phases);
    setActivePhase("lexical");
    setResult(r);
    recordRun(r);
    setRunning(false);
  };

  const renderPhaseContent = () => {
    if (!result) return null;
    switch (activePhase) {
      case "lexical": return <TokenTable tokens={result.lexical.tokens} />;
      case "syntax": return result.parseTree ? <TreeVisualizer tree={result.parseTree} /> : <p className="text-muted-foreground text-sm text-center py-8">Parse tree generated from the first expression in your code.</p>;
      case "ast": return result.ast ? <TreeVisualizer tree={result.ast} isAST /> : <p className="text-muted-foreground text-sm text-center py-8">AST requires a parseable expression in your code.</p>;
      case "semantic": return <SymbolTableView symbols={result.semantic.symbolTable} />;
      case "tac": return <TACView instructions={result.tac} />;
      case "optimization": return result.optimized ? <OptimizationView result={result.optimized} /> : <div className="text-center py-8 text-muted-foreground text-sm">No optimization data available.</div>;
      case "target": return (
        <div className="code-output text-xs">
          {result.targetCode.map((t, i) => (
            <div key={i} className={cn("flex gap-4", t.instruction.startsWith(";") && "text-muted-foreground italic")}>
              <span className="text-primary/80 w-52 shrink-0">{t.instruction}</span>
              {t.comment && <span className="text-muted-foreground">; {t.comment}</span>}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Zap className="w-6 h-6 text-primary" />Compiler X-Ray</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Full 7-phase pipeline — click any phase to inspect results</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={lang} onChange={e => { setLang(e.target.value as Language); setCode(SAMPLE_PROGRAMS[e.target.value as Language][Object.keys(SAMPLE_PROGRAMS[e.target.value as Language])[0]]); setResult(null); setCompleted([]); }}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {LANG_OPTIONS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <select onChange={e => setCode(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {Object.entries(SAMPLE_PROGRAMS[lang]).map(([name, code]) => <option key={name} value={code}>{name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Editor */}
        <div className="xl:col-span-2 space-y-3">
          <div className="rounded-xl border border-border overflow-hidden h-64">
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
              <MonacoEditor height="100%" language={lang === "lex" ? "plaintext" : lang === "cpp" ? "cpp" : lang}
                value={code} onChange={v => setCode(v ?? "")} theme={isDark ? "vs-dark" : "vs"}
                options={{ fontSize: 13, minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, fontFamily: "'JetBrains Mono', monospace", padding: { top: 8 } }} />
            </Suspense>
          </div>
          <button onClick={handleAnalyze} disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all">
            {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {running ? "Analyzing Pipeline..." : "🔍 Analyze with Compiler X-Ray"}
          </button>
          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline complete — {result.lexical.stats.total} tokens · {result.semantic.symbolTable.length} symbols · {result.tac.length} TAC instructions
              </p>
            </div>
          )}
        </div>

        {/* Pipeline phases */}
        <div className="xl:col-span-3 space-y-4">
          {/* Phase selector */}
          <PipelineProgress active={activePhase} completed={completed} loading={running} onPhaseClick={p => { if (completed.includes(p)) setActivePhase(p); }} />

          {/* Phase cards */}
          <div className="grid grid-cols-4 xl:grid-cols-7 gap-2">
            {PHASES.map(phase => {
              const done = completed.includes(phase.id);
              const active = activePhase === phase.id;
              return (
                <button key={phase.id}
                  onClick={() => { if (done || result) setActivePhase(phase.id); }}
                  disabled={!done && !result}
                  className={cn("phase-card p-2 text-center text-xs flex flex-col items-center gap-1", active && "active", !done && !result && "opacity-40 cursor-not-allowed")}>
                  <span className="text-lg">{phase.emoji}</span>
                  <span className="font-medium leading-tight">{phase.label}</span>
                  {done && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Phase result */}
          {result ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{PHASES.find(p => p.id === activePhase)?.emoji}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{PHASES.find(p => p.id === activePhase)?.label}</h3>
                  <p className="text-xs text-muted-foreground">{PHASES.find(p => p.id === activePhase)?.desc}</p>
                </div>
              </div>
              {renderPhaseContent()}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
              <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Enter code and click Analyze to run the full compiler pipeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
