import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HeroSlider } from "@/components/HeroSlider";
import { quickActions } from "@/lib/mockData";
import { BookOpen, FileText, PlayCircle, Trophy, Film, GraduationCap, TrendingUp, Clock, Award, Bell, Search, MoreVertical, Menu, ArrowRight } from "lucide-react";

const iconMap = { BookOpen, FileText, PlayCircle, Trophy, Film, GraduationCap };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tally Accounting Hub Pro — Learn. Grow. Earn." },
      { name: "description", content: "Premium learning hub for Tally, accounting, GST, business skills, sports and entertainment in Hindi & Nepali." },
    ],
  }),
  component: Home,
});

function Home() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <AppShell>
      {/* Professional Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-glow bg-gradient-to-br from-orange-500 to-red-600">
              <img 
                src="https://api.dicebear.com/7.x/shapes/svg?seed=TallyHub&backgroundColor=ff9933,dc143c&scale=80" 
                alt="Tally Hub Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">Tally Hub</h1>
              <p className="text-[10px] text-muted-foreground">Accounting Pro</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Notification Bell with Badge */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </button>

            {/* 3-Dot Menu */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 w-80 glass rounded-2xl shadow-elegant p-4 z-50"
        >
          <h3 className="font-bold mb-3 flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-xs text-muted-foreground">3 new</span>
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
              <div className="h-10 w-10 rounded-full gradient-saffron flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">New Course Available</p>
                <p className="text-xs text-muted-foreground">Advanced GST Filing is now live</p>
                <p className="text-xs text-primary mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
              <div className="h-10 w-10 rounded-full gradient-royal flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Certification Ready</p>
                <p className="text-xs text-muted-foreground">You can now take the final exam</p>
                <p className="text-xs text-primary mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
              <div className="h-10 w-10 rounded-full gradient-gold flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Live Session Tomorrow</p>
                <p className="text-xs text-muted-foreground">Tally Prime Expert Q&A at 6 PM</p>
                <p className="text-xs text-primary mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu Dropdown */}
      {showMenu && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 w-56 glass rounded-2xl shadow-elegant p-2 z-50"
        >
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
            Profile Settings
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
            My Courses
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
            Certificates
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
            Downloads
          </button>
          <div className="h-px bg-border my-2" />
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
            Help & Support
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-destructive">
            Logout
          </button>
        </motion.div>
      )}

      {/* Main Content - Add top padding for fixed navbar */}
      <div className="pt-20 pb-6">
        {/* Hero Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSlider />
        </motion.div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Quick Access</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Start learning instantly</p>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a, idx) => {
              const Icon = iconMap[a.icon];
              return (
                <Link key={a.label} to={a.to}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, type: "spring", stiffness: 300 }}
                    className="relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl glass shadow-card hover:shadow-elegant overflow-hidden group"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 gradient-saffron opacity-0 group-hover:opacity-5 transition-opacity" />
                    
                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl gradient-saffron text-white shadow-glow group-hover:shadow-elegant transition-all">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="relative text-xs font-bold text-center leading-tight">{a.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Continue Learning
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Pick up where you left off</p>
            </div>
            <Link to="/courses" className="text-xs font-semibold text-primary hover:underline">See all</Link>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl glass p-6 shadow-card hover:shadow-elegant transition-all overflow-hidden group"
          >
            {/* Animated background */}
            <div className="absolute inset-0 gradient-royal opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative flex items-center gap-4">
              <div className="relative grid h-20 w-20 place-items-center rounded-2xl gradient-royal text-white font-black text-xl shadow-elegant">
                TP
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <p className="text-lg font-black">Tally Prime Complete Course</p>
                    <p className="text-sm text-muted-foreground mt-1">Lesson 23 of 64 · GST Setup</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "35%" }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full gradient-saffron"
                    />
                  </div>
                  <span className="text-sm font-black text-primary">35%</span>
                </div>
              </div>
            </div>
            <button className="relative mt-5 w-full rounded-xl gradient-saffron px-4 py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-elegant transition-all flex items-center justify-center gap-2 group/btn">
              Resume Learning
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Trending Now
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Most popular this week</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x scrollbar-hide">
            {["GST Filing 2026", "Excel Pivot Mastery", "Tally Shortcuts", "Nepali Accounting"].map((t, idx) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative snap-start min-w-[220px] rounded-3xl gradient-hero p-6 text-white shadow-elegant hover:shadow-glow transition-all cursor-pointer overflow-hidden group"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-base font-bold mb-2">{t}</p>
                  <p className="text-xs opacity-90 mb-4">12,430 students enrolled</p>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span>Start Learning</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[100px]" />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8 mb-3 rounded-2xl gradient-gold p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur text-white shadow-glow">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-black text-accent-foreground">Tally AI Guru</p>
              <p className="text-sm text-accent-foreground/80">Ask anything in Hindi or Nepali</p>
            </div>
            <button className="rounded-xl bg-white/95 px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-card hover:bg-white transition-colors">
              Chat Now
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
