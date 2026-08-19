import type { Language, CompilerPipelineResult } from "@/types";
import { tokenize, analyzeLexProgram } from "./lexer";
import { generateTAC } from "./tac";
import { optimize } from "./optimizer";
import { generateTargetCode } from "./targetCode";
import { performSemanticAnalysis } from "./semantic";
import { generateParseTree, buildAST } from "./parseTree";

export function runFullPipeline(source: string, lang: Language): CompilerPipelineResult {
  const lexical = lang === "lex" ? analyzeLexProgram(source) : tokenize(source, lang);

  // Extract first expression-like statement for parse tree
  const exprLine = extractExpression(source);
  const ptResult = generateParseTree(exprLine);
  const ast = ptResult.tree ? buildAST(ptResult.tree) : null;

  const semantic = performSemanticAnalysis(lexical.tokens, source, lang);
  const tac = generateTAC(source);
  const optimized = tac.length > 0 ? optimize(tac) : null;
  const targetCode = optimized ? generateTargetCode(optimized.optimized) : generateTargetCode(tac);

  return {
    language: lang,
    source,
    lexical,
    parseTree: ptResult.tree,
    ast,
    semantic,
    tac,
    optimized,
    targetCode,
    errors: [...lexical.errors, ...semantic.errors],
    timestamp: Date.now(),
  };
}

function extractExpression(source: string): string {
  const lines = source.split("\n").map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Look for assignment with expression
    const m = line.match(/[a-zA-Z_]\w*\s*=\s*(.+?)\s*;?$/);
    if (m && m[1] && m[1].match(/[+\-*/]/)) return m[1];
  }
  // Return something parseable
  for (const line of lines) {
    const m = line.match(/(.+?[+\-*/].+?)\s*;?$/);
    if (m) return m[1];
  }
  return "a + b * c";
}

export { tokenize, analyzeLexProgram } from "./lexer";
export { computeFirstFollow, parseGrammar, SAMPLE_GRAMMARS } from "./firstFollow";
export { generateTAC } from "./tac";
export { optimize } from "./optimizer";
export { generateTargetCode } from "./targetCode";
export { performSemanticAnalysis } from "./semantic";
export { generateParseTree, buildAST } from "./parseTree";
