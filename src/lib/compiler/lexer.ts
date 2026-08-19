import type { Token, TokenType, LexicalResult, CompilerError, Language } from "@/types";

const C_KEYWORDS = new Set(["int","float","double","char","void","if","else","while","for","do","return","break","continue","switch","case","default","struct","union","typedef","enum","sizeof","const","static","extern","auto","register","long","short","unsigned","signed","volatile","include","define","printf","scanf","main"]);
const CPP_KEYWORDS = new Set([...C_KEYWORDS,"class","public","private","protected","new","delete","this","virtual","override","namespace","using","template","typename","bool","true","false","string","cout","cin","endl","vector","nullptr","auto","const_cast","dynamic_cast","static_cast","reinterpret_cast","try","catch","throw"]);
const PYTHON_KEYWORDS = new Set(["def","class","if","elif","else","while","for","in","return","break","continue","pass","import","from","as","with","try","except","finally","raise","lambda","yield","global","nonlocal","del","assert","not","and","or","is","None","True","False","print","input","range","len","int","float","str","bool","list","dict","tuple","set","type","isinstance","hasattr","getattr","setattr"]);
const LEX_KEYWORDS = new Set(["%{","%}","%%","%option","yytext","yyleng","yylex","yywrap","ECHO","BEGIN","INITIAL","return"]);

function getKeywords(lang: Language): Set<string> {
  if (lang === "cpp") return CPP_KEYWORDS;
  if (lang === "python") return PYTHON_KEYWORDS;
  if (lang === "lex") return LEX_KEYWORDS;
  return C_KEYWORDS;
}

function explainToken(lexeme: string, type: TokenType, lang: Language): string {
  switch (type) {
    case "KEYWORD": return `'${lexeme}' is a reserved keyword in ${lang.toUpperCase()}. Keywords have predefined meaning and cannot be used as identifiers.`;
    case "IDENTIFIER": return `'${lexeme}' is a user-defined identifier. It names a variable, function, or label in the source program.`;
    case "CONSTANT": return `'${lexeme}' is a numeric constant. Constants have fixed values known at compile time.`;
    case "STRING": return `'${lexeme}' is a string literal. The lexer captures the entire string including delimiters as one token.`;
    case "OPERATOR": return `'${lexeme}' is an operator. Operators specify operations on operands and drive expression evaluation.`;
    case "SYMBOL": return `'${lexeme}' is a punctuation symbol used to delimit statements, blocks, or expressions.`;
    case "COMMENT": return `'${lexeme}' is a comment. The lexer recognizes but discards comments before further processing.`;
    default: return `Token of type ${type}`;
  }
}

export function tokenize(source: string, lang: Language): LexicalResult {
  const tokens: Token[] = [];
  const errors: CompilerError[] = [];
  const keywords = getKeywords(lang);
  let i = 0, line = 1, col = 1;

  const peek = (offset = 0) => source[i + offset] || "";
  const advance = () => { const c = source[i++]; if (c === "\n") { line++; col = 1; } else col++; return c; };
  const addToken = (lexeme: string, type: TokenType, l: number, c: number) => {
    tokens.push({ lexeme, type, line: l, column: c, explanation: explainToken(lexeme, type, lang) });
  };

  while (i < source.length) {
    const startLine = line, startCol = col;
    const ch = peek();

    // Whitespace
    if (/\s/.test(ch)) { advance(); continue; }

    // Single-line comment
    if (ch === "/" && peek(1) === "/") {
      let cmt = "";
      while (i < source.length && peek() !== "\n") cmt += advance();
      addToken(cmt, "COMMENT", startLine, startCol);
      continue;
    }

    // Python/Shell comment
    if (ch === "#" && (lang === "python" || lang === "lex")) {
      let cmt = "";
      while (i < source.length && peek() !== "\n") cmt += advance();
      addToken(cmt, "COMMENT", startLine, startCol);
      continue;
    }

    // Multi-line comment
    if (ch === "/" && peek(1) === "*") {
      let cmt = ""; advance(); advance();
      while (i < source.length && !(peek() === "*" && peek(1) === "/")) cmt += advance();
      if (i < source.length) { advance(); advance(); }
      addToken("/*" + cmt + "*/", "COMMENT", startLine, startCol);
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = advance();
      let str = quote;
      while (i < source.length && peek() !== quote && peek() !== "\n") {
        if (peek() === "\\") { str += advance(); }
        str += advance();
      }
      if (peek() === quote) str += advance();
      addToken(str, "STRING", startLine, startCol);
      continue;
    }

    // Number
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(peek(1)))) {
      let num = "";
      while (i < source.length && /[0-9._]/.test(peek())) num += advance();
      if (peek() === "e" || peek() === "E") { num += advance(); if (peek() === "+" || peek() === "-") num += advance(); while (/[0-9]/.test(peek())) num += advance(); }
      addToken(num, "CONSTANT", startLine, startCol);
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let word = "";
      while (i < source.length && /[a-zA-Z0-9_]/.test(peek())) word += advance();
      const type: TokenType = keywords.has(word) ? "KEYWORD" : "IDENTIFIER";
      addToken(word, type, startLine, startCol);
      continue;
    }

    // Operators (multi-char)
    const twoChar = ch + peek(1);
    if (["==","!=","<=",">=","&&","||","++","--","+=","-=","*=","/=","->","::","<<",">>"].includes(twoChar)) {
      advance(); advance();
      addToken(twoChar, "OPERATOR", startLine, startCol);
      continue;
    }

    // Single char operators
    if ("+-*/%=<>!&|^~".includes(ch)) {
      addToken(advance(), "OPERATOR", startLine, startCol);
      continue;
    }

    // Symbols
    if (";:,.(){}[]".includes(ch)) {
      addToken(advance(), "SYMBOL", startLine, startCol);
      continue;
    }

    // Unknown
    const unknown = advance();
    errors.push({ type: "Lexical", message: `Unexpected character '${unknown}'`, line: startLine, column: startCol, suggestion: `Remove or replace the unexpected character '${unknown}'`, cause: "Character not in the alphabet of the language" });
    addToken(unknown, "ERROR", startLine, startCol);
  }

  const filtered = tokens.filter(t => t.type !== "COMMENT" && t.type !== "WHITESPACE");
  const stats = {
    total: filtered.length,
    keywords: filtered.filter(t => t.type === "KEYWORD").length,
    identifiers: filtered.filter(t => t.type === "IDENTIFIER").length,
    operators: filtered.filter(t => t.type === "OPERATOR").length,
    constants: filtered.filter(t => t.type === "CONSTANT").length,
    symbols: filtered.filter(t => t.type === "SYMBOL").length,
  };
  return { tokens: filtered, errors, stats };
}

export function analyzeLexProgram(source: string): LexicalResult {
  const tokens: Token[] = [];
  const errors: CompilerError[] = [];
  const lines = source.split("\n");
  let section = "definitions";
  let line = 1;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed === "%%") { section = section === "definitions" ? "rules" : "user_code"; tokens.push({ lexeme: "%%", type: "SYMBOL", line, column: 1, explanation: "Section separator in LEX program" }); line++; continue; }
    if (section === "rules" && trimmed && !trimmed.startsWith("//")) {
      const match = trimmed.match(/^([^\s{]+)\s*\{(.+)\}$/);
      if (match) {
        tokens.push({ lexeme: match[1], type: "REGEX", line, column: 1, explanation: `Regular expression pattern: matches ${match[1]}` });
        tokens.push({ lexeme: match[2].trim(), type: "LEX_ACTION", line, column: match[1].length + 2, explanation: `Action code executed when pattern matches` });
      }
    }
    line++;
  }

  return { tokens, errors, stats: { total: tokens.length, keywords: 0, identifiers: 0, operators: 0, constants: 0, symbols: tokens.filter(t => t.type === "SYMBOL").length } };
}
