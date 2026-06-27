import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { learnCategories } from "@/lib/mockData";
import { Play, Bookmark, Share2, Clock, Signal } from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Tally Accounting Hub Pro" },
      { name: "description", content: "Learn Tally, accounting, GST, Excel and more in Hindi & Nepali." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const [lang, setLang] = useState<"Hindi" | "Nepali">("Hindi");
  return (
    <AppShell>
      <PageHeader eyebrow="Learn" title="Learn in Hindi & Nepali" subtitle="Pick your language and dive into curated lessons." />

      <div className="mb-5 inline-flex rounded-full glass p-1 shadow-card">
        {(["Hindi", "Nepali"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative rounded-full px-5 py-2 text-xs font-bold transition-colors ${lang === l ? "text-white" : "text-muted-foreground"}`}
          >
            {lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full gradient-hero shadow-glow" />}
            <span className="relative z-10">{l}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {learnCategories.map((c, idx) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="overflow-hidden rounded-2xl glass shadow-card"
          >
            <div className="relative h-28 gradient-hero">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
              <div className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white">{c.level}</div>
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-[10px] uppercase tracking-widest opacity-80">{lang}</p>
                <h3 className="text-lg font-black leading-tight">{c.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                <span className="inline-flex items-center gap-1"><Signal className="h-3 w-3" /> {c.level}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full gradient-saffron px-4 py-2 text-xs font-bold text-white shadow-glow">
                  <Play className="h-3.5 w-3.5" /> Start
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full glass" aria-label="Save"><Bookmark className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-full glass" aria-label="Share"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </AppShell>
  );
}
