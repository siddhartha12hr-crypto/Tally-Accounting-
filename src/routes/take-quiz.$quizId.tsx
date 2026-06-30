import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { getQuizById } from "@/data/quizData";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  RotateCcw,
  Home,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/take-quiz/$quizId")({
  head: () => ({
    meta: [{ title: "Quiz — Tally Accounting Hub Pro" }],
  }),
  component: QuizPlayer,
});

/* ── Types ───────────────────────────────────────────── */
type AnswerState = "unanswered" | "correct" | "wrong";

interface UserAnswer {
  selected: number;
  state: AnswerState;
}

/* ── Quiz Player ─────────────────────────────────────── */
function QuizPlayer() {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const quiz = getQuizById(quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!quiz) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-black">Quiz Not Found</h2>
          <button
            onClick={() => navigate({ to: "/quiz" })}
            className="px-6 py-2.5 rounded-xl gradient-hero text-white text-sm font-bold"
          >
            Back to Quizzes
          </button>
        </div>
      </AppShell>
    );
  }

  const questions = quiz.questions;
  const current = questions[currentIndex];
  const totalQuestions = questions.length;
  const answered = answers[currentIndex];
  const score = Object.values(answers).filter((a) => a.state === "correct").length;

  function handleSelect(optionIndex: number) {
    if (answered) return;
    const isCorrect = optionIndex === current.correct;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        selected: optionIndex,
        state: isCorrect ? "correct" : "wrong",
      },
    }));
    setShowFeedback(true);
  }

  function handleNext() {
    setShowFeedback(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowFeedback(false);
    setFinished(false);
  }

  /* ── Results Screen ───────────────────────────────── */
  if (finished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassing = percentage >= 60;

    return (
      <AppShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pt-6"
        >
          {/* Score Card */}
          <div className="rounded-3xl gradient-hero p-6 text-center text-white mb-6 shadow-glow">
            <Trophy className="h-14 w-14 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-black mb-1">Quiz Complete!</h1>
            <p className="text-white/70 text-sm mb-4">{quiz.title}</p>
            <div className="text-6xl font-black mb-1">
              {score}
              <span className="text-3xl text-white/60">/{totalQuestions}</span>
            </div>
            <p className="text-white/80 text-sm font-semibold">{percentage}% Score</p>
            <div className="mt-4 w-full h-3 rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-white"
              />
            </div>
            <p className="mt-3 text-sm font-bold">
              {isPassing
                ? "🎉 Great job! Keep it up!"
                : "📚 Keep practising — you'll get there!"}
            </p>
          </div>

          {/* Per-question review */}
          <h2 className="text-sm font-black mb-3">Question Review</h2>
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => {
              const ans = answers[i];
              const isCorrect = ans?.state === "correct";
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl glass p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-snug mb-2">
                        Q{i + 1}. {q.question}
                      </p>
                      {!isCorrect && ans && (
                        <p className="text-[11px] text-red-500 mb-1">
                          Your answer:{" "}
                          <span className="font-semibold">
                            {q.options[ans.selected]}
                          </span>
                        </p>
                      )}
                      <p className="text-[11px] text-emerald-600 mb-2">
                        Correct:{" "}
                        <span className="font-semibold">
                          {q.options[q.correct]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5">
                          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-snug">
                            💡 {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold border border-border glass hover:bg-muted/50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </button>
            <button
              onClick={() => navigate({ to: "/quiz" })}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white gradient-hero shadow-glow hover:opacity-90 transition-opacity"
            >
              <Home className="h-4 w-4" />
              All Quizzes
            </button>
          </div>
        </motion.div>
      </AppShell>
    );
  }

  /* ── MCQ Player Screen ────────────────────────────── */
  return (
    <AppShell>
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate({ to: "/quiz" })}
            className="p-2 rounded-xl glass border border-border hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {quiz.category}
            </p>
            <h1 className="text-sm font-black leading-tight">{quiz.title}</h1>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted mb-6">
          <motion.div
            animate={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full gradient-hero"
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-2xl glass p-5 shadow-card mb-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                Question {currentIndex + 1}
              </p>
              <p className="text-base font-black leading-snug text-foreground">
                {current.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {current.options.map((option, idx) => {
                const isSelected = answered?.selected === idx;
                const isCorrectOption = idx === current.correct;

                let optionStyle =
                  "rounded-2xl border glass p-4 text-left w-full text-sm font-semibold transition-all duration-200 ";

                if (!answered) {
                  optionStyle +=
                    "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                } else if (isCorrectOption) {
                  optionStyle +=
                    "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle +=
                    "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300";
                } else {
                  optionStyle += "border-border opacity-50 cursor-default";
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(idx)}
                    className={optionStyle}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-black">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 text-left">{option}</span>
                      {answered && isCorrectOption && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      )}
                      {answered && isSelected && !isCorrectOption && (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && answered?.state === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4"
                >
                  <p className="text-xs font-black text-amber-700 dark:text-amber-300 mb-1">
                    💡 Here's what you need to know:
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    {current.explanation}
                  </p>
                </motion.div>
              )}
              {showFeedback && answered?.state === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4"
                >
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    ✅ Correct! Well done.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {answered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white gradient-hero shadow-glow hover:opacity-90 transition-opacity"
              >
                {currentIndex < totalQuestions - 1 ? (
                  <>
                    Next Question <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    See Results <Trophy className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
