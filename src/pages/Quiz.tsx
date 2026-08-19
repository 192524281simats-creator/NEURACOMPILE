import { useState } from "react";
import { QUIZ_QUESTIONS } from "@/lib/quizData";
import type { QuizQuestion, Difficulty } from "@/types";
import { useProgress } from "@/hooks/useProgress";
import { HelpCircle, CheckCircle2, XCircle, Timer, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "select" | "quiz" | "result";

const TOPICS = ["All", ...new Set(QUIZ_QUESTIONS.map(q => q.topic))];
const DIFFS: Difficulty[] = ["beginner", "intermediate", "advanced"];
const DIFF_COLORS: Record<Difficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function QuizPage() {
  const [state, setState] = useState<State>("select");
  const [topic, setTopic] = useState("All");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const { recordQuiz } = useProgress();

  const startQuiz = () => {
    let qs = QUIZ_QUESTIONS.filter(q => topic === "All" || q.topic === topic);
    if (diff !== "all") qs = qs.filter(q => q.difficulty === diff);
    if (qs.length === 0) return;
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setAnswers(new Array(shuffled.length).fill(null));
    setIdx(0);
    setSelected(null);
    setShowExplanation(false);
    setState("quiz");
  };

  const handleAnswer = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[idx] = opt;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (idx < questions.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const score = answers.filter((a, i) => a === questions[i].correct).length;
      recordQuiz(score, questions.length);
      setState("result");
    }
  };

  const score = answers.filter((a, i) => a !== null && a === questions[i]?.correct).length;
  const current = questions[idx];

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="w-6 h-6 text-primary" />Compiler Design Quiz</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Test your knowledge across all compiler design topics</p>
      </div>

      {state === "select" && (
        <div className="space-y-5">
          <div className="stat-card gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Topic</label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(t => (
                  <button key={t} onClick={() => setTopic(t)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      topic === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary hover:bg-primary/5")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Difficulty</label>
              <div className="flex gap-2">
                <button onClick={() => setDiff("all")}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    diff === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent")}>
                  All
                </button>
                {DIFFS.map(d => (
                  <button key={d} onClick={() => setDiff(d)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      diff === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent capitalize")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {QUIZ_QUESTIONS.filter(q => (topic === "All" || q.topic === topic) && (diff === "all" || q.difficulty === diff)).length} questions available
            </div>
            <button onClick={startQuiz}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
              <Timer className="w-4 h-4" /> Start Quiz
            </button>
          </div>
        </div>
      )}

      {state === "quiz" && current && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Question {idx + 1} of {questions.length}</span>
            <div className="flex items-center gap-3">
              <span className={cn("badge-pill", DIFF_COLORS[current.difficulty])}>{current.difficulty}</span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{current.topic}</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((idx) / questions.length) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <p className="text-base font-medium text-foreground leading-relaxed">{current.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.correct;
              const isSelected = selected === i;
              const revealed = selected !== null;
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className={cn("w-full text-left p-4 rounded-xl border transition-all text-sm font-medium",
                    !revealed && "border-border hover:border-primary hover:bg-primary/5 bg-card",
                    revealed && isCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                    revealed && isSelected && !isCorrect && "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
                    revealed && !isSelected && !isCorrect && "border-border bg-card opacity-60 cursor-default",
                  )}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Explanation</p>
              <p>{current.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <button onClick={nextQuestion}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
              {idx < questions.length - 1 ? "Next Question →" : "Finish Quiz"}
            </button>
          )}
        </div>
      )}

      {state === "result" && (
        <div className="space-y-5 text-center">
          <div className="stat-card items-center py-8">
            <Award className={cn("w-16 h-16 mb-4", score / questions.length >= 0.8 ? "text-amber-500" : score / questions.length >= 0.5 ? "text-blue-500" : "text-muted-foreground")} />
            <p className="text-4xl font-bold text-foreground">{score}/{questions.length}</p>
            <p className="text-lg text-muted-foreground">{Math.round((score / questions.length) * 100)}% Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              {score === questions.length ? "Perfect score! 🎉" : score >= questions.length * 0.8 ? "Excellent work!" : score >= questions.length * 0.5 ? "Good effort!" : "Keep practicing!"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-left">
            {questions.map((q, i) => (
              <div key={i} className={cn("p-3 rounded-xl border text-xs", answers[i] === q.correct ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20")}>
                <div className="flex items-start gap-1.5">
                  {answers[i] === q.correct ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />}
                  <span className="text-foreground line-clamp-2">{q.question.slice(0, 60)}...</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setState("select")}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}
