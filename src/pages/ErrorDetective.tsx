import { useState } from "react";
import { runFullPipeline } from "@/lib/compiler";
import type { Language, CompilerError } from "@/types";
import { Bug, Play, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const BUGGY_EXAMPLES = [
  { label: "Undeclared variable", lang: "c" as Language, code: "int main() {\n    x = 10;\n    int y = x + z;\n    return y;\n}" },
  { label: "Type mismatch hint", lang: "c" as Language, code: "int a = 3.14;\nchar* b = 100;\nfloat c = \"hello\";" },
  { label: "Missing semicolon sim", lang: "c" as Language, code: "int main() {\n    int a = 5\n    int b = a + 3\n    return b\n}" },
];

const ERROR_COLORS: Record<string, string> = {
  Lexical: "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
  Syntax: "border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
  Semantic: "border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800",
  Grammar: "border-violet-300 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-800",
  Type: "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
};

const ERROR_TEXT: Record<string, string> = {
  Lexical: "text-red-700 dark:text-red-400",
  Syntax: "text-orange-700 dark:text-orange-400",
  Semantic: "text-amber-700 dark:text-amber-400",
  Grammar: "text-violet-700 dark:text-violet-400",
  Type: "text-blue-700 dark:text-blue-400",
};

export default function ErrorDetective() {
  const [code, setCode] = useState(BUGGY_EXAMPLES[0].code);
  const [lang, setLang] = useState<Language>("c");
  const [errors, setErrors] = useState<CompilerError[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    const result = runFullPipeline(code, lang);
    setErrors(result.errors);
    setWarnings(result.semantic.warnings);
    setAnalyzed(true);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bug className="w-6 h-6 text-primary" />Error Detective</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Detect and understand lexical, syntax, and semantic errors with detailed explanations and fix suggestions</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BUGGY_EXAMPLES.map(ex => (
          <button key={ex.label} onClick={() => { setCode(ex.code); setLang(ex.lang); setAnalyzed(false); setErrors([]); }}
            className="px-3 py-1.5 rounded-full text-xs border border-border hover:border-destructive hover:bg-destructive/5 transition-all">
            🐛 {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select value={lang} onChange={e => setLang(e.target.value as Language)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {(["c","cpp","python"] as Language[]).map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={12}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Bug className="w-4 h-4" /> Detect Errors
          </button>
        </div>

        <div className="space-y-3">
          {analyzed && errors.length === 0 && warnings.length === 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">✅ No errors detected!</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">The code passed all analysis checks.</p>
            </div>
          )}

          {errors.map((err, i) => (
            <div key={i} className={cn("p-4 rounded-xl border", ERROR_COLORS[err.type] || "border-border bg-card")}>
              <div className="flex items-start gap-3">
                <Bug className={cn("w-4 h-4 shrink-0 mt-0.5", ERROR_TEXT[err.type] || "text-foreground")} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-bold uppercase tracking-wider", ERROR_TEXT[err.type])}>{err.type} Error</span>
                    <span className="text-xs text-muted-foreground">Line {err.line}{err.column ? `, Col ${err.column}` : ""}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-2">{err.message}</p>
                  {err.cause && (
                    <div className="flex items-start gap-1.5 mb-1">
                      <span className="text-xs font-medium text-muted-foreground w-12 shrink-0">Cause:</span>
                      <p className="text-xs text-muted-foreground">{err.cause}</p>
                    </div>
                  )}
                  {err.expected && (
                    <div className="flex items-start gap-1.5 mb-1">
                      <span className="text-xs font-medium text-muted-foreground w-12 shrink-0">Expected:</span>
                      <p className="text-xs font-mono text-foreground">{err.expected}</p>
                    </div>
                  )}
                  {err.suggestion && (
                    <div className="flex items-start gap-1.5 mt-2 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">{err.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {warnings.slice(0, 5).map((w, i) => (
            <div key={i} className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-300">⚠ Warning: {w}</p>
            </div>
          ))}

          {!analyzed && (
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-border text-center">
              <div>
                <Bug className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Paste code with errors and click Detect Errors</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
