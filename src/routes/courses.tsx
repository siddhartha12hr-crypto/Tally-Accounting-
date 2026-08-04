import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { TallyVideoPlayer } from "@/components/TallyVideoPlayer";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useModuleVisibility } from "@/contexts/ModuleVisibilityContext";
import { ModuleUnavailable } from "@/components/ModuleUnavailable";
import { toast } from "sonner";
import {
  Star, Clock, Users, BookOpen, Lock,
  FileText, Play, CheckCircle, ChevronRight, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Tally Hub Pro" },
      { name: "description", content: "Browse and enroll in free and premium Tally courses." },
    ],
  }),
  component: Courses,
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

const TALLY_ERP_ID = "tally-erp-free";

/* ── PDF opener ─────────────────────────────────────────────── */
function openPdf(pdfUrl: string) {
  if (!pdfUrl) return;
  if (pdfUrl.startsWith("data:")) {
    try {
      const byteString = atob(pdfUrl.split(",")[1]);
      const mimeMatch  = pdfUrl.match(/data:([^;]+)/);
      const mime       = mimeMatch ? mimeMatch[1] : "application/pdf";
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mime });
      window.open(URL.createObjectURL(blob), "_blank");
    } catch { window.open(pdfUrl, "_blank", "noopener,noreferrer"); }
  } else {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }
}

const NOTE_ACCENT_COLORS = [
  "#1a3a8f","#e8720c","#7c3aed","#059669",
  "#db2777","#8b0000","#0e6b8f","#876a00",
];

/* ── Progress bar — client-only (avoids SSR hydration mismatch) ── */
function ProgressBar({ courseId }: { courseId: string }) {
  const [pct, setPct] = useState(0);
  useEffect(() => { setPct(getProgress(courseId)); }, [courseId]);
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

/* ── Main component ─────────────────────────────────────────── */
function Courses() {
  const { isVisible } = useModuleVisibility();
  const { courses, notes } = useData();
  const { isAuthenticated, hasPurchased, purchaseContent, user } = useAuth();
  const { add: addNotification } = useNotifications();
  const navigate = useNavigate();

  const [showPlayer, setShowPlayer] = useState(false);

  if (!isVisible("courses")) return <ModuleUnavailable name="Courses" />;

  /* Enrolled admin courses */
  const enrolledCourses = courses.filter(c => hasPurchased(c.id, "course"));

  /* ── Inline Tally ERP player ──────────────────────────────── */
  if (showPlayer) {
    return (
      <AppShell>
        <div className="pt-4 pb-3 flex items-center gap-3">
          <button
            onClick={() => setShowPlayer(false)}
            className="h-9 w-9 rounded-xl glass flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Free Course</p>
            <h1 className="text-lg font-black mt-0">Tally ERP Complete Course</h1>
          </div>
        </div>
        <div className="-mx-4 pb-6">
          <TallyVideoPlayer />
        </div>
      </AppShell>
    );
  }

  /* ── Enroll handler ──────────────────────────────────────── */
  const handleEnroll = (courseId: string, price: string) => {
    if (!isAuthenticated) {
      toast.info("Please login to enroll in this course");
      navigate({ to: "/login", search: { redirect: "/courses" } });
      return;
    }
    // Already enrolled → go straight to player
    if (hasPurchased(courseId, "course")) {
      navigate({ to: `/watch/${courseId}` });
      return;
    }
    const isFree = price === "Free" || price === "₹0";
    if (isFree) {
      // Free course → enroll instantly, no payment page needed
      purchaseContent(courseId, "course");
      addNotification({
        type: "course",
        title: "Enrolled Successfully! 🎉",
        body: `You're now enrolled in "${courses.find(c => c.id === courseId)?.title ?? "the course"}". Start learning!`,
        link: "/learn",
      });
      toast.success("Enrolled! Opening course…");
      setTimeout(() => navigate({ to: `/watch/${courseId}` }), 150);
      return;
    }
    // Paid course → Purchase Course page (WhatsApp + Code)
    navigate({ to: `/payment/${courseId}` });
  };

  return (
    <AppShell>
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="pt-4 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">My Learning</p>
        <h1 className="text-2xl font-black mt-0.5">Continue Learning</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAuthenticated
            ? `${enrolledCourses.length + 1} course${enrolledCourses.length + 1 !== 1 ? "s" : ""} enrolled`
            : "Free Tally ERP course available"}
        </p>
      </div>

      {/* ── Free Tally ERP ────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">Free Course</h2>
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
            <p className="text-xs text-muted-foreground">By <span className="font-semibold text-foreground">Tally Academy</span></p>
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

      {/* ── Enrolled admin courses ────────────────────────────── */}
      {isAuthenticated && enrolledCourses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">My Courses</h2>
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
                  <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
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
                  <p className="text-xs text-muted-foreground">By <span className="font-semibold text-foreground">{course.instructor}</span></p>
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

      {/* ── All available admin courses (catalog) ─────────────── */}
      {courses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">All Courses</h2>
          <div className="grid gap-4">
            {courses.map((course, idx) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="overflow-hidden rounded-3xl glass shadow-card"
              >
                <div className="relative h-32">
                  <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-4 text-white">
                    <h3 className="text-lg font-black leading-tight drop-shadow-lg">{course.title}</h3>
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-lg">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                    {course.price !== "Free" && course.price !== "₹0" && !isAuthenticated && <Lock className="h-3 w-3" />}
                    {course.price}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">By <span className="font-semibold text-foreground">{course.instructor}</span></p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons} lessons</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {course.students}</span>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{course.category}</span>
                  </div>
                  <button
                    onClick={() => handleEnroll(course.id, course.price)}
                    className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow"
                  >
                    {hasPurchased(course.id, "course")
                      ? "Continue Learning →"
                      : course.price === "Free" || course.price === "₹0"
                      ? "Start Learning Free"
                      : isAuthenticated
                      ? "Enroll Now"
                      : "Login to Enroll"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ── CTAs ─────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-6 text-center shadow-card mb-6">
          <Lock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-black text-base mb-1">Login to Track Progress</h3>
          <p className="text-sm text-muted-foreground mb-4">Login to enroll in premium courses and save your progress.</p>
          <button onClick={() => navigate({ to: "/login" })}
            className="px-6 py-2.5 rounded-full gradient-hero text-white font-bold text-sm shadow-glow">
            Login Now
          </button>
        </motion.div>
      )}
    </AppShell>
  );
}
