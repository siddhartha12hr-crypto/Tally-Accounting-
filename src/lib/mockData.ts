/**
 * mockData.ts — UI configuration only
 * All content (courses, videos, movies, sports, notes) is now stored in
 * Supabase (or localStorage fallback). See src/contexts/DataContext.tsx.
 */

/* ── Hero slider images (static UI config) ─────────────── */
export const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
    hasButton: true,
    buttonText: "Enroll Now",
    buttonLink: "/courses",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    hasButton: false,
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    hasButton: true,
    buttonText: "Learn More",
    buttonLink: "/learn",
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    hasButton: false,
  },
  {
    image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=1200&q=80",
    hasButton: true,
    buttonText: "Get Started",
    buttonLink: "/courses",
  },
] as const;

/* ── Quick actions grid (home page) ─────────────────────── */
export const quickActions = [
  { label: "Learn Now",     icon: "BookOpen",     to: "/learn",         gradient: "linear-gradient(135deg,#1a3a8f,#0e6b8f)", bg: "#e8f0fe", external: false },
  { label: "Notes",         icon: "FileText",      to: "/notes",         gradient: "linear-gradient(135deg,#ea580c,#f59e0b)", bg: "#fff7ed", external: false },
  { label: "Courses",       icon: "GraduationCap", to: "/courses",       gradient: "linear-gradient(135deg,#7c3aed,#a855f7)", bg: "#f5f3ff", external: false },
  { label: "Entertainment", icon: "Film",           to: "/entertainment", gradient: "linear-gradient(135deg,#db2777,#f43f5e)", bg: "#fff1f2", external: false },
  { label: "Live Sports",   icon: "Trophy",         to: "/sports",        gradient: "linear-gradient(135deg,#dc2626,#f97316)", bg: "#fff7ed", external: false },
  { label: "Tally Quiz",    icon: "HelpCircle",    to: "/quiz",          gradient: "linear-gradient(135deg,#059669,#10b981)", bg: "#f0fdf4", external: false },
  {
    label: "Support",
    icon: "MessageCircle",
    to: "https://wa.me/9823415625?text=Hello%20sir%2C%20i%20need%20some%20help%20with%20Tally",
    gradient: "linear-gradient(135deg,#16a34a,#22c55e)",
    bg: "#f0fdf4",
    external: true,
  },
] as const;

/* ── Learn section categories (static) ──────────────────── */
export const learnCategories = [
  { title: "Accounting Basics",    duration: "2h 30m", level: "Beginner",      desc: "Master the core principles of accounting." },
  { title: "Tally Prime Tutorials",duration: "5h 10m", level: "Intermediate",  desc: "Hands-on Tally Prime walkthrough." },
  { title: "GST Learning",         duration: "3h 45m", level: "Intermediate",  desc: "Understand GST end-to-end." },
  { title: "Business Skills",      duration: "4h 00m", level: "All Levels",    desc: "Soft skills for modern entrepreneurs." },
  { title: "Computer Skills",      duration: "2h 15m", level: "Beginner",      desc: "Essential computer literacy." },
  { title: "Excel Tutorials",      duration: "6h 20m", level: "All Levels",    desc: "From formulas to pivot tables." },
  { title: "Financial Education",  duration: "3h 30m", level: "Beginner",      desc: "Personal finance & investing." },
  { title: "Digital Skills",       duration: "2h 50m", level: "Beginner",      desc: "Thrive in the digital era." },
] as const;
