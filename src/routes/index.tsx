import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { HeroSlider } from "@/components/HeroSlider";
import { quickActions } from "@/lib/mockData";
import { ChatBot } from "@/components/ChatBot";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, FileText, PlayCircle, Trophy, Film, GraduationCap, TrendingUp, Clock, Award, Bell, Search, MoreVertical, ArrowRight } from "lucide-react";

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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu]     = useState(false);
  const [showChat, setShowChat]     = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: "1", title: "New Course Available", body: "Advanced GST Filing is now live",  time: "2 hours ago", read: false, gradient: "gradient-saffron" },
    { id: "2", title: "Certification Ready",  body: "You can now take the final exam",   time: "1 day ago",   read: false, gradient: "gradient-royal" },
    { id: "3", title: "Live Session Tomorrow",body: "Tally Prime Expert Q&A at 6 PM",    time: "2 days ago",  read: false, gradient: "gradient-gold"  },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      const t = setTimeout(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), 1500);
      return () => clearTimeout(t);
    }
  }, [showNotifications]);

  useEffect(() => {
    const close = () => { setShowNotifications(false); setShowMenu(false); };
    if (showNotifications || showMenu) {
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [showNotifications, showMenu]);

  return (
    <AppShell>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-glow bg-gradient-to-br from-orange-500 to-red-600">
              <img src="https://api.dicebear.com/7.x/shapes/svg?seed=TallyHub&backgroundColor=ff9933,dc143c&scale=80"
                alt="Tally Hub Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">Tally Hub</h1>
              <p className="text-[10px] text-muted-foreground">Accounting Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setShowSearch(true)}
              className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors">
              <Search className="h-5 w-5" />
            </button>
            {/* Bell */}
            <button onClick={e => { e.stopPropagation(); setShowMenu(false); setShowNotifications(v => !v); }}
              className="relative h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">{unreadCount}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {/* Menu */}
            <button onClick={e => { e.stopPropagation(); setShowNotifications(false); setShowMenu(v => !v); }}
              className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ type: "spring", damping: 22, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="fixed top-20 right-4 w-80 glass rounded-2xl shadow-elegant p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Notifications</h3>
              <span className="text-xs text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread` : "All read"}</span>
            </div>
            <div className="space-y-2">
              {notifications.map(n => (
                <motion.div key={n.id} animate={{ opacity: n.read ? 0.6 : 1 }} transition={{ duration: 0.8 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                  <div className={`h-10 w-10 rounded-full ${n.gradient} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate">{n.title}</p>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                    <p className="text-xs text-primary mt-0.5">{n.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="mt-3 w-full text-xs font-semibold text-primary hover:underline text-center">
              Mark all as read
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ type: "spring", damping: 22, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="fixed top-20 right-4 w-56 glass rounded-2xl shadow-elegant p-2 z-50">
            <button onClick={() => { navigate({ to: "/profile" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Profile Settings</button>
            <button onClick={() => { navigate({ to: "/courses" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">My Courses</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Certificates</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Downloads</button>
            <div className="h-px bg-border my-2" />
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Help & Support</button>
            <button onClick={() => { logout(); navigate({ to: "/login" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-destructive">Logout</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      {/* ChatBot */}
      <AnimatePresence>
        {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      </AnimatePresence>

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
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <button onClick={() => navigate({ to: "/courses" })} className="relative mt-5 w-full rounded-xl gradient-saffron px-4 py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-elegant transition-all flex items-center justify-center gap-2 group/btn">
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
            <button onClick={() => setShowChat(true)}
              className="rounded-xl bg-white/95 px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-card hover:bg-white transition-colors active:scale-95">
              Chat Now
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
