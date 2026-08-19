import { useState } from "react";
import { generateParseTree, buildAST } from "@/lib/compiler";
import { TreeVisualizer } from "@/components/features/TreeVisualizer";
import { GitBranch, Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { label: "a + b * c", value: "a + b * c" },
  { label: "( a + b ) * c", value: "( a + b ) * c" },
  { label: "a + b - c + d", value: "a + b - c + d" },
  { label: "10 * 5 + 3", value: "10 * 5 + 3" },
  { label: "x / ( y - z )", value: "x / ( y - z )" },
];

type View = "parse" | "ast" | "compare";

export default function ParseTreePage() {
  const [expr, setExpr] = useState("a + b * c");
  const [result, setResult] = useState<ReturnType<typeof generateParseTree> | null>(null);
  const [view, setView] = useState<View>("parse");

  const handleGenerate = () => {
    const r = generateParseTree(expr);
    setResult(r);
  };

  const ast = result?.tree ? buildAST(result.tree) : null;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><GitBranch className="w-6 h-6 text-primary" />Parse Tree Generator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter an arithmetic expression to generate an interactive parse tree using LL grammar</p>
      </div>

      {/* Grammar info */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grammar Used (Left-Recursive Eliminated)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
          {["E → T E'", "E' → + T E' | - T E' | ε", "T → F T'", "T' → * F T' | / F T' | ε", "F → ( E ) | id | num"].map(p => (
            <span key={p} className="px-2 py-1 bg-muted rounded text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-wrap">
        <input value={expr} onChange={e => setExpr(e.target.value)}
          placeholder="Enter expression: a + b * c"
          className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={e => e.key === "Enter" && handleGenerate()} />
        <button onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
          <Play className="w-4 h-4" /> Generate Tree
        </button>
        <button onClick={() => setResult(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map(ex => (
          <button key={ex.value} onClick={() => { setExpr(ex.value); setResult(null); }}
            className="px-3 py-1.5 rounded-full text-xs font-mono border border-border hover:border-primary hover:bg-primary/5 transition-all">
            {ex.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-4">
          {result.error ? (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">{result.error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Generated in {result.steps} parsing steps</p>
                <div className="flex gap-1">
                  {(["parse","ast","compare"] as View[]).map(v => (
                    <button key={v} onClick={() => setView(v)} className={cn("tab-btn capitalize", view === v && "active")}>
                      {v === "parse" ? "Parse Tree" : v === "ast" ? "AST" : "Side by Side"}
                    </button>
                  ))}
                </div>
              </div>

              {view === "parse" && result.tree && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Parse Tree — Click nodes to inspect</p>
                  <TreeVisualizer tree={result.tree} />
                </div>
              )}
              {view === "ast" && ast && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Abstract Syntax Tree — Grammar artifacts removed</p>
                  <TreeVisualizer tree={ast} isAST />
                </div>
              )}
              {view === "compare" && result.tree && ast && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Parse Tree</p>
                    <TreeVisualizer tree={result.tree} />
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Abstract Syntax Tree</p>
                    <TreeVisualizer tree={ast} isAST />
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30 inline-block" />Non-terminal</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 inline-block" />Terminal</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary/20 inline-block" />Selected</span>
                <span className="ml-2">· Click nodes for details · Click arrows to collapse</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
