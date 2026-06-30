import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Tally Accounting Hub Pro" },
      { name: "description", content: "All available study notes." },
    ],
  }),
  component: Notes,
});

function openPdfUrl(pdfUrl: string) {
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
    } catch {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  } else {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }
}

const PLACEHOLDER_NOTES = [
  { id: "ph-1", title: "Tally Accounting",  description: "Tally Accounting Notes",     category: "Tally",      thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80" },
  { id: "ph-2", title: "GST & Tax Guide",   description: "GST Return Filing Guide",     category: "GST & Tax",  thumbnailUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
  { id: "ph-3", title: "Stock Market",      description: "Stock Market Basics",         category: "Finance",    thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80" },
  { id: "ph-4", title: "Business Goals",    description: "Business Planning Notes",     category: "Business",   thumbnailUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80" },
  { id: "ph-5", title: "Excel Mastery",     description: "Advanced Excel Techniques",   category: "Excel",      thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" },
  { id: "ph-6", title: "Accounting Basics", description: "Fundamentals of Accounting",  category: "Accounting", thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
];

const ACCENT_COLORS = [
  "#1a3a8f","#e8720c","#8b0000","#1a6b3a",
  "#5a1a8f","#876a00","#0e6b8f","#6b1a6b",
];

function NotesList() {
  const { notes } = useData();

  const published = useMemo(
    () => notes.filter(n => n.status === "published"),
    [notes]
  );

  const publishedCategories = useMemo(
    () => new Set(published.map(n => n.category)),
    [published]
  );

  const placeholders = useMemo(
    () => PLACEHOLDER_NOTES.filter(p => !publishedCategories.has(p.category)),
    [publishedCategories]
  );

  const allCards = [
    ...published.map((n, i) => ({ type: "real" as const, data: n, idx: i })),
    ...placeholders.map((n, i) => ({ type: "placeholder" as const, data: n, idx: published.length + i })),
  ];

  return (
    <AppShell>
      <div className="min-h-screen pt-2 pb-28" style={{ background: "var(--color-background)" }}>

        {/* Blue header */}
        <div
          className="mx-[-1rem] px-4 py-4 mb-5 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}
        >
          <h1 className="text-white text-lg font-black tracking-wide">All Available Notes</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 px-4"
          >
            {allCards.map(({ type, data, idx }) => {
              const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];

              if (type === "real") {
                const note = data as typeof published[0];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (note.pdfUrl) openPdfUrl(note.pdfUrl);
                      else toast.info("No PDF attached to this note yet.");
                    }}
                    className="flex flex-col rounded-2xl overflow-hidden w-full cursor-pointer"
                    style={{ background: "#fff2f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  >
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
                    <div className="px-3 py-3">
                      <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: accent }}>{note.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.description || note.category}</p>
                    </div>
                  </motion.div>
                );
              }

              // placeholder
              return (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col rounded-2xl overflow-hidden w-full"
                  style={{ background: "#fff2f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  <div className="w-full overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                    <img src={data.thumbnailUrl} alt={data.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.45)" }}>
                      <span className="text-white text-xs font-black px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(0,0,0,0.55)", letterSpacing: "0.12em" }}>
                        COMING SOON
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: accent }}>{data.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{data.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </AppShell>
  );
}

function Notes() {
  const matchRoute = useMatchRoute();
  const onChild    = matchRoute({ to: "/notes/$noteId", fuzzy: true });
  return onChild ? <Outlet /> : <NotesList />;
}
