import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PinLock } from "@/components/PinLock";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  LayoutDashboard, Trophy, Film,
  GraduationCap, Settings, FileText, ShieldCheck, Users,
} from "lucide-react";
import { AdminSports }    from "@/components/admin/AdminSports";
import { AdminMovies }    from "@/components/admin/AdminMovies";
import { AdminCourses }   from "@/components/admin/AdminCourses";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSettings }  from "@/components/admin/AdminSettings";
import { AdminNotes }     from "@/components/admin/AdminNotes";
import { AdminUsers }     from "@/components/admin/AdminUsers";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tally Accounting Hub Pro" }] }),
  component: AdminPage,
});

type TabId = "dashboard" | "users" | "sports" | "movies" | "courses" | "notes" | "settings";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users",     label: "Users",     icon: Users },
  { id: "courses",   label: "Courses",   icon: GraduationCap },
  { id: "notes",     label: "Notes",     icon: FileText },
  { id: "movies",    label: "Movies",    icon: Film },
  { id: "sports",    label: "Sports",    icon: Trophy },
  { id: "settings",  label: "Settings",  icon: Settings },
];

function AdminPage() {
  const [tab, setTab] = useState<TabId>("dashboard");

  return (
    <PinLock title="Admin Panel" access="admin">
      <div className="relative min-h-screen overflow-x-hidden pb-28">

        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="mx-auto max-w-2xl px-4 h-16 flex items-center gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center shadow-glow flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-black leading-tight">Admin Panel</h1>
                <p className="text-[10px] text-muted-foreground">Content Management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border/50">
          <div className="mx-auto max-w-2xl">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 py-2.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
                    tab === id ? "text-white shadow-glow" : "text-muted-foreground glass hover:text-foreground"
                  }`}
                >
                  {tab === id && (
                    <motion.span
                      layoutId="admin-tab-pill"
                      className="absolute inset-0 rounded-full gradient-hero"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-32 pb-6">
          <div className="mx-auto max-w-2xl px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <ErrorBoundary key={`eb-${tab}`}>
                  {tab === "dashboard" && <AdminDashboard />}
                  {tab === "users"     && <AdminUsers />}
                  {tab === "sports"    && <AdminSports />}
                  {tab === "movies"    && <AdminMovies />}
                  {tab === "courses"   && <AdminCourses />}
                  {tab === "notes"     && <AdminNotes />}
                  {tab === "settings"  && <AdminSettings />}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PinLock>
  );
}
