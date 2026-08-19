import { useState } from "react";
import { computeFirstFollow, parseGrammar } from "@/lib/compiler";
import { FlaskConical, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParseStep { stack: string[]; input: string[]; action: string; }

function simulateLL1(tableMap: Record<string, Record<string, string>>, input: string, startSymbol: string, nonTerminals: string[]): ParseStep[] {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const inputBuf = [...tokens, "$"];
  const stack = ["$", startSymbol];
  const steps: ParseStep[] = [];
  let pos = 0;
  let limit = 50;

  while (stack.length > 0 && limit-- > 0) {
    const top = stack[stack.length - 1];
    const curr = inputBuf[pos] ?? "$";
    let action = "";

    if (top === "$" && curr === "$") {
      action = "ACCEPT ✓";
      steps.push({ stack: [...stack], input: inputBuf.slice(pos), action });
      break;
    } else if (top === curr) {
      action = `Match '${top}'`;
      stack.pop();
      pos++;
    } else if (!nonTerminals.includes(top)) {
      action = `ERROR: expected '${top}', got '${curr}'`;
      steps.push({ stack: [...stack], input: inputBuf.slice(pos), action });
      break;
    } else {
      const prod = tableMap[top]?.[curr];
      if (!prod) {
        action = `ERROR: no entry for [${top}, ${curr}]`;
        steps.push({ stack: [...stack], input: inputBuf.slice(pos), action });
        break;
      }
      const rhs = prod === "ε" ? [] : prod.split(" ");
      stack.pop();
      for (let i = rhs.length - 1; i >= 0; i--) stack.push(rhs[i]);
      action = `${top} → ${prod}`;
    }
    steps.push({ stack: [...stack], input: inputBuf.slice(pos), action });
  }
  return steps;
}

const DEFAULT_GRAMMAR = `E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | id`;

export default function ParserLabPage() {
  const [grammar, setGrammar] = useState(DEFAULT_GRAMMAR);
  const [input, setInput] = useState("id + id * id");
  const [steps, setSteps] = useState<ParseStep[]>([]);
  const [ran, setRan] = useState(false);

  const handleRun = () => {
    const g = parseGrammar(grammar);
    const ff = computeFirstFollow(g);
    const s = simulateLL1(ff.parsingTable, input, g.startSymbol, g.nonTerminals);
    setSteps(s);
    setRan(true);
  };

  const accepted = steps[steps.length - 1]?.action.includes("ACCEPT");

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FlaskConical className="w-6 h-6 text-primary" />Parser Lab</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Simulate LL(1) predictive parsing — step by step stack/input trace</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Grammar</label>
            <textarea value={grammar} onChange={e => setGrammar(e.target.value)} rows={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Input String (space-separated tokens)</label>
            <input value={input} onChange={e => setInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={handleRun}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Simulate Parsing
          </button>
        </div>

        <div>
          {ran && (
            <div className="space-y-3">
              <div className={cn("p-3 rounded-xl border text-sm font-medium",
                accepted ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400")}>
                {accepted ? "✓ Input ACCEPTED by grammar" : "✗ Parse ERROR — input rejected"}
              </div>
              <div className="rounded-xl border border-border overflow-auto max-h-80">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 text-muted-foreground w-8">#</th>
                      <th className="text-left px-3 py-2 text-muted-foreground">Stack</th>
                      <th className="text-left px-3 py-2 text-muted-foreground">Input</th>
                      <th className="text-left px-3 py-2 text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((s, i) => (
                      <tr key={i} className={cn("border-t border-border", s.action.includes("ACCEPT") && "bg-emerald-50/50 dark:bg-emerald-900/10", s.action.includes("ERROR") && "bg-red-50/50 dark:bg-red-900/10")}>
                        <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-1.5">[{s.stack.join(", ")}]</td>
                        <td className="px-3 py-1.5">{s.input.join(" ")}</td>
                        <td className={cn("px-3 py-1.5", s.action.includes("ACCEPT") && "text-emerald-600 dark:text-emerald-400 font-semibold", s.action.includes("ERROR") && "text-red-600 dark:text-red-400 font-semibold", s.action.startsWith("Match") && "text-blue-600 dark:text-blue-400")}>{s.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!ran && (
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-border text-center">
              <div>
                <FlaskConical className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Enter grammar and input to simulate LL(1) parsing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
