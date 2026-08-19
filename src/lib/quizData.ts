import type { QuizQuestion } from "@/types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1", topic: "Lexical Analysis", difficulty: "beginner",
    question: "Which phase of a compiler converts source code into tokens?",
    options: ["Syntax Analysis", "Lexical Analysis", "Semantic Analysis", "Code Generation"],
    correct: 1,
    explanation: "Lexical Analysis (scanning) is the first phase that reads characters and groups them into tokens like keywords, identifiers, and literals."
  },
  {
    id: "q2", topic: "Lexical Analysis", difficulty: "beginner",
    question: "In LEX, what does `yytext` contain?",
    options: ["The length of matched text", "The matched text string", "The token type", "The current line number"],
    correct: 1,
    explanation: "`yytext` is a global variable in LEX that holds the actual text string that was matched by the current rule."
  },
  {
    id: "q3", topic: "FIRST & FOLLOW", difficulty: "intermediate",
    question: "FIRST(A) for the production A → aB | ε is:",
    options: ["{a, ε}", "{a}", "{a, $}", "{B}"],
    correct: 0,
    explanation: "FIRST(A) includes 'a' from the first production and ε from the second production because A can derive the empty string."
  },
  {
    id: "q4", topic: "FIRST & FOLLOW", difficulty: "intermediate",
    question: "What is always in FOLLOW(S) where S is the start symbol?",
    options: ["ε", "FIRST(S)", "$ (end marker)", "All terminals"],
    correct: 2,
    explanation: "The end-of-input marker $ is always added to FOLLOW of the start symbol, representing the end of the input string."
  },
  {
    id: "q5", topic: "Parsing", difficulty: "intermediate",
    question: "In LL(1) parsing, the '1' stands for:",
    options: ["One token lookahead", "One pass through input", "One stack symbol", "One production rule"],
    correct: 0,
    explanation: "In LL(1), the '1' means we use exactly one lookahead token to make parsing decisions without backtracking."
  },
  {
    id: "q6", topic: "Parsing", difficulty: "intermediate",
    question: "A grammar is NOT LL(1) when:",
    options: ["It has left recursion", "It has right recursion", "It has only terminals", "It produces empty strings"],
    correct: 0,
    explanation: "Left recursion prevents LL(1) parsing because the parser would loop infinitely trying to expand A → A... without consuming input."
  },
  {
    id: "q7", topic: "Semantic Analysis", difficulty: "intermediate",
    question: "What is the primary purpose of a symbol table?",
    options: ["Store tokens", "Track identifiers, types, and scopes", "Generate target code", "Optimize expressions"],
    correct: 1,
    explanation: "The symbol table stores information about identifiers including their names, data types, scope levels, and memory locations for later use."
  },
  {
    id: "q8", topic: "TAC", difficulty: "intermediate",
    question: "The Three Address Code (TAC) for `x = a + b * c` is:",
    options: ["t1 = a + b * c", "t1 = b * c; t2 = a + t1; x = t2", "x = a + b; x = x * c", "t1 = a + b; x = t1 * c"],
    correct: 1,
    explanation: "TAC linearizes expressions using temporary variables. Operator precedence is respected: multiply first, then add, with each operation using at most two operands."
  },
  {
    id: "q9", topic: "Optimization", difficulty: "advanced",
    question: "Constant folding transforms `x = 3 * 4` to:",
    options: ["x = 12", "x = 3; x = x * 4", "No change", "t1 = 3; t2 = 4; x = t1 * t2"],
    correct: 0,
    explanation: "Constant folding evaluates constant expressions at compile time. Since both 3 and 4 are known constants, the result 12 is computed directly."
  },
  {
    id: "q10", topic: "Optimization", difficulty: "advanced",
    question: "Which optimization eliminates `y = x + 0`?",
    options: ["Dead Code Elimination", "Constant Folding", "Algebraic Simplification", "Constant Propagation"],
    correct: 2,
    explanation: "Algebraic Simplification uses mathematical identities (x + 0 = x, x * 1 = x, x * 0 = 0) to eliminate unnecessary operations."
  },
  {
    id: "q11", topic: "Parse Tree", difficulty: "beginner",
    question: "An Abstract Syntax Tree (AST) differs from a Parse Tree because:",
    options: ["AST has more nodes", "AST omits grammar-specific intermediate nodes", "AST only has terminal nodes", "AST is generated before parsing"],
    correct: 1,
    explanation: "The AST removes nodes that are artifacts of the grammar structure (like E', T' in LL grammars) while preserving the semantic structure of the program."
  },
  {
    id: "q12", topic: "Code Generation", difficulty: "advanced",
    question: "In register allocation, what strategy minimizes register spilling?",
    options: ["LIFO allocation", "Graph coloring", "Round-robin", "First-fit"],
    correct: 1,
    explanation: "Graph coloring models register allocation as a graph coloring problem where nodes are variables and edges indicate simultaneous liveness, minimizing spills."
  },
  {
    id: "q13", topic: "Lexical Analysis", difficulty: "beginner",
    question: "Regular expressions in LEX are used to:",
    options: ["Define context-free grammar", "Specify token patterns", "Build parse trees", "Generate assembly code"],
    correct: 1,
    explanation: "Regular expressions in LEX specify patterns for matching lexemes. Each rule is a regex-action pair where the action defines what happens on a match."
  },
  {
    id: "q14", topic: "Parsing", difficulty: "advanced",
    question: "Shift-reduce conflicts in LR parsing occur when:",
    options: ["Two states have the same goto", "An item set has both a shift and reduce item for the same lookahead", "The grammar is ambiguous only", "The stack is empty"],
    correct: 1,
    explanation: "A shift-reduce conflict occurs when the LR(0) item set contains both a completed item (reduce) and a dot before a terminal (shift) for the same lookahead symbol."
  },
  {
    id: "q15", topic: "TAC", difficulty: "intermediate",
    question: "In a quadruple representation, the format is:",
    options: ["(result, op, arg1)", "(op, arg1, arg2, result)", "(op, result)", "(arg1, arg2, result, op)"],
    correct: 1,
    explanation: "Quadruples store each TAC instruction as (operator, argument1, argument2, result), making it easy to reference any field by position."
  },
];
