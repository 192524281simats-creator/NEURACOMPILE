import { useState } from "react";
import { generateTAC } from "@/lib/compiler/tac";
import { optimize } from "@/lib/compiler/optimizer";
import { generateTargetCode } from "@/lib/compiler/targetCode";
import { Cpu, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE = "int a = 10;\nint b = 20;\nint c = a + b * 2;\nreturn c;";

export default function TargetCodePage() {
  const [code, setCode] = useState(SAMPLE);
  const [target, setTarget] = useState<ReturnType<typeof generateTargetCode> | null>(null);

  const handleGenerate = () => {
    const tac = generateTAC(code);
    const opt = optimize(tac);
    setTarget(generateTargetCode(opt.optimized));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Cpu className="w-6 h-6 text-primary" />Target Code Generator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Educational target code / simplified assembly from TAC</p>
      </div>

      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
        ⚠️ This is <strong>educational target code</strong> — a simplified assembly-like representation for learning purposes. It is not real x86/ARM assembly and is not executable.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={10}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            <Play className="w-4 h-4" /> Generate Target Code
          </button>
        </div>

        <div>
          {target ? (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2 bg-muted border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground">Target Code Output</p>
              </div>
              <div className="p-4 font-mono text-xs space-y-0.5 overflow-auto max-h-80">
                {target.map((line, i) => (
                  <div key={i} className={cn("flex gap-4", line.instruction.startsWith(";") && "text-muted-foreground italic")}>
                    <span className={cn("w-52 shrink-0", line.instruction.endsWith(":") && "text-amber-600 dark:text-amber-400 font-semibold", !line.instruction.startsWith(";") && !line.instruction.endsWith(":") && "text-primary")}>
                      {line.instruction}
                    </span>
                    {line.comment && <span className="text-muted-foreground">; {line.comment}</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-border text-center">
              <div>
                <Cpu className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Generate target code to see assembly output</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
