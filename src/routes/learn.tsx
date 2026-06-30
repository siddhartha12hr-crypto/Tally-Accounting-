import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TallyVideoPlayer } from "@/components/TallyVideoPlayer";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Tally — Video Course" },
      { name: "description", content: "Complete Tally ERP video course with 61 lessons." },
    ],
  }),
  component: Learn,
});

function Learn() {
  return (
    <AppShell>
      {/* Header — keeps normal padding */}
      <div className="pt-4 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Video Course</p>
        <h1 className="text-2xl font-black mt-0.5">Tally ERP Complete Course</h1>
        <p className="text-sm text-muted-foreground mt-1">61 lessons · From basics to advanced</p>
      </div>

      {/* Player — break out of px-4 container with negative margin */}
      <div className="-mx-4 pb-6">
        <TallyVideoPlayer />
      </div>
    </AppShell>
  );
}
