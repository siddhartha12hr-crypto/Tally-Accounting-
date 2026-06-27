import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { courses } from "@/lib/mockData";
import { Star, Clock, Users, BookOpen } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Premium Courses — Tally Accounting Hub Pro" },
      { name: "description", content: "Hand-picked premium courses for Tally, accounting, GST, Excel and more." },
    ],
  }),
  component: Courses,
});

const palettes = ["gradient-saffron", "gradient-royal", "gradient-hero", "gradient-gold"];

function Courses() {
  return (
    <AppShell>
      <PageHeader eyebrow="Courses" title="Premium Courses" subtitle="Master-level programs taught by top instructors." />
      <div className="grid gap-4">
        {courses.map((c, idx) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="overflow-hidden rounded-3xl glass shadow-card"
          >
            <div className={`relative h-32 ${palettes[idx % palettes.length]}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
              <div className="absolute inset-0 flex items-end p-4 text-white">
                <h3 className="text-lg font-black leading-tight drop-shadow">{c.title}</h3>
              </div>
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">By <span className="font-semibold text-foreground">{c.instructor}</span></p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {c.lessons} lessons</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.students}</span>
              </div>
              {c.progress > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Progress</span><span>{c.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full gradient-saffron" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              )}
              <button className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow">
                {c.progress > 0 ? "Continue Course" : "Enroll Now"}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </AppShell>
  );
}
