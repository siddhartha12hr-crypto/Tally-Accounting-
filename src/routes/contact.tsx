import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Mail, 
  MessageCircle, 
  Send, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  ChevronDown,
  LogOut,
  User,
  ShoppingBag,
  Settings,
  Crown,
  Camera,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Tally Accounting Hub Pro" }] }),
  component: Contact,
});

const faqs = [
  { q: "How do I access Sports and Entertainment?", a: "Both sections are PIN-protected. Use your access PIN to unlock them." },
  { q: "Can I learn in Nepali?", a: "Yes! Toggle between Hindi and Nepali inside the Learn section." },
  { q: "Do I get a certificate?", a: "Every premium course awards a downloadable certificate on completion." },
  { q: "What is Tally AI Guru?", a: "Your AI assistant for accounting, Tally and course doubts in Hindi and Nepali." },
];

function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [nameVal,     setNameVal]     = useState(user?.fullName || "");
  const [avatarHover, setAvatarHover] = useState(false);

  const initials = (user?.fullName || user?.username || "U")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      updateProfile({ avatar: ev.target?.result as string });
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeAvatar = () => { updateProfile({ avatar: null }); toast.success("Photo removed"); };

  const saveName = () => {
    if (!nameVal.trim()) { toast.error("Name cannot be empty"); return; }
    updateProfile({ fullName: nameVal.trim() });
    setEditingName(false);
    toast.success("Name updated!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  const handleLogin = () => { navigate({ to: "/login" }); };

  return (
    <AppShell>
      <PageHeader 
        eyebrow={isAuthenticated ? "Profile" : "Contact"} 
        title={isAuthenticated ? `Welcome, ${user?.name || 'User'}` : "Get in touch"} 
        subtitle={isAuthenticated ? "Manage your account and preferences" : "We'd love to hear from you. Drop a message or reach us directly."} 
      />

      {/* User Profile Section (if logged in) */}
      {isAuthenticated && user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-6 shadow-card mb-4"
        >
          {/* ── Avatar + name row ── */}
          <div className="flex items-start gap-4 mb-5">

            {/* Avatar with edit overlay */}
            <div className="relative flex-shrink-0 cursor-pointer"
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={() => fileRef.current?.click()}>
              <div className="h-16 w-16 rounded-full overflow-hidden shadow-md"
                style={{ border: "2.5px solid var(--color-primary)" }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-hero flex items-center justify-center text-white text-2xl font-black">
                    {initials}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {avatarHover && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.5)" }}>
                    <Camera className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* camera badge */}
              <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
                <Camera className="h-2.5 w-2.5 text-white" />
              </div>
            </div>

            {/* Hidden file input */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

            {/* Name + email + badge */}
            <div className="flex-1 min-w-0">
              {/* Editable name */}
              {editingName ? (
                <div className="flex items-center gap-1.5 mb-1">
                  <Input
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setNameVal(user.fullName); setEditingName(false); } }}
                    className="h-8 text-sm font-black rounded-lg px-2 flex-1"
                    autoFocus
                  />
                  <button onClick={saveName}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "#22c55e" }}>
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { setNameVal(user.fullName); setEditingName(false); }}
                    className="h-7 w-7 rounded-lg border border-border flex items-center justify-center flex-shrink-0 hover:bg-accent">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-xl font-black truncate">{user.fullName || user.name}</h3>
                  <button onClick={() => { setNameVal(user.fullName); setEditingName(true); }}
                    className="h-6 w-6 rounded-lg flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0">
                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground truncate">{user.email || user.phone}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <Crown className="h-3 w-3" /> Premium Member
              </div>
            </div>
          </div>

          {/* Avatar action buttons */}
          <div className="flex gap-2 mb-5">
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors">
              <Camera className="h-3 w-3" /> {user.avatar ? "Change Photo" : "Add Photo"}
            </button>
            {user.avatar && (
              <button onClick={removeAvatar}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl glass p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold">Purchased</p>
              </div>
              <p className="text-2xl font-black">
                {(user.purchasedCourses?.length || 0) + (user.purchasedVideos?.length || 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
            <div className="rounded-xl glass p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold">Account</p>
              </div>
              <p className="text-2xl font-black">Active</p>
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-xl font-bold text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      )}

      {/* Login Prompt (if not logged in) */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-6 shadow-card mb-4 text-center"
        >
          <div className="h-16 w-16 rounded-full gradient-hero flex items-center justify-center text-white mx-auto mb-4">
            <User className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black mb-2">Not Logged In</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Login to access your profile and purchased content
          </p>
          <Button
            onClick={handleLogin}
            className="rounded-xl gradient-hero text-white shadow-glow font-bold"
          >
            Login Now
          </Button>
        </motion.div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); alert("Message sent! 🙏"); }}
        className="rounded-3xl glass p-5 shadow-card space-y-3"
      >
        <input className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" required maxLength={100} />
        <input type="email" className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Email address" required maxLength={255} />
        <textarea rows={4} className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Your message" required maxLength={1000} />
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-hero px-4 py-3 text-sm font-bold text-white shadow-glow">
          <Send className="h-4 w-4" /> Send Message
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a href="https://wa.me/0" className="flex items-center gap-2 rounded-2xl glass p-4 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-500 text-white"><MessageCircle className="h-5 w-5" /></div>
          <div><p className="text-xs font-bold">WhatsApp</p><p className="text-[10px] text-muted-foreground">Chat with us</p></div>
        </a>
        <a href="mailto:support@tallyhub.app" className="flex items-center gap-2 rounded-2xl glass p-4 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-royal text-white"><Mail className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs font-bold">Support</p><p className="truncate text-[10px] text-muted-foreground">support@tallyhub.app</p></div>
        </a>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        {[Instagram, Facebook, Youtube, Twitter].map((Icon, idx) => (
          <a key={idx} href="#" className="grid h-11 w-11 place-items-center rounded-2xl glass shadow-card transition-transform hover:-translate-y-0.5">
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-black">Frequently Asked</h2>
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl glass shadow-card">
              <button onClick={() => setOpen(open === idx ? null : idx)} className="flex w-full items-center justify-between p-4 text-left">
                <span className="text-sm font-bold">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === idx ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === idx ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-xs text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
