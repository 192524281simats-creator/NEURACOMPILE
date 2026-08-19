import type { CodeInsight } from "@/types";
import { Code, Variable, Repeat, GitBranch, Zap, AlertTriangle } from "lucide-react";

function computeInsight(source: string): CodeInsight {
  const lines = source.split("\n").filter(l => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("#"));
  const loc = lines.length;
  const identifierMatches = source.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
  const declarations = source.match(/\b(int|float|double|char|bool|auto|var|let|const)\s+[a-zA-Z_]/g) || [];
  const functions = source.match(/\b(def|void|int|float|double|char)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g) || [];
  const conditions = (source.match(/\bif\s*\(/g) || []).length + (source.match(/\belif\s*\(/g) || []).length + (source.match(/\bswitch\s*\(/g) || []).length;
  const loops = (source.match(/\bwhile\s*\(/g) || []).length + (source.match(/\bfor\s*\(/g) || []).length;
  const operators = (source.match(/[+\-*/%=<>!&|^]+/g) || []).length;

  const opts: string[] = [];
  if (source.match(/\b\d+\s*[+\-*\/]\s*\d+/)) opts.push("Constant folding possible");
  if (source.match(/\+\s*0\b|\b0\s*\+|\*\s*1\b|\b1\s*\*/)) opts.push("Algebraic simplification applicable");
  if (declarations.length > 0) opts.push("Check for unused variables");

  const complexity: "Low" | "Medium" | "High" = conditions + loops > 5 ? "High" : conditions + loops > 2 ? "Medium" : "Low";

  return { loc, variables: declarations.length, functions: Math.max(0, functions.length - 1), conditions, loops, operators, complexity, optimizationOpportunities: opts, unusedVars: [] };
}

const COMPLEXITY_COLORS: Record<string, string> = {
  Low: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  High: "text-red-600 dark:text-red-400",
};

export function CodeInsightPanel({ source }: { source: string }) {
  if (!source.trim()) return null;
  const insight = computeInsight(source);
  const metrics = [
    { icon: Code, label: "Lines of Code", value: insight.loc },
    { icon: Variable, label: "Variables", value: insight.variables },
    { icon: GitBranch, label: "Functions", value: insight.functions },
    { icon: GitBranch, label: "Conditions", value: insight.conditions },
    { icon: Repeat, label: "Loops", value: insight.loops },
    { icon: Zap, label: "Operators", value: insight.operators },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="stat-card p-3 gap-1">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
            </div>
          );
        })}
      </div>
      <div className="stat-card p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Complexity</span>
          <span className={`font-semibold text-sm ${COMPLEXITY_COLORS[insight.complexity]}`}>{insight.complexity}</span>
        </div>
      </div>
      {insight.optimizationOpportunities.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Optimization Opportunities
          </div>
          {insight.optimizationOpportunities.map((o, i) => (
            <p key={i} className="text-xs text-amber-700 dark:text-amber-300">• {o}</p>
          ))}
        </div>
      )}
    </div>
  );
}
