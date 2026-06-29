import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import {
  ArrowLeft, FileText, Clock, BookOpen, User,
  Tag, BarChart2, Calendar, ExternalLink, Download, Share2,
} from "lucide-react";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteDetails,
});

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#d1fae5", color: "#065f46" },
  Intermediate: { bg: "#fef3c7", color: "#92400e" },
  Advanced:     { bg: "#fee2e2", color: "#991b1b" },
};

function NoteDetails() {
  const navigate       = useNavigate();
  const { noteId }     = Route.useParams();
  const { notes }      = useData();
  const note           = notes.find(n => n.id === noteId);

  /* ── not found ── */
  if (!note) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
            <FileText className="h-10 w-10 text-muted-foreground opacity-40" />
          </div>
          <h2 className="text-lg font-black mb-2">Note Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This note may have been removed or unpublished.
          </p>
          <button
            onClick={() => navigate({ to: "/notes" })}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}
          >
            ← Back to Notes
          </button>
        </div>
      </AppShell>
    );
  }

  const diff = DIFFICULTY_STYLE[note.difficulty] ?? { bg: "#f3f4f6", color: "#374151" };

  const openPdf = () => {
    if (!note.pdfUrl) return;
    window.open(note.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = () => {
    if (!note.pdfUrl) return;
    const a = document.createElement("a");
    a.href = note.pdfUrl;
    a.download = `${note.title}.pdf`;
    a.click();
  };

  const sharePdf = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: note.title, text: note.description, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen pb-28" style={{ background: "var(--color-background)" }}>

        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border backdrop-blur-xl"
          style={{ background: "rgba(255,255,255,0.88)" }}
        >
          <button
            onClick={() => navigate({ to: "/notes" })}
            className="h-9 w-9 rounded-xl flex items-center justify-center glass hover:bg-accent transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold truncate text-foreground">{note.title}</span>
        </div>

        {/* Thumbnail hero */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#1a3a8f14" }}>
          {note.thumbnailUrl ? (
            <motion.img
              src={note.thumbnailUrl}
              alt={note.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1a3a8f22,#0e6b8f11)" }}>
              <FileText className="h-16 w-16 text-primary opacity-30" />
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category + Difficulty on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 flex-wrap">
            <span
              className="text-white text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ background: "#1a3a8f" }}
            >
              {note.category}
            </span>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ background: diff.bg, color: diff.color }}
            >
              {note.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-5 space-y-5">

          {/* Title + description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h1 className="text-xl font-black leading-tight mb-2 text-foreground">{note.title}</h1>
            {note.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{note.description}</p>
            )}
          </motion.div>

          {/* Meta grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { icon: User,      label: "Author",       value: note.author || "—" },
              { icon: Clock,     label: "Reading Time",  value: note.readingTime || "—" },
              { icon: BookOpen,  label: "Pages",         value: note.pageCount > 0 ? `${note.pageCount} pages` : "—" },
              { icon: BarChart2, label: "Difficulty",    value: note.difficulty },
              {
                icon: Calendar,
                label: "Last Updated",
                value: note.updatedAt
                  ? new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "—",
              },
              {
                icon: Tag,
                label: "Tags",
                value: note.tags?.length > 0 ? note.tags.join(", ") : "—",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-3"
                style={{ background: "#fff2f0" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5" style={{ color: "#e8720c" }} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">{value}</p>
              </div>
            ))}
          </motion.div>

          {/* Tags chips */}
          {note.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2"
            >
              {note.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#1a3a8f15", color: "#1a3a8f" }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 pt-2"
          >
            {/* Read PDF — primary */}
            <button
              onClick={openPdf}
              disabled={!note.pdfUrl}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-base font-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: note.pdfUrl
                  ? "linear-gradient(135deg,#e8720c,#c05800)"
                  : "#ccc",
                boxShadow: note.pdfUrl ? "0 4px 16px rgba(232,114,12,0.35)" : "none",
              }}
            >
              <ExternalLink className="h-5 w-5" />
              Read PDF
            </button>

            {/* Download + Share row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadPdf}
                disabled={!note.pdfUrl}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold glass hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={sharePdf}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold glass hover:bg-accent transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* No PDF warning */}
          {!note.pdfUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}
            >
              <p className="text-sm font-bold" style={{ color: "#92400e" }}>
                ⚠️ No PDF has been attached to this note yet.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
