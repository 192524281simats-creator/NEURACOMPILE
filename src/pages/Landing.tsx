import { Link } from "react-router-dom";
import { ArrowRight, Zap, GitBranch, BrainCircuit, Gauge, Code2, BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const PIPELINE = ["Source Code", "Tokens", "Parse Tree", "AST", "Semantic", "TAC", "Optimize", "Target Code"];

const FEATURES = [
  { icon: Zap, title: "Compiler X-Ray", desc: "Run source code through the full 8-phase pipeline with click-through explanations at every step." },
  { icon: GitBranch, title: "Interactive Parse Trees", desc: "Visualize parse trees and ASTs with zoom, pan, node selection, and step-by-step animation." },
  { icon: BrainCircuit, title: "Semantic Analyzer", desc: "Symbol tables, type checking, scope analysis, and undeclared variable detection in real time." },
  { icon: Gauge, title: "Optimization Lab", desc: "Constant folding, dead code elimination, CSE — compare before/after with real statistics." },
  { icon: Code2, title: "Multi-Language Support", desc: "Write and analyze LEX/FLEX, C, C++, and Python with Monaco Editor and full syntax highlighting." },
  { icon: BookOpen, title: "Practice & Quiz", desc: "Topic-wise MCQs, viva preparation, gamified challenges, and a complete interactive lab manual." },
];

const STATS = [
  { label: "Compiler Phases", value: "8" },
  { label: "Supported Languages", value: "4" },
  { label: "Lab Experiments", value: "6+" },
  { label: "Quiz Questions", value: "15+" },
];

export default function Landing() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">NEURACOMPILE</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-foreground transition-colors">Pipeline</a>
            <a href="#practice" className="hover:text-foreground transition-colors">Practice</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-accent transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Open App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <GraduationCap className="w-3.5 h-3.5" />
            Interactive Compiler Design Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-foreground">NEURA</span>
            <span className="text-primary">COMPILE</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-4">
            Learn How a Compiler <span className="text-foreground">Thinks</span> — Not Just What It Produces.
          </p>
          <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
            An interactive Compiler Design platform for learning, coding, visualization, debugging, optimization, and practical experimentation across LEX, C, C++, and Python.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/studio" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/80 hover:bg-accent transition-all font-semibold">
              Open Compiler Studio <Code2 className="w-4 h-4" />
            </Link>
            <Link to="/xray" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/80 hover:bg-accent transition-all font-semibold">
              Compiler X-Ray <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">The Complete Compiler Pipeline</h2>
            <p className="text-muted-foreground">Every phase — visualized, explained, and interactive.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PIPELINE.map((phase, i) => (
              <div key={phase} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all cursor-default">
                  {phase}
                </div>
                {i < PIPELINE.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground">A complete environment for learning Compiler Design.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="practice" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Learn?</h2>
          <p className="text-muted-foreground mb-8">Start from the dashboard, run your first code through the pipeline, and understand every decision the compiler makes.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30">
            Launch Platform <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground">NEURACOMPILE</span>
        </div>
        <p>Interactive Compiler Design Learning Platform · Built for Computer Science Students</p>
      </footer>
    </div>
  );
}
