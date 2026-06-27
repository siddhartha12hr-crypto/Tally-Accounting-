import { motion } from "framer-motion";
import { TrendingUp, Users, Video, Trophy, Film, GraduationCap, Eye, PlayCircle } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "43,892", change: "+12.3%", icon: Users, color: "gradient-saffron" },
    { label: "Total Videos", value: "1,247", change: "+8.1%", icon: Video, color: "gradient-royal" },
    { label: "Active Courses", value: "156", change: "+5.4%", icon: GraduationCap, color: "gradient-gold" },
    { label: "Live Sports", value: "24", change: "+18.9%", icon: Trophy, color: "gradient-hero" },
    { label: "Movies", value: "892", change: "+3.2%", icon: Film, color: "gradient-saffron" },
    { label: "Total Views", value: "2.4M", change: "+25.7%", icon: Eye, color: "gradient-royal" },
  ];

  const recentActivity = [
    { action: "New video uploaded", item: "Tally Prime Advanced Tutorial", time: "5 min ago", icon: Video },
    { action: "Course updated", item: "GST Expert Course", time: "15 min ago", icon: GraduationCap },
    { action: "Live match started", item: "India vs Nepal Cricket", time: "32 min ago", icon: Trophy },
    { action: "Movie added", item: "Pathaan (2023)", time: "1 hour ago", icon: Film },
    { action: "User milestone", item: "10K active users reached", time: "2 hours ago", icon: Users },
  ];

  const topContent = [
    { title: "Tally Prime Complete Course", views: "45.2K", type: "Course", trend: "+15%" },
    { title: "Accounting Basics Tutorial", views: "38.9K", type: "Video", trend: "+22%" },
    { title: "India vs Nepal Live", views: "92.1K", type: "Sports", trend: "+45%" },
    { title: "3 Idiots", views: "67.3K", type: "Movie", trend: "+8%" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${stat.color} grid place-items-center shadow-glow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-gradient">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl glass p-5 shadow-card"
      >
        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/20 transition-colors">
                <div className="h-9 w-9 rounded-lg gradient-hero grid place-items-center shrink-0">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold shrink-0">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl glass p-5 shadow-card"
      >
        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-primary" />
          Top Performing Content
        </h3>
        <div className="space-y-2">
          {topContent.map((content, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/20 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold">{content.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{content.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-semibold text-primary">{content.views} views</span>
                </div>
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {content.trend}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
