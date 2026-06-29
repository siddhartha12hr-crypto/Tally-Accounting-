import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { PinLock } from "@/components/PinLock";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { 
  BarChart3, 
  Video, 
  Trophy, 
  Film, 
  GraduationCap, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  FileText
} from "lucide-react";
import { AdminVideos } from "@/components/admin/AdminVideos";
import { AdminSports } from "@/components/admin/AdminSports";
import { AdminMovies } from "@/components/admin/AdminMovies";
import { AdminCourses } from "@/components/admin/AdminCourses";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminNotes } from "@/components/admin/AdminNotes";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Tally Accounting Hub Pro" }] }),
  component: AdminPage,
});

type TabType = "dashboard" | "videos" | "sports" | "movies" | "courses" | "notes" | "settings";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "videos"    as const, label: "Videos",    icon: Video },
    { id: "sports"    as const, label: "Sports",    icon: Trophy },
    { id: "movies"    as const, label: "Movies",    icon: Film },
    { id: "courses"   as const, label: "Courses",   icon: GraduationCap },
    { id: "notes"     as const, label: "Notes",     icon: FileText },
    { id: "settings"  as const, label: "Settings",  icon: Settings },
  ];

  return (
    <PinLock title="Admin Access" pin="1111">
      <AppShell>
        <PageHeader 
          eyebrow="Admin Panel" 
          title="Content Management" 
          subtitle="Manage videos, sports, movies, courses and more." 
        />
        
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? "text-white shadow-glow" 
                    : "text-muted-foreground glass hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.span 
                    layoutId="admin-tab" 
                    className="absolute inset-0 rounded-full gradient-hero" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content - Wrapped with Error Boundaries */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorBoundary key={`error-boundary-${activeTab}`}>
              {activeTab === "dashboard" && <AdminDashboard />}
              {activeTab === "videos"    && <AdminVideos />}
              {activeTab === "sports"    && <AdminSports />}
              {activeTab === "movies"    && <AdminMovies />}
              {activeTab === "courses"   && <AdminCourses />}
              {activeTab === "notes"     && <AdminNotes />}
              {activeTab === "settings"  && <AdminSettings />}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </PinLock>
  );
}
