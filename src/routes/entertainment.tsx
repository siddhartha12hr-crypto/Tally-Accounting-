import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinLock } from "@/components/PinLock";
import { MOVIES } from "@/lib/moviesData";
import { Play, Plus, Star, Search, X, ChevronRight, Info } from "lucide-react";

export const Route = createFileRoute("/entertainment")({
  head: () => ({ meta: [{ title: "Entertainment — Movies & More" }] }),
  component: Entertainment,
});

const GENRES = ["All", "Action", "Drama", "Comedy/Drama", "Nepali", "Biography", "Epic Action"];

function Entertainment() {
  const navigate      = useNavigate();
  const [query,        setQuery]        = useState("");
  const [activeGenre,  setActiveGenre]  = useState("All");
  const [featured,     setFeatured]     = useState(MOVIES[0]);
  const [showInfo,     setShowInfo]     = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = MOVIES;
    if (activeGenre !== "All") list = list.filter(m => m.genre.includes(activeGenre));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeGenre, query]);

  const goToDetail = (id: string) => navigate({ to: "/entertainment/$movieId", params: { movieId: id } });

  return (
    <PinLock title="Entertainment Access">
      {/* Full dark Netflix-style screen */}
      <div className="min-h-screen pb-28" style={{ background: "#141414" }}>

        {/* ── Hero banner ── */}
        <div className="relative w-full overflow-hidden" style={{ height: "56vw", maxHeight: 340, minHeight: 220 }}>
          <img
            src={featured.poster}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #141414 0%, rgba(20,20,20,0.6) 40%, transparent 80%)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(20,20,20,0.8) 0%, transparent 60%)" }} />

          {/* Hero content */}
          <div className="absolute bottom-6 left-4 right-4">
            {/* Genre badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                {featured.genre}
              </span>
              <span className="text-[10px] text-gray-400">• {featured.year} • {featured.duration}</span>
            </div>

            <h1 className="text-2xl font-black text-white leading-tight mb-1">{featured.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">{featured.rating}</span>
              <span className="text-xs text-gray-400 ml-1">IMDb</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => goToDetail(featured.id)}
                className="flex items-center gap-2 px-5 py-2 rounded text-sm font-black text-black"
                style={{ background: "white" }}>
                <Play className="h-4 w-4 fill-black" /> Play
              </button>
              <button
                onClick={() => setShowInfo(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-bold text-white"
                style={{ background: "rgba(109,109,110,0.7)" }}>
                <Info className="h-4 w-4" /> More Info
              </button>
            </div>

            {/* Info panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-gray-300 mt-3 leading-relaxed max-w-xs"
                >
                  {featured.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="px-4 mt-4 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, genres…"
              className="w-full h-11 pl-10 pr-10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              style={{ background: "#2a2a2a", border: "1px solid #3a3a3a" }}
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Genre pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 px-4 mb-5 scrollbar-hide">
          {GENRES.map(g => (
            <button key={g} onClick={() => setActiveGenre(g)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={activeGenre === g
                ? { background: "#e50914", color: "white", border: "1px solid #e50914" }
                : { background: "transparent", color: "#aaa", border: "1px solid #555" }
              }>
              {g}
            </button>
          ))}
        </div>

        {/* ── Section: Trending ── */}
        {!query && activeGenre === "All" && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-black text-white">🔥 Trending Now</h2>
              <button className="flex items-center gap-0.5 text-xs font-bold text-red-500">
                See all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {MOVIES.slice(0, 5).map((m, idx) => (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goToDetail(m.id)}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden"
                  style={{ width: 130, height: 190, cursor: "pointer" }}
                >
                  <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }} />
                  {/* Number badge */}
                  <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{idx + 1}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[11px] font-black truncate">{m.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 text-[10px] font-bold">{m.rating}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ── All / filtered movies grid ── */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-white">
              {query ? `Results for "${query}"` : activeGenre === "All" ? "All Movies" : activeGenre}
            </h2>
            <span className="text-xs text-gray-500">{filtered.length} titles</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Search className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-white font-bold text-lg">No results found</p>
              <p className="text-gray-500 text-sm mt-1">Try a different title or genre</p>
              <button onClick={() => { setQuery(""); setActiveGenre("All"); }}
                className="mt-4 px-5 py-2 rounded bg-red-600 text-white text-sm font-bold">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((m, idx) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => goToDetail(m.id)}
                  className="relative rounded-xl overflow-hidden text-left w-full"
                  style={{ aspectRatio: "2/3", cursor: "pointer", display: "block" }}
                >
                  <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-[10px] font-black leading-tight line-clamp-2">{m.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 text-[9px] font-bold">{m.rating}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center">
                    <Play className="h-3 w-3 text-white fill-white ml-0.5" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

      </div>
    </PinLock>
  );
}
