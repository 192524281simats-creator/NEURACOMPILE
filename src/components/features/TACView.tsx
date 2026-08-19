import type { TACInstruction } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Info } from "lucide-react";

type View = "tac" | "quadruple" | "triple";

interface TACViewProps { instructions: TACInstruction[]; }

export function TACView({ instructions }: TACViewProps) {
  const [view, setView] = useState<View>("tac");
  const [selected, setSelected] = useState<TACInstruction | null>(null);

  if (instructions.length === 0) return (
    <div className="text-center py-8 text-muted-foreground text-sm">No TAC generated. Run analysis on source code with expressions.</div>
  );

  const VIEWS: { id: View; label: string }[] = [
    { id: "tac", label: "Three Address Code" },
    { id: "quadruple", label: "Quadruples" },
    { id: "triple", label: "Triples" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} className={cn("tab-btn", view === v.id && "active")}>{v.label}</button>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        {view === "tac" && (
          <table className="w-full text-sm font-mono">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 text-muted-foreground w-8">#</th>
                <th className="text-left px-3 py-2 text-muted-foreground">Instruction</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {instructions.map((instr) => (
                <tr key={instr.id} className={cn("border-t border-border hover:bg-accent/50 cursor-pointer transition-colors", selected === instr && "bg-primary/5")}
                  onClick={() => setSelected(instr)}>
                  <td className="px-3 py-1.5 text-muted-foreground">{instr.id}</td>
                  <td className="px-3 py-1.5">
                    <span className="text-foreground">{instr.result}</span>
                    <span className="text-muted-foreground"> = </span>
                    {instr.arg1 && <span className="text-primary">{instr.arg1}</span>}
                    {instr.arg2 && <><span className="text-muted-foreground"> {instr.op} </span><span className="text-primary">{instr.arg2}</span></>}
                    {!instr.arg2 && instr.op !== "=" && <span className="text-amber-500"> [{instr.op}]</span>}
                  </td>
                  <td className="px-3 py-1.5">
                    <button onClick={e => { e.stopPropagation(); setSelected(instr); }}
                      className="p-1 rounded hover:bg-accent" title="Why?">
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === "quadruple" && (
          <table className="w-full text-sm font-mono">
            <thead className="bg-muted">
              <tr>
                {["#","Op","Arg1","Arg2","Result"].map(h => <th key={h} className="text-left px-3 py-2 text-muted-foreground">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {instructions.map(instr => (
                <tr key={instr.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                  <td className="px-3 py-1.5 text-muted-foreground">{instr.id}</td>
                  {instr.quadruple.map((v, i) => <td key={i} className={cn("px-3 py-1.5", i === 0 && "text-red-500", i === 3 && "text-primary")}>{v || "_"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === "triple" && (
          <table className="w-full text-sm font-mono">
            <thead className="bg-muted">
              <tr>
                {["#","Op","Arg1","Arg2"].map(h => <th key={h} className="text-left px-3 py-2 text-muted-foreground">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {instructions.map(instr => (
                <tr key={instr.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                  <td className="px-3 py-1.5 text-muted-foreground">({instr.id - 1})</td>
                  {instr.triple.map((v, i) => <td key={i} className={cn("px-3 py-1.5", i === 0 && "text-red-500")}>{v?.startsWith("t") ? `(${parseInt(v.slice(1)) - 1})` : (v || "_")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-foreground mb-1">Instruction {selected.id}</p>
              <p className="text-muted-foreground">{selected.explanation}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground text-xs px-2 py-1 rounded hover:bg-accent">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
