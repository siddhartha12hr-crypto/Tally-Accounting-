import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PinLock } from "@/components/PinLock";
import { movies } from "@/lib/mockData";
import { Play, Bookmark, Star } from "lucide-react";

export const Route = createFileRoute("/entertainment")({
  head: () => ({ meta: [{ title: "Entertainment — Tally Accounting Hub Pro" }] }),
  component: Entertainment,
});

const palettes = ["gradient-saffron", "gradient-royal", "gradient-hero", "gradient-gold"];

function Entertainment() {
  return (
    <PinLock title="Entertainment Access">
      <AppShell>
        <PageHeader eyebrow="Movies & More" title="Entertainment" subtitle="Trending Bollywood, Nepali and regional cinema." />
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {["Trending", "Bollywood", "Nepali", "South", "Action", "Drama", "Comedy"].map((g) => (
            <span key={g} className="shrink-0 rounded-full glass px-4 py-1.5 text-[11px] font-bold">{g}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {movies.map((m, idx) => (
            <motion.article
              key={m.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="overflow-hidden rounded-2xl glass shadow-card"
            >
              <div className={`relative aspect-[3/4] ${palettes[idx % palettes.length]}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.25),transparent_70%)]" />
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white">
                  <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" /> {m.rating}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="text-[10px] uppercase tracking-widest opacity-80">{m.genre}</p>
                  <h3 className="text-sm font-black leading-tight">{m.title}</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-[11px] text-muted-foreground">{m.desc}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <button className="flex-1 inline-flex items-center justify-center gap-1 rounded-full gradient-saffron px-2 py-1.5 text-[11px] font-bold text-white shadow-glow">
                    <Play className="h-3 w-3" /> Watch
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-full glass"><Bookmark className="h-3 w-3" /></button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </AppShell>
    </PinLock>
  );
}
