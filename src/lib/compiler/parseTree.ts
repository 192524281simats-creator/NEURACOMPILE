import type { ParseTreeNode, ASTNode } from "@/types";

let nodeId = 0;
const nid = () => String(++nodeId);

// Simple recursive descent parse tree for arithmetic expressions: E -> E+T | T, T -> T*F | F, F -> (E) | id | num
interface ParseState { tokens: string[]; pos: number; steps: number; nodes: ParseTreeNode[]; }

function makeNode(label: string, symbol: string, isTerminal: boolean, production?: string, step?: number): ParseTreeNode {
  return { id: nid(), label, symbol, isTerminal, production, children: [], step };
}

function parseExpr(state: ParseState): ParseTreeNode {
  const node = makeNode("E", "E", false, "E → T E'", state.steps++);
  const t = parseTermNode(state);
  node.children.push(t);
  const ep = parseEPrime(state);
  node.children.push(ep);
  return node;
}

function parseEPrime(state: ParseState): ParseTreeNode {
  const node = makeNode("E'", "E'", false, "", state.steps++);
  if (state.pos < state.tokens.length && state.tokens[state.pos] === "+") {
    node.production = "E' → + T E'";
    const plus = makeNode("+", "+", true, "", state.steps++);
    state.pos++;
    node.children.push(plus);
    node.children.push(parseTermNode(state));
    node.children.push(parseEPrime(state));
  } else if (state.pos < state.tokens.length && state.tokens[state.pos] === "-") {
    node.production = "E' → - T E'";
    const minus = makeNode("-", "-", true, "", state.steps++);
    state.pos++;
    node.children.push(minus);
    node.children.push(parseTermNode(state));
    node.children.push(parseEPrime(state));
  } else {
    node.production = "E' → ε";
    node.children.push(makeNode("ε", "ε", true, "", state.steps++));
  }
  return node;
}

function parseTermNode(state: ParseState): ParseTreeNode {
  const node = makeNode("T", "T", false, "T → F T'", state.steps++);
  const f = parseFactor(state);
  node.children.push(f);
  const tp = parseTprime(state);
  node.children.push(tp);
  return node;
}

function parseTprime(state: ParseState): ParseTreeNode {
  const node = makeNode("T'", "T'", false, "", state.steps++);
  if (state.pos < state.tokens.length && state.tokens[state.pos] === "*") {
    node.production = "T' → * F T'";
    state.pos++;
    node.children.push(makeNode("*", "*", true, "", state.steps++));
    node.children.push(parseFactor(state));
    node.children.push(parseTprime(state));
  } else if (state.pos < state.tokens.length && state.tokens[state.pos] === "/") {
    node.production = "T' → / F T'";
    state.pos++;
    node.children.push(makeNode("/", "/", true, "", state.steps++));
    node.children.push(parseFactor(state));
    node.children.push(parseTprime(state));
  } else {
    node.production = "T' → ε";
    node.children.push(makeNode("ε", "ε", true, "", state.steps++));
  }
  return node;
}

function parseFactor(state: ParseState): ParseTreeNode {
  const node = makeNode("F", "F", false, "", state.steps++);
  if (state.pos < state.tokens.length && state.tokens[state.pos] === "(") {
    node.production = "F → ( E )";
    state.pos++;
    node.children.push(makeNode("(", "(", true, "", state.steps++));
    node.children.push(parseExpr(state));
    if (state.pos < state.tokens.length && state.tokens[state.pos] === ")") state.pos++;
    node.children.push(makeNode(")", ")", true, "", state.steps++));
  } else if (state.pos < state.tokens.length) {
    const tok = state.tokens[state.pos];
    node.production = /^[0-9]/.test(tok) ? "F → num" : "F → id";
    state.pos++;
    node.children.push(makeNode(tok, tok, true, "", state.steps++));
  }
  return node;
}

export function generateParseTree(expression: string): { tree: ParseTreeNode | null; steps: number; error?: string } {
  nodeId = 0;
  const tokens = tokenizeExpression(expression);
  if (tokens.length === 0) return { tree: null, steps: 0, error: "Empty expression" };
  const state: ParseState = { tokens, pos: 0, steps: 0, nodes: [] };
  try {
    const tree = parseExpr(state);
    return { tree, steps: state.steps };
  } catch (e) {
    return { tree: null, steps: 0, error: "Failed to parse expression. Use simple arithmetic like: a + b * c" };
  }
}

function tokenizeExpression(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/[a-zA-Z_]/.test(expr[i])) {
      let word = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) word += expr[i++];
      tokens.push(word);
    } else if (/[0-9]/.test(expr[i])) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
      tokens.push(num);
    } else {
      tokens.push(expr[i++]);
    }
  }
  return tokens;
}

// Generate simplified AST (remove ε nodes and chain nodes)
export function buildAST(parseTree: ParseTreeNode): ASTNode {
  return simplifyNode(parseTree);
}

function simplifyNode(node: ParseTreeNode): ASTNode {
  const children = node.children
    .filter(c => c.symbol !== "ε" && c.symbol !== "E'" && c.symbol !== "T'")
    .map(simplifyNode);

  // Flatten: if this node has one meaningful child, collapse
  if (children.length === 1 && !node.isTerminal && (node.symbol === "E" || node.symbol === "T" || node.symbol === "F")) {
    return children[0];
  }

  // Binary operation node
  if (!node.isTerminal && (node.symbol === "E" || node.symbol === "T")) {
    const ops = node.children.filter(c => "+-*/".includes(c.symbol));
    if (ops.length > 0 && children.length >= 2) {
      return { id: node.id, type: "BinaryOp", value: ops[0].symbol, children: children.filter(c => c.value !== ops[0].symbol) };
    }
  }

  return { id: node.id, type: node.isTerminal ? ((/^[0-9]/.test(node.symbol)) ? "Literal" : "Identifier") : node.symbol, value: node.symbol, children };
}
