import type { SymbolEntry } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SymbolTableViewProps { symbols: SymbolEntry[]; }

const CATEGORY_COLORS: Record<string, string> = {
  variable: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  function: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  parameter: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  constant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export function SymbolTableView({ symbols }: SymbolTableViewProps) {
  const [selected, setSelected] = useState<SymbolEntry | null>(null);

  if (symbols.length === 0) return (
    <div className="text-center py-8 text-muted-foreground text-sm">No symbols found. Run semantic analysis first.</div>
  );

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {["Name","Type","Category","Scope","Line","Usages"].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symbols.map((sym, i) => (
              <tr key={i} onClick={() => setSelected(sym)}
                className={cn("border-t border-border cursor-pointer hover:bg-accent/50 transition-colors", selected === sym && "bg-primary/5")}>
                <td className="px-3 py-2 font-mono font-medium text-primary">{sym.name}</td>
                <td className="px-3 py-2 font-mono">{sym.type}</td>
                <td className="px-3 py-2">
                  <span className={cn("badge-pill", CATEGORY_COLORS[sym.category] || "bg-muted text-muted-foreground")}>{sym.category}</span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{sym.scope}</td>
                <td className="px-3 py-2 text-muted-foreground">{sym.line}</td>
                <td className="px-3 py-2 text-muted-foreground">{sym.usages.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-foreground mb-1">
                <span className="font-mono text-primary">{selected.name}</span> : {selected.type}
              </p>
              <p className="text-muted-foreground">Declared at line {selected.line} in scope '{selected.scope}'</p>
              {selected.usages.length > 0 && (
                <p className="text-muted-foreground mt-1">Used at lines: {selected.usages.join(", ")}</p>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 rounded hover:bg-accent">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
