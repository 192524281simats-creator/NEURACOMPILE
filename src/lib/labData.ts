import type { LabExperiment } from "@/types";
import { SAMPLE_PROGRAMS } from "./sampleCode";

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 1, title: "LEX: Keywords and Identifiers Recognition",
    aim: "Write a LEX program to identify and classify keywords and identifiers in a C program.",
    theory: "Lexical analysis is the first phase of a compiler. A LEX program consists of three sections separated by %%. The definitions section declares regular expression macros, the rules section specifies patterns and actions, and the user code section contains auxiliary functions. Keywords are reserved words with predefined meaning while identifiers are programmer-defined names.",
    algorithm: ["Define patterns for keywords (if, else, while, int, float, char, return)", "Define pattern for identifiers: letter followed by letters/digits/underscore", "Define patterns for operators and symbols", "In rules section, match keywords first (longer match takes priority)", "For each match, print the token type and lexeme", "Compile and test with sample C code"],
    program: SAMPLE_PROGRAMS.lex["Keywords & Identifiers"],
    sampleInput: "int studentName = 10;\nfloat marks;\nif (marks > 50) return 1;",
    expectedOutput: "KEYWORD: int\nIDENTIFIER: studentName\nOPERATOR: =\nNUMBER: 10\nSYMBOL: ;\nKEYWORD: float\nIDENTIFIER: marks\nSYMBOL: ;\n...",
    vivaQuestions: ["What is yytext?", "What is the difference between a token and a lexeme?", "How does LEX handle ambiguity when two rules match?", "What does yywrap() return?"],
    tags: ["LEX", "Tokenization", "Keywords"]
  },
  {
    id: 2, title: "LEX: Number Recognition and Validation",
    aim: "Write a LEX program to recognize integers, floating-point numbers, hexadecimal numbers, and scientific notation.",
    theory: "Numeric literals in programming languages can take various forms: integers (42), floating-point (3.14), hexadecimal (0xFF), and scientific notation (1.5e10). Each form is described by a distinct regular expression. LEX matches the longest possible string, so more specific patterns should be listed before more general ones.",
    algorithm: ["Define regex for hexadecimal: 0[xX][0-9a-fA-F]+", "Define regex for float: [0-9]+.[0-9]+", "Define regex for scientific: [0-9]+[eE][+-]?[0-9]+", "Define regex for integer: [0-9]+", "Order rules from most specific to least specific", "Test with various numeric inputs"],
    program: SAMPLE_PROGRAMS.lex["Number Validator"],
    sampleInput: "42 3.14 0xFF 1.5e10 -273.15",
    expectedOutput: "INTEGER: 42\nFLOAT: 3.14\nHEX: 0xFF\nSCIENTIFIC: 1.5e10\nFLOAT: 273.15",
    vivaQuestions: ["Why must float pattern come before integer pattern?", "What is yyleng?", "How does LEX handle the longest match rule?", "What happens with unmatched input?"],
    tags: ["LEX", "Regex", "Numbers"]
  },
  {
    id: 3, title: "FIRST and FOLLOW Sets Computation",
    aim: "Compute the FIRST and FOLLOW sets for a given context-free grammar and construct the LL(1) parsing table.",
    theory: "FIRST(A) is the set of terminals that can appear at the beginning of strings derived from A. FOLLOW(A) is the set of terminals that can appear immediately after A in any sentential form. These sets are essential for constructing predictive (LL(1)) parsing tables which drive top-down parsing.",
    algorithm: ["Initialize FIRST(a) = {a} for all terminals a", "For each production A → ε, add ε to FIRST(A)", "For A → X1 X2...Xk, add FIRST(Xi) - {ε} to FIRST(A), continue if Xi is nullable", "Add $ to FOLLOW(S) for start symbol S", "For B → αAβ, add FIRST(β)-{ε} to FOLLOW(A)", "If β is nullable or absent, add FOLLOW(B) to FOLLOW(A)", "Build parsing table: for each A → α, add to M[A,a] for each a in FIRST(α)"],
    program: `/* Grammar:\nE -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | id\n\nFIRST(E)  = {(, id}\nFIRST(E') = {+, ε}\nFIRST(T)  = {(, id}\nFIRST(T') = {*, ε}\nFIRST(F)  = {(, id}\n\nFOLLOW(E)  = {$, )}\nFOLLOW(E') = {$, )}\nFOLLOW(T)  = {+, $, )}\nFOLLOW(T') = {+, $, )}\nFOLLOW(F)  = {*, +, $, )}\n*/`,
    sampleInput: "E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | id",
    expectedOutput: "FIRST(E) = {(, id}\nFOLLOW(E) = {$, )}\nNo conflicts — Grammar is LL(1)",
    vivaQuestions: ["What is a nullable non-terminal?", "When is a grammar NOT LL(1)?", "What are FIRST-FIRST and FIRST-FOLLOW conflicts?", "How do you eliminate left recursion?"],
    tags: ["FIRST", "FOLLOW", "LL(1)", "Parsing Table"]
  },
  {
    id: 4, title: "Predictive (LL(1)) Parser Implementation",
    aim: "Implement a table-driven predictive parser for a given LL(1) grammar.",
    theory: "A predictive parser uses the LL(1) parsing table to parse input without backtracking. It maintains a stack (initially containing $ and the start symbol), and at each step either matches a terminal (pop and advance) or expands a non-terminal using the table entry M[A, a] where A is the stack top and a is the current input token.",
    algorithm: ["Push $ and start symbol S onto stack", "Read the next input token a", "If stack top X = a = $, accept", "If X is terminal and X = a, pop X, advance input", "If X is non-terminal, look up M[X, a]", "If M[X, a] = X → Y1Y2...Yk, pop X, push Yk...Y1", "If M[X, a] = error, report syntax error", "Repeat until accept or error"],
    program: `/* LL(1) Parsing Trace for input: id + id * id\n\nStack              Input              Action\n──────────────────────────────────────────────\n$ E                id + id * id $    E → T E'\n$ E' T             id + id * id $    T → F T'\n$ E' T' F          id + id * id $    F → id\n$ E' T' id         id + id * id $    Match id\n$ E' T'            + id * id $       T' → ε\n$ E'               + id * id $       E' → + T E'\n$ E' T +           + id * id $       Match +\n$ E' T             id * id $         T → F T'\n$ E' T' F          id * id $         F → id\n$ E' T' id         id * id $         Match id\n$ E' T'            * id $            T' → * F T'\n$ E' T' F *        * id $            Match *\n$ E' T' F          id $              F → id\n$ E' T' id         id $              Match id\n$ E' T'            $                 T' → ε\n$ E'               $                 E' → ε\n$                  $                 ACCEPT ✓\n*/`,
    sampleInput: "id + id * id",
    expectedOutput: "Parse successful! Input accepted by LL(1) grammar.",
    vivaQuestions: ["What is the role of the parsing stack?", "What happens on a mismatch?", "How is error recovery handled in LL(1) parsers?", "What is a panic mode error recovery?"],
    tags: ["LL(1)", "Predictive Parsing", "Stack", "Parsing Table"]
  },
  {
    id: 5, title: "Three Address Code Generation",
    aim: "Generate Three Address Code (TAC) from a given source program containing arithmetic expressions and assignment statements.",
    theory: "Three Address Code is an intermediate representation where each instruction has at most three addresses (two operands and one result). TAC is close to assembly language but uses symbolic names and unlimited temporaries. It simplifies code generation and enables machine-independent optimizations.",
    algorithm: ["Traverse the AST in post-order", "For each leaf node (operand), return its name", "For each internal node (operator), recursively process children", "Allocate a new temporary for the result", "Emit instruction: temp = left op right", "For assignment a = expr, emit: a = computed_temp", "Return the result name for use by parent"],
    program: `/* Source:
int a = 10;
int b = 20;
int c = a + b * 2;

Generated TAC:
t1 = b * 2
t2 = a + t1
c = t2

Quadruples:
(  *  , b  , 2  , t1 )
(  +  , a  , t1 , t2 )
(  =  , t2 , _  , c  )

Triples:
(0) ( * , b  , 2  )
(1) ( + , a  , (0))
(2) ( = , c  , (1))
*/`,
    sampleInput: "int a = 10;\nint b = 20;\nint c = a + b * 2;",
    expectedOutput: "t1 = b * 2\nt2 = a + t1\nc = t2",
    vivaQuestions: ["What is the advantage of TAC over direct code generation?", "How are conditional statements represented in TAC?", "What is the difference between triples and quadruples?", "How do function calls appear in TAC?"],
    tags: ["TAC", "Intermediate Code", "Quadruples", "Triples"]
  },
  {
    id: 6, title: "Code Optimization Techniques",
    aim: "Apply machine-independent optimization techniques to Three Address Code and measure the improvement.",
    theory: "Code optimization transforms intermediate code to produce equivalent but more efficient code. Machine-independent optimizations include: Constant Folding (evaluate constant expressions at compile time), Constant Propagation (substitute known constant values), Dead Code Elimination (remove unreachable/unused code), Common Subexpression Elimination (avoid recomputing the same expression), and Algebraic Simplification (use mathematical identities).",
    algorithm: ["Apply constant folding: evaluate x = c1 op c2 at compile time", "Apply constant propagation: replace variable with known value", "Identify dead code: unreachable code or unused variables", "Find common subexpressions: same operation with same operands", "Apply algebraic identities: x+0=x, x*1=x, x*0=0", "Measure reduction in instruction count"],
    program: `/* BEFORE OPTIMIZATION:
x = 10 * 5        ← Constant Folding opportunity
y = x + 0         ← Algebraic Simplification
z = y * 1         ← Algebraic Simplification
w = y + z         ← Common Subexpr (if y = z)
dead = 42         ← Dead Code (never used)

AFTER OPTIMIZATION:
x = 50            ← 10 * 5 folded
y = 50            ← x + 0 simplified, x propagated
z = 50            ← y * 1 simplified, y propagated
w = 100           ← 50 + 50 folded

Optimizations Applied:
✓ Constant Folding (1 instruction)
✓ Algebraic Simplification (2 instructions)
✓ Constant Propagation (2 propagations)
✓ Dead Code Elimination (1 removed)
Reduction: 5 → 4 instructions (20% reduction)
*/`,
    sampleInput: "x = 10 * 5\ny = x + 0\nz = y * 1\ndead = 42",
    expectedOutput: "x = 50\ny = 50\nz = 50\n(dead removed)\nReduction: 20%",
    vivaQuestions: ["What is the difference between peephole and global optimization?", "What is strength reduction?", "Can all optimizations be applied in any order?", "What is loop invariant code motion?"],
    tags: ["Optimization", "Constant Folding", "Dead Code", "CSE"]
  },
];
