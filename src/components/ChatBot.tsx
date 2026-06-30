import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are "Tally AI Guru", the official smart assistant for Tally Hub — a premium learning and entertainment app. Be friendly, concise, and helpful. Answer in the language the user writes in (Hindi/English/Hinglish).

=== APP OVERVIEW ===
Tally Hub is a mobile-first app for learning Tally, accounting, GST, Excel, and business skills. It also has entertainment (movies), live sports scores, notes, and more.

=== MOVIES AVAILABLE ===
1. Pathaan (2023) — Action | Rating 8.2 | 2h 26m | A spy thriller with breathtaking action sequences across the globe.
2. 3 Idiots (2009) — Comedy/Drama | Rating 9.1 | 2h 50m | Iconic story of friendship, dreams and the broken education system.
3. Kabhi Khushi Kabhie Gham (2001) — Drama | Rating 8.0 | 3h 30m | A family epic spanning generations, love and sacrifice.
4. RRR (2022) — Action | Rating 8.7 | 3h 7m | Epic tale of two legendary revolutionaries fighting British rule.
5. Loot (2012) — Nepali Thriller | Rating 8.5 | 2h 10m | Iconic Nepali heist thriller that redefined Nepali cinema.
6. Kabaddi (2013) — Nepali Comedy | Rating 8.1 | 2h 5m | Heartwarming village comedy about love and tradition.
7. Dangal (2016) — Biography | Rating 8.4 | 2h 41m | A father trains his daughters to become world-class wrestlers.
8. KGF Chapter 2 (2022) — Action | Rating 8.2 | 2h 48m | Rocky's fearsome reputation spreads across the nation.
9. Baahubali 2 (2017) — Epic Action | Rating 8.5 | 2h 47m | Conclusion to an epic saga of power, betrayal and love.
10. Pashupati Prasad (2016) — Nepali Drama | Rating 8.3 | 2h 15m | Moving story of hope, dignity and humanity in Kathmandu.

=== COURSES AVAILABLE ===
1. Tally Prime Complete Course — Instructor: Anil Sharma | 18h | 64 lessons | Rating 4.9 | 12,430 students
2. Accounting Mastery — Instructor: Pooja Verma | 22h | 80 lessons | Rating 4.8 | 9,212 students
3. GST Expert Course — Instructor: Rohan Khadka | 12h | 42 lessons | Rating 4.7 | 5,890 students
4. Excel Master Course — Instructor: Sneha Rai | 15h | 55 lessons | Rating 4.9 | 10,001 students
5. Computer Basics — Instructor: Ravi Thapa | 8h | 30 lessons | Rating 4.6 | 7,420 students
6. Business Skills — Instructor: Maya Joshi | 10h | 36 lessons | Rating 4.8 | 4,330 students

=== LEARN CATEGORIES ===
Accounting Basics (2h 30m, Beginner), Tally Prime Tutorials (5h 10m, Intermediate), GST Learning (3h 45m, Intermediate), Business Skills (4h, All Levels), Computer Skills (2h 15m, Beginner), Excel Tutorials (6h 20m, All Levels), Financial Education (3h 30m, Beginner), Digital Skills (2h 50m, Beginner)

=== APP FEATURES ===
- Learn: Video lessons, tutorials, structured courses
- Notes: Create, save, and manage study notes
- Entertainment: Watch movies (Hindi & Nepali)
- Live Sports: Cricket and Football live scores
- Profile: Edit profile, upload photo, manage account
- Certificates: Earn on course completion
- Help & Support: Live chat, call, email support
- WhatsApp Support: +91 98234 15625

=== TALLY & ACCOUNTING KNOWLEDGE ===
You are an expert in Tally Prime, GST, TDS, accounting entries, Excel formulas, payroll, inventory, balance sheet, P&L, cash flow, BRS, depreciation, financial ratios, and all accounting topics. Answer detailed questions on these topics.

Keep answers concise. Use bullet points and emojis for readability. If asked about movies, list them helpfully. If asked about courses, suggest the best match. Always be encouraging and supportive.`;

async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const errMsg = errBody?.error?.message ?? `HTTP ${res.status}`;
      if (res.status === 401) return "❌ API key is invalid or expired. Please update the Groq API key.";
      if (res.status === 429) return "⏳ Too many requests. Please wait a moment and try again.";
      return `❌ API Error: ${errMsg}`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response. Please try again.";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Network error: ${msg}. Please check your connection. 🔌`;
  }
}

/* ─── ChatBot Component ─── */
export function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      text: "Namaste! 🙏 I'm Tally AI Guru — your smart assistant for this app.\n\nAsk me anything:\n• 🎬 Movies available\n• 📚 Courses & learning\n• 🧾 Tally, GST, Accounting\n• 📊 Excel, Finance\n• ❓ App features & help\n\nTap a quick question below 👇",
      time: getTime(),
    },
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  // Keep last 10 messages for context (to stay within token limits)
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Add to history
    historyRef.current = [
      ...historyRef.current,
      { role: "user", content: trimmed },
    ].slice(-10);

    const reply = await callGroq(historyRef.current);

    // Add bot reply to history
    historyRef.current = [
      ...historyRef.current,
      { role: "assistant", content: reply },
    ].slice(-10);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: reply,
      time: getTime(),
    };
    setMessages(prev => [...prev, botMsg]);
    setTyping(false);
  }, [typing]);

  const handleSend = () => sendMessage(input);

  const CHIPS = [
    "Which movies are available?",
    "Best course for beginners",
    "How to file GST return?",
    "Tally shortcuts",
    "Journal entry example",
    "App features",
    "Excel VLOOKUP",
    "Contact support",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100]"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 flex flex-col rounded-t-3xl overflow-hidden"
        style={{ height: "90vh", background: "var(--color-background)" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)" }}>
          <div className="h-11 w-11 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-base leading-tight">Tally AI Guru</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              <p className="text-xs text-white/85">Online · Powered by Groq AI</p>
            </div>
          </div>
          <button onClick={onClose}
            className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/35 transition-colors active:scale-95 flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-blue-500 to-violet-600"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="h-4 w-4 text-white" />
                  : <User className="h-4 w-4 text-white" />}
              </div>

              <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-tr-sm text-white"
                      : "rounded-2xl rounded-tl-sm border border-border"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }
                      : { background: "var(--color-card)" }
                  }
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                className="flex gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-border flex items-center gap-1.5 shadow-sm"
                  style={{ background: "var(--color-card)" }}>
                  {[0, 150, 300].map(d => (
                    <span key={d} className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Quick chips ── */}
        <div className="px-4 pb-2 pt-1 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
          {CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={typing}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:border-orange-400 hover:text-orange-500 transition-colors disabled:opacity-40"
              style={{ background: "var(--color-card)" }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── Input row ── */}
        <div className="px-4 pb-6 pt-2 flex gap-2 border-t border-border flex-shrink-0"
          style={{ background: "var(--color-background)" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask about movies, courses, Tally, GST…"
            className="flex-1 h-12 px-4 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            style={{ background: "var(--color-card)" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white transition-all disabled:opacity-40 active:scale-95 flex-shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}
          >
            {typing
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <Send className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
