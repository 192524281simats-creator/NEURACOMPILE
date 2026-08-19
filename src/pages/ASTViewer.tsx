import { useState } from "react";
import { generateParseTree, buildAST } from "@/lib/compiler";
import { TreeVisualizer } from "@/components/features/TreeVisualizer";
import { TreePine, Play } from "lucide-react";

const EXAMPLES = ["a + b * c", "( a + b ) * ( c - d )", "x / y + z * w", "10 * 5 + 3 - 2"];

export default function ASTViewerPage() {
  const [expr, setExpr] = useState("a + b * c");
  const [result, setResult] = useState<{ parseTree: ReturnType<typeof generateParseTree>; ast: ReturnType<typeof buildAST> | null } | null>(null);

  const handleGenerate = () => {
    const pt = generateParseTree(expr);
    const ast = pt.tree ? buildAST(pt.tree) : null;
    setResult({ parseTree: pt, ast });
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><TreePine className="w-6 h-6 text-primary" />AST Viewer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">See how grammar-specific nodes are removed from the parse tree to build a cleaner AST</p>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border text-sm">
        <p className="font-semibold text-foreground mb-2">Parse Tree vs AST</p>
        <p className="text-muted-foreground">The <strong className="text-foreground">Parse Tree</strong> reflects the grammar structure exactly, including all intermediate non-terminals (E', T', F...). The <strong className="text-foreground">Abstract Syntax Tree (AST)</strong> removes these grammar artifacts, keeping only the semantically meaningful nodes.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input value={expr} onChange={e => setExpr(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={e => e.key === "Enter" && handleGenerate()} />
        <button onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
          <Play className="w-4 h-4" /> Generate
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => { setExpr(ex); setResult(null); }}
            className="px-3 py-1.5 rounded-full text-xs font-mono border border-border hover:border-primary hover:bg-primary/5 transition-all">
            {ex}
          </button>
        ))}
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.parseTree.tree && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Parse Tree <span className="text-xs text-muted-foreground font-normal">(includes E', T', F nodes)</span></p>
              <TreeVisualizer tree={result.parseTree.tree} />
            </div>
          )}
          {result.ast && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-primary mb-3">Abstract Syntax Tree <span className="text-xs text-primary/70 font-normal">(grammar artifacts removed)</span></p>
              <TreeVisualizer tree={result.ast} isAST />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
