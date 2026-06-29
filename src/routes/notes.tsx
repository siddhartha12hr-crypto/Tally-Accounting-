import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { Search, FileText, X } from "lucide-react";
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

/* ── Open a PDF from any URL (handles base64 data URLs too) ── */
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

/* ── Placeholder coming-soon notes (shown when no real notes exist for a category) ── */
const PLACEHOLDER_NOTES = [
  { id: "ph-1", title: "Tally Accounting",   description: "Tally Accounting Notes",        category: "Tally",      thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80" },
  { id: "ph-2", title: "GST & Tax Guide",    description: "GST Return Filing Guide",        category: "GST & Tax",  thumbnailUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
  { id: "ph-3", title: "Stock Market",       description: "Stock Market Basics",            category: "Finance",    thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80" },
  { id: "ph-4", title: "Business Goals",     description: "Business Planning Notes",        category: "Business",   thumbnailUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80" },
  { id: "ph-5", title: "Excel Mastery",      description: "Advanced Excel Techniques",      category: "Excel",      thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" },
  { id: "ph-6", title: "Accounting Basics",  description: "Fundamentals of Accounting",     category: "Accounting", thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
];

const ACCENT_COLORS = [
  "#1a3a8f","#e8720c","#8b0000","#1a6b3a",
  "#5a1a8f","#876a00","#0e6b8f","#6b1a6b",
];

const CATEGORIES = ["All","Tally","Accounting","GST & Tax","Business","Finance","Excel","Other"];

/* ── Notes list page ── */
function NotesList() {
  const { notes }  = useData();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  /* Only published notes */
  const published = useMemo(
    () => notes.filter(n => n.status === "published"),
    [notes]
  );

  /* Filter published notes by category & search */
  const filteredPublished = useMemo(() => {
    let list = published;
    if (category !== "All") list = list.filter(n => n.category === category);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(n =>
      n.title.toLowerCase().includes(q)       ||
      n.description.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)    ||
      n.author?.toLowerCase().includes(q)     ||
      (n.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
    );
  }, [published, category, search]);

  /* Filter placeholders — only show ones whose category has NO published notes */
  const publishedCategories = useMemo(
    () => new Set(published.map(n => n.category)),
    [published]
  );

  const filteredPlaceholders = useMemo(() => {
    let list = PLACEHOLDER_NOTES.filter(p => !publishedCategories.has(p.category));
    if (category !== "All") list = list.filter(p => p.category === category);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [publishedCategories, category, search]);

  const clearSearch = () => setSearch("");
  const noResults   = filteredPublished.length === 0 && filteredPlaceholders.length === 0;

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

        {/* Search */}
        <div className="relative mb-4 px-4">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, category, tags, author…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-2xl glass border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
          />
          {search && (
            <button onClick={clearSearch}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 px-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border"
              style={
                category === cat
                  ? { background: "#1a3a8f", color: "#fff", borderColor: "#1a3a8f" }
                  : { background: "#fff", color: "#1c1c2e", borderColor: "#e0e0e0" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Info banner */}
        <p className="text-center text-xs text-muted-foreground mb-4 px-4">
          {published.length > 0
            ? "Tap any note to open its PDF instantly."
            : "Notes will appear here once published by the admin."}
        </p>

        <AnimatePresence mode="wait">

          {/* No results */}
          {noResults && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center"
            >
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#e8720c18" }}>
                <Search className="h-8 w-8" style={{ color: "#e8720c" }} />
              </div>
              <h3 className="text-base font-black mb-1">No matching notes found</h3>
              <p className="text-sm text-muted-foreground mb-5">Try another keyword or category.</p>
              <button onClick={clearSearch}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e8720c,#c05800)" }}>
                Clear Search
              </button>
            </motion.div>
          )}

          {/* Grid */}
          {!noResults && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 px-4"
            >
              {/* ── Real published notes ── */}
              {filteredPublished.map((note, idx) => {
                const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (note.pdfUrl) {
                        openPdfUrl(note.pdfUrl);
                      } else {
                        toast.info("No PDF attached to this note yet.");
                      }
                    }}
                    className="flex flex-col rounded-2xl overflow-hidden w-full cursor-pointer"
                    style={{ background: "#fff2f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  >
                    {/* Thumbnail */}
                    <div className="w-full overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                      {note.thumbnailUrl ? (
                        <img
                          src={note.thumbnailUrl}
                          alt={note.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `${accent}18` }}>
                          <FileText className="h-12 w-12" style={{ color: accent, opacity: 0.45 }} />
                        </div>
                      )}
                      {/* PDF Ready badge */}
                      {note.pdfUrl && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                          style={{ background: "rgba(22,163,74,0.85)" }}>
                          <FileText className="h-3 w-3 text-white" />
                          <span className="text-[9px] font-bold text-white tracking-wide">PDF</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="px-3 py-3">
                      <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: accent }}>
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {note.description || note.category}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* ── Placeholder coming-soon cards for unpublished categories ── */}
              {filteredPlaceholders.map((note, idx) => {
                const accent = ACCENT_COLORS[(filteredPublished.length + idx) % ACCENT_COLORS.length];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (filteredPublished.length + idx) * 0.05 }}
                    className="flex flex-col rounded-2xl overflow-hidden w-full"
                    style={{ background: "#fff2f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  >
                    {/* Thumbnail with COMING SOON overlay */}
                    <div className="w-full overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={note.thumbnailUrl}
                        alt={note.title}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.45)" }}>
                        <span className="text-white text-xs font-black px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(0,0,0,0.55)", letterSpacing: "0.12em" }}>
                          COMING SOON
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="px-3 py-3">
                      <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: accent }}>
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </AppShell>
  );
}

/* ── Root Notes component ── */
function Notes() {
  const matchRoute = useMatchRoute();
  const onChild    = matchRoute({ to: "/notes/$noteId", fuzzy: true });
  return onChild ? <Outlet /> : <NotesList />;
}
