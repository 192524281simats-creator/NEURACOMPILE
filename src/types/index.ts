export type Language = "c" | "cpp" | "python" | "lex";
export type Theme = "light" | "dark";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Token {
  lexeme: string;
  type: TokenType;
  line: number;
  column: number;
  explanation?: string;
}

export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "CONSTANT"
  | "STRING"
  | "OPERATOR"
  | "SYMBOL"
  | "COMMENT"
  | "WHITESPACE"
  | "ERROR"
  | "LEX_RULE"
  | "LEX_ACTION"
  | "REGEX";

export interface LexicalResult {
  tokens: Token[];
  errors: CompilerError[];
  stats: { total: number; keywords: number; identifiers: number; operators: number; constants: number; symbols: number };
}

export interface CompilerError {
  type: "Lexical" | "Syntax" | "Semantic" | "Grammar" | "Type";
  message: string;
  line: number;
  column?: number;
  suggestion?: string;
  cause?: string;
  expected?: string;
}

export interface ASTNode {
  id: string;
  type: string;
  value?: string;
  children: ASTNode[];
  line?: number;
}

export interface ParseTreeNode {
  id: string;
  label: string;
  symbol: string;
  isTerminal: boolean;
  production?: string;
  children: ParseTreeNode[];
  step?: number;
}

export interface SymbolEntry {
  name: string;
  type: string;
  scope: string;
  category: "variable" | "function" | "parameter" | "constant";
  line: number;
  value?: string;
  usages: number[];
}

export interface TACInstruction {
  id: number;
  op: string;
  arg1?: string;
  arg2?: string;
  result: string;
  explanation: string;
  quadruple: [string, string, string, string];
  triple: [string, string, string];
}

export interface OptimizationResult {
  original: TACInstruction[];
  optimized: TACInstruction[];
  applied: string[];
  reductionPercent: number;
}

export interface TargetInstruction {
  instruction: string;
  comment: string;
  fromTAC: string;
}

export interface FirstFollowResult {
  first: Record<string, Set<string>>;
  follow: Record<string, Set<string>>;
  nullable: Set<string>;
  parsingTable: Record<string, Record<string, string>>;
  steps: string[];
  conflicts: string[];
  isLL1: boolean;
}

export interface SemanticResult {
  symbolTable: SymbolEntry[];
  errors: CompilerError[];
  warnings: string[];
}

export interface CompilerPipelineResult {
  language: Language;
  source: string;
  lexical: LexicalResult;
  parseTree: ParseTreeNode | null;
  ast: ASTNode | null;
  semantic: SemanticResult;
  tac: TACInstruction[];
  optimized: OptimizationResult | null;
  targetCode: TargetInstruction[];
  errors: CompilerError[];
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface VivaQuestion {
  id: string;
  topic: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface LabExperiment {
  id: number;
  title: string;
  aim: string;
  theory: string;
  algorithm: string[];
  program: string;
  sampleInput: string;
  expectedOutput: string;
  vivaQuestions: string[];
  tags: string[];
}

export interface Progress {
  totalRuns: number;
  lexAnalyses: number;
  parseTreesGenerated: number;
  optimizationsApplied: number;
  quizzesTaken: number;
  quizScore: number;
  practiceAttempts: number;
  labsCompleted: number[];
  streak: number;
  lastActive: string;
  badges: string[];
  xp: number;
  topicsCompleted: string[];
  recentRuns: CompilerPipelineResult[];
}

export interface CodeInsight {
  loc: number;
  variables: number;
  functions: number;
  conditions: number;
  loops: number;
  operators: number;
  complexity: "Low" | "Medium" | "High";
  optimizationOpportunities: string[];
  unusedVars: string[];
}
