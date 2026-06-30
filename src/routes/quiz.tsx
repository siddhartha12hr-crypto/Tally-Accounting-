import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  BookOpen,
  FileText,
  Library,
  Scale,
  BarChart3,
  DollarSign,
  Package,
  Landmark,
  Briefcase,
  TrendingUp,
  ClipboardList,
  Keyboard,
  Search,
  ArrowRight,
  Zap,
  Shield,
  Trophy,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Tally Quiz — Tally Accounting Hub Pro" },
      {
        name: "description",
        content:
          "Interactive Tally accounting quizzes to test your knowledge.",
      },
    ],
  }),
  component: TallyQuiz,
});

/* ── Quiz Categories ──────────────────────────────────── */
const quizCategories = [
  { name: "Tally Basics", emoji: "📘", icon: BookOpen, color: "#1a3a8f" },
  { name: "Journal Entries", emoji: "🧾", icon: FileText, color: "#ea580c" },
  { name: "Ledger Accounts", emoji: "📚", icon: Library, color: "#7c3aed" },
  { name: "Trial Balance", emoji: "⚖️", icon: Scale, color: "#059669" },
  { name: "Balance Sheet", emoji: "📊", icon: BarChart3, color: "#db2777" },
  { name: "GST", emoji: "💰", icon: DollarSign, color: "#e8720c" },
  { name: "Inventory Management", emoji: "📦", icon: Package, color: "#0e6b8f" },
  { name: "Banking", emoji: "🏦", icon: Landmark, color: "#6b1a6b" },
  { name: "Payroll", emoji: "💼", icon: Briefcase, color: "#1a6b3a" },
  { name: "Financial Reports", emoji: "📈", icon: TrendingUp, color: "#8b0000" },
  { name: "Voucher Entries", emoji: "📋", icon: ClipboardList, color: "#5a1a8f" },
  {
    name: "Tally Keyboard Shortcuts",
    emoji: "⌨️",
    icon: Keyboard,
    color: "#876a00",
  },
];

/* ── Placeholder Quizzes (future: loaded from DB) ───── */
const PLACEHOLDER_QUIZZES = [
  {
    id: "q1",
    title: "Tally Basics: Getting Started",
    category: "Tally Basics",
    difficulty: "Beginner" as const,
    questions: 10,
    duration: "10 min",
    totalMarks: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80",
  },
  {
    id: "q2",
    title: "Journal Entries Mastery",
    category: "Journal Entries",
    difficulty: "Intermediate" as const,
    questions: 15,
    duration: "18 min",
    totalMarks: 15,
    thumbnail:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
  },
  {
    id: "q3",
    title: "GST Filing & Returns",
    category: "GST",
    difficulty: "Advanced" as const,
    questions: 20,
    duration: "25 min",
    totalMarks: 20,
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  },
  {
    id: "q4",
    title: "Trial Balance Fundamentals",
    category: "Trial Balance",
    difficulty: "Beginner" as const,
    questions: 10,
    duration: "12 min",
    totalMarks: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
  },
  {
    id: "q5",
    title: "Balance Sheet Analysis",
    category: "Balance Sheet",
    difficulty: "Advanced" as const,
    questions: 20,
    duration: "30 min",
    totalMarks: 20,
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
  },
  {
    id: "q6",
    title: "Tally Keyboard Shortcuts",
    category: "Tally Keyboard Shortcuts",
    difficulty: "Beginner" as const,
    questions: 8,
    duration: "8 min",
    totalMarks: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
  },
];

/* ── Difficulty Badge ────────────────────────────────── */
function DifficultyBadge({ level }: { level: "Beginner" | "Intermediate" | "Advanced" }) {
  const config = {
    Beginner: { color: "bg-emerald-500/10 text-emerald-600", icon: Shield },
    Intermediate: { color: "bg-amber-500/10 text-amber-600", icon: Zap },
    Advanced: { color: "bg-red-500/10 text-red-600", icon: Trophy },
  };
  const { color, icon: Icon } = config[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${color}`}>
      <Icon className="h-3 w-3" />
      {level}
    </span>
  );
}

/* ── Quiz Card ───────────────────────────────────────── */
function QuizCard({ quiz }: { quiz: (typeof PLACEHOLDER_QUIZZES)[number] }) {
  const navigate = useNavigate();

  function handleStart() {
    navigate({ to: "/take-quiz/$quizId", params: { quizId: quiz.id } });
  }

  return (
    <div className="rounded-2xl glass shadow-card overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        <img
          src={quiz.thumbnail}
          alt={quiz.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2">
          <DifficultyBadge level={quiz.difficulty} />
        </div>
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
            {quiz.category}
          </p>
          <h3 className="text-sm font-black text-white leading-tight">
            {quiz.title}
          </h3>
        </div>
      </div>

      {/* Button */}
      <div className="p-3">
        <button
          type="button"
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white gradient-hero shadow-glow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Start Quiz
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Main Page Component ──────────────────────────────── */
function TallyQuiz() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredQuizzes = PLACEHOLDER_QUIZZES.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? q.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Test Your Knowledge"
        title="Tally Quiz"
        subtitle="Challenge yourself with interactive accounting quizzes"
      />

      {/* ── Featured Quizzes ────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black">Featured Quizzes</h3>
          <span className="text-[10px] text-muted-foreground">
            {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 && "z"}{" "}
            available
          </span>
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl glass p-8 text-center"
          >
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              No quizzes found matching your search.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try a different keyword or category.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Progress Tracking Section ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass p-4 shadow-card"
      >
        <h3 className="text-sm font-black mb-3">Your Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Quizzes Completed</span>
            <span className="font-bold">0</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted">
            <div className="h-full rounded-full gradient-hero" style={{ width: "0%" }} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Average Score</span>
            <span className="font-bold">—</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Marks Earned</span>
            <span className="font-bold">0</span>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
