import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { Play, Bookmark, Share2, Clock, Signal, Users, BookOpen, Star } from "lucide-react";

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
  const { courses } = useData();
  
  return (
    <AppShell>
      <PageHeader eyebrow="Learn" title="Learn in Hindi & Nepali" subtitle="Pick your language and dive into curated courses." />

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

      {/* Display courses from global state */}
      <div className="grid gap-4">
        {courses.map((course, idx) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="overflow-hidden rounded-2xl glass shadow-card"
          >
            {/* Course Thumbnail Header */}
            <div className="relative h-32">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white">
                {course.category}
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-[10px] uppercase tracking-widest opacity-90">{lang}</p>
                <h3 className="text-lg font-black leading-tight">{course.title}</h3>
                <p className="text-[10px] opacity-80 mt-0.5">by {course.instructor}</p>
              </div>
              {/* Price Badge */}
              <div className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-lg">
                {course.price}
              </div>
            </div>
            
            {/* Course Details */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
              
              {/* Stats */}
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {course.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {course.students}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {course.rating}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full gradient-hero px-4 py-2 text-xs font-bold text-white shadow-glow">
                  <Play className="h-3.5 w-3.5" /> Start Learning
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full glass" aria-label="Save">
                  <Bookmark className="h-4 w-4" />
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full glass" aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">No courses available yet</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon for new content!</p>
        </div>
      )}
    </AppShell>
  );
}
