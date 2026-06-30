import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBot } from "./ChatBot";

export function FloatingChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button — fixed bottom-right, sits above BottomNav with safe clearance */}
      <div className="fixed z-[90] flex flex-col items-center select-none"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 90px)", right: "12px" }}>

        {/* Straight "We Are Here!" text */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-0.5"
        >
          <svg width="90" height="18" viewBox="0 0 90 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="45" y="13" fontSize="10.5" fontWeight="900"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              textAnchor="middle" fill="none"
              stroke="#00d4ff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
              We Are Here!
            </text>
            <text x="45" y="13" fontSize="10.5" fontWeight="900"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              textAnchor="middle" fill="white">
              We Are Here!
            </text>
          </svg>
        </motion.div>

        {/* The button itself — Tally AI Guru logo */}
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          animate={{ y: [0, -4, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300 },
          }}
          className="h-16 w-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#c0392b 0%,#e74c3c 100%)" }}
          aria-label="Open Tally AI Guru chat"
        >
          {/* Tally AI Guru icon — white chat bubble face matching reference image */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head circle */}
            <circle cx="20" cy="16" r="10" fill="white" />
            {/* Eyes */}
            <circle cx="16.5" cy="14.5" r="1.5" fill="#c0392b" />
            <circle cx="23.5" cy="14.5" r="1.5" fill="#c0392b" />
            {/* Smile */}
            <path d="M15.5 18.5 Q20 22 24.5 18.5" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Chat bubble tail */}
            <path d="M17 26 L14 32 L22 26 Z" fill="white" />
            {/* Bubble body bottom */}
            <rect x="11" y="22" width="18" height="5" rx="2.5" fill="white" />
          </svg>
        </motion.button>

        {/* Pulse ring */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 64, height: 64,
            border: "2px solid rgba(231,76,60,0.5)",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      </div>

      {/* ChatBot drawer */}
      <AnimatePresence>
        {open && <ChatBot onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
