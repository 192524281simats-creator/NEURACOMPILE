import { useProgress } from "@/hooks/useProgress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Award, Flame, Code2, HelpCircle, FlaskConical, Trash2 } from "lucide-react";

const BADGE_ICONS: Record<string, string> = {
  "First Compile": "🎉", "Compiler Explorer": "🔍", "Compiler Pro": "⚙️",
  "Optimizer": "⚡", "Tree Builder": "🌳", "LEX Beginner": "📋",
  "3-Day Streak": "🔥", "Week Warrior": "🏆", "Quiz Perfect": "🎯",
  "Quiz Veteran": "📚", "Lab Enthusiast": "🧪", "Lab Master": "🎓",
};

const ALL_BADGES = Object.keys(BADGE_ICONS);

export default function ProgressPage() {
  const { progress, resetProgress } = useProgress();

  const chartData = [
    { name: "Compiler Runs", value: progress.totalRuns },
    { name: "Lex Analyses", value: progress.lexAnalyses },
    { name: "Parse Trees", value: progress.parseTreesGenerated },
    { name: "Optimizations", value: progress.optimizationsApplied },
    { name: "Practice", value: progress.practiceAttempts },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-primary" />My Progress</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your compiler learning journey</p>
        </div>
        <button onClick={() => { if (confirm("Reset all progress?")) resetProgress(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs hover:bg-destructive/5 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Code2, label: "Total XP", value: progress.xp, color: "text-primary" },
          { icon: Flame, label: "Streak (days)", value: progress.streak, color: "text-red-500" },
          { icon: HelpCircle, label: "Quiz Score", value: `${progress.quizScore}%`, color: "text-amber-500" },
          { icon: FlaskConical, label: "Labs Done", value: `${progress.labsCompleted.length}/6`, color: "text-emerald-500" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Activity chart */}
      <div className="stat-card">
        <h2 className="section-header"><TrendingUp className="w-5 h-5" />Activity Breakdown</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={32}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Badges */}
      <div className="stat-card">
        <h2 className="section-header"><Award className="w-5 h-5" />Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_BADGES.map(b => {
            const earned = progress.badges.includes(b);
            return (
              <div key={b} className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${earned ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20" : "border-border bg-card opacity-40"}`}>
                <span className="text-2xl">{BADGE_ICONS[b]}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{b}</p>
                  <p className="text-xs text-muted-foreground">{earned ? "Earned!" : "Locked"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent runs */}
      {progress.recentRuns.length > 0 && (
        <div className="stat-card">
          <h2 className="section-header"><Code2 className="w-5 h-5" />Recent Compiler Runs</h2>
          <div className="space-y-2">
            {progress.recentRuns.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 text-sm">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs uppercase">{r.language}</span>
                <span className="text-muted-foreground">{r.lexical.stats.total} tokens · {r.semantic.symbolTable.length} symbols · {r.tac.length} TAC</span>
                <span className="ml-auto text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
