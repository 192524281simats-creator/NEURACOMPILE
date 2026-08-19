import { useState, useRef, Suspense, lazy } from "react";
import type { Language, CompilerPipelineResult } from "@/types";
import { runFullPipeline } from "@/lib/compiler";
import { SAMPLE_PROGRAMS } from "@/lib/sampleCode";
import { useProgress } from "@/hooks/useProgress";
import { TokenTable } from "@/components/features/TokenTable";
import { SymbolTableView } from "@/components/features/SymbolTableView";
import { TACView } from "@/components/features/TACView";
import { OptimizationView } from "@/components/features/OptimizationView";
import { CodeInsightPanel } from "@/components/features/CodeInsightPanel";
import { cn } from "@/lib/utils";
import { Play, RefreshCw, Download, FileCode, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";

const MonacoEditor = lazy(() => import("@monaco-editor/react").then(m => ({ default: m.default })));

const LANGUAGES: { id: Language; label: string; monaco: string }[] = [
  { id: "c", label: "C", monaco: "c" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "lex", label: "LEX/FLEX", monaco: "plaintext" },
];

const TABS = ["Tokens","Symbol Table","TAC","Optimization","Target Code","Insights","Errors"];

export default function CompilerStudio() {
  const [lang, setLang] = useState<Language>("c");
  const [code, setCode] = useState(SAMPLE_PROGRAMS.c["Basic Variables"]);
  const [result, setResult] = useState<CompilerPipelineResult | null>(null);
  const [tab, setTab] = useState("Tokens");
  const [running, setRunning] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { recordRun } = useProgress();
  const isDark = document.documentElement.classList.contains("dark");

  const handleLangChange = (l: Language) => {
    setLang(l);
    const examples = SAMPLE_PROGRAMS[l];
    const first = Object.values(examples)[0];
    setCode(first);
    setResult(null);
  };

  const handleRun = () => {
    if (!code.trim()) return;
    setRunning(true);
    setTimeout(() => {
      const r = runFullPipeline(code, lang);
      setResult(r);
      recordRun(r);
      setRunning(false);
      setTab("Tokens");
    }, 300);
  };

  const handleReset = () => { setCode(SAMPLE_PROGRAMS[lang][Object.keys(SAMPLE_PROGRAMS[lang])[0]]); setResult(null); };
  const handleDownload = () => {
    const ext = { c: "c", cpp: "cpp", python: "py", lex: "l" }[lang];
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `program.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const examples = SAMPLE_PROGRAMS[lang];

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card shrink-0 flex-wrap">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {LANGUAGES.map(l => (
            <button key={l.id} onClick={() => handleLangChange(l.id)}
              className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", lang === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Examples dropdown */}
        <div className="relative">
          <button onClick={() => setShowExamples(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
            <FileCode className="w-3.5 h-3.5" /> Examples <ChevronDown className="w-3 h-3" />
          </button>
          {showExamples && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-20 min-w-48 py-1">
              {Object.keys(examples).map(name => (
                <button key={name} onClick={() => { setCode(examples[name]); setShowExamples(false); setResult(null); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors">{name}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
        <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button onClick={handleRun} disabled={running}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all">
          {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {running ? "Analyzing..." : "Run & Analyze"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <Suspense fallback={<div className="flex-1 bg-muted animate-pulse" />}>
            <MonacoEditor
              height="100%"
              language={LANGUAGES.find(l => l.id === lang)?.monaco ?? "plaintext"}
              value={code}
              onChange={v => setCode(v ?? "")}
              theme={isDark ? "vs-dark" : "vs"}
              options={{
                fontSize: 14, minimap: { enabled: false }, lineNumbers: "on",
                scrollBeyondLastLine: false, wordWrap: "on", tabSize: 4,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 12, bottom: 12 },
              }}
            />
          </Suspense>
        </div>

        {/* Results */}
        <div className="w-1/2 flex flex-col">
          {result ? (
            <>
              {/* Status bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border shrink-0">
                {result.errors.length === 0 ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Analysis Complete — {result.lexical.stats.total} tokens, {result.semantic.symbolTable.length} symbols
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {result.errors.length} error(s) found
                  </span>
                )}
              </div>
              {/* Tabs */}
              <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto shrink-0">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} className={cn("tab-btn text-xs py-1 px-2.5 whitespace-nowrap", tab === t && "active")}>
                    {t}{t === "Errors" && result.errors.length > 0 && <span className="ml-1 bg-destructive text-destructive-foreground rounded-full px-1 text-[10px]">{result.errors.length}</span>}
                  </button>
                ))}
              </div>
              {/* Tab content */}
              <div className="flex-1 overflow-auto p-4">
                {tab === "Tokens" && <TokenTable tokens={result.lexical.tokens} />}
                {tab === "Symbol Table" && <SymbolTableView symbols={result.semantic.symbolTable} />}
                {tab === "TAC" && <TACView instructions={result.tac} />}
                {tab === "Optimization" && result.optimized && <OptimizationView result={result.optimized} />}
                {tab === "Optimization" && !result.optimized && <div className="text-center py-8 text-muted-foreground text-sm">No optimization data. Ensure your code has expressions.</div>}
                {tab === "Target Code" && (
                  <div className="code-output text-xs">
                    {result.targetCode.map((t, i) => (
                      <div key={i} className={cn("flex gap-4", t.instruction.startsWith(";") && "text-muted-foreground italic")}>
                        <span className="text-primary/80 w-48 shrink-0">{t.instruction}</span>
                        {t.comment && <span className="text-muted-foreground">; {t.comment}</span>}
                      </div>
                    ))}
                  </div>
                )}
                {tab === "Insights" && <CodeInsightPanel source={code} />}
                {tab === "Errors" && (
                  <div className="space-y-3">
                    {result.errors.length === 0 ? (
                      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400 text-sm">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" /> No errors found!
                      </div>
                    ) : result.errors.map((err, i) => (
                      <div key={i} className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-destructive">{err.type} Error — Line {err.line}</p>
                            <p className="text-sm text-foreground mt-0.5">{err.message}</p>
                            {err.cause && <p className="text-xs text-muted-foreground mt-1">Cause: {err.cause}</p>}
                            {err.suggestion && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Fix: {err.suggestion}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {result.semantic.warnings.slice(0, 5).map((w, i) => (
                      <div key={i} className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                        <p className="text-xs text-amber-700 dark:text-amber-300"><AlertTriangle className="w-3 h-3 inline mr-1" />{w}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <Play className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Click "Run & Analyze" to see results</p>
                <p className="text-sm text-muted-foreground mt-1">Tokens, AST, symbol table, TAC, optimization, and target code</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
