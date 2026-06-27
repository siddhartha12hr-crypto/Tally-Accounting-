import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PinLock } from "@/components/PinLock";
import { cricketMatches, footballMatches } from "@/lib/mockData";
import { Trophy, Radio } from "lucide-react";

export const Route = createFileRoute("/sports")({
  head: () => ({ meta: [{ title: "Sports — Tally Accounting Hub Pro" }] }),
  component: Sports,
});

function Sports() {
  return (
    <PinLock title="Sports Access">
      <AppShell>
        <PageHeader eyebrow="Live & Highlights" title="Sports Hub" subtitle="Cricket and football, live scores and fixtures." />
        <Tabs />
      </AppShell>
    </PinLock>
  );
}

function Tabs() {
  const [tab, setTab] = useState<"cricket" | "football">("cricket");
  return (
    <>
      <div className="mb-5 inline-flex rounded-full glass p-1 shadow-card">
        {(["cricket", "football"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative rounded-full px-5 py-2 text-xs font-bold capitalize ${tab === t ? "text-white" : "text-muted-foreground"}`}>
            {tab === t && <motion.span layoutId="sport-pill" className="absolute inset-0 rounded-full gradient-hero shadow-glow" />}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>
      {tab === "cricket" ? (
        <div className="grid gap-3">
          {cricketMatches.map((m, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-2xl glass p-4 shadow-card">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="inline-flex items-center gap-1 text-primary"><Trophy className="h-3 w-3" /> Cricket</span>
                <span className={`inline-flex items-center gap-1 ${m.status === "LIVE" ? "text-destructive" : "text-muted-foreground"}`}>
                  {m.status === "LIVE" && <Radio className="h-3 w-3 animate-pulse" />} {m.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div>
                  <p className="text-sm font-black">{m.teamA}</p>
                  <p className="text-lg font-black text-gradient">{m.scoreA}</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground">VS</span>
                <div className="text-right">
                  <p className="text-sm font-black">{m.teamB}</p>
                  <p className="text-lg font-black text-gradient">{m.scoreB}</p>
                </div>
              </div>
              {m.overs && <p className="mt-2 text-center text-[11px] text-muted-foreground">{m.overs}</p>}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {footballMatches.map((m, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-2xl glass p-4 shadow-card">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-primary">⚽ Football</span>
                <span className={`${m.status === "LIVE" ? "text-destructive" : "text-muted-foreground"}`}>{m.status} {m.time}</span>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <p className="text-sm font-black">{m.teamA}</p>
                <p className="text-2xl font-black text-gradient">{m.scoreA} - {m.scoreB}</p>
                <p className="text-sm font-black text-right">{m.teamB}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
