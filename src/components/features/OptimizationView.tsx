import type { OptimizationResult } from "@/types";
import { CheckCircle2, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizationViewProps { result: OptimizationResult; }

export function OptimizationView({ result }: OptimizationViewProps) {
  const { original, optimized, applied, reductionPercent } = result;

  const formatInstr = (i: { op: string; arg1?: string; arg2?: string; result: string }) =>
    `${i.result} = ${i.arg1 ?? ""}${i.arg2 ? ` ${i.op} ${i.arg2}` : i.op !== "=" ? ` [${i.op}]` : ""}`.trim();

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card items-center text-center">
          <p className="text-2xl font-bold text-foreground">{original.length}</p>
          <p className="text-xs text-muted-foreground">Instructions Before</p>
        </div>
        <div className="stat-card items-center text-center border-primary/30 bg-primary/5">
          <p className="text-2xl font-bold text-primary">{optimized.length}</p>
          <p className="text-xs text-muted-foreground">Instructions After</p>
        </div>
        <div className="stat-card items-center text-center border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-5 h-5" />{reductionPercent}%
          </p>
          <p className="text-xs text-muted-foreground">Reduction</p>
        </div>
      </div>

      {/* Optimizations applied */}
      {applied.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Optimizations Applied</p>
          <div className="flex flex-wrap gap-2">
            {applied.map(opt => (
              <span key={opt} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />{opt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Before</p>
          <div className="code-output text-xs">
            {original.map((i, idx) => <div key={idx} className="text-muted-foreground">{formatInstr(i)}</div>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">After</p>
          <div className="code-output text-xs">
            {optimized.map((i, idx) => <div key={idx} className="text-emerald-600 dark:text-emerald-400">{formatInstr(i)}</div>)}
            {applied.length === 0 && <span className="text-muted-foreground">No optimizations applicable</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
