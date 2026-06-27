import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, GraduationCap, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/contact", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      <div className="mx-auto flex max-w-2xl items-center justify-around rounded-[2rem] glass shadow-elegant border border-border/50 px-3 py-3 backdrop-blur-2xl">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link key={to} to={to} className="relative">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1.5 px-4 py-2"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl gradient-hero shadow-glow"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon 
                    className={`h-6 w-6 transition-all duration-200 ${
                      active 
                        ? "text-white drop-shadow-lg" 
                        : "text-muted-foreground"
                    }`} 
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                    />
                  )}
                </div>
                <motion.span 
                  className={`relative z-10 text-[11px] font-bold transition-all duration-200 ${
                    active 
                      ? "text-white drop-shadow" 
                      : "text-muted-foreground"
                  }`}
                  animate={{ 
                    scale: active ? 1.05 : 1,
                    y: active ? -1 : 0
                  }}
                >
                  {label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      
      {/* iOS-style indicator bar */}
      <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-foreground/10" />
    </nav>
  );
}
