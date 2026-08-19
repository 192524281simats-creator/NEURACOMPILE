import { useProgress } from "@/hooks/useProgress";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Code2, Zap, GitBranch, TrendingUp, Award, Flame, FlaskConical, HelpCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000];
const LEVEL_NAMES = ["Beginner", "Learner", "Practitioner", "Analyst", "Expert", "Master"];

function getLevel(xp: number) {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
  }
  const nextXP = LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[level];
  const progress = nextXP > LEVEL_THRESHOLDS[level] ? Math.round(((xp - LEVEL_THRESHOLDS[level]) / (nextXP - LEVEL_THRESHOLDS[level])) * 100) : 100;
  return { level, name: LEVEL_NAMES[level], progress, nextXP, xp };
}

const BADGE_ICONS: Record<string, string> = {
  "First Compile": "🎉", "Compiler Explorer": "🔍", "Compiler Pro": "⚙️",
  "Optimizer": "⚡", "Tree Builder": "🌳", "LEX Beginner": "📋",
  "3-Day Streak": "🔥", "Week Warrior": "🏆", "Quiz Perfect": "🎯",
  "Quiz Veteran": "📚", "Lab Enthusiast": "🧪", "Lab Master": "🎓",
};

export default function Dashboard() {
  const { progress } = useProgress();
  const lvl = getLevel(progress.xp);

  const radarData = [
    { subject: "Lexical", value: Math.min(100, progress.lexAnalyses * 10) },
    { subject: "Parsing", value: Math.min(100, progress.parseTreesGenerated * 15) },
    { subject: "Semantic", value: Math.min(100, progress.lexAnalyses * 8) },
    { subject: "TAC", value: Math.min(100, progress.optimizationsApplied * 12) },
    { subject: "Optimization", value: Math.min(100, progress.optimizationsApplied * 8) },
    { subject: "Quiz", value: progress.quizScore },
  ];

  const runHistory = progress.recentRuns.slice(0, 7).map((r, i) => ({
    name: `Run ${progress.totalRuns - i}`,
    tokens: r.lexical.stats.total,
    tac: r.tac.length,
  })).reverse();

  const quickActions = [
    { to: "/studio", icon: Code2, label: "Compiler Studio", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { to: "/xray", icon: Zap, label: "Run X-Ray", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
    { to: "/first-follow", icon: GitBranch, label: "FIRST/FOLLOW", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { to: "/quiz", icon: HelpCircle, label: "Take Quiz", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    { to: "/lab-manual", icon: FlaskConical, label: "Lab Manual", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
    { to: "/progress", icon: TrendingUp, label: "My Progress", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your compiler learning journey</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{progress.xp} XP</span>
          <span className="text-xs text-muted-foreground">· {lvl.name}</span>
        </div>
      </div>

      {/* Level progress */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Level {lvl.level} — {lvl.name}</span>
          <span className="text-xs text-muted-foreground">{progress.xp} / {lvl.nextXP} XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${lvl.progress}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{100 - lvl.progress}% to next level</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Compiler Runs", value: progress.totalRuns, icon: Code2, color: "text-blue-500" },
          { label: "Quiz Score", value: `${progress.quizScore}%`, icon: HelpCircle, color: "text-amber-500" },
          { label: "Labs Completed", value: `${progress.labsCompleted.length}/6`, icon: FlaskConical, color: "text-emerald-500" },
          { label: "Day Streak", value: progress.streak, icon: Flame, color: "text-red-500" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div>
          <h2 className="section-header"><Zap className="w-5 h-5" />Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", a.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Topic Radar */}
        <div className="stat-card">
          <h2 className="section-header"><TrendingUp className="w-5 h-5" />Topic Mastery</h2>
          {progress.totalRuns > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Progress" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
              Run the compiler to see your progress
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="stat-card">
          <h2 className="section-header"><Award className="w-5 h-5" />Badges</h2>
          {progress.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {progress.badges.map(b => (
                <div key={b} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-accent border border-border" title={b}>
                  <span className="text-base">{BADGE_ICONS[b] ?? "🏅"}</span>
                  <span className="text-xs font-medium text-foreground">{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Run the compiler to earn badges!
            </div>
          )}
        </div>
      </div>

      {/* Run history chart */}
      {runHistory.length > 0 && (
        <div className="stat-card">
          <h2 className="section-header"><Code2 className="w-5 h-5" />Recent Compiler Runs</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={runHistory}>
              <defs>
                <linearGradient id="gTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="tokens" stroke="hsl(var(--primary))" fill="url(#gTokens)" name="Tokens" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
