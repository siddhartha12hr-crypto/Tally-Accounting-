import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, ChevronDown, ChevronUp, CheckCircle, PlayCircle,
  List,
} from "lucide-react";
import { TALLY_VIDEOS, SECTIONS, type TallyVideo } from "@/lib/tallyVideos";

/* ── HLS loader — loads hls.js dynamically only if needed ── */
async function attachHls(video: HTMLVideoElement, src: string) {
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    // Safari native HLS
    video.src = src;
    return;
  }
  const Hls = (await import("hls.js")).default;
  if (Hls.isSupported()) {
    const hls = new Hls({ enableWorker: false });
    hls.loadSource(src);
    hls.attachMedia(video);
  } else {
    video.src = src;
  }
}

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function TallyVideoPlayer() {
  const [current,      setCurrent]      = useState<TallyVideo>(TALLY_VIDEOS[0]);
  const [playing,      setPlaying]      = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [showList,     setShowList]     = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([SECTIONS[0]]));
  const [completed,    setCompleted]    = useState<Set<number>>(new Set());
  const [showControls, setShowControls] = useState(true);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const hideTimer  = useRef<ReturnType<typeof setTimeout>>();

  /* Load video whenever current changes */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    attachHls(v, current.src);
    if (playing) v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  /* Controls auto-hide */
  const resetHide = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
    resetHide();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const t = (Number(e.target.value) / 100) * duration;
    v.currentTime = t;
    setProgress(Number(e.target.value));
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
    setMuted(vol === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const playVideo = (vid: TallyVideo) => {
    setCurrent(vid);
    setPlaying(true);
    setProgress(0);
  };

  const playNext = () => {
    const idx = TALLY_VIDEOS.findIndex(v => v.id === current.id);
    if (idx < TALLY_VIDEOS.length - 1) playVideo(TALLY_VIDEOS[idx + 1]);
  };

  const playPrev = () => {
    const idx = TALLY_VIDEOS.findIndex(v => v.id === current.id);
    if (idx > 0) playVideo(TALLY_VIDEOS[idx - 1]);
  };

  const toggleSection = (s: string) => {
    setOpenSections(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  };

  const currentIdx = TALLY_VIDEOS.findIndex(v => v.id === current.id);

  return (
    <div className="flex flex-col gap-0 rounded-3xl overflow-hidden shadow-elegant"
      style={{ background: "var(--color-card)" }}>

      {/* ── Video area ── */}
      <div className="relative w-full bg-black select-none"
        style={{ aspectRatio: "16/9" }}
        onMouseMove={resetHide}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (v) setDuration(v.duration);
          }}
          onEnded={() => {
            setPlaying(false);
            setCompleted(prev => new Set([...prev, current.id]));
            playNext();
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          playsInline
        />

        {/* Controls overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Title */}
              <div className="px-4 pb-1">
                <p className="text-white text-xs font-bold opacity-80 truncate">{current.section}</p>
                <p className="text-white text-sm font-black truncate">{current.title}</p>
              </div>

              {/* Progress bar */}
              <div className="px-4 pb-2 flex items-center gap-2">
                <span className="text-white text-[10px] font-bold w-9 flex-shrink-0">
                  {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"}
                </span>
                <div className="relative flex-1 h-1.5 group">
                  <input type="range" min={0} max={100} value={progress}
                    onChange={seek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-full rounded-full bg-white/30">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg,#f59e0b,#ea580c)" }} />
                  </div>
                </div>
                <span className="text-white text-[10px] font-bold w-9 flex-shrink-0 text-right">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Buttons row */}
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={playPrev} disabled={currentIdx === 0}
                    className="text-white disabled:opacity-40 hover:scale-110 transition-transform">
                    <SkipBack className="h-5 w-5" />
                  </button>
                  <button onClick={togglePlay}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  <button onClick={playNext} disabled={currentIdx === TALLY_VIDEOS.length - 1}
                    className="text-white disabled:opacity-40 hover:scale-110 transition-transform">
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Volume */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={toggleMute} className="text-white">
                      {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                      onChange={changeVolume}
                      className="w-16 accent-orange-400 cursor-pointer" />
                  </div>
                  {/* Playlist toggle */}
                  <button onClick={() => setShowList(v => !v)} className="text-white hover:scale-110 transition-transform">
                    <List className="h-4 w-4" />
                  </button>
                  {/* Fullscreen */}
                  <button onClick={fullscreen} className="text-white hover:scale-110 transition-transform">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Big play button when paused */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-16 w-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(234,88,12,0.85)" }}>
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* ── Progress strip ── */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-border">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${(completed.size / TALLY_VIDEOS.length) * 100}%`,
              background: "linear-gradient(90deg,#22c55e,#16a34a)"
            }} />
        </div>
        <span className="text-xs font-bold text-muted-foreground flex-shrink-0">
          {completed.size}/{TALLY_VIDEOS.length} done
        </span>
      </div>

      {/* ── Playlist ── */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="max-h-[50vh] overflow-y-auto">
              {SECTIONS.map(section => {
                const videos = TALLY_VIDEOS.filter(v => v.section === section);
                const isOpen = openSections.has(section);
                return (
                  <div key={section}>
                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(section)}
                      className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-accent transition-colors"
                      style={{ background: "var(--color-card)" }}
                    >
                      <span className="text-sm font-black text-left">{section}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{videos.length} videos</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {/* Videos in section */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {videos.map(vid => {
                            const isActive    = vid.id === current.id;
                            const isDone      = completed.has(vid.id);
                            return (
                              <button key={vid.id} onClick={() => playVideo(vid)}
                                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 transition-colors text-left ${
                                  isActive ? "bg-primary/10" : "hover:bg-accent"
                                }`}>
                                {/* Number / done */}
                                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                                  style={isActive
                                    ? { background: "linear-gradient(135deg,#f59e0b,#ea580c)", color: "white" }
                                    : isDone
                                    ? { background: "#dcfce7", color: "#16a34a" }
                                    : { background: "var(--color-muted)", color: "var(--color-muted-foreground)" }
                                  }>
                                  {isDone ? <CheckCircle className="h-4 w-4" /> : isActive ? <PlayCircle className="h-4 w-4" /> : vid.id}
                                </div>
                                <p className={`text-sm flex-1 min-w-0 truncate ${isActive ? "font-black text-primary" : "font-medium"}`}>
                                  {vid.title}
                                </p>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
