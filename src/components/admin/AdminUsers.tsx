import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Users, UserCheck, Ban, ShoppingBag, Search, MoreVertical,
  Gift, Trash2, ShieldBan, ShieldCheck, Clock, Mail, Phone,
  GraduationCap, User as UserIcon, Calendar, Activity,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { AdminUser } from "@/contexts/auth.types";

type FilterId = "all" | "active" | "online" | "blocked" | "purchased";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "online",    label: "Online Now" },
  { id: "active",    label: "Active" },
  { id: "blocked",   label: "Blocked" },
  { id: "purchased", label: "Has Courses" },
];

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

export function AdminUsers() {
  const {
    users, stats, isOnline, currentUser,
    blockUser, unblockUser, deleteUser,
    grantCourseAccess, revokeCourseAccess, refresh,
  } = useAdminUsers();
  const { courses } = useData();

  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<FilterId>("all");

  // Grant-access dialog state
  const [grantUser, setGrantUser] = useState<AdminUser | null>(null);

  // Delete confirmation state
  const [deleteUserState, setDeleteUserState] = useState<AdminUser | null>(null);

  // Detail dialog state
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

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

    // Sort: blocked users last, then by most recent login
    return [...list].sort((a, b) => {
      if (a.status === "blocked" && b.status !== "blocked") return 1;
      if (a.status !== "blocked" && b.status === "blocked") return -1;
      const aT = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
      const bT = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      return bT - aT;
    });
  }, [users, filter, search, isOnline]);

  // ── Stat cards ──────────────────────────────────────────
  const statCards = [
    { label: "Total Users",  value: stats.total,         icon: Users,      color: "gradient-hero",   sub: "registered" },
    { label: "Active Now",   value: stats.activeNow,     icon: Activity,   color: "gradient-saffron", sub: "last 30 min" },
    { label: "Blocked",       value: stats.blocked,       icon: Ban,        color: "bg-red-500",       sub: "suspended" },
    { label: "Purchases",     value: stats.totalPurchases, icon: ShoppingBag, color: "gradient-gold",    sub: `${stats.withPurchases} users` },
  ];

  // ── Handlers ────────────────────────────────────────────
  const handleBlock = (u: AdminUser) => {
    blockUser(u.id);
    toast.success(`${u.fullName} has been blocked`);
  };
  const handleUnblock = (u: AdminUser) => {
    unblockUser(u.id);
    toast.success(`${u.fullName} has been unblocked`);
  };
  const handleDelete = () => {
    if (!deleteUserState) return;
    deleteUser(deleteUserState.id);
    toast.success(`${deleteUserState.fullName} has been deleted`);
    setDeleteUserState(null);
  };

  const handleToggleCourse = (userId: string, courseId: string, has: boolean) => {
    if (has) {
      revokeCourseAccess(userId, courseId);
      toast.success("Course access revoked");
    } else {
      grantCourseAccess(userId, courseId);
      toast.success("Course access granted!");
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Session Overview Cards ───────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${s.color} grid place-items-center shadow-glow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {s.label === "Active Now" && stats.activeNow > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live
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
        <Input
          placeholder="Search users by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl glass border-0"
        />
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
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                filter === f.id ? "text-white shadow-glow gradient-hero" : "text-muted-foreground glass hover:text-foreground"
              }`}
            >
              {f.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-white/20" : "bg-muted/50"}`}>
                {count}
              </span>
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
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
                className={`rounded-2xl glass p-3.5 shadow-card transition-all ${
                  isBlocked ? "opacity-70 border border-red-500/20" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar with online indicator */}
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11 rounded-xl border-2 border-border">
                      <AvatarImage src={u.avatar || undefined} alt={u.fullName} />
                      <AvatarFallback className="rounded-xl gradient-hero text-white text-xs font-black">
                        {initials(u.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {online && !isBlocked && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                    {isBlocked && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-background grid place-items-center">
                        <Ban className="h-2 w-2 text-white" />
                      </span>
                    )}
                  </div>

                  {/* User info */}
                  <button
                    onClick={() => setDetailUser(u)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black truncate">{u.fullName}</p>
                      {isSelf && (
                        <span className="text-[8px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      @{u.username}
                      {u.email ? ` · ${u.email}` : u.phone ? ` · ${u.phone}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isBlocked
                          ? "bg-red-500/15 text-red-600"
                          : online
                            ? "bg-green-500/15 text-green-600"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {isBlocked ? (
                          <><Ban className="h-2.5 w-2.5" /> Blocked</>
                        ) : online ? (
                          <><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online</>
                        ) : (
                          <><Clock className="h-2.5 w-2.5" /> {timeAgo(u.lastLogin)}</>
                        )}
                      </span>
                      {u.purchasedCourses.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          <GraduationCap className="h-2.5 w-2.5" /> {u.purchasedCourses.length}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => setGrantUser(u)}>
                        <Gift className="h-4 w-4 mr-2" />
                        Course Access
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDetailUser(u)}>
                        <UserIcon className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isBlocked ? (
                        <DropdownMenuItem onClick={() => handleUnblock(u)} className="text-green-600">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Unblock User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleBlock(u)}
                          className="text-orange-600"
                          disabled={isSelf}
                        >
                          <ShieldBan className="h-4 w-4 mr-2" />
                          {isSelf ? "Can't block self" : "Block User"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setDeleteUserState(u)}
                        className="text-destructive"
                        disabled={isSelf}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isSelf ? "Can't delete self" : "Delete User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Empty state ───────────────────────────────────── */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl glass p-8 text-center"
        >
          <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-black text-muted-foreground">
            {search ? "No users match your search" : "No users yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? "Try a different name or email"
              : "Users will appear here after they sign up."}
          </p>
        </motion.div>
      )}

      {/* ── Refresh button ─────────────────────────────────── */}
      {users.length > 0 && (
        <button
          onClick={refresh}
          className="w-full text-center text-[10px] font-bold text-muted-foreground py-2 hover:text-foreground transition-colors"
        >
          Tap to refresh sessions
        </button>
      )}

      {/* ════════════════════════════════════════════════════
          GRANT COURSE ACCESS DIALOG
          ════════════════════════════════════════════════════ */}
      <Dialog open={!!grantUser} onOpenChange={(open) => !open && setGrantUser(null)}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl glass border-0 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Course Access
            </DialogTitle>
            <DialogDescription>
              Grant or revoke course purchase access for{" "}
              <span className="font-bold text-foreground">{grantUser?.fullName}</span>
            </DialogDescription>
          </DialogHeader>

          {grantUser && (
            <div className="space-y-2 mt-2">
              {courses.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <GraduationCap className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                  No courses available yet.
                  <p className="text-xs mt-1">Add courses first from the Courses tab.</p>
                </div>
              )}

              {courses.map(course => {
                const has = grantUser.purchasedCourses.includes(course.id);
                return (
                  <div
                    key={course.id}
                    className={`flex items-center gap-3 rounded-xl p-2.5 transition-all ${
                      has ? "bg-green-500/10 border border-green-500/20" : "glass"
                    }`}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-9 w-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{course.title}</p>
                      <p className="text-[10px] text-muted-foreground">{course.price} · {course.category}</p>
                    </div>
                    <Switch
                      checked={has}
                      onCheckedChange={() => handleToggleCourse(grantUser.id, course.id, has)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                );
              })}

              {courses.length > 0 && (
                <div className="pt-2 text-center text-[10px] text-muted-foreground">
                  {grantUser.purchasedCourses.length} of {courses.length} courses accessible
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          USER DETAIL DIALOG
          ════════════════════════════════════════════════════ */}
      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl glass border-0 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">User Details</DialogTitle>
          </DialogHeader>

          {detailUser && (
            <div className="space-y-4">
              {/* Profile header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 rounded-2xl border-2 border-border">
                  <AvatarImage src={detailUser.avatar || undefined} alt={detailUser.fullName} />
                  <AvatarFallback className="rounded-2xl gradient-hero text-white text-lg font-black">
                    {initials(detailUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-black text-base">{detailUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{detailUser.username}</p>
                  <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    detailUser.status === "blocked"
                      ? "bg-red-500/15 text-red-600"
                      : isOnline(detailUser)
                        ? "bg-green-500/15 text-green-600"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {detailUser.status === "blocked"
                      ? <><Ban className="h-2.5 w-2.5" /> Blocked</>
                      : isOnline(detailUser)
                        ? <><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online</>
                        : "Offline"}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <InfoChip icon={Mail}   label="Email"  value={detailUser.email || "—"} />
                <InfoChip icon={Phone}  label="Phone"  value={detailUser.phone || "—"} />
                <InfoChip icon={Clock}  label="Last Login" value={timeAgo(detailUser.lastLogin)} />
                <InfoChip icon={Calendar} label="Joined" value={detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString() : "—"} />
              </div>

              {/* Purchased courses */}
              <div className="rounded-xl glass p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    Purchased Courses
                  </p>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {detailUser.purchasedCourses.length}
                  </span>
                </div>
                {detailUser.purchasedCourses.length > 0 ? (
                  <div className="space-y-1">
                    {detailUser.purchasedCourses.map(cid => {
                      const course = courses.find(c => c.id === cid);
                      return (
                        <div key={cid} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent/30">
                          {course?.thumbnail && (
                            <img src={course.thumbnail} alt="" className="h-7 w-7 rounded-md object-cover" />
                          )}
                          <span className="text-xs font-semibold truncate flex-1">
                            {course?.title || `Course #${cid}`}
                          </span>
                          {course && (
                            <span className="text-[9px] text-muted-foreground">{course.price}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No purchased courses yet
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => { setDetailUser(null); setGrantUser(detailUser); }}
                  className="flex-1 rounded-xl gradient-hero text-white shadow-glow"
                >
                  <Gift className="h-4 w-4 mr-1.5" />
                  Manage Access
                </Button>
                {detailUser.status === "blocked" ? (
                  <Button
                    variant="outline"
                    onClick={() => { handleUnblock(detailUser); setDetailUser(null); }}
                    className="flex-1 rounded-xl text-green-600 border-green-500/30"
                  >
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                    Unblock
                  </Button>
                ) : currentUser?.id !== detailUser.id && (
                  <Button
                    variant="outline"
                    onClick={() => { handleBlock(detailUser); setDetailUser(null); }}
                    className="flex-1 rounded-xl text-orange-600 border-orange-500/30"
                  >
                    <ShieldBan className="h-4 w-4 mr-1.5" />
                    Block
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════
          DELETE CONFIRMATION
          ════════════════════════════════════════════════════ */}
      <AlertDialog open={!!deleteUserState} onOpenChange={(open) => !open && setDeleteUserState(null)}>
        <AlertDialogContent className="rounded-3xl glass border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold text-foreground">{deleteUserState?.fullName}</span>{" "}
              and all associated data including purchased courses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── Small info chip helper ──────────────────────────────── */
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
