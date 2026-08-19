import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const PHASES = [
  { id: "lexical", label: "Lexical Analysis", short: "Tokens" },
  { id: "syntax", label: "Syntax Analysis", short: "Parse Tree" },
  { id: "ast", label: "AST Generation", short: "AST" },
  { id: "semantic", label: "Semantic Analysis", short: "Symbol Table" },
  { id: "tac", label: "TAC Generation", short: "TAC" },
  { id: "optimization", label: "Optimization", short: "Optimize" },
  { id: "target", label: "Target Code", short: "Assembly" },
];

interface PipelineProgressProps {
  active: string;
  completed: string[];
  loading?: boolean;
  onPhaseClick?: (id: string) => void;
}

export function PipelineProgress({ active, completed, loading, onPhaseClick }: PipelineProgressProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1">
      {PHASES.map((phase, i) => {
        const isDone = completed.includes(phase.id);
        const isActive = active === phase.id;
        return (
          <div key={phase.id} className="flex items-center">
            <button
              onClick={() => onPhaseClick?.(phase.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap",
                isDone && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-pointer hover:opacity-80",
                isActive && "bg-primary text-primary-foreground",
                !isDone && !isActive && "bg-muted text-muted-foreground cursor-default"
              )}
            >
              {loading && isActive ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isDone ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
              {phase.short}
            </button>
            {i < PHASES.length - 1 && (
              <div className={cn("w-3 h-px mx-0.5", isDone ? "bg-emerald-400" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
