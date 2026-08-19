import { useState } from "react";
import { generateTAC } from "@/lib/compiler/tac";
import { TACView } from "@/components/features/TACView";
import { SAMPLE_PROGRAMS } from "@/lib/sampleCode";
import { FileCode, Play } from "lucide-react";

const EXAMPLES = [
  { label: "a + b * c", code: "int a = 5;\nint b = 3;\nint c = a + b * 2;\nreturn c;" },
  { label: "Factorial step", code: "int n = 5;\nint result = n * n - 1;\nreturn result;" },
  { label: "Chain ops", code: "int x = 10 * 5;\nint y = x + 0;\nint z = y * 1;\nreturn z;" },
];

export default function IntermediateCodePage() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [tac, setTAC] = useState<ReturnType<typeof generateTAC> | null>(null);

  const handleGenerate = () => setTAC(generateTAC(code));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileCode className="w-6 h-6 text-primary" />Intermediate Code Generator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Generate Three Address Code, Quadruples, and Triples from assignment statements</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map(ex => (
          <button key={ex.label} onClick={() => { setCode(ex.code); setTAC(null); }}
            className="px-3 py-1.5 rounded-full text-xs border border-border hover:border-primary hover:bg-primary/5 transition-all">
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Source Code (assignments with expressions)</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={10}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Generate Intermediate Code
          </button>
          <div className="p-3 rounded-xl bg-muted text-xs space-y-1 text-muted-foreground">
            <p className="font-semibold text-foreground">TAC Rules:</p>
            <p>• At most 3 addresses per instruction</p>
            <p>• Complex expressions use temporary variables (t1, t2...)</p>
            <p>• Operator precedence is respected (* before +)</p>
            <p>• Click any instruction row for explanation</p>
          </div>
        </div>

        <div>
          {tac ? (
            <div className="space-y-3">
              <TACView instructions={tac} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-border text-center">
              <div>
                <FileCode className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Generate intermediate code to see TAC, Quadruples, and Triples</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
