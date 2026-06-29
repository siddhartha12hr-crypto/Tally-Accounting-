import { createFileRoute, useNavigate, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { Search, FileText, X, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Tally Accounting Hub Pro" },
      { name: "description", content: "All available study notes." },
    ],
  }),
  component: Notes,
});

const ACCENT_COLORS = [
  "#1a3a8f","#e8720c","#8b0000","#1a6b3a",
  "#5a1a8f","#876a00","#0e6b8f","#6b1a6b",
];

const CATEGORIES = [
  "All","Tally","Accounting","GST & Tax",
  "Business","Finance","Excel","Other",
];

/* ── Notes list (the /notes page itself) ── */
function NotesList() {
  const { notes }  = useData();
  const navigate   = useNavigate();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  /* Step 1 — published only */
  const published = useMemo(
    () => notes.filter(n => n.status === "published"),
    [notes]
  );

  /* Step 2 — category filter */
  const afterCategory = useMemo(
    () => category === "All"
      ? published
      : published.filter(n => n.category === category),
    [published, category]
  );

  /* Step 3 — search filter (case-insensitive, multi-field) */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return afterCategory;
    return afterCategory.filter(n =>
      n.title.toLowerCase().includes(q)       ||
      n.description.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)    ||
      n.author.toLowerCase().includes(q)      ||
      (n.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
    );
  }, [afterCategory, search]);

  const clearSearch   = () => setSearch("");
  const nonePublished = published.length === 0;
  const noResults     = !nonePublished && filtered.length === 0;

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
            <button
              onClick={clearSearch}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 px-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border"
              style={
                category === cat
                  ? { background: "#e8720c", color: "#fff", borderColor: "#e8720c" }
                  : { background: "#fff", color: "#1c1c2e", borderColor: "#e0e0e0" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* CASE 1 — no published notes */}
          {nonePublished && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 px-4 text-center"
            >
              <div
                className="h-20 w-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg,#e8720c,#c05800)" }}
              >
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-lg font-black mb-2">No Notes Available</h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                No notes have been published yet. Check back soon.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e8720c,#c05800)" }}
              >
                <RefreshCw className="h-4 w-4" /> Check Again
              </button>
            </motion.div>
          )}

          {/* CASE 2 — no search/filter results */}
          {noResults && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center"
            >
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#e8720c18" }}
              >
                <Search className="h-8 w-8" style={{ color: "#e8720c" }} />
              </div>
              <h3 className="text-base font-black mb-1">No matching notes found</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Try another keyword or category.
              </p>
              <button
                onClick={clearSearch}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e8720c,#c05800)" }}
              >
                Clear Search
              </button>
            </motion.div>
          )}

          {/* CASE 3 — results grid */}
          {!nonePublished && !noResults && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 px-4"
            >
              {filtered.map((note, idx) => {
                const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                return (
                  <motion.button
                    key={note.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.13)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate({ to: "/notes/$noteId", params: { noteId: note.id } })}
                    className="text-left flex flex-col rounded-2xl overflow-hidden w-full"
                    style={{
                      background: "#fff2f0",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "box-shadow 250ms ease",
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="w-full overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                      {note.thumbnailUrl ? (
                        <img
                          src={note.thumbnailUrl}
                          alt={note.title}
                          className="w-full h-full object-cover"
                          style={{ transition: "transform 300ms ease" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `${accent}18` }}
                        >
                          <FileText className="h-12 w-12" style={{ color: accent, opacity: 0.45 }} />
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
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}

/* ── Root Notes component — renders list OR child route ── */
function Notes() {
  const matchRoute = useMatchRoute();
  const onChild    = matchRoute({ to: "/notes/$noteId", fuzzy: true });
  return onChild ? <Outlet /> : <NotesList />;
}
