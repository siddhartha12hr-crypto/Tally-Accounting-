import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { HeroSlider } from "@/components/HeroSlider";
import { quickActions } from "@/lib/mockData";
import { SearchOverlay } from "@/components/SearchOverlay";
import { ChatBot } from "@/components/ChatBot";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "../../imgfile/logo.png";
import { BookOpen, FileText, PlayCircle, HelpCircle, Film, GraduationCap, MessageCircle, Clock, Bell, Search, MoreVertical, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { BookOpen, FileText, PlayCircle, HelpCircle, Film, GraduationCap, MessageCircle };

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
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-glow">
              <img src={logoImg} alt="Tally Hub Logo" className="h-full w-full object-cover" />
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
            className="fixed top-20 right-4 w-56 glass rounded-2xl shadow-elegant p-1.5 z-50">
            <button onClick={() => { navigate({ to: "/profile" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Profile Settings</button>
            <button onClick={() => { navigate({ to: "/courses" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">My Courses</button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Certificates</button>
            <div className="h-px bg-border mx-2" />
            <button onClick={() => { navigate({ to: "/help" }); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors text-sm font-semibold">Help & Support</button>
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
          <div className="mb-4">
            <h2 className="text-xl font-black">Quick Access</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Start learning instantly</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a, idx) => {
              const Icon = iconMap[a.icon];
              const card = (
                <motion.div
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 300 }}
                  className="relative flex flex-col items-center justify-center gap-2.5 rounded-2xl overflow-hidden shadow-card hover:shadow-elegant"
                  style={{ background: a.bg, aspectRatio: "1 / 1", padding: "0" }}
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `${a.gradient.replace("135deg", "160deg")}22` }} />
                  <div className="relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ background: a.gradient }}>
                    <Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
                  </div>
                  <span className="relative text-[11px] font-black text-center leading-tight px-1"
                    style={{ color: "#1c1c2e" }}>
                    {a.label}
                  </span>
                </motion.div>
              );

              return a.external ? (
                <a key={a.label} href={a.to} target="_blank" rel="noopener noreferrer">{card}</a>
              ) : (
                <Link key={a.label} to={a.to as any}>{card}</Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
