import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { MountainBg } from "@/components/MountainBg";
import { toast } from "sonner";
import {
  Info, Copy, Share2, Users, UserPlus, Gift,
  MessageCircle, Send, Instagram, Link2, MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/it-hero")({
  head: () => ({ meta: [{ title: "IT Hero — Tally Hub Pro" }] }),
  component: ITHero,
});

const ORANGE = "#FF6B00";
const ORANGE_LIGHT = "#FFF3E8";

/* ── referral code derived from user id ── */
function getReferralCode(userId?: string) {
  const base = userId ? userId.slice(-4).toUpperCase() : "0000";
  return `ITHERO${base}`;
}

/* ─────────────────────────────────────────── */
function ITHero() {
  const { user } = useAuth();
  const referralCode = getReferralCode(user?.id);

  /* progress: how many friends invited (mock — can wire to DB) */
  const [invited] = useState(1);
  const goal = 3;

  const shareMessage = `Join Tally Hub Pro using my referral code *${referralCode}* and get premium access! https://tallyhub.app`;

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://tallyhub.app?ref=${referralCode}`);
    toast.success("Link copied!");
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  }

  function shareTelegram() {
    window.open(`https://t.me/share/url?url=https://tallyhub.app?ref=${referralCode}&text=${encodeURIComponent(shareMessage)}`, "_blank");
  }

  function shareInstagram() {
    copyLink();
    toast.info("Link copied! Paste it in your Instagram story.");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-28 bg-[#FAFAFA]">
      <MountainBg className="pointer-events-none fixed inset-x-0 bottom-20 h-64 text-orange-100 opacity-30" />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mx-auto max-w-2xl px-4"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <h1 className="text-2xl font-black text-gray-900">IT Hero</h1>
          <button className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <Info className="h-5 w-5" style={{ color: ORANGE }} />
          </button>
        </div>

        {/* ── Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[20px] p-5 mb-4 flex items-center gap-4"
          style={{ background: ORANGE_LIGHT }}
        >
          {/* Gift illustration */}
          <div className="text-6xl flex-shrink-0 select-none">🎁</div>
          <div>
            <h2 className="text-lg font-black text-gray-900 leading-tight">
              Invite Friends,{" "}
              <span style={{ color: ORANGE }}>Get Rewarded!</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1 leading-snug">
              Share your code with friends and unlock premium benefits.
            </p>
          </div>
        </motion.div>

        {/* ── Referral Code Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[20px] bg-white shadow-sm p-5 mb-5"
          style={{ border: "1px solid #F0F0F0" }}
        >
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Your Referral Code
          </p>
          <div className="flex items-center gap-3">
            {/* Code box */}
            <div
              className="flex-1 flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "#FFF8F3", border: `1.5px dashed ${ORANGE}40` }}
            >
              <span className="text-xl font-black tracking-widest" style={{ color: ORANGE }}>
                {referralCode}
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: ORANGE }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>

            {/* Share button */}
            <button
              onClick={() => shareWhatsApp()}
              className="h-[52px] w-[52px] rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm"
              style={{ background: "#FFF8F3", border: `1px solid ${ORANGE}30` }}
            >
              <Share2 className="h-5 w-5" style={{ color: ORANGE }} />
              <span className="text-[9px] font-bold" style={{ color: ORANGE }}>Share</span>
            </button>
          </div>
        </motion.div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-5"
        >
          <h3 className="text-lg font-black text-gray-900 mb-4">How It Works</h3>

          <div className="flex items-start gap-0">
            {[
              {
                num: 1, icon: "👥",
                title: "Invite Friends",
                desc: "Share your referral code with friends",
              },
              {
                num: 2, icon: "🧑‍💻",
                title: "Friends Join",
                desc: "Your friends sign up using your code",
              },
              {
                num: 3, icon: "🎁",
                title: "You Get Reward",
                desc: "Invite 3 friends and get",
                highlight: "1 premium course",
              },
            ].map((step, idx, arr) => (
              <div key={step.num} className="flex-1 flex flex-col items-center relative">
                {/* Dashed connector */}
                {idx < arr.length - 1 && (
                  <div
                    className="absolute top-[22px] left-[58%] right-0 h-px border-t-2 border-dashed"
                    style={{ borderColor: `${ORANGE}40` }}
                  />
                )}

                {/* Icon circle */}
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-2xl mb-2 relative z-10"
                  style={{ background: ORANGE_LIGHT }}
                >
                  {step.icon}
                  {/* Step number badge */}
                  <div
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: ORANGE }}
                  >
                    {step.num}
                  </div>
                </div>

                <p className="text-xs font-black text-gray-900 text-center leading-tight mt-1">
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-400 text-center mt-0.5 leading-snug px-1">
                  {step.desc}{" "}
                  {step.highlight && (
                    <span className="font-bold" style={{ color: ORANGE }}>
                      {step.highlight}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Reward Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-5 mb-5 flex items-center gap-4"
          style={{ background: ORANGE_LIGHT, border: `1px solid ${ORANGE}25` }}
        >
          {/* Crown illustration */}
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
            👑
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-black text-gray-900 leading-tight">
              Invite {goal} Friends
            </h4>
            <h4 className="text-base font-black leading-tight" style={{ color: ORANGE }}>
              Get 1 Premium Course
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Once {goal} of your friends join using your code, you'll unlock any one premium course for free!
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-400">Progress</span>
                <span className="text-[10px] font-black" style={{ color: ORANGE }}>
                  {invited}/{goal} invited
                </span>
              </div>
              <div className="h-2 rounded-full bg-white overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(invited / goal) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: ORANGE }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Share via ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <h3 className="text-lg font-black text-gray-900 mb-4">Share via</h3>

          <div className="flex items-center justify-around">
            {[
              {
                icon: <MessageCircle className="h-6 w-6 text-white" />,
                label: "WhatsApp",
                bg: "#25D366",
                action: shareWhatsApp,
              },
              {
                icon: <Send className="h-6 w-6 text-white" />,
                label: "Telegram",
                bg: "#229ED9",
                action: shareTelegram,
              },
              {
                icon: <Instagram className="h-6 w-6 text-white" />,
                label: "Instagram",
                bg: "linear-gradient(135deg,#E1306C,#833AB4,#F77737)",
                action: shareInstagram,
              },
              {
                icon: <Link2 className="h-6 w-6 text-white" />,
                label: "Copy Link",
                bg: "#7C3AED",
                action: copyLink,
              },
              {
                icon: <MoreHorizontal className="h-6 w-6 text-gray-500" />,
                label: "More",
                bg: "#F3F4F6",
                action: () => {
                  if (navigator.share) {
                    navigator.share({ title: "Tally Hub Pro", text: shareMessage, url: `https://tallyhub.app?ref=${referralCode}` });
                  } else {
                    copyLink();
                  }
                },
              },
            ].map(item => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.92 }}
                onClick={item.action}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.main>

      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}
