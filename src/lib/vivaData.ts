import type { VivaQuestion } from "@/types";

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: "v1", topic: "Lexical Analysis",
    question: "What is the role of a lexical analyzer in a compiler?",
    answer: "The lexical analyzer (scanner) is the first phase of a compiler. It reads the source program character by character and groups them into meaningful sequences called tokens. It removes whitespace and comments, handles lexical errors, and passes tokens to the syntax analyzer.",
    explanation: "Think of the lexer as reading words in a sentence — it identifies what each word is (noun, verb) before trying to understand the sentence structure."
  },
  {
    id: "v2", topic: "Lexical Analysis",
    question: "What is the difference between a token, lexeme, and pattern?",
    answer: "A token is a pair (token-name, attribute-value) like (IDENTIFIER, 'x'). A lexeme is the actual string matched, like 'studentName'. A pattern is the rule (usually a regex) describing what strings can form a token, like [a-z][a-z0-9]*.",
    explanation: "Token is the category, lexeme is the actual text, and pattern is the rule. Example: KEYWORD is the token, 'if' is the lexeme, 'if|else|while...' is the pattern."
  },
  {
    id: "v3", topic: "LEX",
    question: "What is the purpose of `yywrap()` in a LEX program?",
    answer: "yywrap() is called by the lexer when it reaches the end of the input file. If it returns 0, the lexer continues with additional input. If it returns 1 (nonzero), the lexer terminates. Most simple LEX programs return 1 from yywrap().",
    explanation: "It acts as a hook to handle end-of-file conditions — returning 1 signals 'we are done with all input'."
  },
  {
    id: "v4", topic: "FIRST & FOLLOW",
    question: "What is FIRST(A) and why is it needed?",
    answer: "FIRST(A) is the set of terminals that can begin any string derivable from A. If A can derive ε, then ε is also in FIRST(A). It is needed to construct predictive parsing tables and to decide which production to use when a non-terminal is at the top of the parsing stack.",
    explanation: "FIRST sets answer: 'When I see this terminal as the next input, which production should I expand?'"
  },
  {
    id: "v5", topic: "FIRST & FOLLOW",
    question: "When do we add $ to FOLLOW(A)?",
    answer: "We add $ (end-of-input marker) to FOLLOW(A) in two cases: (1) if A is the start symbol of the grammar, and (2) if there is a production B → αA where α is a sequence that can all derive ε (i.e., FOLLOW(B) ⊆ FOLLOW(A)).",
    explanation: "The $ in FOLLOW indicates that A can legally appear at the very end of the input string in some sentential form."
  },
  {
    id: "v6", topic: "Parsing",
    question: "What is the difference between top-down and bottom-up parsing?",
    answer: "Top-down parsing starts from the start symbol and tries to derive the input string by expanding non-terminals (e.g., LL parsers, recursive descent). Bottom-up parsing starts from the input and reduces it to the start symbol by applying productions in reverse (e.g., LR parsers, shift-reduce).",
    explanation: "Top-down builds the parse tree from root to leaves; bottom-up builds from leaves to root."
  },
  {
    id: "v7", topic: "Semantic Analysis",
    question: "What is a symbol table and what information does it store?",
    answer: "A symbol table is a data structure used throughout compilation to store information about identifiers. For each identifier it stores: name, type, scope (global/local), category (variable/function/parameter), memory location, and for functions — parameter count and types.",
    explanation: "The symbol table is the compiler's 'memory' — it records everything declared in the program for later verification and code generation."
  },
  {
    id: "v8", topic: "Intermediate Code",
    question: "Why is intermediate code used in compilers?",
    answer: "Intermediate code decouples the front-end (language-specific) from the back-end (machine-specific). This allows: (1) portability — one front-end for many machines, (2) optimization — machine-independent optimizations on intermediate form, (3) retargeting — one optimizer for many target architectures.",
    explanation: "Intermediate code is like a universal language — translate once from source, then translate to many targets from the intermediate form."
  },
  {
    id: "v9", topic: "TAC",
    question: "What are the three forms of intermediate code and their differences?",
    answer: "Three Address Code (TAC): Uses temporary variables explicitly (t1 = a + b). Quadruples: Store (op, arg1, arg2, result) in a four-field tuple. Triples: Store (op, arg1, arg2) in three fields, implicitly referencing the triple number as the result. Indirect Triples: Use a pointer array to reference triples, allowing easy reordering during optimization.",
    explanation: "All represent the same operations but differ in how the result is referenced — TAC uses named temps, triples use position numbers."
  },
  {
    id: "v10", topic: "Optimization",
    question: "What is constant folding and give an example?",
    answer: "Constant folding is a compile-time optimization that evaluates expressions whose operands are all compile-time constants. Example: x = 3 * 4 + 2 becomes x = 14 because the expression is fully known at compile time. This eliminates runtime computation.",
    explanation: "The compiler acts as a calculator at compile time — if the answer is known, why compute it at runtime?"
  },
  {
    id: "v11", topic: "Code Generation",
    question: "What is register allocation and why is it important?",
    answer: "Register allocation assigns program variables and temporaries to machine registers, which are faster to access than memory. Since processors have limited registers, the allocator must decide which values to keep in registers (and spill others to memory). Graph coloring is the most common algorithm — variables that are live simultaneously cannot share a register.",
    explanation: "Good register allocation significantly impacts program speed — keeping values in registers avoids costly memory accesses."
  },
  {
    id: "v12", topic: "Parsing",
    question: "What is left recursion and why must it be eliminated for LL parsing?",
    answer: "A grammar has left recursion if a non-terminal A can derive a string beginning with A, such as A → Aα | β. LL parsers build parse trees top-down; when they see A at the top and try to expand A → Aα, they get A again — leading to infinite recursion without consuming any input. Left recursion must be eliminated by transforming A → Aα | β into A → βA' and A' → αA' | ε.",
    explanation: "Imagine trying to write a function that calls itself first before doing any work — it would loop forever without making progress."
  },
];
