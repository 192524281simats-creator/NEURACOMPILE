import type { Token } from "@/types";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useState } from "react";

const TYPE_COLORS: Record<string, string> = {
  KEYWORD: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  IDENTIFIER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  CONSTANT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  STRING: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  OPERATOR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  SYMBOL: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  COMMENT: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  REGEX: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  LEX_ACTION: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

interface TokenTableProps { tokens: Token[]; }

export function TokenTable({ tokens }: TokenTableProps) {
  const [selected, setSelected] = useState<Token | null>(null);
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-lg border border-border max-h-72">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-8">#</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Lexeme</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Token Type</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Line</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Col</th>
              <th className="px-3 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((tok, i) => (
              <tr key={i} onClick={() => setSelected(tok)}
                className={cn("border-t border-border cursor-pointer hover:bg-accent/50 transition-colors", selected === tok && "bg-primary/5")}>
                <td className="px-3 py-1.5 text-muted-foreground font-mono">{i + 1}</td>
                <td className="px-3 py-1.5 font-mono font-medium">{tok.lexeme}</td>
                <td className="px-3 py-1.5">
                  <span className={cn("badge-pill", TYPE_COLORS[tok.type] || "bg-muted text-muted-foreground")}>{tok.type}</span>
                </td>
                <td className="px-3 py-1.5 text-muted-foreground">{tok.line}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{tok.column}</td>
                <td className="px-3 py-1.5">
                  <button onClick={e => { e.stopPropagation(); setSelected(tok); setShowWhy(true); }}
                    className="p-1 rounded hover:bg-accent transition-colors" title="Why?">
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                <span className="font-mono text-primary">'{selected.lexeme}'</span> — {selected.type}
              </p>
              <p className="text-sm text-muted-foreground">{selected.explanation}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 rounded hover:bg-accent">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
