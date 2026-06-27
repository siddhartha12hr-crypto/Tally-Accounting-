import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "./BottomNav";
import { MountainBg } from "./MountainBg";
import { Toaster } from "./ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden pb-24">
      <MountainBg className="pointer-events-none fixed inset-x-0 bottom-20 h-64 text-secondary opacity-40" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative mx-auto max-w-2xl px-4"
      >
        {children}
      </motion.main>
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h1 className="mt-1 text-3xl font-black tracking-tight text-gradient">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
