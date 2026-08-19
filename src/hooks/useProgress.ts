import { useState, useCallback } from "react";
import type { Progress, CompilerPipelineResult } from "@/types";

const INITIAL_PROGRESS: Progress = {
  totalRuns: 0, lexAnalyses: 0, parseTreesGenerated: 0, optimizationsApplied: 0,
  quizzesTaken: 0, quizScore: 0, practiceAttempts: 0, labsCompleted: [],
  streak: 0, lastActive: "", badges: [], xp: 0, topicsCompleted: [], recentRuns: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem("neura-progress");
      return saved ? { ...INITIAL_PROGRESS, ...JSON.parse(saved) } : INITIAL_PROGRESS;
    } catch { return INITIAL_PROGRESS; }
  });

  const save = useCallback((p: Progress) => {
    try { localStorage.setItem("neura-progress", JSON.stringify(p)); } catch {}
  }, []);

  const recordRun = useCallback((result: CompilerPipelineResult) => {
    setProgress(prev => {
      const today = new Date().toDateString();
      const streak = prev.lastActive === today ? prev.streak : (prev.lastActive === new Date(Date.now() - 86400000).toDateString() ? prev.streak + 1 : 1);
      const recentRuns = [result, ...prev.recentRuns.slice(0, 9)];

      const badges = [...prev.badges];
      const addBadge = (b: string) => { if (!badges.includes(b)) badges.push(b); };
      
      if (prev.totalRuns === 0) addBadge("First Compile");
      if (prev.totalRuns >= 9) addBadge("Compiler Explorer");
      if (prev.totalRuns >= 24) addBadge("Compiler Pro");
      if (result.optimized && result.optimized.applied.length > 0) addBadge("Optimizer");
      if (result.parseTree) addBadge("Tree Builder");
      if (result.language === "lex") addBadge("LEX Beginner");
      if (streak >= 3) addBadge("3-Day Streak");
      if (streak >= 7) addBadge("Week Warrior");

      const next = {
        ...prev, totalRuns: prev.totalRuns + 1, lexAnalyses: prev.lexAnalyses + 1,
        parseTreesGenerated: result.parseTree ? prev.parseTreesGenerated + 1 : prev.parseTreesGenerated,
        optimizationsApplied: result.optimized ? prev.optimizationsApplied + result.optimized.applied.length : prev.optimizationsApplied,
        xp: prev.xp + 10 + (result.errors.length === 0 ? 5 : 0),
        streak, lastActive: today, badges, recentRuns,
      };
      save(next);
      return next;
    });
  }, [save]);

  const recordQuiz = useCallback((score: number, total: number) => {
    setProgress(prev => {
      const pct = Math.round((score / total) * 100);
      const badges = [...prev.badges];
      if (pct === 100 && !badges.includes("Quiz Perfect")) badges.push("Quiz Perfect");
      if (prev.quizzesTaken >= 4 && !badges.includes("Quiz Veteran")) badges.push("Quiz Veteran");
      const next = { ...prev, quizzesTaken: prev.quizzesTaken + 1, quizScore: Math.round((prev.quizScore * prev.quizzesTaken + pct) / (prev.quizzesTaken + 1)), xp: prev.xp + score * 5, badges };
      save(next);
      return next;
    });
  }, [save]);

  const completeLab = useCallback((id: number) => {
    setProgress(prev => {
      if (prev.labsCompleted.includes(id)) return prev;
      const badges = [...prev.badges];
      const labsCompleted = [...prev.labsCompleted, id];
      if (labsCompleted.length >= 3 && !badges.includes("Lab Enthusiast")) badges.push("Lab Enthusiast");
      if (labsCompleted.length >= 6 && !badges.includes("Lab Master")) badges.push("Lab Master");
      const next = { ...prev, labsCompleted, xp: prev.xp + 50, badges };
      save(next);
      return next;
    });
  }, [save]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem("neura-progress");
    setProgress(INITIAL_PROGRESS);
  }, []);

  return { progress, recordRun, recordQuiz, completeLab, resetProgress };
}
