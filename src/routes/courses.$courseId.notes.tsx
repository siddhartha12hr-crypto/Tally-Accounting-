import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, BookOpen, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$courseId/notes")({
  head: () => ({
    meta: [{ title: "Course Notes — Tally Accounting Hub Pro" }],
  }),
  component: CourseNotesPage,
});

function openNote(pdfUrl: string) {
  if (!pdfUrl) {
    toast.info("This note will be available soon.");
    return;
  }

  window.open(pdfUrl, "_blank", "noopener,noreferrer");
}

function CourseNotesPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const { courses, notes } = useData();
  const course = courses.find((item) => item.id === courseId);
  const courseNotes = notes.filter((note) => {
    if (!course || note.status !== "published") return false;

    const isAssignedToCourse = note.tags.includes(`course:${course.id}`);
    const isSameCategory = note.category.trim().toLowerCase() === course.category.trim().toLowerCase();

    return isAssignedToCourse || isSameCategory;
  });

  if (!course) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-black">Course not found</h1>
          <button
            onClick={() => navigate({ to: "/courses" })}
            className="mt-4 rounded-full gradient-hero px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to Courses
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="pb-10">
        <button
          onClick={() => navigate({ to: "/courses" })}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        <section className="rounded-3xl gradient-hero p-6 text-white shadow-glow">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/75">Course Notes</p>
              <h1 className="text-xl font-black">{course.title}</h1>
            </div>
          </div>
        </section>

        <div className="mt-6 space-y-3">
          {courseNotes.map((note, index) => (
            <motion.button
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openNote(note.pdfUrl)}
              className="flex w-full items-center gap-4 rounded-2xl glass p-4 text-left shadow-card transition-colors hover:bg-accent"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-black">{note.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{note.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </motion.button>
          ))}

          {courseNotes.length === 0 && (
            <div className="rounded-2xl glass px-6 py-12 text-center shadow-card">
              <FileText className="mx-auto mb-3 h-11 w-11 text-muted-foreground/50" />
              <h2 className="font-black">No notes available yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Notes for this course will appear here when they are published.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
