import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

/* ─────────────────────────────────────────────
   KNOWLEDGE BASE  — pure frontend, no API key
───────────────────────────────────────────── */
const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "helo", "hii"],
    answer: "Namaste! 🙏 I'm Tally AI Guru.\n\nI can help you with:\n• Tally Prime — vouchers, shortcuts, reports\n• GST — GSTR-1, 3B, returns, TDS\n• Accounting — journal entries, ledgers, P&L\n• Excel — formulas, pivot tables, VLOOKUP\n• Finance — balance sheet, cash flow\n\nWhat would you like to know today?",
  },
  {
    keywords: ["help", "kya kar sakte", "what can you do", "features", "topics"],
    answer: "Here's what I can help you with:\n\n📊 Accounting\nJournal entries, ledgers, trial balance, debit/credit rules\n\n🧾 GST & Tax\nGSTR-1, GSTR-3B, TDS, input tax credit, e-invoicing\n\n💼 Tally Prime\nVouchers, shortcuts, company setup, inventory, payroll\n\n📈 Excel\nFormulas, VLOOKUP, pivot tables, conditional formatting\n\n💰 Finance\nBalance sheet, P&L, cash flow, ratio analysis\n\nJust type your question! मैं हिंदी में भी समझता हूँ 😊",
  },
  {
    keywords: ["tally prime", "tally erp", "tally software", "tally kya hai"],
    answer: "Tally Prime is India's most popular business accounting software.\n\nKey Features:\n• Accounting & Book-keeping\n• GST billing & returns\n• Inventory management\n• Payroll & HR\n• Banking & reconciliation\n• MIS reports\n\nHow to start:\n1. Create Company → Gateway of Tally\n2. Set financial year\n3. Create ledgers under proper groups\n4. Start entering vouchers (F4–F9)\n\nWant to know about any specific feature?",
  },
  {
    keywords: ["voucher", "f4", "f5", "f6", "f7", "f8", "f9", "contra", "payment", "receipt", "sales", "purchase"],
    answer: "Tally Voucher Types & Shortcuts:\n\n• F4 — Contra (cash ↔ bank)\n• F5 — Payment (cash/bank going out)\n• F6 — Receipt (cash/bank coming in)\n• F7 — Journal (adjustments, provisions)\n• F8 — Sales Invoice\n• F9 — Purchase Invoice\n• F10 — Reversing Journal\n• Alt+F5 — Debit Note\n• Alt+F6 — Credit Note\n\nTip: Press Ctrl+A to save any voucher quickly!",
  },
  {
    keywords: ["shortcut", "keyboard", "hotkey", "key", "shortcut key", "tally shortcut"],
    answer: "Essential Tally Prime Shortcuts:\n\nNavigation:\n• Ctrl+G — Go To any screen\n• Alt+G — Go To reports\n• Escape — Go back\n• Enter — Select/Drill down\n\nVouchers:\n• F2 — Change date\n• F4 — Contra  • F5 — Payment\n• F6 — Receipt  • F7 — Journal\n• F8 — Sales    • F9 — Purchase\n\nReports:\n• Alt+F1 — Detailed view\n• Alt+F2 — Auto column\n• Ctrl+B — Change period\n• Ctrl+F3 — Group company",
  },
  {
    keywords: ["gst", "goods and service", "igst", "cgst", "sgst", "gst kya hai"],
    answer: "GST (Goods & Services Tax) — India's unified indirect tax.\n\nThree Components:\n• CGST — Central GST (intra-state)\n• SGST — State GST (intra-state)\n• IGST — Integrated GST (inter-state)\n\nGST Rates: 0%, 5%, 12%, 18%, 28%\n\nKey Returns:\n• GSTR-1 — Outward supplies (monthly/quarterly)\n• GSTR-3B — Summary return (monthly)\n• GSTR-9 — Annual return\n\nIn Tally: Enable GST under F11 → Statutory Features",
  },
  {
    keywords: ["gstr", "gstr1", "gstr-1", "gstr3b", "gstr-3b", "return", "filing"],
    answer: "GST Return Filing Guide:\n\nGSTR-1 (Outward Supply):\n• Due: 11th of next month\n• Contains all sales invoices\n• Exported from Tally → GST Returns → GSTR-1\n\nGSTR-3B (Summary):\n• Due: 20th of next month\n• Monthly tax payment return\n• Auto-populated from GSTR-1\n\nInput Tax Credit (ITC):\n• Claim ITC on purchases\n• Available in GSTR-2B\n• Must match supplier's GSTR-1\n\nIn Tally: Reports → GST Reports → GSTR-1/3B",
  },
  {
    keywords: ["tds", "tax deducted", "tds kya", "194", "194c", "194j"],
    answer: "TDS (Tax Deducted at Source) in Tally:\n\nSetup:\n1. F11 → Enable TDS\n2. Create TDS ledger (Nature of Payment)\n3. Set deductee type & PAN\n\nCommon Sections:\n• 194C — Contractor (1–2%)\n• 194J — Professional (10%)\n• 194I — Rent (10%)\n• 192B — Salary (slab rate)\n\nIn Tally:\n• TDS auto-deducts on payment above threshold\n• Reports → TDS Reports → Computation\n• Generate Form 26Q, Form 16/16A",
  },
  {
    keywords: ["journal entry", "journal", "debit", "credit", "dr", "cr", "double entry"],
    answer: "Journal Entry — Double Entry System:\n\nGolden Rules:\n• Real A/c: Debit what comes in, Credit what goes out\n• Personal A/c: Debit the receiver, Credit the giver\n• Nominal A/c: Debit all expenses/losses, Credit all income/gains\n\nExamples:\n\nCash Sales ₹10,000:\nCash A/c Dr 10,000\n  To Sales A/c 10,000\n\nPurchase on Credit ₹5,000:\nPurchases A/c Dr 5,000\n  To Creditor A/c 5,000\n\nIn Tally: F7 → Journal Voucher",
  },
  {
    keywords: ["ledger", "account", "chart", "group", "sundry", "debtor", "creditor"],
    answer: "Ledger Creation in Tally Prime:\n\nPath: Gateway → Accounts Info → Ledgers → Create\n\nCommon Groups:\n• Capital — Owner's capital, reserves\n• Loans — Bank loans, term loans\n• Current Assets — Cash, bank, debtors, stock\n• Current Liabilities — Creditors, outstanding\n• Sales Account — All revenue ledgers\n• Purchase Account — All purchase ledgers\n• Indirect Expenses — Rent, salary, power\n• Direct Expenses — Labour, freight on purchase\n\nTip: Wrong group = wrong reports! Always double-check.",
  },
  {
    keywords: ["balance sheet", "assets", "liabilities", "equity", "balance sheet kya"],
    answer: "Balance Sheet — Financial Position Statement\n\nFormula: Assets = Liabilities + Owner's Equity\n\nAssets Side:\n• Fixed Assets: Land, building, machinery\n• Current Assets: Cash, bank, debtors, stock\n• Investments, loans given\n\nLiabilities Side:\n• Capital & Reserves\n• Long-term Loans\n• Current Liabilities: Creditors, outstanding expenses\n\nIn Tally:\nGateway → Balance Sheet\nPress Alt+F1 for detailed view\nCtrl+B to change period",
  },
  {
    keywords: ["profit loss", "p&l", "income statement", "profit and loss", "revenue", "expense"],
    answer: "Profit & Loss Account — Performance Statement\n\nStructure:\nRevenue (Sales, other income)\n– Cost of Goods Sold\n= Gross Profit\n– Operating Expenses (salary, rent, depreciation)\n= Operating Profit (EBIT)\n– Interest & Tax\n= Net Profit\n\nKey Ratios:\n• Gross Profit % = GP/Sales × 100\n• Net Profit % = NP/Sales × 100\n\nIn Tally: Gateway → Profit & Loss A/c\nPress F2 to change date range",
  },
  {
    keywords: ["inventory", "stock", "godown", "warehouse", "item", "batch"],
    answer: "Inventory Management in Tally:\n\nSetup:\n1. F11 → Enable Inventory Features\n2. Create Stock Groups (e.g., Electronics, Clothing)\n3. Create Units of Measure (Nos, Kg, Litre)\n4. Create Stock Items with opening balance\n\nGodowns (Warehouses):\n• Create multiple godowns\n• Track stock location-wise\n• Transfer stock between godowns\n\nReports:\n• Stock Summary — current stock levels\n• Movement Analysis — item-wise movement\n• Reorder levels — low stock alerts\n\nIn Tally: Inventory Info → Stock Items",
  },
  {
    keywords: ["payroll", "salary", "employee", "pf", "esi", "hr"],
    answer: "Payroll in Tally Prime:\n\nSetup:\n1. F11 → Enable Payroll\n2. Create Pay Heads:\n   • Basic Salary, HRA, DA, Conveyance\n   • PF (12%), ESI (3.25%), PT\n3. Create Employee Masters\n4. Define Salary Structure\n\nMonthly Processing:\n• Payroll Vouchers → Attendance Entry\n• Process salary → auto-deduct PF, ESI, TDS\n• Generate payslips\n\nStatutory Reports:\n• PF ECR Challan\n• ESI Return\n• Form 16 for TDS",
  },
  {
    keywords: ["excel", "vlookup", "hlookup", "sumif", "countif", "pivot", "formula"],
    answer: "Excel for Accountants — Key Formulas:\n\nLookup:\n• VLOOKUP: =VLOOKUP(A2,Sheet2!A:C,2,0)\n• INDEX MATCH: =INDEX(B:B,MATCH(A2,A:A,0))\n\nSumming:\n• SUMIF: =SUMIF(A:A,\"Sales\",B:B)\n• SUMIFS: multiple criteria\n\nCounting:\n• COUNTIF: =COUNTIF(A:A,\"GST\")\n\nDates:\n• TODAY(), NOW(), DATEDIF()\n\nPivot Table:\n• Insert → PivotTable → drag fields\n• Great for GST reconciliation!\n\nShortcuts: Ctrl+T (table), Alt+= (sum), Ctrl+Shift+L (filter)",
  },
  {
    keywords: ["depreciation", "fixed asset", "wdv", "slm"],
    answer: "Depreciation in Accounting:\n\nMethods:\n1. SLM (Straight Line Method)\n   • Fixed % on original cost\n   • Formula: Cost / Useful Life\n\n2. WDV (Written Down Value)\n   • % on remaining book value\n   • Used for Income Tax purposes\n\nIn Tally:\n• Create Fixed Asset ledger under Fixed Assets group\n• Create Depreciation ledger under Indirect Expenses\n• Pass Journal entry:\n  Depreciation A/c Dr\n    To Fixed Asset A/c\n\nIncome Tax rates: Buildings 10%, Plant 15%, Computers 40%",
  },
  {
    keywords: ["cash flow", "fund flow", "liquidity", "working capital"],
    answer: "Cash Flow Statement:\n\nThree Activities:\n1. Operating Activities\n   • Cash from core business operations\n   • Net profit ± working capital changes\n\n2. Investing Activities\n   • Purchase/sale of fixed assets\n   • Investments made/received\n\n3. Financing Activities\n   • Loans taken/repaid\n   • Dividends paid\n   • Capital introduced\n\nWorking Capital = Current Assets – Current Liabilities\n\nIn Tally: Reports → Cash Flow Statement",
  },
  {
    keywords: ["bank reconciliation", "brs", "bank statement", "bank"],
    answer: "Bank Reconciliation Statement (BRS):\n\nWhy BRS:\n• Match your books with bank statement\n• Identify outstanding cheques & deposits\n• Catch errors & fraud\n\nCommon Differences:\n• Cheques issued but not cleared\n• Cheques deposited but not credited\n• Bank charges not recorded\n• Interest credited by bank\n\nIn Tally Prime:\n1. Banking → Bank Reconciliation\n2. Select bank ledger\n3. Import bank statement (Excel/CSV)\n4. Auto-match transactions\n5. Reconcile manually remaining items",
  },
  {
    keywords: ["ratio", "analysis", "current ratio", "quick ratio", "roe", "roa"],
    answer: "Financial Ratio Analysis:\n\nLiquidity Ratios:\n• Current Ratio = Current Assets / Current Liabilities (ideal: 2:1)\n• Quick Ratio = (CA – Stock) / CL (ideal: 1:1)\n\nProfitability:\n• GP Ratio = GP / Sales × 100\n• NP Ratio = NP / Sales × 100\n• ROE = Net Profit / Equity × 100\n• ROA = Net Profit / Total Assets × 100\n\nEfficiency:\n• Debtors Turnover = Sales / Debtors\n• Stock Turnover = COGS / Avg Stock\n\nSolvency:\n• Debt-Equity Ratio = Long Term Debt / Equity",
  },
  {
    keywords: ["company create", "new company", "company setup", "create company"],
    answer: "Create Company in Tally Prime:\n\nSteps:\n1. Open Tally Prime\n2. Press Alt+K → Create Company\n3. Fill details:\n   • Company Name\n   • Mailing Name & Address\n   • State & PIN\n   • Financial Year (1 April)\n   • Base Currency: INR\n4. Enable Features (F11):\n   • GST — Enter GSTIN\n   • TDS — Enable if applicable\n   • Inventory — if stock maintenance needed\n   • Payroll — if salary processing needed\n5. Press Ctrl+A to save",
  },
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();

  // Exact or partial match
  for (const item of KB) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.answer;
    }
  }

  // Fuzzy: check if any word in input matches any keyword word
  const words = lower.split(/\s+/);
  for (const item of KB) {
    for (const kw of item.keywords) {
      for (const word of words) {
        if (word.length > 3 && kw.includes(word)) {
          return item.answer;
        }
      }
    }
  }

  return "That's an interesting question! 🤔\n\nI specialise in:\n• Tally Prime (vouchers, setup, shortcuts)\n• GST (returns, TDS, ITC)\n• Accounting (journal entries, ledgers, reports)\n• Excel (formulas, pivot tables)\n• Finance (balance sheet, ratios)\n\nCould you rephrase or ask about one of these topics? मैं हिंदी में भी समझता हूँ! 😊";
}

/* ─── ChatBot Component ─── */
export function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      text: "Namaste! 🙏 I'm Tally AI Guru.\n\nAsk me anything about Tally, GST, accounting entries, Excel formulas, or finance — in English or Hindi!\n\nTry tapping one of the quick questions below 👇",
      time: getTime(),
    },
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  /* ── Core send function — takes text directly, no stale closure ── */
  const sendMessage = useCallback((text: string) => {
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

    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: getBotReply(trimmed),
        time: getTime(),
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, delay);
  }, [typing]);

  const handleSend = () => sendMessage(input);

  const CHIPS = [
    "How to create a company?",
    "GST Returns",
    "Journal Entry",
    "Tally Shortcuts",
    "Balance Sheet",
    "TDS in Tally",
    "Excel VLOOKUP",
    "Payroll Setup",
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
              <p className="text-xs text-white/85">Online · Powered by Knowledge Base</p>
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
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                msg.role === "bot"
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-blue-500 to-violet-600"
              }`}>
                {msg.role === "bot"
                  ? <Bot className="h-4 w-4 text-white" />
                  : <User className="h-4 w-4 text-white" />
                }
              </div>

              {/* Bubble */}
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

          {/* Typing indicator */}
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
            placeholder="Ask about Tally, GST, accounting…"
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
              : <Send className="h-5 w-5" />
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
