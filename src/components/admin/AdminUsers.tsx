import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Users, Ban, ShoppingBag, Search, MoreVertical, KeyRound,
  Trash2, ShieldBan, ShieldCheck, Clock, Mail, Phone,
  GraduationCap, User as UserIcon, Calendar, Activity, ChevronLeft,
  CheckCircle2, Lock, Unlock, Ticket, Copy, Timer, XCircle,
  AlertTriangle, Smartphone,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { AdminUser, PurchaseCode } from "@/contexts/auth.types";

/* ════════════════════════════════════════════════════════════
   DURATION OPTIONS
   ════════════════════════════════════════════════════════════ */
const DURATIONS = [
  { label: "7 days access",   value: "7" },
  { label: "30 days access",  value: "30" },
  { label: "60 days access",  value: "60" },
  { label: "90 days access",  value: "90" },
  { label: "180 days access", value: "180" },
  { label: "1 year access",   value: "365" },
  { label: "Lifetime access", value: "-1" },
];

type FilterId = "all" | "active" | "online" | "blocked" | "purchased";
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "online",    label: "Online Now" },
  { id: "active",    label: "Active" },
  { id: "blocked",   label: "Blocked" },
  { id: "purchased", label: "Has Courses" },
];

/* ════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════ */
function initials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function formatDate(iso: string | null) {
  if (!iso) return "Lifetime";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(iso: string | null) {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export function AdminUsers() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (selectedUserId) {
    return (
      <UserDetailView
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  return <UserListView onSelectUser={setSelectedUserId} />;
}

/* ════════════════════════════════════════════════════════════
   USER LIST VIEW
   ════════════════════════════════════════════════════════════ */
function UserListView({ onSelectUser }: { onSelectUser: (id: string) => void }) {
  const { users, stats, isOnline, currentUser, blockUser, unblockUser, deleteUser, refresh } = useAdminUsers();
  const { courses } = useData();

  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<FilterId>("all");
  const [deleteUserState, setDeleteUserState] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    let list = users;
    switch (filter) {
      case "online":    list = list.filter(u => isOnline(u) && u.status !== "blocked"); break;
      case "active":    list = list.filter(u => u.status !== "blocked"); break;
      case "blocked":   list = list.filter(u => u.status === "blocked"); break;
      case "purchased": list = list.filter(u => u.purchasedCourses.length > 0); break;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.phone ?? "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (a.status === "blocked" && b.status !== "blocked") return 1;
      if (a.status !== "blocked" && b.status === "blocked") return -1;
      const aT = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
      const bT = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      return bT - aT;
    });
  }, [users, filter, search, isOnline]);

  const statCards = [
    { label: "Total Users",  value: stats.total,          icon: Users,       color: "gradient-hero",    sub: "registered" },
    { label: "Active Now",   value: stats.activeNow,      icon: Activity,    color: "gradient-saffron", sub: "last 30 min" },
    { label: "Blocked",      value: stats.blocked,        icon: Ban,         color: "bg-red-500",       sub: "suspended" },
    { label: "Access Codes", value: stats.activeCodes,    icon: Ticket,      color: "gradient-gold",    sub: `${stats.withPurchases} users` },
  ];

  const handleBlock = (u: AdminUser) => { blockUser(u.id); toast.success(`${u.fullName} has been blocked`); };
  const handleUnblock = (u: AdminUser) => { unblockUser(u.id); toast.success(`${u.fullName} has been unblocked`); };
  const handleDelete = () => {
    if (!deleteUserState) return;
    deleteUser(deleteUserState.id);
    toast.success(`${deleteUserState.fullName} has been deleted`);
    setDeleteUserState(null);
  };

  return (
    <div className="space-y-5">
      {/* ── Session Overview Cards ───────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${s.color} grid place-items-center shadow-glow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {s.label === "Active Now" && stats.activeNow > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Live
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-gradient">{s.value}</p>
              <p className="text-xs font-black text-foreground mt-0.5">{s.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Search ────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users by name, email, phone..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl glass border-0" />
      </div>

      {/* ── Filter pills ──────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mt-2">
        {FILTERS.map(f => {
          const count =
            f.id === "all"       ? users.length :
            f.id === "online"    ? users.filter(u => isOnline(u) && u.status !== "blocked").length :
            f.id === "active"    ? users.filter(u => u.status !== "blocked").length :
            f.id === "blocked"   ? stats.blocked :
            f.id === "purchased"  ? stats.withPurchases : 0;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn("relative shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all",
                filter === f.id ? "text-white shadow-glow gradient-hero" : "text-muted-foreground glass hover:text-foreground")}>
              {f.label}
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", filter === f.id ? "bg-white/20" : "bg-muted/50")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── User List ─────────────────────────────────────── */}
      <div className="grid gap-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((u, idx) => {
            const online = isOnline(u);
            const isBlocked = u.status === "blocked";
            const isSelf = currentUser?.id === u.id;
            return (
              <motion.div key={u.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
                className={cn("rounded-2xl glass p-3.5 shadow-card transition-all", isBlocked ? "opacity-70 border border-red-500/20" : "")}>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11 rounded-xl border-2 border-border">
                      <AvatarImage src={u.avatar || undefined} alt={u.fullName} />
                      <AvatarFallback className="rounded-xl gradient-hero text-white text-xs font-black">{initials(u.fullName)}</AvatarFallback>
                    </Avatar>
                    {online && !isBlocked && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />}
                    {isBlocked && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-background grid place-items-center"><Ban className="h-2 w-2 text-white" /></span>}
                  </div>
                  <button onClick={() => onSelectUser(u.id)} className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black truncate">{u.fullName}</p>
                      {isSelf && <span className="text-[8px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">YOU</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">@{u.username}{u.email ? ` · ${u.email}` : u.phone ? ` · ${u.phone}` : ""}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                        isBlocked ? "bg-red-500/15 text-red-600" : online ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground")}>
                        {isBlocked ? <><Ban className="h-2.5 w-2.5" /> Blocked</>
                          : online ? <><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online</>
                          : <><Clock className="h-2.5 w-2.5" /> {timeAgo(u.lastLogin)}</>}
                      </span>
                      {u.purchasedCourses.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          <GraduationCap className="h-2.5 w-2.5" /> {u.purchasedCourses.length}
                        </span>
                      )}
                    </div>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => onSelectUser(u.id)}>
                        <KeyRound className="h-4 w-4 mr-2" /> Manage Access
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectUser(u.id)}>
                        <UserIcon className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isBlocked ? (
                        <DropdownMenuItem onClick={() => handleUnblock(u)} className="text-green-600">
                          <ShieldCheck className="h-4 w-4 mr-2" /> Unblock User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleBlock(u)} className="text-orange-600" disabled={isSelf}>
                          <ShieldBan className="h-4 w-4 mr-2" /> {isSelf ? "Can't block self" : "Block User"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => setDeleteUserState(u)} className="text-destructive" disabled={isSelf}>
                        <Trash2 className="h-4 w-4 mr-2" /> {isSelf ? "Can't delete self" : "Delete User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl glass p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-black text-muted-foreground">{search ? "No users match your search" : "No users yet"}</p>
          <p className="text-xs text-muted-foreground mt-1">{search ? "Try a different name or email" : "Users will appear here after they sign up."}</p>
        </motion.div>
      )}

      {users.length > 0 && (
        <button onClick={refresh} className="w-full text-center text-[10px] font-bold text-muted-foreground py-2 hover:text-foreground transition-colors">
          Tap to refresh sessions
        </button>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteUserState} onOpenChange={(open) => !open && setDeleteUserState(null)}>
        <AlertDialogContent className="rounded-3xl glass border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black flex items-center gap-2"><Trash2 className="h-5 w-5 text-destructive" /> Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-bold text-foreground">{deleteUserState?.fullName}</span> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   USER DETAIL VIEW — Full profile with access control
   ════════════════════════════════════════════════════════════ */
function UserDetailView({ userId, onBack }: { userId: string; onBack: () => void }) {
  const {
    users, isOnline, currentUser, getUserCodes,
    blockUser, unblockUser, generatePurchaseCode, revokePurchaseCode,
    blockCourseForUser, unblockCourseForUser, revokeCourseAccess,
  } = useAdminUsers();
  const { courses } = useData();

  const user = users.find(u => u.id === userId);
  const userCodes = getUserCodes(userId);

  // Course access control state
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [duration, setDuration] = useState("30");
  const [showCodeHistory, setShowCodeHistory] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found</p>
        <Button onClick={onBack} variant="outline" className="mt-3 rounded-xl">Go Back</Button>
      </div>
    );
  }

  const isBlocked = user.status === "blocked";
  const online = isOnline(user);
  const isSelf = currentUser?.id === user.id;

  // Unlocked courses (in purchasedCourses but NOT in courseBlocks)
  const unlockedCourses = user.purchasedCourses
    .filter(cid => !user.courseBlocks?.includes(cid))
    .map(cid => courses.find(c => c.id === cid))
    .filter(Boolean);

  // Blocked courses
  const blockedCourses = (user.courseBlocks || [])
    .map(cid => courses.find(c => c.id === cid))
    .filter(Boolean);

  // Active codes for this user
  const activeCodes = userCodes.filter(c => c.status === "active");
    const pendingCodes = activeCodes.filter(c => !c.redeemed);

  // ── Handlers ────────────────────────────────────────────
  const handleGenerateCode = () => {
    if (selectedCourseIds.length === 0) {
      toast.error("Select at least one course");
      return;
    }
    if (courses.length === 0) {
      toast.error("No courses available. Add courses from the Courses tab first.");
      return;
    }
    const days = parseInt(duration);
    const code = generatePurchaseCode(user.id, selectedCourseIds, days);
    toast.success(`Code generated: ${code.code}`, {
      description: `Give this code to ${user.fullName}. They can redeem it on the Courses page. ${days > 0 ? `Valid for ${days} days.` : "Lifetime access."}`,
      duration: 8000,
    });
    setSelectedCourseIds([]);
  };

  const handleBlockCourse = (courseId: string, title: string) => {
    blockCourseForUser(user.id, courseId);
    toast.success(`"${title}" blocked for ${user.fullName}`);
  };

  const handleUnblockCourse = (courseId: string, title: string) => {
    unblockCourseForUser(user.id, courseId);
    toast.success(`"${title}" unblocked for ${user.fullName}`);
  };

  const handleRemoveAccess = (courseId: string, title: string) => {
    revokeCourseAccess(user.id, courseId);
    // Also revoke any purchase codes covering this course
    const codesForCourse = userCodes.filter(c => c.courseIds.includes(courseId) && c.status === "active");
    codesForCourse.forEach(c => revokePurchaseCode(c.code));
    toast.success(`Access removed for "${title}"`);
  };

  const handleRevokeCode = (code: string) => {
    revokePurchaseCode(code);
    toast.success("Purchase code revoked");
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    }
  };

  const handlePlatformBlock = () => {
    blockUser(user.id);
    toast.success(`${user.fullName} blocked from platform`);
  };

  const handlePlatformUnblock = () => {
    unblockUser(user.id);
    toast.success(`${user.fullName} unblocked`);
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Back button ──────────────────────────────────────── */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Users
      </button>

      {/* ═════════════════════════════════════════════════════
          USER PROFILE HEADER
          ═════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass p-5 shadow-card">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-border">
              <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
              <AvatarFallback className="rounded-2xl gradient-hero text-white text-lg font-black">{initials(user.fullName)}</AvatarFallback>
            </Avatar>
            <span className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
              isBlocked ? "bg-red-500" : online ? "bg-green-500" : "bg-muted")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black truncate">{user.fullName}</h2>
              {isSelf && <span className="text-[8px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">YOU</span>}
            </div>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.id}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <Badge color={isBlocked ? "red" : "green"} icon={isBlocked ? Ban : CheckCircle2}>
                {isBlocked ? "Blocked" : "Platform Active"}
              </Badge>
              {user.purchasedCourses.length > 0 && (
                <Badge color="purple" icon={Ticket}>{user.purchasedCourses.length} Courses</Badge>
              )}
              {activeCodes.length > 0 && (
                <Badge color="gold" icon={KeyRound}>{activeCodes.length} Active Codes</Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═════════════════════════════════════════════════════
          PLATFORM CONTROL
          ═════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl glass p-4 shadow-card">
        <h3 className="text-sm font-black mb-3 flex items-center gap-2">
          <ShieldBan className="h-4 w-4 text-primary" /> Platform Control
        </h3>
        <div className="flex gap-2">
          {isBlocked ? (
            <Button onClick={handlePlatformUnblock} disabled={isSelf}
              className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
              <Unlock className="h-4 w-4 mr-1.5" /> Unblock Platform
            </Button>
          ) : (
            <Button onClick={handlePlatformBlock} disabled={isSelf} variant="outline"
              className="flex-1 rounded-xl text-red-600 border-red-500/30 hover:bg-red-500/10">
              <Lock className="h-4 w-4 mr-1.5" /> Block Platform
            </Button>
          )}
        </div>
        {isSelf && <p className="text-[10px] text-muted-foreground text-center mt-2">You can't block your own account</p>}

        {/* Device info */}
        <div className="mt-3 rounded-xl bg-muted/30 p-3 flex items-center gap-2.5">
          <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Last Device</p>
            <p className="text-xs font-semibold truncate">
              {typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-3).join(" ") : "Unknown"}
            </p>
          </div>
          <span className="text-[9px] text-muted-foreground">{timeAgo(user.lastLogin)}</span>
        </div>
      </motion.div>

      {/* ═════════════════════════════════════════════════════
          COURSE ACCESS CONTROL
          ═════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl glass p-4 shadow-card">
        <h3 className="text-sm font-black mb-3 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" /> Course Access Control
        </h3>

        {courses.length === 0 ? (
          <div className="text-center py-4">
            <GraduationCap className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs font-bold text-muted-foreground">No courses available</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Add courses from the Courses tab first.</p>
          </div>
        ) : (
          <>
            {/* Course multi-select */}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Select Course(s)</p>
            <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto">
              {courses.map(course => {
                const checked = selectedCourseIds.includes(course.id);
                const hasAccess = user.purchasedCourses.includes(course.id) && !user.courseBlocks?.includes(course.id);
                const isCourseBlocked = user.courseBlocks?.includes(course.id);
                return (
                  <label key={course.id}
                    className={cn("flex items-center gap-2.5 rounded-xl p-2 cursor-pointer transition-all",
                      checked ? "bg-primary/10 border border-primary/30" : "glass hover:bg-accent/30")}>
                    <Checkbox checked={checked} onCheckedChange={() => toggleCourseSelection(course.id)} />
                    <img src={course.thumbnail} alt="" className="h-7 w-7 rounded-md object-cover shrink-0" />
                    <span className="text-xs font-bold truncate flex-1">{course.title}</span>
                    {hasAccess && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                    {isCourseBlocked && <Ban className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                  </label>
                );
              })}
            </div>

            {/* Duration selector */}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Access Duration</p>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="rounded-xl mb-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button onClick={handleGenerateCode}
                className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
                <KeyRound className="h-4 w-4 mr-1.5" /> Generate Code
              </Button>
            </div>
            {selectedCourseIds.length > 0 && (
              <p className="text-[10px] text-center text-muted-foreground mt-1.5">
                Will generate 1 code — user must redeem it to unlock
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* ═════════════════════════════════════════════════════
          PENDING CODES (generated but not redeemed yet)
          ═════════════════════════════════════════════════════ */}
      {pendingCodes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="rounded-2xl glass p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" /> Pending Codes
            </h3>
            <span className="text-[10px] font-bold bg-orange-500/15 text-orange-600 px-2 py-0.5 rounded-full">{pendingCodes.length}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">Share these codes with {user.fullName}. They must be redeemed on the Courses page.</p>
          <div className="space-y-2">
            {pendingCodes.map(code => {
              const dl = daysLeft(code.expiresAt);
              return (
                <div key={code.code} className="rounded-xl bg-orange-500/5 p-2.5">
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono font-bold text-primary flex-1">{code.code}</code>
                    <button onClick={() => handleCopyCode(code.code)} className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleRevokeCode(code.code)} className="text-red-500 hover:text-red-600">
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground">
                      {code.durationDays > 0 ? `${code.durationDays} days` : "Lifetime"}
                    </span>
                    <span className="text-[9px] font-bold text-orange-500">
                      {dl === null ? "Lifetime" : dl > 0 ? `${dl}d to redeem` : "Expired"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ═════════════════════════════════════════════════════
          UNLOCKED COURSES
          ═════════════════════════════════════════════════════ */}
      {unlockedCourses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl glass p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Unlock className="h-4 w-4 text-green-500" /> Unlocked Courses
            </h3>
            <span className="text-[10px] font-bold bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full">{unlockedCourses.length}</span>
          </div>
          <div className="space-y-2">
            {unlockedCourses.map(course => {
              const courseCodes = userCodes.filter(c => c.courseIds.includes(course!.id) && c.status === "active");
              const code = courseCodes[0];
              const dl = daysLeft(code?.expiresAt || null);
              return (
                <div key={course!.id} className="rounded-xl bg-muted/20 p-2.5">
                  <div className="flex items-center gap-2.5">
                    <img src={course!.thumbnail} alt="" className="h-8 w-8 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{course!.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {code ? (
                          <>
                            <code className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{code.code}</code>
                            <span className={cn("text-[9px] font-bold",
                              dl === null ? "text-blue-500" : dl <= 7 ? "text-orange-500" : "text-green-500")}>
                              {dl === null ? "Lifetime" : dl > 0 ? `${dl}d left` : "Expired"}
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] text-muted-foreground">Direct access</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {code && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg"
                          onClick={() => handleCopyCode(code.code)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-orange-600"
                        onClick={() => handleBlockCourse(course!.id, course!.title)}>
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-destructive"
                        onClick={() => handleRemoveAccess(course!.id, course!.title)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ═════════════════════════════════════════════════════
          BLOCKED COURSES
          ═════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl glass p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-500" /> Blocked Courses
          </h3>
          <span className="text-[10px] font-bold bg-red-500/15 text-red-600 px-2 py-0.5 rounded-full">{blockedCourses.length}</span>
        </div>
        {blockedCourses.length > 0 ? (
          <div className="space-y-2">
            {blockedCourses.map(course => (
              <div key={course!.id} className="rounded-xl bg-red-500/5 p-2.5 flex items-center gap-2.5">
                <img src={course!.thumbnail} alt="" className="h-8 w-8 rounded-lg object-cover shrink-0 opacity-60" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{course!.title}</p>
                  <p className="text-[9px] text-red-500">Course blocked for this user</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg text-green-600 shrink-0"
                  onClick={() => handleUnblockCourse(course!.id, course!.title)}>
                  <Unlock className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">No course blocks active.</p>
        )}
        {user.phone && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Phone className="h-3 w-3" /> {user.phone}
          </div>
        )}
      </motion.div>

      {/* ═════════════════════════════════════════════════════
          PURCHASE CODE HISTORY
          ═════════════════════════════════════════════════════ */}
      {userCodes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl glass p-4 shadow-card">
          <button onClick={() => setShowCodeHistory(s => !s)}
            className="w-full flex items-center justify-between mb-1">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" /> Purchase Code History
            </h3>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{userCodes.length}</span>
          </button>

          <AnimatePresence>
            {showCodeHistory && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="space-y-2 pt-2">
                  {userCodes.map(code => {
                    const dl = daysLeft(code.expiresAt);
                    const codeCourses = code.courseIds.map(cid => courses.find(c => c.id === cid)).filter(Boolean);
                    return (
                      <div key={code.code} className={cn("rounded-xl p-2.5 border",
                        code.status === "active" ? "bg-green-500/5 border-green-500/15" :
                        code.status === "expired" ? "bg-orange-500/5 border-orange-500/15" :
                        "bg-red-500/5 border-red-500/15")}>
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] font-mono font-bold text-primary flex-1">{code.code}</code>
                          <button onClick={() => handleCopyCode(code.code)} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                          {code.status === "active" && (
                            <button onClick={() => handleRevokeCode(code.code)} className="text-red-500 hover:text-red-600">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {codeCourses.map(c => (
                            <span key={c!.id} className="text-[8px] font-bold bg-muted/50 px-1.5 py-0.5 rounded truncate max-w-[100px]">{c!.title}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px] text-muted-foreground">
                            {code.durationDays > 0 ? `${code.durationDays} days` : "Lifetime"}
                          </span>
                          <span className={cn("text-[9px] font-bold",
                            code.status === "active" ? (dl === null ? "text-blue-500" : dl <= 7 ? "text-orange-500" : "text-green-500")
                            : code.status === "expired" ? "text-orange-500" : "text-red-500")}>
                            {code.status === "revoked" ? "Revoked"
                              : code.redeemed ? "Redeemed ✓"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!showCodeHistory && (
            <p className="text-[10px] text-muted-foreground text-center pt-1">Tap to expand history</p>
          )}
        </motion.div>
      )}

      {/* User info chips */}
      <div className="grid grid-cols-2 gap-2.5">
        <InfoChip icon={Mail} label="Email" value={user.email || "—"} />
        <InfoChip icon={Phone} label="Phone" value={user.phone || "—"} />
        <InfoChip icon={Clock} label="Last Login" value={timeAgo(user.lastLogin)} />
        <InfoChip icon={Calendar} label="Joined" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SMALL HELPER COMPONENTS
   ════════════════════════════════════════════════════════════ */
function Badge({ children, color, icon: Icon }: { children: React.ReactNode; color: "green" | "red" | "purple" | "gold"; icon: React.ElementType }) {
  const colors = {
    green:  "bg-green-500/15 text-green-600",
    red:    "bg-red-500/15 text-red-600",
    purple: "bg-purple-500/15 text-purple-600",
    gold:   "bg-amber-500/15 text-amber-600",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full", colors[color])}>
      <Icon className="h-2.5 w-2.5" /> {children}
    </span>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-xs font-bold truncate">{value}</p>
    </div>
  );
}
