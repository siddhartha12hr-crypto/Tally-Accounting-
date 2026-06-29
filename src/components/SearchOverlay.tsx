import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, BookOpen, FileText, PlayCircle, ArrowRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "@tanstack/react-router";

interface Result {
  id: string;
  type: "course" | "note" | "video";
  title: string;
  subtitle: string;
  to: string;
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { courses, notes, videos } = useData();
  const navigate  = useNavigate();
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const results: Result[] = query.trim().length < 2 ? [] : [
    ...courses
      .filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(c => ({ id: c.id, type: "course" as const, title: c.title, subtitle: `${c.instructor} · ${c.duration}`, to: "/courses" })),

    ...notes
      .filter(n =>
        n.status === "published" && (
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.category.toLowerCase().includes(query.toLowerCase())
        )
      )
      .slice(0, 3)
      .map(n => ({ id: n.id, type: "note" as const, title: n.title, subtitle: `${n.category} · ${n.difficulty}`, to: "/notes" })),

    ...videos
      .filter(v =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(v => ({ id: v.id, type: "video" as const, title: v.title, subtitle: `${v.category} · ${v.duration}`, to: "/learn" })),
  ];

  const iconFor = (type: Result["type"]) => {
    if (type === "course") return <BookOpen className="h-4 w-4" />;
    if (type === "note")   return <FileText className="h-4 w-4" />;
    return <PlayCircle className="h-4 w-4" />;
  };

  const colorFor = (type: Result["type"]) => {
    if (type === "course") return "#1a3a8f";
    if (type === "note")   return "#e8720c";
    return "#8b0000";
  };

  const labelFor = (type: Result["type"]) => {
    if (type === "course") return "Course";
    if (type === "note")   return "Note";
    return "Video";
  };

  const POPULAR = [
    { label: "Tally Prime", to: "/courses" },
    { label: "GST Returns", to: "/notes" },
    { label: "Excel Tips", to: "/learn" },
    { label: "Balance Sheet", to: "/notes" },
    { label: "Payroll", to: "/courses" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60]"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="absolute top-0 left-0 right-0 rounded-b-3xl shadow-elegant"
        style={{ background: "var(--color-background)" }}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search courses, notes, videos…"
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              style={{ background: "var(--color-card)" }}
            />
          </div>
          <button onClick={onClose}
            className="h-12 w-12 rounded-2xl border border-border flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
            style={{ background: "var(--color-card)" }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results or Popular */}
        <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {query.trim().length < 2 ? (
              <motion.div key="popular" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map(p => (
                    <button key={p.label}
                      onClick={() => { navigate({ to: p.to as any }); onClose(); }}
                      className="text-sm font-semibold px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                      style={{ background: "var(--color-card)" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-8 text-center">
                <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="font-bold text-muted-foreground">No results for "{query}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different keyword</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                {results.map((r, idx) => (
                  <motion.button
                    key={r.id + r.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => { navigate({ to: r.to as any }); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary transition-all text-left group"
                    style={{ background: "var(--color-card)" }}
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: colorFor(r.type) }}>
                      {iconFor(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${colorFor(r.type)}18`, color: colorFor(r.type) }}>
                        {labelFor(r.type)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
