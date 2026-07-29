import { motion } from "framer-motion";
import {
  TrendingUp, Users, Video, Trophy,
  Film, GraduationCap, Eye, FileText,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

export function AdminDashboard() {
  const { videos, courses, movies, sports, notes, isLoading } = useData();

  const stats = [
    {
      label: "Videos",
      value: videos.length,
      icon: Video,
      color: "gradient-royal",
      sub: `${videos.filter(v => v.price === "Free").length} free`,
    },
    {
      label: "Courses",
      value: courses.length,
      icon: GraduationCap,
      color: "gradient-gold",
      sub: `${courses.filter(c => c.price === "Free").length} free`,
    },
    {
      label: "Movies",
      value: movies.length,
      icon: Film,
      color: "gradient-saffron",
      sub: "in library",
    },
    {
      label: "Live Sports",
      value: sports.filter(s => s.isLive).length,
      icon: Trophy,
      color: "gradient-hero",
      sub: `${sports.length} total`,
    },
    {
      label: "Notes",
      value: notes.filter(n => n.status === "published").length,
      icon: FileText,
      color: "gradient-royal",
      sub: `${notes.filter(n => n.status === "draft").length} drafts`,
    },
    {
      label: "Total Views",
      value: videos.reduce((sum, v) => sum + (v.views || 0), 0),
      icon: Eye,
      color: "gradient-gold",
      sub: "across all videos",
      format: (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n),
    },
  ];

  /* ── Top content by views ── */
  const topVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  /* ── Recent notes ── */
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-5">

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const display = stat.format ? stat.format(stat.value) : stat.value.toLocaleString();
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${stat.color} grid place-items-center shadow-glow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-gradient">{display}</p>
              <p className="text-xs font-black text-foreground mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Top videos by views */}
      {topVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass p-5 shadow-card"
        >
          <h3 className="text-sm font-black mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Top Videos by Views
          </h3>
          <div className="space-y-2">
            {topVideos.map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-colors">
                <span className="text-xs font-black text-muted-foreground w-4">{i + 1}</span>
                <div className="h-9 w-9 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{v.title}</p>
                  <p className="text-[10px] text-muted-foreground">{v.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-primary">{v.views.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent notes */}
      {recentNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl glass p-5 shadow-card"
        >
          <h3 className="text-sm font-black mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Recent Notes
          </h3>
          <div className="space-y-2">
            {recentNotes.map(n => (
              <div key={n.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground">{n.category} · {n.difficulty}</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                  n.status === "published"
                    ? "bg-green-500/15 text-green-600"
                    : "bg-orange-500/15 text-orange-600"
                }`}>
                  {n.status === "published" ? "● Live" : "○ Draft"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {videos.length === 0 && courses.length === 0 && movies.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl glass p-8 text-center"
        >
          <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-black text-muted-foreground">No content yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the tabs above to add videos, courses, movies, and more.
          </p>
        </motion.div>
      )}
    </div>
  );
}
