export function MountainBg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="mtn1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mtn2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path fill="url(#mtn1)" d="M0,220 L120,120 L220,200 L360,80 L500,200 L640,140 L780,220 L920,100 L1080,200 L1220,120 L1360,200 L1440,160 L1440,320 L0,320 Z" />
      <path fill="url(#mtn2)" d="M0,260 L160,200 L300,260 L460,180 L620,250 L780,200 L940,260 L1100,200 L1260,260 L1440,220 L1440,320 L0,320 Z" />
    </svg>
  );
}
