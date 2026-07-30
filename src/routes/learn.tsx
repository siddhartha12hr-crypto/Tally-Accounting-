import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { TallyVideoPlayer } from "@/components/TallyVideoPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import {
  BookOpen, Clock, Star, Users, Play,
  CheckCircle, Lock, ChevronRight, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "My Learning — Tally Hub Pro" },
      { name: "description", content: "Your enrolled courses and learning progress." },
    ],
  }),
  component: Learn,
});

/* ── progress helpers (SSR-safe) ──────────────────────────── */
const PROGRESS_KEY = "tally_course_progress";

function getProgress(courseId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw)[courseId] ?? 0) : 0;
  } catch { return 0; }
}

/* ── the built-in free Tally ERP course ───────────────────── */
const TALLY_ERP_ID = "tally-erp-free";

function Learn() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { courses } = useData();

  /* When true, show the inline Tally ERP player */
  const [showPlayer, setShowPlayer] = useState(false);

  /* Courses the user has enrolled in */
  const enrolledCourses = courses.filter(c =>
    user?.purchasedCourses?.includes(c.id)
  );

  /* ── Inline player view ───────────────────────────────────── */
  if (showPlayer) {
    return (
      <AppShell>
        {/* Back button */}
        <div className="pt-4 pb-3 flex items-center gap-3">
          <button
            onClick={() => setShowPlayer(false)}
            className="h-9 w-9 rounded-xl glass flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Free Course
            </p>
            <h1 className="text-lg font-black mt-0">Tally ERP Complete Course</h1>
          </div>
        </div>
        <div className="-mx-4 pb-6">
          <TallyVideoPlayer />
        </div>
      </AppShell>
    );
  }

  /* ── Course list view ─────────────────────────────────────── */
  return (
    <AppShell>
      {/* Header */}
      <div className="pt-4 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          My Learning
        </p>
        <h1 className="text-2xl font-black mt-0.5">Continue Learning</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAuthenticated
            ? `${enrolledCourses.length + 1} course${enrolledCourses.length + 1 !== 1 ? "s" : ""} enrolled`
            : "Free Tally ERP course available"}
        </p>
      </div>

      {/* ── Free Tally ERP — always visible ── */}
      <section className="mb-6">
        <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">
          Free Course
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass shadow-card overflow-hidden"
        >
          <div className="relative h-36">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80"
              alt="Tally ERP"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end p-4 text-white">
              <div>
                <span className="text-[10px] font-bold bg-green-500 px-2 py-0.5 rounded-full mb-1 inline-block">FREE</span>
                <h3 className="text-base font-black leading-tight">Tally ERP Complete Course</h3>
              </div>
            </div>
            <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground">
              By <span className="font-semibold text-foreground">Tally Academy</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> 61 lessons</span>
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 50,000+ students</span>
              <span className="inline-flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Always free</span>
            </div>
            <ProgressBar courseId={TALLY_ERP_ID} />
            <button
              onClick={() => setShowPlayer(true)}
              className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
            >
              <Play className="h-3.5 w-3.5" />
              {getProgress(TALLY_ERP_ID) > 0 ? "Continue Learning" : "Start Learning"}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Enrolled courses ── */}
      {isAuthenticated && enrolledCourses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">
            My Courses
          </h2>
          <div className="grid gap-4">
            {enrolledCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl glass shadow-card overflow-hidden"
              >
                <div className="relative h-32">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-4 text-white">
                    <h3 className="text-base font-black leading-tight">{course.title}</h3>
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Enrolled
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">
                    By <span className="font-semibold text-foreground">{course.instructor}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground font-semibold">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons} lessons</span>
                  </div>
                  <ProgressBar courseId={course.id} />
                  <button
                    onClick={() => navigate({ to: `/watch/${course.id}` })}
                    className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {getProgress(course.id) > 0 ? "Continue Learning" : "Start Learning"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTAs ── */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-6 text-center shadow-card mb-6"
        >
          <Lock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-black text-base mb-1">Login to Track Progress</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Login to enroll in premium courses and save your progress.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="px-6 py-2.5 rounded-full gradient-hero text-white font-bold text-sm shadow-glow"
          >
            Login Now
          </button>
        </motion.div>
      )}

      {isAuthenticated && enrolledCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-6 text-center shadow-card mb-6"
        >
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-black text-base mb-1">Enroll in More Courses</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Browse the course catalog and enroll to unlock more content.
          </p>
          <button
            onClick={() => navigate({ to: "/courses" })}
            className="px-6 py-2.5 rounded-full gradient-hero text-white font-bold text-sm shadow-glow inline-flex items-center gap-2"
          >
            Browse Courses <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AppShell>
  );
}

/* ── Progress bar ─────────────────────────────────────────── */
function ProgressBar({ courseId }: { courseId: string }) {
  const pct = getProgress(courseId);
  if (pct === 0) return null;
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1">
        <span>Progress</span>
        <span className="text-primary font-black">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full gradient-hero" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
