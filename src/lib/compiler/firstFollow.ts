import type { FirstFollowResult } from "@/types";

export interface Grammar {
  nonTerminals: string[];
  terminals: string[];
  productions: Record<string, string[][]>;
  startSymbol: string;
}

export function parseGrammar(input: string): Grammar {
  const productions: Record<string, string[][]> = {};
  const nonTerminals: string[] = [];
  const terminalSet = new Set<string>();

  const lines = input.trim().split("\n").filter(l => l.trim() && !l.startsWith("//"));
  for (const line of lines) {
    const parts = line.split("->").map(p => p.trim());
    if (parts.length < 2) continue;
    const lhs = parts[0].trim();
    if (!productions[lhs]) { productions[lhs] = []; nonTerminals.push(lhs); }
    const rhs = parts[1].split("|").map(alt => alt.trim().split(/\s+/).filter(Boolean));
    productions[lhs].push(...rhs);
  }

  const ntSet = new Set(nonTerminals);
  for (const prods of Object.values(productions)) {
    for (const prod of prods) {
      for (const sym of prod) {
        if (sym !== "ε" && sym !== "eps" && !ntSet.has(sym)) terminalSet.add(sym);
      }
    }
  }

  return { nonTerminals, terminals: [...terminalSet, "$"], productions, startSymbol: nonTerminals[0] || "" };
}

export function computeFirstFollow(grammar: Grammar): FirstFollowResult {
  const { nonTerminals, terminals, productions, startSymbol } = grammar;
  const steps: string[] = [];
  const nullable = new Set<string>();
  const first: Record<string, Set<string>> = {};
  const follow: Record<string, Set<string>> = {};

  for (const nt of nonTerminals) { first[nt] = new Set(); follow[nt] = new Set(); }
  for (const t of terminals) { first[t] = new Set([t]); }

  // Compute nullable
  let changed = true;
  while (changed) {
    changed = false;
    for (const [lhs, prods] of Object.entries(productions)) {
      for (const prod of prods) {
        if (prod.every(sym => sym === "ε" || sym === "eps" || nullable.has(sym))) {
          if (!nullable.has(lhs)) { nullable.add(lhs); changed = true; }
        }
      }
    }
  }
  steps.push(`Nullable symbols: {${[...nullable].join(", ") || "none"}}`);

  // Compute FIRST
  changed = true;
  while (changed) {
    changed = false;
    for (const [lhs, prods] of Object.entries(productions)) {
      for (const prod of prods) {
        if (prod[0] === "ε" || prod[0] === "eps") {
          // handled by nullable
        } else {
          for (const sym of prod) {
            const before = first[lhs].size;
            if (first[sym]) for (const f of first[sym]) if (f !== "ε") first[lhs].add(f);
            if (first[lhs].size !== before) changed = true;
            if (!nullable.has(sym)) break;
          }
        }
      }
    }
  }
  for (const nt of nonTerminals) {
    steps.push(`FIRST(${nt}) = {${[...first[nt]].join(", ")}}`);
  }

  // Compute FOLLOW
  if (startSymbol) follow[startSymbol].add("$");
  changed = true;
  while (changed) {
    changed = false;
    for (const [lhs, prods] of Object.entries(productions)) {
      for (const prod of prods) {
        for (let i = 0; i < prod.length; i++) {
          const sym = prod[i];
          if (!nonTerminals.includes(sym)) continue;
          const before = follow[sym]?.size ?? 0;
          // Add FIRST of the rest
          let allNullable = true;
          for (let j = i + 1; j < prod.length; j++) {
            const next = prod[j];
            if (first[next]) for (const f of first[next]) if (f !== "ε") follow[sym]?.add(f);
            if (!nullable.has(next)) { allNullable = false; break; }
          }
          if (allNullable) for (const f of (follow[lhs] ?? [])) follow[sym]?.add(f);
          if ((follow[sym]?.size ?? 0) !== before) changed = true;
        }
      }
    }
  }
  for (const nt of nonTerminals) {
    steps.push(`FOLLOW(${nt}) = {${[...follow[nt]].join(", ")}}`);
  }

  // Build LL(1) parsing table
  const parsingTable: Record<string, Record<string, string>> = {};
  const conflicts: string[] = [];
  for (const nt of nonTerminals) {
    parsingTable[nt] = {};
    for (const prod of productions[nt] ?? []) {
      const firstOfProd = new Set<string>();
      let allNull = true;
      for (const sym of prod) {
        if (sym === "ε" || sym === "eps") { break; }
        if (first[sym]) for (const f of first[sym]) if (f !== "ε") firstOfProd.add(f);
        if (!nullable.has(sym)) { allNull = false; break; }
      }
      if (allNull) for (const f of follow[nt]) firstOfProd.add(f);
      const prodStr = prod.join(" ");
      for (const terminal of firstOfProd) {
        if (parsingTable[nt][terminal]) {
          conflicts.push(`Conflict at [${nt}, ${terminal}]: '${parsingTable[nt][terminal]}' vs '${prodStr}'`);
        } else {
          parsingTable[nt][terminal] = prodStr;
        }
      }
    }
  }

  return { first, follow, nullable, parsingTable, steps, conflicts, isLL1: conflicts.length === 0 };
}

export const SAMPLE_GRAMMARS: Record<string, string> = {
  "Arithmetic Expression": `E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | id`,
  "Simple Statement": `S -> if E then S else S | while E do S | begin S L end | a\nL -> ; S L | ε\nE -> b`,
  "Identifier Assignment": `P -> S\nS -> id = E ;\nE -> E + T | T\nT -> T * F | F\nF -> ( E ) | id | num`,
  "Boolean Expr": `B -> B || C | C\nC -> C && D | D\nD -> ! D | ( B ) | id`,
};
