import type { TACInstruction, OptimizationResult } from "@/types";

function cloneInstructions(instrs: TACInstruction[]): TACInstruction[] {
  return instrs.map(i => ({ ...i, quadruple: [...i.quadruple] as [string,string,string,string], triple: [...i.triple] as [string,string,string] }));
}

function isNumeric(s: string | undefined): boolean { return s !== undefined && !isNaN(Number(s)); }
function eval2(op: string, a: string, b: string): string | null {
  const na = Number(a), nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return null;
  switch (op) {
    case "+": return String(na + nb);
    case "-": return String(na - nb);
    case "*": return String(na * nb);
    case "/": return nb !== 0 ? String(na / nb) : null;
    case "%": return nb !== 0 ? String(na % nb) : null;
    default: return null;
  }
}

export function optimize(original: TACInstruction[]): OptimizationResult {
  let instrs = cloneInstructions(original);
  const applied: string[] = [];

  // 1. Constant Folding
  let changed = true;
  while (changed) {
    changed = false;
    for (const instr of instrs) {
      if (instr.op && isNumeric(instr.arg1) && isNumeric(instr.arg2)) {
        const result = eval2(instr.op, instr.arg1!, instr.arg2!);
        if (result !== null) {
          instr.op = "=";
          instr.arg1 = result;
          instr.arg2 = undefined;
          instr.explanation = `Constant folding: computed ${instr.arg1} at compile time`;
          changed = true;
          if (!applied.includes("Constant Folding")) applied.push("Constant Folding");
        }
      }
    }
  }

  // 2. Algebraic Simplification
  for (const instr of instrs) {
    if (instr.op === "+" && instr.arg2 === "0") {
      instr.op = "="; instr.arg2 = undefined; instr.explanation = `Algebraic simplification: x + 0 = x`;
      if (!applied.includes("Algebraic Simplification")) applied.push("Algebraic Simplification");
    }
    if (instr.op === "+" && instr.arg1 === "0") {
      instr.op = "="; instr.arg1 = instr.arg2; instr.arg2 = undefined; instr.explanation = `Algebraic simplification: 0 + x = x`;
      if (!applied.includes("Algebraic Simplification")) applied.push("Algebraic Simplification");
    }
    if (instr.op === "*" && (instr.arg2 === "1" || instr.arg1 === "1")) {
      instr.op = "="; instr.arg1 = instr.arg2 === "1" ? instr.arg1 : instr.arg2; instr.arg2 = undefined;
      instr.explanation = `Algebraic simplification: x * 1 = x`;
      if (!applied.includes("Algebraic Simplification")) applied.push("Algebraic Simplification");
    }
    if (instr.op === "*" && (instr.arg2 === "0" || instr.arg1 === "0")) {
      instr.op = "="; instr.arg1 = "0"; instr.arg2 = undefined;
      instr.explanation = `Algebraic simplification: x * 0 = 0`;
      if (!applied.includes("Algebraic Simplification")) applied.push("Algebraic Simplification");
    }
    if (instr.op === "-" && instr.arg2 === "0") {
      instr.op = "="; instr.arg2 = undefined; instr.explanation = `Algebraic simplification: x - 0 = x`;
      if (!applied.includes("Algebraic Simplification")) applied.push("Algebraic Simplification");
    }
  }

  // 3. Constant Propagation
  const constants = new Map<string, string>();
  changed = true;
  while (changed) {
    changed = false;
    for (const instr of instrs) {
      if (instr.op === "=" && isNumeric(instr.arg1) && !instr.arg2) {
        if (constants.get(instr.result) !== instr.arg1) { constants.set(instr.result, instr.arg1!); changed = true; }
      }
      if (instr.arg1 && constants.has(instr.arg1)) {
        instr.arg1 = constants.get(instr.arg1)!; changed = true;
        if (!applied.includes("Constant Propagation")) applied.push("Constant Propagation");
      }
      if (instr.arg2 && constants.has(instr.arg2)) {
        instr.arg2 = constants.get(instr.arg2)!; changed = true;
        if (!applied.includes("Constant Propagation")) applied.push("Constant Propagation");
      }
    }
  }

  // 4. Common Subexpression Elimination
  const seen = new Map<string, string>();
  for (const instr of instrs) {
    if (instr.op && instr.op !== "=" && instr.op !== "RETURN" && instr.op !== "PRINT" && instr.arg1 && instr.arg2) {
      const key = `${instr.arg1}${instr.op}${instr.arg2}`;
      if (seen.has(key)) {
        instr.op = "="; instr.arg1 = seen.get(key)!; instr.arg2 = undefined;
        instr.explanation = `Common subexpression elimination: reuse already computed value ${instr.arg1}`;
        if (!applied.includes("Common Subexpression Elimination")) applied.push("Common Subexpression Elimination");
      } else {
        seen.set(key, instr.result);
      }
    }
  }

  // 5. Dead Code Elimination
  const used = new Set<string>();
  for (const instr of instrs) {
    if (instr.arg1) used.add(instr.arg1);
    if (instr.arg2) used.add(instr.arg2);
    if (instr.op === "RETURN" || instr.op === "PRINT") used.add(instr.arg1 ?? "");
  }
  const before = instrs.length;
  instrs = instrs.filter(instr => {
    if (instr.result.startsWith("t") && !used.has(instr.result)) {
      if (!applied.includes("Dead Code Elimination")) applied.push("Dead Code Elimination");
      return false;
    }
    return true;
  });

  const reductionPercent = original.length > 0 ? Math.round(((original.length - instrs.length) / original.length) * 100) : 0;
  return { original, optimized: instrs, applied, reductionPercent };
}
