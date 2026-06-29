import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Camera, Trash2, Edit2, Check, X, LogOut,
  User, Mail, Phone, Crown, ShoppingBag, AtSign,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — Tally Accounting Hub Pro" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();

  const [editingName, setEditingName] = useState(false);
  const [nameVal,     setNameVal]     = useState(user?.fullName || "");
  const [avatarHover, setAvatarHover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  /* ── Avatar ── */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      updateProfile({ avatar: dataUrl });
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeAvatar = () => {
    updateProfile({ avatar: null });
    toast.success("Profile picture removed");
  };

  /* ── Name edit ── */
  const saveName = () => {
    if (!nameVal.trim()) { toast.error("Name cannot be empty"); return; }
    updateProfile({ fullName: nameVal.trim() });
    setEditingName(false);
    toast.success("Name updated!");
  };

  const cancelName = () => {
    setNameVal(user.fullName);
    setEditingName(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/login" });
  };

  const initials = (user.fullName || user.username || "U")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AppShell>
      <div className="pt-6 pb-10">

        {/* ── Avatar section ── */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative cursor-pointer select-none"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            onClick={() => fileRef.current?.click()}
          >
            {/* Avatar circle */}
            <div className="h-24 w-24 rounded-full overflow-hidden shadow-elegant"
              style={{ border: "3px solid var(--color-primary)" }}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                  style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <AnimatePresence>
              {avatarHover && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <Camera className="h-6 w-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera badge */}
            <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          {/* Hidden file input */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

          {/* Avatar actions */}
          <div className="flex gap-2 mt-3">
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors">
              <Camera className="h-3 w-3" /> Change Photo
            </button>
            {user.avatar && (
              <button onClick={removeAvatar}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>

          {/* Premium badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#f59e0b22,#ea580c22)", color: "#ea580c" }}>
            <Crown className="h-3 w-3" /> Premium Member
          </div>
        </div>

        {/* ── Profile info card ── */}
        <div className="rounded-3xl glass p-6 shadow-elegant space-y-5">

          <h2 className="text-lg font-black">Profile Details</h2>

          {/* Full Name — editable */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</Label>
            <div className="flex items-center gap-2 mt-1.5">
              {editingName ? (
                <>
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={nameVal}
                      onChange={e => setNameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelName(); }}
                      className="pl-10 rounded-xl"
                      autoFocus
                    />
                  </div>
                  <button onClick={saveName}
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={cancelName}
                    className="h-9 w-9 rounded-xl flex items-center justify-center border border-border hover:bg-accent flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-border"
                    style={{ background: "var(--color-card)" }}>
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold">{user.fullName}</span>
                  </div>
                  <button onClick={() => { setNameVal(user.fullName); setEditingName(true); }}
                    className="h-9 w-9 rounded-xl flex items-center justify-center border border-border hover:bg-accent flex-shrink-0 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Username — read only */}
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Username</Label>
            <div className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-xl border border-border"
              style={{ background: "var(--color-card)" }}>
              <AtSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold">{user.username}</span>
            </div>
          </div>

          {/* Email — read only */}
          {user.email && (
            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</Label>
              <div className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-xl border border-border"
                style={{ background: "var(--color-card)" }}>
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-semibold truncate">{user.email}</span>
              </div>
            </div>
          )}

          {/* Phone — read only */}
          {user.phone && (
            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone</Label>
              <div className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-xl border border-border"
                style={{ background: "var(--color-card)" }}>
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-semibold">{user.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Stats card ── */}
        <div className="rounded-3xl glass p-5 shadow-elegant mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card)" }}>
            <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-black">
              {(user.purchasedCourses?.length || 0) + (user.purchasedVideos?.length || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Purchases</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card)" }}>
            <Crown className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-black text-green-500">Active</p>
            <p className="text-xs text-muted-foreground">Account</p>
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="mt-6">
          <Button onClick={handleLogout} variant="outline"
            className="w-full rounded-2xl font-bold text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 py-5">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

      </div>
    </AppShell>
  );
}
