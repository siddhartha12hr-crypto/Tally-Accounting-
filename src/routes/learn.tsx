import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { TALLY_VIDEOS, SECTIONS, type TallyVideo } from "@/lib/tallyVideos";
import { toast } from "sonner";
import {
  Play, Pause, SkipForward, SkipBack,
  CheckCircle2, Circle, ChevronDown, ChevronUp,
  BookOpen, Clock, ArrowLeft, GraduationCap,
  PlayCircle, RotateCcw, Volume2, VolumeX,
} from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [{ title: "My Learning — Tally Hub Pro" }],
  }),
  component: LearnPage,
});

/* ── localStorage keys ─────────────────────────────────── */
const PROGRESS_KEY   = "tally_course_progress";
const COMPLETED_KEY  = "tally_erp_completed_lessons";
const LAST_VIDEO_KEY = "tally_erp_last_video";

function getProgress(courseId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw)[courseId] ?? 0) : 0;
  } catch { return 0; }
}

function saveProgress(courseId: string, pct: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[courseId] = pct;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {}
}

function getCompleted(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveCompleted(ids: Set<number>) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(COMPLETED_KEY, JSON.stringify([...ids])); } catch {}
}

function getLastVideo(): number {
  if (typeof window === "undefined") return TALLY_VIDEOS[0].id;
  try {
    const raw = localStorage.getItem(LAST_VIDEO_KEY);
    return raw ? Number(raw) : TALLY_VIDEOS[0].id;
  } catch { return TALLY_VIDEOS[0].id; }
}

/* ── HLS attach ─────────────────────────────────────────── */
async function attachHls(video: HTMLVideoElement, src: string) {
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src; return;
  }
  const Hls = (await import("hls.js")).default;
  if (Hls.isSupported()) {
    const hls = new Hls({ enableWorker: false });
    hls.loadSource(src);
    hls.attachMedia(video);
  } else { video.src = src; }
}

const TALLY_ERP_ID = "tally-erp-free";

/* ── Main component ─────────────────────────────────────── */
function LearnPage() {
  const navigate  = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { courses } = useData();

  /* enrolled admin courses */
  const enrolledCourses = courses.filter(c => user?.purchasedCourses?.includes(c.id));

  /* Tally ERP player state */
  const [currentVideo, setCurrentVideo] = useState<TallyVideo>(() => {
    const lastId = getLastVideo();
    return TALLY_VIDEOS.find(v => v.id === lastId) ?? TALLY_VIDEOS[0];
  });
  const [completed,   setCompleted]   = useState<Set<number>>(getCompleted);
  const [playing,     setPlaying]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [muted,       setMuted]       = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([SECTIONS[0]]));
  const [showPlayer,  setShowPlayer]  = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const erpProgress = getProgress(TALLY_ERP_ID);
  const completedCount = completed.size;
  const totalLessons   = TALLY_VIDEOS.length;
  const pct = Math.round((completedCount / totalLessons) * 100);

  /* Load video on change */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    attachHls(v, currentVideo.src);
    if (playing) v.play().catch(() => {});
    localStorage.setItem(LAST_VIDEO_KEY, String(currentVideo.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const playVideo = (vid: TallyVideo) => {
    setCurrentVideo(vid);
    setPlaying(true);
    setProgress(0);
  };

  const playNext = () => {
    const idx = TALLY_VIDEOS.findIndex(v => v.id === currentVideo.id);
    if (idx < TALLY_VIDEOS.length - 1) playVideo(TALLY_VIDEOS[idx + 1]);
  };

  const playPrev = () => {
    const idx = TALLY_VIDEOS.findIndex(v => v.id === currentVideo.id);
    if (idx > 0) playVideo(TALLY_VIDEOS[idx - 1]);
  };

  const markComplete = (id: number) => {
    setCompleted(prev => {
      const next = new Set([...prev, id]);
      saveCompleted(next);
      saveProgress(TALLY_ERP_ID, Math.round((next.size / totalLessons) * 100));
      return next;
    });
  };

  const toggleSection = (s: string) =>
    setOpenSections(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });

  /* ── Not logged in ── */
  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 gap-5">
          <GraduationCap className="h-16 w-16 text-muted-foreground" />
          <div>
            <h2 className="text-xl font-black">Login to Access Your Learning</h2>
            <p className="text-sm text-muted-foreground mt-1">Track progress, resume lessons, and earn certificates.</p>
          </div>
          <button onClick={() => navigate({ to: "/login" })}
            className="px-8 py-3 rounded-full gradient-hero text-white font-bold text-sm shadow-glow">
            Login Now
          </button>
        </div>
      </AppShell>
    );
  }

  /* ── Inline Tally ERP Player view ── */
  if (showPlayer) {
    return (
      <AppShell>
        {/* Header */}
        <div className="pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => { setShowPlayer(false); setPlaying(false); videoRef.current?.pause(); }}
            className="h-9 w-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Tally ERP Free Course</p>
            <p className="text-sm font-black truncate">{currentVideo.title}</p>
          </div>
          <span className="text-xs font-bold text-muted-foreground flex-shrink-0">
            {TALLY_VIDEOS.findIndex(v => v.id === currentVideo.id) + 1}/{totalLessons}
          </span>
        </div>

        {/* Video player */}
        <div className="-mx-4 bg-black" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (v?.duration) setProgress((v.currentTime / v.duration) * 100);
            }}
            onLoadedMetadata={() => {
              const v = videoRef.current;
              if (v) setDuration(v.duration);
            }}
            onEnded={() => {
              setPlaying(false);
              markComplete(currentVideo.id);
              toast.success("Lesson complete! ✓");
              playNext();
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>

        {/* Controls */}
        <div className="bg-black px-4 pb-3 -mx-4">
          {/* Progress bar */}
          <input type="range" min={0} max={100} value={progress}
            onChange={e => {
              const v = videoRef.current;
              if (!v || !duration) return;
              v.currentTime = (Number(e.target.value) / 100) * duration;
              setProgress(Number(e.target.value));
            }}
            className="w-full h-1 accent-primary cursor-pointer"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button onClick={playPrev} className="text-white/70 hover:text-white">
                <SkipBack className="h-5 w-5" />
              </button>
              <button onClick={togglePlay}
                className="h-10 w-10 rounded-full gradient-hero flex items-center justify-center shadow-glow">
                {playing
                  ? <Pause className="h-5 w-5 text-white" />
                  : <Play className="h-5 w-5 text-white" />}
              </button>
              <button onClick={playNext} className="text-white/70 hover:text-white">
                <SkipForward className="h-5 w-5" />
              </button>
              <button onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !muted;
                setMuted(!muted);
              }} className="text-white/70 hover:text-white">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={() => markComplete(currentVideo.id)}
              className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                completed.has(currentVideo.id)
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completed.has(currentVideo.id) ? "Completed" : "Mark done"}
            </button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4 mb-3 rounded-2xl glass p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black">Overall Progress</span>
            <span className="text-xs font-black text-primary">{pct}% · {completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        {/* Lesson list */}
        <div className="mb-6">
          {SECTIONS.map(section => {
            const lessons = TALLY_VIDEOS.filter(v => v.section === section);
            const isOpen  = openSections.has(section);
            const doneInSection = lessons.filter(l => completed.has(l.id)).length;
            return (
              <div key={section} className="mb-2 rounded-2xl glass overflow-hidden shadow-card">
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-sm font-black">{section}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {doneInSection}/{lessons.length} completed
                    </p>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden"
                    >
                      <div className="border-t border-border/50">
                        {lessons.map((lesson, i) => {
                          const isCurrent = lesson.id === currentVideo.id;
                          const isDone    = completed.has(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => playVideo(lesson)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                isCurrent ? "bg-primary/10" : "hover:bg-accent/30"
                              }`}
                            >
                              {isDone
                                ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                : isCurrent
                                ? <PlayCircle className="h-4 w-4 text-primary flex-shrink-0 animate-pulse" />
                                : <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                              }
                              <p className={`text-xs flex-1 min-w-0 leading-snug ${
                                isCurrent ? "font-black text-primary" : isDone ? "text-muted-foreground line-through" : "font-semibold"
                              }`}>
                                {i + 1}. {lesson.title}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </AppShell>
    );
  }

  /* ── Dashboard view ─────────────────────────────────────── */
  return (
    <AppShell>
      <div className="pt-4 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">My Learning</p>
        <h1 className="text-2xl font-black mt-0.5">Learning Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resume where you left off</p>
      </div>

      {/* ── Tally ERP — Continue Learning ── */}
      <section className="mb-6">
        <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">Free Course</h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass shadow-card overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative h-36">
            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80"
              alt="Tally ERP" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end p-4 text-white">
              <div>
                <span className="text-[10px] font-bold bg-green-500 px-2 py-0.5 rounded-full mb-1 inline-block">FREE</span>
                <h3 className="text-base font-black leading-tight">Tally ERP Complete Course</h3>
                <p className="text-white/70 text-xs mt-0.5">
                  Last watched: {currentVideo.title}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {completedCount}/{totalLessons} lessons</span>
                <span className="font-black text-primary">{pct}% complete</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-hero transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPlayer(true)}
                className="flex-1 rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
              >
                <Play className="h-3.5 w-3.5" />
                {pct > 0 ? "Continue Learning" : "Start Learning"}
              </button>
              {pct > 0 && (
                <button
                  onClick={() => {
                    setCompleted(new Set());
                    saveCompleted(new Set());
                    saveProgress(TALLY_ERP_ID, 0);
                    setCurrentVideo(TALLY_VIDEOS[0]);
                    toast.success("Progress reset");
                  }}
                  className="h-10 w-10 rounded-full glass flex items-center justify-center"
                  title="Restart course"
                >
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Enrolled admin courses ── */}
      {enrolledCourses.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">My Enrolled Courses</h2>
          <div className="grid gap-4">
            {enrolledCourses.map((course, idx) => {
              const coursePct = getProgress(course.id);
              return (
                <motion.div key={course.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-3xl glass shadow-card overflow-hidden"
                >
                  <div className="relative h-28">
                    <img src={course.thumbnail} alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4 text-white">
                      <h3 className="text-sm font-black leading-tight">{course.title}</h3>
                    </div>
                    <div className="absolute top-3 left-3 rounded-full bg-green-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Enrolled
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                      <span className="font-black text-primary">{coursePct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                      <div className="h-full rounded-full gradient-hero" style={{ width: `${coursePct}%` }} />
                    </div>
                    <button
                      onClick={() => navigate({ to: `/watch/${course.id}` })}
                      className="w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {coursePct > 0 ? "Continue Learning" : "Start Learning"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Recently completed lessons ── */}
      {completedCount > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-black mb-3 text-muted-foreground uppercase tracking-widest">
            Recently Completed
          </h2>
          <div className="rounded-2xl glass shadow-card overflow-hidden">
            {TALLY_VIDEOS.filter(v => completed.has(v.id)).slice(-5).reverse().map((lesson, i) => (
              <div key={lesson.id}>
                <button
                  onClick={() => { setCurrentVideo(lesson); setShowPlayer(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <p className="flex-1 text-xs font-semibold text-muted-foreground line-through truncate">{lesson.title}</p>
                  <Play className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </button>
                {i < Math.min(completedCount, 5) - 1 && <div className="h-px bg-border/50 mx-4" />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty enrolled courses ── */}
      {enrolledCourses.length === 0 && pct === 0 && completedCount === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-3xl glass p-6 text-center shadow-card mb-6">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-black text-base mb-1">Start Learning Today</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The free Tally ERP course above is ready to start. Or browse more courses to enroll.
          </p>
          <button onClick={() => navigate({ to: "/courses" })}
            className="px-6 py-2.5 rounded-full gradient-hero text-white font-bold text-sm shadow-glow">
            Browse Courses
          </button>
        </motion.div>
      )}
    </AppShell>
  );
}
