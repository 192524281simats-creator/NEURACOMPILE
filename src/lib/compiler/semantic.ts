import type { Token, SemanticResult, SymbolEntry, CompilerError, Language } from "@/types";

export function performSemanticAnalysis(tokens: Token[], source: string, lang: Language): SemanticResult {
  const symbolTable: SymbolEntry[] = [];
  const errors: CompilerError[] = [];
  const warnings: string[] = [];
  const declared = new Map<string, SymbolEntry>();

  const lines = source.split("\n");
  let scopeStack = ["global"];
  let scopeDepth = 0;

  const currentScope = () => scopeStack[scopeStack.length - 1];

  // Heuristic analysis based on tokens
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    // Scope detection
    if (tok.lexeme === "{") { scopeDepth++; scopeStack.push(`block_${scopeDepth}`); }
    if (tok.lexeme === "}") { scopeStack.pop(); if (scopeStack.length === 0) scopeStack = ["global"]; }

    // Variable declarations (C/C++)
    if ((lang === "c" || lang === "cpp") && ["int","float","double","char","bool","long","short"].includes(tok.lexeme) && tok.type === "KEYWORD") {
      let j = i + 1;
      while (j < tokens.length && tokens[j].lexeme !== ";") {
        if (tokens[j].type === "IDENTIFIER") {
          const name = tokens[j].lexeme;
          // Check duplicate
          if (declared.has(name + "_" + currentScope())) {
            errors.push({ type: "Semantic", message: `Variable '${name}' already declared in this scope`, line: tokens[j].line, suggestion: `Rename the variable or remove the duplicate declaration`, cause: "Duplicate declaration in the same scope" });
          } else {
            const entry: SymbolEntry = { name, type: tok.lexeme, scope: currentScope(), category: "variable", line: tokens[j].line, usages: [] };
            symbolTable.push(entry);
            declared.set(name + "_" + currentScope(), entry);
          }
        }
        j++;
      }
    }

    // Function declarations
    if ((lang === "c" || lang === "cpp") && ["int","void","float","double","char"].includes(tok.lexeme) && tok.type === "KEYWORD") {
      if (i + 1 < tokens.length && tokens[i+1].type === "IDENTIFIER" && i + 2 < tokens.length && tokens[i+2].lexeme === "(") {
        const name = tokens[i+1].lexeme;
        if (!declared.has(name + "_" + currentScope())) {
          const entry: SymbolEntry = { name, type: tok.lexeme, scope: currentScope(), category: "function", line: tokens[i+1].line, usages: [] };
          symbolTable.push(entry);
          declared.set(name + "_" + currentScope(), entry);
        }
      }
    }

    // Python function declarations
    if (lang === "python" && tok.lexeme === "def" && i + 1 < tokens.length) {
      const name = tokens[i+1]?.lexeme;
      if (name && tokens[i+1]?.type === "IDENTIFIER") {
        const entry: SymbolEntry = { name, type: "function", scope: currentScope(), category: "function", line: tok.line, usages: [] };
        symbolTable.push(entry);
        declared.set(name + "_" + currentScope(), entry);
      }
    }

    // Track identifier usage
    if (tok.type === "IDENTIFIER") {
      const entry = declared.get(tok.lexeme + "_" + currentScope()) || declared.get(tok.lexeme + "_global");
      if (entry) {
        entry.usages.push(tok.line);
      }
    }
  }

  // Check for undeclared variables (usage before declaration) for C/C++
  if (lang === "c" || lang === "cpp") {
    const allDeclaredNames = new Set(symbolTable.map(s => s.name));
    const coreKeywords = new Set(["printf","scanf","main","cout","cin","endl","NULL","true","false"]);
    for (const tok of tokens) {
      if (tok.type === "IDENTIFIER" && !allDeclaredNames.has(tok.lexeme) && !coreKeywords.has(tok.lexeme)) {
        // Only warn, don't error (we do simple analysis)
        warnings.push(`Identifier '${tok.lexeme}' at line ${tok.line} may be undeclared or from an external header`);
      }
    }
  }

  // Unused variable detection
  for (const entry of symbolTable) {
    if (entry.category === "variable" && entry.usages.length <= 1) {
      warnings.push(`Variable '${entry.name}' declared at line ${entry.line} may be unused`);
    }
  }

  return { symbolTable, errors, warnings };
}
