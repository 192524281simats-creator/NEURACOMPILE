import type { Token, TACInstruction } from "@/types";

interface Expr { op?: string; left?: string; right?: string; value?: string; }

let tempCounter = 0;
const newTemp = () => `t${++tempCounter}`;

function genTACFromExprString(expr: string, instructions: TACInstruction[]): string {
  expr = expr.trim();
  // Parenthesized expression
  if (expr.startsWith("(") && findMatchingParen(expr) === expr.length - 1) {
    return genTACFromExprString(expr.slice(1, -1), instructions);
  }
  // Find lowest-precedence operator outside parens
  const ops = [["||"], ["&&"], ["==","!=","<=",">=","<",">"], ["+","-"], ["*","/","%"]];
  for (const group of ops) {
    const idx = findOpOutsideParen(expr, group);
    if (idx !== -1) {
      const op = group.find(o => expr.startsWith(o, idx))!;
      const left = genTACFromExprString(expr.slice(0, idx), instructions);
      const right = genTACFromExprString(expr.slice(idx + op.length), instructions);
      const temp = newTemp();
      const id = instructions.length + 1;
      instructions.push({
        id, op, arg1: left, arg2: right, result: temp,
        explanation: `Compute ${left} ${op} ${right} and store in temporary variable ${temp}`,
        quadruple: [op, left, right, temp],
        triple: [op, left, right],
      });
      return temp;
    }
  }
  return expr;
}

function findMatchingParen(s: string): number {
  let d = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") d++;
    if (s[i] === ")") { d--; if (d === 0) return i; }
  }
  return -1;
}

function findOpOutsideParen(expr: string, ops: string[]): number {
  let depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    if (expr[i] === ")") depth++;
    if (expr[i] === "(") depth--;
    if (depth === 0) {
      for (const op of ops) {
        if (expr.slice(i, i + op.length) === op) return i;
      }
    }
  }
  return -1;
}

export function generateTAC(source: string): TACInstruction[] {
  tempCounter = 0;
  const instructions: TACInstruction[] = [];
  const lines = source.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Skip declarations without assignment, comments, braces, etc.
    if (line.startsWith("//") || line.startsWith("#") || line === "{" || line === "}" || line.endsWith("{")) continue;
    if (line.startsWith("printf") || line.startsWith("cout") || line.startsWith("print")) {
      // I/O statement
      const match = line.match(/["']([^"']*)["']/);
      if (match) {
        const id = instructions.length + 1;
        instructions.push({ id, op: "PRINT", arg1: `"${match[1]}"`, result: "_", explanation: `Output operation: print the string literal`, quadruple: ["PRINT", `"${match[1]}"`, "_", "_"], triple: ["PRINT", `"${match[1]}"`, "_"] });
      }
      continue;
    }

    // Assignment: [type?] lhs = rhs ;
    const assignMatch = line.match(/^(?:int|float|double|char|bool|auto)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+?)\s*;?$/);
    if (assignMatch) {
      const lhs = assignMatch[1];
      const rhs = assignMatch[2].trim();
      const computed = genTACFromExprString(rhs, instructions);
      const id = instructions.length + 1;
      if (computed !== lhs) {
        instructions.push({ id, op: "=", arg1: computed, result: lhs, explanation: `Assign the value of ${computed} to variable ${lhs}`, quadruple: ["=", computed, "_", lhs], triple: ["=", computed, "_"] });
      }
      continue;
    }

    // Return statement
    const retMatch = line.match(/^return\s+(.+?)\s*;?$/);
    if (retMatch) {
      const val = genTACFromExprString(retMatch[1], instructions);
      const id = instructions.length + 1;
      instructions.push({ id, op: "RETURN", arg1: val, result: "_", explanation: `Return value ${val} from the current function`, quadruple: ["RETURN", val, "_", "_"], triple: ["RETURN", val, "_"] });
    }
  }

  return instructions;
}
