import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, Clock, Users, BookOpen, Lock, FileText } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Premium Courses — Tally Accounting Hub Pro" },
      { name: "description", content: "Hand-picked premium courses for Tally, accounting, GST, Excel and more." },
    ],
  }),
  component: Courses,
});

const palettes = ["gradient-saffron", "gradient-royal", "gradient-hero", "gradient-gold"];

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

function Courses() {
  const { courses, notes } = useData();
  const { isAuthenticated, hasPurchased, purchaseContent } = useAuth();
  const navigate = useNavigate();
  
  const handleEnroll = (courseId: string, price: string) => {
    const isFree = price === "Free" || price === "₹0";
    
    // Must be logged in
    if (!isAuthenticated) {
      toast.info("Please login to enroll in this course");
      navigate({ to: "/login", search: { redirect: `/courses` } });
      return;
    }

    // Already enrolled
    if (hasPurchased(courseId, 'course')) {
      toast.info("You're already enrolled — opening course");
      navigate({ to: `/watch/${courseId}` });
      return;
    }

    if (isFree) {
      // Enroll immediately — save to user account
      purchaseContent(courseId, 'course');
      toast.success("Enrolled successfully! Opening course…");
      navigate({ to: `/watch/${courseId}` });
      return;
    }

    // Premium — go to payment
    navigate({ to: `/payment/${courseId}` });
  };
  
  return (
    <AppShell>
      <PageHeader eyebrow="Courses" title="Premium Courses" subtitle="Master-level programs taught by top instructors." />
      <div className="grid gap-4">
        {courses.map((course, idx) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="overflow-hidden rounded-3xl glass shadow-card"
          >
            {/* Course Header with Thumbnail */}
            <div className="relative h-32">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 text-white">
                <h3 className="text-lg font-black leading-tight drop-shadow-lg">{course.title}</h3>
              </div>
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-lg">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
              </div>
              {/* Price Badge */}
              <div className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                {course.price !== "Free" && course.price !== "₹0" && !isAuthenticated && (
                  <Lock className="h-3 w-3" />
                )}
                {course.price}
              </div>
            </div>
            
            {/* Course Details */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground">
                By <span className="font-semibold text-foreground">{course.instructor}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
              
              {/* Stats */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {course.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {course.students}
                </span>
              </div>
              
              {/* Category Badge */}
              <div className="mt-3">
                <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {course.category}
                </span>
              </div>
              
              {/* Enroll Button */}
              <button 
                onClick={() => handleEnroll(course.id, course.price)}
                className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow"
              >
                {hasPurchased(course.id, 'course')
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

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">No courses available yet</p>
          <p className="text-xs text-muted-foreground mt-1">New courses coming soon!</p>
        </div>
      )}

      {/* ── View Notes Section ────────────────────────── */}
      {(() => {
        const courseNotes = notes.filter(n => n.showInCourses && n.status === "published");
        if (courseNotes.length === 0) return null;
        return (
          <div className="mt-8">
            {/* Section header */}
            <div
              className="mx-[-1rem] px-4 py-4 mb-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}
            >
              <h2 className="text-white text-lg font-black tracking-wide flex items-center gap-2">
                <FileText className="h-5 w-5" /> View Notes
              </h2>
              <span className="text-white/70 text-xs font-semibold">{courseNotes.length} available</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {courseNotes.map((note, idx) => {
                const accent = NOTE_ACCENT_COLORS[idx % NOTE_ACCENT_COLORS.length];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (note.pdfUrl) openPdf(note.pdfUrl);
                      else toast.info("No PDF attached to this note yet.");
                    }}
                    className="flex flex-col rounded-2xl overflow-hidden cursor-pointer"
                    style={{ background: "#fff2f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  >
                    {/* Thumbnail */}
                    <div className="w-full overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                      {note.thumbnailUrl ? (
                        <img src={note.thumbnailUrl} alt={note.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `${accent}18` }}>
                          <FileText className="h-12 w-12" style={{ color: accent, opacity: 0.45 }} />
                        </div>
                      )}
                      {note.pdfUrl && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                          style={{ background: "rgba(22,163,74,0.85)" }}>
                          <FileText className="h-3 w-3 text-white" />
                          <span className="text-[9px] font-bold text-white tracking-wide">PDF</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="px-3 py-3">
                      <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: accent }}>
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {note.description || note.category}
                      </p>
                      {note.readingTime && note.readingTime !== "—" && (
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                          📖 {note.readingTime} · {note.difficulty}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </AppShell>
  );
}
