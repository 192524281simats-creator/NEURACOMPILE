import { Link } from "react-router-dom";
import { BookOpen, Zap, GitBranch, Calculator, BrainCircuit, FileCode, Gauge, Cpu, Bug, ChevronRight } from "lucide-react";

const TOPICS = [
  { icon: BookOpen, title: "Lexical Analysis", desc: "Tokens, patterns, regular expressions, LEX programs, yytext, yyleng", to: "/studio", tag: "Foundation" },
  { icon: Zap, title: "Compiler Pipeline", desc: "Full 7-phase pipeline from source code to target code with interactive visualization", to: "/xray", tag: "Core" },
  { icon: GitBranch, title: "Parse Trees & AST", desc: "Context-free grammars, derivations, parse trees vs abstract syntax trees", to: "/parse-tree", tag: "Syntax" },
  { icon: Calculator, title: "FIRST & FOLLOW", desc: "Computing FIRST sets, FOLLOW sets, nullable symbols, LL(1) parsing tables", to: "/first-follow", tag: "Parsing" },
  { icon: BrainCircuit, title: "Semantic Analysis", desc: "Symbol tables, type checking, scope analysis, declaration and usage tracking", to: "/semantic", tag: "Semantics" },
  { icon: FileCode, title: "Intermediate Code", desc: "Three Address Code, quadruples, triples, indirect triples", to: "/intermediate", tag: "IR" },
  { icon: Gauge, title: "Optimization", desc: "Constant folding, propagation, dead code elimination, CSE, algebraic simplification", to: "/optimization", tag: "Optimization" },
  { icon: Cpu, title: "Target Code", desc: "Register allocation, instruction selection, educational assembly generation", to: "/target-code", tag: "Backend" },
  { icon: Bug, title: "Error Analysis", desc: "Lexical, syntax, semantic, and type errors with explanations and fix suggestions", to: "/error-detective", tag: "Debugging" },
];

const TAG_COLORS: Record<string, string> = {
  Foundation: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Core: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Syntax: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Parsing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Semantics: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  IR: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Optimization: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Backend: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Debugging: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function LearnPage() {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" />Learn Compiler Design</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Interactive learning modules for every phase of compiler construction</p>
      </div>

      {/* Pipeline overview */}
      <div className="mb-6 p-5 rounded-2xl border border-border bg-card">
        <p className="text-sm font-semibold text-foreground mb-3">The Compiler Pipeline</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {["Source Code", "Lexical Analysis", "Tokens", "Syntax Analysis", "Parse Tree / AST", "Semantic Analysis", "Symbol Table", "TAC", "Optimization", "Target Code"].map((phase, i, arr) => (
            <div key={phase} className="flex items-center gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground font-medium">{phase}</span>
              {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map(topic => {
          const Icon = topic.icon;
          return (
            <Link key={topic.to} to={topic.to}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[topic.tag] || "bg-muted text-muted-foreground"}`}>{topic.tag}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{topic.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{topic.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
