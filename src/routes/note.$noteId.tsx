import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Star, Clock, Tag } from "lucide-react";
import { notesData } from "./notes";

export const Route = createFileRoute("/note/$noteId")({
  component: NoteViewer,
});

/* ─── per-note rich document content ─── */
const noteDocuments: Record<number, () => ReactElement> = {
  1: GSTDoc,
  2: TallyShortcutsDoc,
  3: BalanceSheetDoc,
  4: JournalDoc,
  5: MultiCurrencyDoc,
  6: BusinessModelDoc,
  // other notes fall through to the generic renderer
};

const S = `
  .doc{font-family:"Plus Jakarta Sans","Inter",sans-serif;color:#1c1c2e;line-height:1.82;}
  .dark .doc{color:#dddde8;}
  /* cover */
  .dc{background:linear-gradient(135deg,#e8720c,#8b0000 52%,#1a3a8f);border-radius:16px;padding:40px 28px;color:#fff;margin-bottom:32px;position:relative;overflow:hidden;}
  .dc::after{content:"";position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none;}
  .dc-ey{font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;opacity:.7;margin-bottom:8px;}
  .dc-t{font-size:30px;font-weight:900;line-height:1.08;margin-bottom:4px;}
  .dc-s{font-size:15px;font-weight:700;opacity:.85;margin-bottom:8px;}
  .dc-d{font-size:11px;opacity:.65;font-weight:500;margin-bottom:14px;line-height:1.6;}
  .dc-b{display:inline-block;padding:3px 12px;border-radius:100px;background:rgba(255,255,255,.16);font-size:9px;font-weight:800;letter-spacing:.08em;}
  /* dividers & headings */
  .ddiv{border:none;border-top:1.5px solid #e5e7eb;margin:28px 0;}
  .dark .ddiv{border-color:#2a2a3a;}
  .dh2{font-size:18px;font-weight:900;letter-spacing:-.02em;margin:28px 0 8px;display:flex;align-items:center;gap:9px;color:#111827;}
  .dark .dh2{color:#ededf5;}
  .dh2-bar{width:4px;height:18px;border-radius:3px;background:linear-gradient(180deg,#e8720c,#1a3a8f);flex-shrink:0;}
  /* body */
  .dp{font-size:14px;line-height:1.85;color:#374151;margin-bottom:12px;}
  .dark .dp{color:#9898b0;}
  .dp strong{color:#111827;font-weight:700;}
  .dark .dp strong{color:#e0e0ea;}
  /* callout */
  .dcall{border-radius:11px;padding:16px 18px;margin:18px 0;background:linear-gradient(135deg,rgba(26,58,143,.08),rgba(26,58,143,.03));border-left:4px solid #1a3a8f;}
  .dark .dcall{background:linear-gradient(135deg,rgba(26,58,143,.20),rgba(26,58,143,.09));}
  .dcall-lb{font-size:8px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#1a3a8f;margin-bottom:4px;}
  .dark .dcall-lb{color:#6080d0;}
  .dcall-f{font-size:17px;font-weight:900;color:#1a3a8f;margin-bottom:4px;}
  .dark .dcall-f{color:#8099e0;}
  .dcall-b{font-size:12.5px;color:#4b5563;line-height:1.7;}
  .dark .dcall-b{color:#8080a0;}
  /* sub-headings */
  .dh3{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;display:inline-block;padding:4px 10px;border-radius:6px;margin:20px 0 10px;}
  .h3o{background:rgba(232,114,12,.11);color:#c05800;}
  .h3b{background:rgba(26,58,143,.10);color:#1a3a8f;}
  .h3g{background:rgba(176,136,14,.12);color:#876a00;}
  .h3r{background:rgba(139,0,0,.09);color:#8b0000;}
  .dark .h3o{background:rgba(232,114,12,.20);color:#f0902a;}
  .dark .h3b{background:rgba(26,58,143,.26);color:#7090d8;}
  .dark .h3g{background:rgba(176,136,14,.20);color:#d4aa30;}
  .dark .h3r{background:rgba(139,0,0,.22);color:#d04040;}
  /* lists */
  .dl{list-style:none;padding:0;margin:0 0 12px;}
  .dl li{display:flex;gap:9px;padding:8px 0;font-size:13.5px;line-height:1.65;border-bottom:1px dashed #e5e7eb;color:#374151;}
  .dark .dl li{border-color:#2a2a3a;color:#8888a8;}
  .dl li:last-child{border-bottom:none;}
  .dl li span.flex1{flex:1;}
  .dl li strong{color:#111827;font-weight:700;}
  .dark .dl li strong{color:#d8d8e8;}
  .dd{flex-shrink:0;margin-top:3px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:900;color:#fff;}
  .ddo{background:#e8720c;}.ddb{background:#1a3a8f;}.ddg{background:#b08c0e;}.ddr{background:#8b0000;}
  /* table */
  .dtw{border-radius:12px;overflow:hidden;border:1.5px solid #e5e7eb;margin:16px 0;}
  .dark .dtw{border-color:#2a2a3a;}
  .dt{width:100%;border-collapse:collapse;font-size:12.5px;}
  .dt thead tr{background:linear-gradient(135deg,#e8720c,#8b0000 52%,#1a3a8f);}
  .dt thead th{padding:10px 12px;font-weight:800;text-align:left;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#fff;}
  .dt thead th.tr{text-align:right;}
  .dt tbody tr{border-bottom:1px solid #e5e7eb;}
  .dark .dt tbody tr{border-color:#2a2a3a;}
  .dt tbody tr:nth-child(even){background:#f8f8fc;}
  .dark .dt tbody tr:nth-child(even){background:#181828;}
  .dt tbody td{padding:8px 12px;color:#374151;}
  .dark .dt tbody td{color:#8888a8;}
  .dt tbody td:first-child{font-weight:700;color:#111827;}
  .dark .dt tbody td:first-child{color:#d0d0e0;}
  .dt tbody td.tr{text-align:right;}
  .dt tfoot tr{background:#111827;}
  .dt tfoot td{padding:9px 12px;font-weight:900;font-size:13px;color:#fff;}
  .dt tfoot td.tr{text-align:right;}
  /* tip */
  .dtip{border-radius:11px;padding:14px 16px;margin:20px 0;background:rgba(176,136,14,.08);border-left:4px solid #b08c0e;}
  .dark .dtip{background:rgba(176,136,14,.12);}
  .dtip-t{font-weight:800;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#876a00;margin-bottom:7px;}
  .dark .dtip-t{color:#d4aa30;}
  .dtip ul{list-style:none;padding:0;margin:0;}
  .dtip ul li{font-size:12.5px;color:#4b5563;padding:2px 0;display:flex;gap:6px;}
  .dark .dtip ul li{color:#8080a0;}
  /* banner */
  .dban{border-radius:12px;padding:18px;text-align:center;background:linear-gradient(135deg,#e8720c,#8b0000 52%,#1a3a8f);color:#fff;margin:24px 0;}
  .dban .bf{font-size:17px;font-weight:900;margin-bottom:4px;}
  .dban .bn{font-size:11.5px;opacity:.8;}
  /* step cards */
  .dstep{display:flex;gap:12px;padding:12px;border-radius:10px;background:rgba(0,0,0,.03);border:1px solid #e5e7eb;margin-bottom:10px;}
  .dark .dstep{background:rgba(255,255,255,.03);border-color:#2a2a3a;}
  .dstep-n{flex-shrink:0;width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#e8720c,#c05800);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;}
  .dstep-title{font-size:13px;font-weight:800;color:#111827;margin-bottom:2px;}
  .dark .dstep-title{color:#e0e0ea;}
  .dstep-desc{font-size:12px;color:#4b5563;line-height:1.5;}
  .dark .dstep-desc{color:#8080a0;}
  /* meta bar */
  .dmeta{display:flex;flex-wrap:wrap;gap:12px;padding:12px 0 20px;border-bottom:1px solid #e5e7eb;margin-bottom:20px;}
  .dark .dmeta{border-color:#2a2a3a;}
  .dmeta-item{font-size:11.5px;font-weight:600;color:#6b7280;display:flex;align-items:center;gap:4px;}
  /* footer */
  .dfooter{text-align:center;font-size:9.5px;font-weight:700;letter-spacing:.08em;color:#9ca3af;padding:24px 0 8px;border-top:1px solid #e5e7eb;margin-top:40px;}
  .dark .dfooter{border-color:#2a2a3a;color:#444460;}
  /* generic note */
  .gnote-warn{border-radius:11px;padding:14px 16px;margin:18px 0;background:rgba(139,0,0,.07);border-left:4px solid #8b0000;}
  .dark .gnote-warn{background:rgba(139,0,0,.15);}
  .code{background:#f3f4f6;padding:2px 6px;border-radius:5px;font-family:'Courier New',monospace;font-size:12px;color:#1a3a8f;}
  .dark .code{background:#1e1e30;color:#8099e0;}
`;

/* ── BALANCE SHEET full document ── */
function BalanceSheetDoc() {
  return (
    <>
      <div className="dc">
        <div className="dc-ey">Financial Education Series</div>
        <div className="dc-t">Balance Sheet</div>
        <div className="dc-s">Learning Guide</div>
        <div className="dc-d">Understanding the Basics of Business Financial Position</div>
        <span className="dc-b">2025 EDITION</span>
      </div>

      <div className="dmeta">
        <span className="dmeta-item"><Clock size={12}/>5 days ago</span>
        <span className="dmeta-item"><Tag size={12}/>Accounting</span>
        <span className="dmeta-item">📖 8 min read</span>
      </div>

      {/* What is a Balance Sheet */}
      <h2 className="dh2"><span className="dh2-bar"/>What is a Balance Sheet?</h2>
      <p className="dp">A balance sheet is a financial statement that shows what a business <strong>owns (Assets)</strong>, <strong>owes (Liabilities)</strong>, and the <strong>owner's investment (Capital / Equity)</strong> on a specific date. It provides a snapshot of the financial position of a business at any given point in time.</p>
      <div className="dcall">
        <div className="dcall-lb">Accounting Equation</div>
        <div className="dcall-f">Assets = Liabilities + Capital (Equity)</div>
        <div className="dcall-b">Every balance sheet must always balance — the total value of Assets must equal the combined total of Liabilities and Capital. This fundamental equation is the foundation of all financial accounting.</div>
      </div>

      <hr className="ddiv"/>

      {/* Assets */}
      <h2 className="dh2"><span className="dh2-bar"/>Assets – What the Business Owns</h2>
      <p className="dp">Assets are everything a business owns that has economic value. They are broadly classified into <strong>Current Assets</strong>, <strong>Fixed (Non-current) Assets</strong>, and <strong>Intangible Assets</strong>. Together, they form the left side of the balance sheet and must equal total Liabilities plus Capital.</p>

      <span className="dh3 h3o">Current Assets</span>
      <ul className="dl">
        {["Cash","Bank Deposits","Accounts Receivable","Inventory","Prepaid Expenses"].map(i=>(
          <li key={i}><span className="dd ddo">▸</span><span className="flex1">{i}</span></li>
        ))}
      </ul>

      <span className="dh3 h3b">Fixed (Non-current) Assets</span>
      <ul className="dl">
        {["Land","Building","Machinery","Furniture","Vehicles","Computers"].map(i=>(
          <li key={i}><span className="dd ddb">▸</span><span className="flex1">{i}</span></li>
        ))}
      </ul>

      <span className="dh3 h3r">Intangible Assets</span>
      <ul className="dl">
        {([["Goodwill","Long-term value from business reputation"],["Patents","Exclusive rights to inventions"],["Trademarks","Protected brand identifiers"]] as [string,string][]).map(([n,d])=>(
          <li key={n}><span className="dd ddr">▸</span><span className="flex1"><strong>{n}:</strong> {d}</span></li>
        ))}
      </ul>

      <div className="dtip">
        <div className="dtip-t">📌 Key Principle</div>
        <ul><li><span>✦</span><span>Assets are listed in order of <strong>liquidity</strong> — most liquid (Cash) first, least liquid (Intangibles) last.</span></li></ul>
      </div>

      <hr className="ddiv"/>

      {/* Liabilities & Capital */}
      <h2 className="dh2"><span className="dh2-bar"/>Liabilities and Capital</h2>

      <span className="dh3 h3o">Current Liabilities</span>
      <ul className="dl">
        {([["Accounts Payable","Amounts owed to suppliers for goods or services received."],["Short-term Loans","Borrowings due within one year."],["Outstanding Expenses","Expenses incurred but not yet paid (e.g., salaries payable, rent payable)."]] as [string,string][]).map(([t,d])=>(
          <li key={t}><span className="dd ddo">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <span className="dh3 h3b">Long-term Liabilities</span>
      <ul className="dl">
        {([["Bank Loans","Long-term borrowings from financial institutions repayable over multiple years."],["Debentures","Fixed-interest debt instruments issued to lenders."],["Provisions","Amounts set aside for future liabilities such as tax provision and warranty provision."]] as [string,string][]).map(([t,d])=>(
          <li key={t}><span className="dd ddb">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <span className="dh3 h3g">Capital / Equity</span>
      <ul className="dl">
        {([["Owner's Capital","Initial investment made by the owner into the business."],["Retained Earnings","Profits kept in the business after distributions."],["Reserves","Funds set aside from profits for specific future purposes."]] as [string,string][]).map(([t,d])=>(
          <li key={t}><span className="dd ddg">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Sample Format */}
      <h2 className="dh2"><span className="dh2-bar"/>Sample Balance Sheet Format</h2>
      <p className="dp">A balance sheet presents two sides that must always be equal: <strong>Assets</strong> (what the business owns) and <strong>Liabilities + Capital</strong> (what it owes and the owner's stake).</p>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>Assets</th><th className="tr">₹ Amount</th><th>Liabilities & Capital</th><th className="tr">₹ Amount</th></tr></thead>
          <tbody>
            {([["Cash","1,00,000","Accounts Payable","60,000"],["Bank","50,000","Short-term Loan","80,000"],["Accounts Receivable","80,000","Long-term Loan","1,20,000"],["Inventory","50,000","Provisions","40,000"],["Furniture & Equipment","20,000","Owner's Capital","1,80,000"],["Building","2,00,000","Retained Earnings","20,000"]] as string[][]).map(([a,av,l,lv])=>(
              <tr key={a}><td>{a}</td><td className="tr">₹{av}</td><td>{l}</td><td className="tr">₹{lv}</td></tr>
            ))}
          </tbody>
          <tfoot><tr><td>Total Assets</td><td className="tr">₹5,00,000</td><td>Total Liabilities + Capital</td><td className="tr">₹5,00,000</td></tr></tfoot>
        </table>
      </div>
      <div className="dban"><div className="bf">✅ Assets = Liabilities + Capital</div><div className="bn">Both sides balance — ₹5,00,000 = ₹5,00,000</div></div>

      <hr className="ddiv"/>

      {/* Balancing Example */}
      <h2 className="dh2"><span className="dh2-bar"/>Example: Balancing the Sheet</h2>
      <p className="dp">A simple worked example showing how the accounting equation holds true with real numbers.</p>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>Assets</th><th className="tr">Amount</th><th>Liabilities + Capital</th><th className="tr">Amount</th></tr></thead>
          <tbody>
            <tr><td>Cash</td><td className="tr">₹1,00,000</td><td>Loan</td><td className="tr">₹1,20,000</td></tr>
            <tr><td>Inventory</td><td className="tr">₹50,000</td><td>Owner's Capital</td><td className="tr">₹1,80,000</td></tr>
            <tr><td>Furniture</td><td className="tr">₹1,50,000</td><td>—</td><td className="tr">—</td></tr>
          </tbody>
          <tfoot><tr><td>Total Assets</td><td className="tr">₹3,00,000</td><td>Total</td><td className="tr">₹3,00,000</td></tr></tfoot>
        </table>
      </div>
      <div className="dtip">
        <div className="dtip-t">✅ Both Sides Balance</div>
        <ul>
          <li><span>▸</span><span>Assets: Cash ₹1,00,000 + Inventory ₹50,000 + Furniture ₹1,50,000 = <strong>₹3,00,000</strong></span></li>
          <li><span>▸</span><span>Liabilities + Capital: Loan ₹1,20,000 + Owner's Capital ₹1,80,000 = <strong>₹3,00,000</strong></span></li>
          <li><span>▸</span><span>Equation satisfied: <strong>Assets = Liabilities + Capital ✓</strong></span></li>
        </ul>
      </div>
    </>
  );
}

/* ── GST RETURN FILING PROCESS full document ── */
function GSTDoc() {
  return (
    <>
      {/* Cover */}
      <div className="dc">
        <div className="dc-ey">📘 Tax & Compliance Series</div>
        <div className="dc-t">GST Return Filing Process</div>
        <div className="dc-s">Beginner to Advanced Guide</div>
        <div className="dc-d">🧾 Invoices &nbsp;·&nbsp; 📊 Returns &nbsp;·&nbsp; 💰 ITC &nbsp;·&nbsp; ✅ Compliance</div>
        <span className="dc-b">COMPLETE LEARNING GUIDE</span>
      </div>

      {/* TOC */}
      <div style={{borderRadius:"12px",border:"1.5px solid #e5e7eb",padding:"16px 20px",marginBottom:"24px",background:"#f9f9fc"}}>
        <div style={{fontWeight:800,fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase" as const,color:"#6b7280",marginBottom:"10px"}}>📖 Table of Contents</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 16px"}}>
          {["1. Introduction to GST","2. What is GST Return?","3. Why File Returns?","4. Types of Returns","5. Who Should File?","6. Documents Required","7. Filing Process","8. Example","9. Due Dates","10. Common Mistakes","11. Penalties","12. Benefits","13. Flowchart","14. FAQs","15. Practice Qs","16. MCQs","17. Summary"].map((t,i)=>(
            <div key={i} style={{fontSize:"12px",color:"#374151",padding:"2px 0",borderBottom:"1px dashed #e5e7eb",display:"flex",gap:"5px"}}>
              <span style={{color:"#e8720c",fontWeight:700,minWidth:"18px"}}>{t.split(".")[0]}.</span>
              <span>{t.split(".").slice(1).join(".")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ch 1 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 1 – What is GST?</h2>
      <div className="dcall">
        <div className="dcall-lb">Definition</div>
        <div className="dcall-f">Goods and Services Tax (GST)</div>
        <div className="dcall-b">GST is an <strong>indirect tax</strong> charged on the supply of goods and services. It replaced multiple indirect taxes (VAT, Service Tax, Excise Duty, etc.) with one unified tax system across the country.</div>
      </div>
      <span className="dh3 h3o">Key Benefits of GST</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["🇮🇳","One Nation, One Tax","Uniform tax across all states"],["🔍","Transparent Taxation","Clear tax structure at every stage"],["📋","Easy Compliance","Single portal for all filings"],["💳","Input Tax Credit","Claim credit on taxes already paid"],["📉","No Tax Cascading","Tax only on value added, not on tax"]].map(([icon,title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <div style={{fontSize:"16px",marginBottom:"3px"}}>{icon}</div>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 2 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 2 – What is a GST Return?</h2>
      <p className="dp">A <strong>GST Return</strong> is an official document filed by a registered business on the GST portal. It reports all tax-related activities for a specific period.</p>
      <span className="dh3 h3b">A GST Return Reports:</span>
      <ul className="dl">
        {[["Sales (Outward Supplies)","All invoices raised to customers"],["Purchases (Inward Supplies)","All bills received from suppliers"],["GST Collected","Tax collected from customers on sales"],["GST Paid","Tax paid to suppliers on purchases"],["Input Tax Credit (ITC)","GST paid on purchases eligible for set-off"],["Tax Liability","Net GST payable to the government"]].map(([t,d])=>(
          <li key={t}><span className="dd ddo">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 3 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 3 – Why File GST Returns?</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["✅ Legal Compliance","Mandatory by law for registered businesses"],["💰 Claim ITC","Reduce your tax liability using input credit"],["🚫 Avoid Penalties","Late filing attracts fines and interest"],["📂 Accurate Records","Maintains clean financial history"],["🏦 Loan Approvals","GST returns used as income proof by banks"],["⭐ Business Credibility","Shows you are a compliant, trustworthy business"]].map(([title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 4 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 4 – Types of GST Returns</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Return</th><th>Purpose</th><th>Frequency</th></tr></thead>
        <tbody>
          {[["GSTR-1","Details of outward supplies (Sales)","Monthly / Quarterly"],["GSTR-3B","Monthly summary return and tax payment","Monthly"],["GSTR-9","Annual GST Return (reconciliation)","Annually"],["GSTR-4","Composition Scheme Return","Quarterly"],["GSTR-2A","Auto-populated purchase details (view only)","Auto"],["GSTR-9C","Reconciliation Statement (audit)","Annually"]].map(([r,p,f])=>(
            <tr key={r}><td style={{color:"#1a3a8f",fontWeight:800}}>{r}</td><td>{p}</td><td style={{color:"#876a00",fontWeight:600,fontSize:"11px"}}>{f}</td></tr>
          ))}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 5 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 5 – Who Should File GST Returns?</h2>
      <ul className="dl">
        {["Registered businesses with GSTIN","Companies (Private/Public/LLP)","Traders buying and selling goods","Manufacturers of goods","Service providers","E-commerce sellers","Importers and exporters"].map(p=>(
          <li key={p}><span className="dd ddb">▸</span><span className="flex1">{p}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 6 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 6 – Documents Required</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",margin:"8px 0 16px"}}>
        {[["🧾","Sales Invoices","All B2B and B2C invoices raised"],["📄","Purchase Bills","Bills from suppliers with GST breakup"],["🔢","GSTIN","Your GST Identification Number"],["🏦","Bank Details","Account for tax payments and refunds"],["📋","Debit Notes","Issued for short billing or price increase"],["📋","Credit Notes","Issued for returns or price reduction"],["💸","Expense Records","All GST-paid expense vouchers"],["📁","Previous Returns","Copies of last filed GST returns"]].map(([icon,title,desc])=>(
          <div key={title} style={{display:"flex",gap:"8px",alignItems:"flex-start",borderRadius:"8px",border:"1px solid #e5e7eb",padding:"8px 10px",background:"#f9f9fc"}}>
            <span style={{fontSize:"16px",flexShrink:0}}>{icon}</span>
            <div><div style={{fontWeight:700,fontSize:"12px",color:"#111827"}}>{title}</div><div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div></div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 7 – 10 step process */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 7 – GST Return Filing Process</h2>
      {[["Collect All Invoices","Gather all sales invoices, purchase bills, credit/debit notes for the period."],["Record Sales","Enter all outward supply (sales) details into your accounting software."],["Record Purchases","Enter all inward supply (purchase) bills with GST breakup."],["Calculate GST","Compute total GST collected on sales and GST paid on purchases."],["Claim Input Tax Credit","Identify eligible ITC from purchases and reconcile with GSTR-2A."],["Prepare GST Return","Fill GSTR-1 (sales details) and GSTR-3B (summary with tax payment)."],["Upload Return on GST Portal","Login to www.gst.gov.in and upload the prepared return data."],["Verify and Submit","Review all details, check for errors, and submit the return."],["Pay Tax (if applicable)","Pay the net GST liability (GST Collected − ITC) via challan."],["Download Acknowledgement","Download the ARN (Acknowledgement Reference Number) as proof."]].map(([t,d],i)=>(
        <div className="dstep" key={t}>
          <div className="dstep-n">{i+1}</div>
          <div><div className="dstep-title">{t}</div><div className="dstep-desc">{d}</div></div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 8 – Example */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 8 – Worked Example</h2>
      <div style={{borderRadius:"12px",border:"2px solid #e8720c33",padding:"16px 18px",marginBottom:"16px",background:"#e8720c06"}}>
        <div style={{fontWeight:800,fontSize:"14px",color:"#e8720c",marginBottom:"12px"}}>🏪 ABC Traders — Monthly GST Calculation</div>
        <div className="dtw" style={{margin:0}}><table className="dt">
          <thead><tr><th>Item</th><th className="tr">Amount (₹)</th></tr></thead>
          <tbody>
            <tr><td>Sales (Outward Supplies)</td><td className="tr" style={{color:"#1a3a8f",fontWeight:700}}>2,00,000</td></tr>
            <tr><td>GST Collected on Sales (@18%)</td><td className="tr" style={{color:"#e8720c",fontWeight:700}}>36,000</td></tr>
            <tr><td>Purchases (Inward Supplies)</td><td className="tr" style={{color:"#1a3a8f",fontWeight:700}}>1,20,000</td></tr>
            <tr><td>GST Paid on Purchases (@18%)</td><td className="tr" style={{color:"#876a00",fontWeight:700}}>21,600</td></tr>
          </tbody>
          <tfoot><tr><td><strong>Net GST Payable (36,000 − 21,600)</strong></td><td className="tr">₹14,400</td></tr></tfoot>
        </table></div>
      </div>
      <div className="dtip">
        <div className="dtip-t">💡 How ITC Works</div>
        <ul>
          <li><span>▸</span><span>GST Collected on Sales = <strong>₹36,000</strong> (liability)</span></li>
          <li><span>▸</span><span>GST Paid on Purchases = <strong>₹21,600</strong> (Input Tax Credit)</span></li>
          <li><span>▸</span><span>Net GST Payable = 36,000 − 21,600 = <strong>₹14,400</strong> to be paid to government</span></li>
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 9 – Due Dates */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 9 – Due Dates</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Return</th><th>Frequency</th><th>Typical Due Date</th></tr></thead>
        <tbody>
          {[["GSTR-1","Monthly","11th of the following month"],["GSTR-1 (QRMP)","Quarterly","13th of the month after quarter"],["GSTR-3B","Monthly","20th of the following month"],["GSTR-9","Annual","31st December of next financial year"],["GSTR-4","Quarterly (Composition)","18th of month after quarter"]].map(([r,f,d])=>(
            <tr key={r}><td style={{color:"#1a3a8f",fontWeight:800}}>{r}</td><td style={{fontSize:"11px",color:"#6b7280"}}>{f}</td><td style={{color:"#876a00",fontWeight:600}}>{d}</td></tr>
          ))}
        </tbody>
      </table></div>
      <div className="gnote-warn">
        <div className="dtip-t" style={{color:"#8b0000"}}>⚠️ Important Note</div>
        <ul className="dl" style={{marginTop:"6px"}}>
          <li><span className="dd ddr">!</span><span className="flex1">Due dates may change based on government notifications. Always verify the latest schedule on the official GST portal before filing.</span></li>
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 10 – Mistakes */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 10 – Common Mistakes</h2>
      <div className="gnote-warn">
        <div className="dtip-t" style={{color:"#8b0000"}}>❌ Avoid These Errors</div>
        <ul className="dl" style={{marginTop:"6px"}}>
          {["Wrong GSTIN entered for supplier or customer","Missing invoices — not all sales/purchases recorded","Incorrect tax rate calculation (CGST/SGST/IGST)","Duplicate entries — same invoice entered twice","Wrong HSN/SAC code on invoices","Missing Input Tax Credit — not claiming eligible ITC","Filing return late — leads to penalties"].map(m=>(
            <li key={m}><span className="dd ddr">✗</span><span className="flex1">{m}</span></li>
          ))}
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 11 – Penalties */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 11 – Penalties for Late Filing</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Penalty Type</th><th>Details</th></tr></thead>
        <tbody>
          {[["Late Fee","Charged per day of delay (varies by return type)"],["Interest on Unpaid Tax","18% per annum on the outstanding tax amount"],["ITC Blocking","Input Tax Credit may be blocked for non-filers"],["Legal Notices","Tax authority can issue notices and summons"],["Cancellation of GSTIN","Repeated non-filing can lead to GST registration cancellation"]].map(([t,d])=>(
            <tr key={t}><td style={{color:"#8b0000",fontWeight:700}}>{t}</td><td>{d}</td></tr>
          ))}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 12 – Benefits */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 12 – Benefits of Timely Filing</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["✅ Avoid Penalties","No late fees or interest charges"],["💵 Better Cash Flow","Timely ITC claims improve liquidity"],["🏦 Easy Loan Approval","Returns serve as income proof for banks"],["📋 Business Compliance","Demonstrates good governance"],["⭐ Better Reputation","Trusted by suppliers, customers and banks"],["🔓 No ITC Blocking","Uninterrupted input tax credit flow"]].map(([title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 13 – Flowchart */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 13 – GST Filing Flowchart</h2>
      <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",gap:"0",margin:"8px 0 20px"}}>
        {[["📥","Collect Invoices & Bills","#e8720c"],["📊","Record Sales & Purchases","#1a3a8f"],["🧮","Calculate GST Liability","#876a00"],["💳","Claim Input Tax Credit","#1a3a8f"],["📝","Prepare GSTR-1 & GSTR-3B","#e8720c"],["🌐","Upload on GST Portal","#1a3a8f"],["✅","Verify & Submit","#876a00"],["💰","Pay Net Tax","#8b0000"],["📄","Download ARN","#1a3a8f"]].map(([icon,step,color],i,arr)=>(
          <div key={step} style={{display:"flex",flexDirection:"column" as const,alignItems:"center",width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",width:"100%",maxWidth:"360px",borderRadius:"10px",border:`1.5px solid ${color}44`,padding:"10px 14px",background:`${color}0a`}}>
              <span style={{fontSize:"18px"}}>{icon}</span>
              <span style={{fontWeight:700,fontSize:"13px",color}}>{step}</span>
            </div>
            {i < arr.length-1 && <div style={{width:"2px",height:"16px",background:"#e5e7eb",margin:"0 auto"}}/>}
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 14 – FAQs */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 14 – Frequently Asked Questions</h2>
      {[["Q1. What is GST?","GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It replaced multiple taxes like VAT, Service Tax, and Excise Duty."],["Q2. What is Input Tax Credit (ITC)?","ITC allows registered businesses to reduce the GST they owe by claiming credit for GST already paid on purchases and expenses."],["Q3. Is filing GST Returns compulsory?","Yes. Every GST-registered business must file returns even if there are no transactions (nil return)."],["Q4. What happens if I don't file?","Late fees, interest on unpaid tax, ITC blocking, and possible cancellation of GSTIN."],["Q5. How is GSTR-1 different from GSTR-3B?","GSTR-1 contains detailed invoice-level sales data. GSTR-3B is a summary return where you declare total tax liability and pay it."]].map(([q,a])=>(
        <div key={q} style={{borderRadius:"11px",border:"1px solid #e5e7eb",padding:"12px 16px",marginBottom:"10px",background:"#f9f9fc"}}>
          <div style={{fontWeight:800,fontSize:"13px",color:"#1a3a8f",marginBottom:"5px"}}>{q}</div>
          <div style={{fontSize:"13px",color:"#374151",lineHeight:"1.7"}}>{a}</div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 15 – Practice */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 15 – Practice Questions</h2>
      <ul className="dl">
        {["Define GST and explain its full form.","What is a GST Return? Why is it filed?","Explain the purpose of GSTR-1.","What is GSTR-3B and when is it filed?","What is Input Tax Credit (ITC)?","Why should businesses file GST Returns on time?","List 6 documents required for GST return filing.","Explain the 10-step GST return filing process."].map((q,i)=>(
          <li key={i}><span className="dd ddo">{i+1}</span><span className="flex1">{q}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 16 – MCQs */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 16 – MCQs</h2>
      {[
        {q:"1. GST stands for:",opts:["A. Goods Sales Tax","B. General Service Tax","C. Goods and Services Tax ✅","D. Government Sales Tax"],ans:"C"},
        {q:"2. Which return contains detailed sales invoice data?",opts:["A. GSTR-3B","B. GSTR-1 ✅","C. GSTR-9","D. GSTR-4"],ans:"B"},
        {q:"3. ITC stands for:",opts:["A. Income Tax Credit","B. Input Tax Credit ✅","C. Internal Tax Code","D. International Tax Code"],ans:"B"},
        {q:"4. GSTR-9 is filed:",opts:["A. Monthly","B. Quarterly","C. Annually ✅","D. Weekly"],ans:"C"},
        {q:"5. The GST portal is:",opts:["A. www.incometax.gov.in","B. www.mca.gov.in","C. www.gst.gov.in ✅","D. www.cbic.gov.in"],ans:"C"},
      ].map(({q,opts})=>(
        <div key={q} style={{borderRadius:"11px",border:"1px solid #e5e7eb",padding:"12px 16px",marginBottom:"10px",background:"#f9f9fc"}}>
          <div style={{fontWeight:800,fontSize:"13px",color:"#111827",marginBottom:"8px"}}>{q}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px"}}>
            {opts.map(o=>(
              <div key={o} style={{fontSize:"12px",padding:"4px 8px",borderRadius:"6px",background:o.includes("✅")?"#e8720c18":"transparent",color:o.includes("✅")?"#c05800":"#374151",fontWeight:o.includes("✅")?700:400,border:o.includes("✅")?"1px solid #e8720c44":"1px solid transparent"}}>{o}</div>
            ))}
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 17 – Summary */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 17 – Quick Summary</h2>
      <div className="dtip">
        <div className="dtip-t">📌 Key Takeaways</div>
        <ul>
          {["GST is an indirect tax on the supply of goods and services.","GST Returns report sales, purchases, ITC and tax liability.","GSTR-1 covers sales details; GSTR-3B is the summary return.","Filing on time avoids penalties, late fees and ITC blocking.","ITC allows businesses to reduce net tax payable.","Maintain accurate records, invoices and previous returns.","Always verify due dates on the official GST portal."].map(t=><li key={t}><span>✅</span><span>{t}</span></li>)}
        </ul>
      </div>

      <div className="dban">
        <div className="bf">🎯 You're GST Ready!</div>
        <div className="bn">Master these concepts and you can handle GST compliance for any small or medium business with confidence.</div>
      </div>
    </>
  );
}

/* ── BUSINESS MODEL CANVAS full document ── */
function BusinessModelDoc() {
  const Block = ({title,icon,color,items,qs}:{title:string,icon:string,color:string,items:string[],qs?:string[]}) => (
    <div style={{borderRadius:"12px",border:`2px solid ${color}33`,padding:"14px 16px",marginBottom:"12px",background:`${color}07`}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
        <span style={{fontSize:"18px"}}>{icon}</span>
        <span style={{fontWeight:900,fontSize:"14px",color}}>{title}</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap" as const,gap:"6px",marginBottom:qs?"10px":"0"}}>
        {items.map(i=><span key={i} style={{background:`${color}18`,color,padding:"3px 10px",borderRadius:"20px",fontSize:"11.5px",fontWeight:700}}>{i}</span>)}
      </div>
      {qs&&<div style={{borderTop:`1px dashed ${color}33`,paddingTop:"8px",marginTop:"4px"}}>
        {qs.map(q=><div key={q} style={{fontSize:"12px",color:"#6b7280",padding:"2px 0",display:"flex",gap:"6px"}}><span style={{color,fontWeight:700}}>?</span><span>{q}</span></div>)}
      </div>}
    </div>
  );

  return (
    <>
      {/* Cover */}
      <div className="dc">
        <div className="dc-ey">📘 Financial Education Series</div>
        <div className="dc-t">Business Model Canvas</div>
        <div className="dc-s">Complete Professional Learning Guide</div>
        <div className="dc-d">🏗️ Strategy &nbsp;·&nbsp; 🚀 Startups &nbsp;·&nbsp; 💡 Innovation &nbsp;·&nbsp; 📊 Planning</div>
        <span className="dc-b">BMC COMPLETE GUIDE</span>
      </div>

      {/* TOC */}
      <div style={{borderRadius:"12px",border:"1.5px solid #e5e7eb",padding:"16px 20px",marginBottom:"24px",background:"#f9f9fc"}}>
        <div style={{fontWeight:800,fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase" as const,color:"#6b7280",marginBottom:"10px"}}>📑 Table of Contents</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 16px"}}>
          {["1. Introduction","2. What is BMC?","3. Why Use It?","4. The 9 Building Blocks","5. BMC Layout","6. Real-World Example","7. Advantages","8. Limitations","9. Common Mistakes","10. Practice Activity","11. MCQs","12. Interview Questions","13. Summary"].map((t,i)=>(
            <div key={i} style={{fontSize:"12px",color:"#374151",padding:"2px 0",borderBottom:"1px dashed #e5e7eb",display:"flex",gap:"5px"}}>
              <span style={{color:"#e8720c",fontWeight:700,minWidth:"18px"}}>{t.split(".")[0]}.</span>
              <span>{t.split(".").slice(1).join(".")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ch 1 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 1 – Introduction: What is a Business Model?</h2>
      <p className="dp">A <strong>business model</strong> explains how a company <strong>creates</strong>, <strong>delivers</strong>, and <strong>captures value</strong>. It is the blueprint of how a business operates and makes money.</p>
      <span className="dh3 h3o">Key Questions a Business Model Answers</span>
      <ul className="dl">
        {[["What problem are we solving?","The core need or pain point being addressed"],["Who are our customers?","The target audience who will pay for the solution"],["How do we earn money?","The revenue model and pricing strategy"],["What resources do we need?","People, technology, capital and infrastructure"],["How do we deliver our product/service?","Channels and customer touchpoints"]].map(([t,d])=>(
          <li key={t}><span className="dd ddo">?</span><span className="flex1"><strong>{t}</strong> — {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 2 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 2 – What is a Business Model Canvas?</h2>
      <div className="dcall">
        <div className="dcall-lb">Definition</div>
        <div className="dcall-f">Business Model Canvas (BMC)</div>
        <div className="dcall-b">The BMC is a <strong>one-page strategic planning tool</strong> developed by <strong>Alexander Osterwalder</strong>. It helps entrepreneurs, startups, and businesses visualize their entire business model using <strong>9 building blocks</strong>. Instead of writing a long business plan, the BMC summarizes everything on a single page.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",margin:"12px 0 16px"}}>
        {[["📄","1 Page","Entire business on a single canvas"],["🧩","9 Blocks","Covers all key business areas"],["👁️","Visual","Easy to understand at a glance"],["🔄","Flexible","Update anytime as business evolves"],["🤝","Team Tool","Share and collaborate easily"],["⚡","Fast","Create in minutes, not months"]].map(([icon,title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px",background:"#f8f8fc",textAlign:"center" as const}}>
            <div style={{fontSize:"20px",marginBottom:"3px"}}>{icon}</div>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"10px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 3 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 3 – Why Use a Business Model Canvas?</h2>
      <ul className="dl">
        {[["Understand the Complete Business","See all parts of the business at once"],["Identify Strengths & Weaknesses","Quickly spot gaps and opportunities"],["Improve Business Planning","Structure your strategy clearly"],["Encourage Innovation","Spot areas for improvement and new ideas"],["Save Time","Faster than writing a traditional business plan"],["Easy to Update","Adapt as your business evolves"],["Better Team Communication","Everyone sees the same picture"]].map(([t,d])=>(
          <li key={t}><span className="dd ddb">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 4 – 9 Blocks */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 4 – The 9 Building Blocks</h2>

      <Block title="1. Customer Segments" icon="👥" color="#e8720c"
        items={["Students","Small Businesses","Retail Shops","Accountants","Freelancers","Job Seekers"]}
        qs={["Who is our target audience?","Who are our most valuable customers?","Are there multiple customer segments?"]}/>

      <Block title="2. Value Proposition" icon="💎" color="#1a3a8f"
        items={["Affordable Accounting Software","Easy Tally Courses","AI-Powered Learning","Time-Saving Tools","PDF Study Notes"]}
        qs={["What problem are we solving?","Why should customers choose us?","What makes us unique?"]}/>

      <Block title="3. Channels" icon="📡" color="#876a00"
        items={["Mobile App","Website","Play Store","App Store","YouTube","Social Media"]}
        qs={["How do customers find us?","Which channels are most cost-effective?"]}/>

      <Block title="4. Customer Relationships" icon="🤝" color="#8b0000"
        items={["Customer Support","Live Chat","Email","Community Forum","Push Notifications","Loyalty Programs"]}
        qs={["How do we acquire new customers?","How do we retain existing customers?"]}/>

      <Block title="5. Revenue Streams" icon="💰" color="#e8720c"
        items={["Subscription","Course Sales","Advertising","Premium Membership","Certification Fees","Consulting"]}
        qs={["How does the business make money?","What are customers willing to pay for?"]}/>

      <Block title="6. Key Resources" icon="🏗️" color="#1a3a8f"
        items={["Developers","Designers","Mobile App","Website","Database","Cloud Storage","Brand"]}
        qs={["What resources are most critical?","Which resources are hardest to replace?"]}/>

      <Block title="7. Key Activities" icon="⚙️" color="#876a00"
        items={["App Development","Create Content","Marketing","Customer Support","Software Maintenance","Updating Courses"]}
        qs={["What do we do every day?","Which activities create the most value?"]}/>

      <Block title="8. Key Partnerships" icon="🌐" color="#8b0000"
        items={["Payment Gateways","Cloud Providers","Accounting Experts","Universities","Content Creators","Marketing Agencies"]}
        qs={["Who helps us operate?","Which partnerships reduce risk?"]}/>

      <Block title="9. Cost Structure" icon="📊" color="#e8720c"
        items={["Salaries","Server Costs","Office Rent","Marketing","Software Licenses","Content Production","Customer Support"]}
        qs={["What are our biggest costs?","Which resources are most expensive?"]}/>

      <hr className="ddiv"/>

      {/* Ch 5 – BMC Layout */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 5 – Business Model Canvas Layout</h2>
      <div style={{borderRadius:"12px",overflow:"hidden",border:"2px solid #e5e7eb",margin:"12px 0 20px"}}>
        {/* Row 1 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.3fr 1fr",borderBottom:"2px solid #e5e7eb"}}>
          {[["Key Partners","#e8720c","🌐"],["Key Activities","#1a3a8f","⚙️"],["Value Proposition","#876a00","💎"],["Customer Relations","#8b0000","🤝"]].map(([label,color,icon])=>(
            <div key={label as string} style={{padding:"12px 10px",borderRight:"1px solid #e5e7eb",background:`${color}08`}}>
              <div style={{fontSize:"14px",marginBottom:"3px"}}>{icon as string}</div>
              <div style={{fontWeight:800,fontSize:"11px",color:color as string}}>{label as string}</div>
            </div>
          ))}
        </div>
        {/* Row 2 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.3fr 1fr",borderBottom:"2px solid #e5e7eb"}}>
          {[["Key Resources","#e8720c","🏗️"],["","",""],["","",""],["Channels","#876a00","📡"]].map(([label,color,icon],i)=>(
            <div key={i} style={{padding:"12px 10px",borderRight:"1px solid #e5e7eb",background:label?`${color}08`:"#fafafa",minHeight:"48px"}}>
              {label && <><div style={{fontSize:"14px",marginBottom:"3px"}}>{icon}</div><div style={{fontWeight:800,fontSize:"11px",color}}>{label}</div></>}
            </div>
          ))}
        </div>
        {/* Row 3 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          {[["Cost Structure","#8b0000","📊"],["Revenue Streams","#1a3a8f","💰"]].map(([label,color,icon])=>(
            <div key={label as string} style={{padding:"12px 10px",borderRight:"1px solid #e5e7eb",background:`${color}08`}}>
              <div style={{fontSize:"14px",marginBottom:"3px"}}>{icon as string}</div>
              <div style={{fontWeight:800,fontSize:"11px",color:color as string}}>{label as string}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="ddiv"/>

      {/* Ch 6 – Real Example */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 6 – Real-World Example: Tally Learning App</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {([
          ["👥 Customer Segments","#e8720c",["Students","Accountants","Job Seekers","Business Owners"]],
          ["💎 Value Proposition","#1a3a8f",["Learn Tally Anywhere","PDF Notes","Video Lessons","AI Tutor","Practice Questions"]],
          ["📡 Channels","#876a00",["Android App","Website","YouTube"]],
          ["🤝 Customer Relations","#8b0000",["Live Chat","AI Assistant","Push Notifications"]],
          ["💰 Revenue Streams","#e8720c",["Premium Subscription","Course Sales","Certification"]],
          ["🏗️ Key Resources","#1a3a8f",["Developers","Designers","PDFs","Video Courses","Cloud Storage"]],
          ["⚙️ Key Activities","#876a00",["Upload Notes","Create Videos","Improve App","Marketing"]],
          ["🌐 Key Partnerships","#8b0000",["Accounting Experts","Universities","Cloud Providers","Payment Providers"]],
          ["📊 Cost Structure","#e8720c",["Developer Salaries","Server Costs","Marketing","Content Creation"]],
        ] as [string,string,string[]][]).map(([title,color,items])=>(
          <div key={title} style={{borderRadius:"10px",border:`1.5px solid ${color}33`,padding:"10px 12px",background:`${color}07`}}>
            <div style={{fontWeight:800,fontSize:"12px",color,marginBottom:"6px"}}>{title}</div>
            <div style={{display:"flex",flexWrap:"wrap" as const,gap:"4px"}}>
              {items.map(i=><span key={i} style={{background:`${color}18`,color,padding:"2px 7px",borderRadius:"20px",fontSize:"10.5px",fontWeight:700}}>{i}</span>)}
            </div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 7 – Advantages */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 7 – Advantages</h2>
      <ul className="dl">
        {["Easy to understand — even non-business people can read it","One-page overview of the entire business","Encourages teamwork and collaborative planning","Helps attract investors and communicate the business model","Improves strategic planning and decision-making","Supports innovation and identifying new opportunities"].map(a=>(
          <li key={a}><span className="dd ddb">✔</span><span className="flex1">{a}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 8 – Limitations */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 8 – Limitations</h2>
      <div className="gnote-warn">
        <div className="dtip-t" style={{color:"#8b0000"}}>⚠️ Known Limitations</div>
        <ul className="dl" style={{marginTop:"6px"}}>
          {["Lacks detailed financial analysis — no P&L or cash flow projections","Needs regular updates as the business evolves","May oversimplify very complex businesses","Does not replace a full business plan for investors","No operational or timeline detail included"].map(l=>(
            <li key={l}><span className="dd ddr">!</span><span className="flex1">{l}</span></li>
          ))}
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 9 – Common Mistakes */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 9 – Common Mistakes</h2>
      <ul className="dl">
        {[["Ignoring Customer Needs","Building a product nobody wants to buy"],["Weak Value Proposition","Not clearly explaining why customers should choose you"],["Unrealistic Revenue Estimates","Overestimating sales without market data"],["Forgetting Partnerships","Underestimating how much partners contribute"],["Underestimating Costs","Not accounting for hidden or indirect expenses"],["No Competitive Analysis","Ignoring what competitors offer"]].map(([t,d])=>(
          <li key={t}><span className="dd ddr">✗</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 10 – Practice */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 10 – Practice Activity</h2>
      <p className="dp">Create a full Business Model Canvas for each of the following businesses. Fill in all 9 building blocks.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["☕","Coffee Shop","A local café serving beverages and snacks"],["👗","Clothing Brand","Fashion brand selling online and in-store"],["📱","Online Learning App","EdTech platform for accounting students"],["🍕","Food Delivery Service","App-based meal delivery from restaurants"],["🏋️","Gym","Fitness centre with memberships and classes"]].map(([icon,title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1.5px solid #1a3a8f22",padding:"12px",background:"#1a3a8f06"}}>
            <div style={{fontSize:"22px",marginBottom:"4px"}}>{icon}</div>
            <div style={{fontWeight:800,fontSize:"13px",color:"#1a3a8f",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 11 – MCQs */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 11 – MCQs</h2>
      {[
        {q:"1. How many building blocks are in the Business Model Canvas?",opts:["A. 5","B. 7","C. 9 ✅","D. 12"]},
        {q:"2. Which block explains how the company earns money?",opts:["A. Customer Segments","B. Revenue Streams ✅","C. Channels","D. Key Partnerships"]},
        {q:"3. Which block identifies business expenses?",opts:["A. Cost Structure ✅","B. Channels","C. Value Proposition","D. Key Resources"]},
        {q:"4. Who developed the Business Model Canvas?",opts:["A. Peter Drucker","B. Alexander Osterwalder ✅","C. Michael Porter","D. Philip Kotler"]},
        {q:"5. The Value Proposition answers which question?",opts:["A. How do we pay employees?","B. Why should customers choose us? ✅","C. Who are our partners?","D. What are our costs?"]},
      ].map(({q,opts})=>(
        <div key={q} style={{borderRadius:"11px",border:"1px solid #e5e7eb",padding:"12px 16px",marginBottom:"10px",background:"#f9f9fc"}}>
          <div style={{fontWeight:800,fontSize:"13px",color:"#111827",marginBottom:"8px"}}>{q}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px"}}>
            {opts.map(o=>(
              <div key={o} style={{fontSize:"12px",padding:"4px 8px",borderRadius:"6px",background:o.includes("✅")?"#e8720c18":"transparent",color:o.includes("✅")?"#c05800":"#374151",fontWeight:o.includes("✅")?700:400,border:o.includes("✅")?"1px solid #e8720c44":"1px solid transparent"}}>{o}</div>
            ))}
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 12 – Interview Questions */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 12 – Interview Questions</h2>
      {[
        ["What is a Business Model Canvas?","A one-page strategic tool with 9 building blocks used to visualize and design a business model, developed by Alexander Osterwalder."],
        ["Why is the BMC important?","It gives a clear, visual overview of the entire business on a single page, making planning, communication and innovation easier."],
        ["Explain the 9 building blocks.","Customer Segments, Value Proposition, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure."],
        ["Difference between Business Plan and BMC?","A Business Plan is a long, detailed document with financials. A BMC is a concise, one-page visual framework focused on the business model."],
        ["Give an example of a Business Model Canvas.","E.g., for an online learning app: Customers = students; Value = affordable courses; Revenue = subscription fees; Key Activity = content creation."],
      ].map(([q,a])=>(
        <div key={q} style={{borderRadius:"11px",border:"1px solid #e5e7eb",padding:"12px 16px",marginBottom:"10px",background:"#f9f9fc"}}>
          <div style={{fontWeight:800,fontSize:"13px",color:"#1a3a8f",marginBottom:"5px"}}>Q: {q}</div>
          <div style={{fontSize:"13px",color:"#374151",lineHeight:"1.7"}}>A: {a}</div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 13 – Summary */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 13 – Quick Summary</h2>
      <div className="dtip">
        <div className="dtip-t">📌 Key Takeaways</div>
        <ul>
          {["Business Model Canvas is a one-page business planning framework.","It consists of 9 building blocks covering every aspect of a business.","Helps businesses understand how they create, deliver, and capture value.","Widely used by startups, entrepreneurs, and established companies.","Effective tool for planning, innovation, and communicating the business model.","Does not replace a full business plan but complements it perfectly."].map(t=><li key={t}><span>✔</span><span>{t}</span></li>)}
        </ul>
      </div>

      <div className="dban">
        <div className="bf">🚀 You've Mastered the Business Model Canvas!</div>
        <div className="bn">Use this framework to plan, pitch, and grow any business — from a startup to an enterprise.</div>
      </div>
    </>
  );
}

/* ── TALLY MULTI-CURRENCY SETUP full document ── */
function MultiCurrencyDoc() {
  const Step = ({n,t,d}:{n:number,t:string,d:string})=>(
    <div className="dstep"><div className="dstep-n">{n}</div><div><div className="dstep-title">{t}</div><div className="dstep-desc">{d}</div></div></div>
  );
  const Flow = ({items,color}:{items:string[],color:string})=>(
    <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",margin:"10px 0 16px"}}>
      {items.map((item,i,arr)=>(
        <div key={item} style={{display:"flex",flexDirection:"column" as const,alignItems:"center",width:"100%"}}>
          <div style={{width:"100%",maxWidth:"320px",borderRadius:"9px",border:`1.5px solid ${color}44`,padding:"9px 14px",background:`${color}0a`,fontWeight:700,fontSize:"13px",color,textAlign:"center" as const}}>{item}</div>
          {i<arr.length-1&&<div style={{width:"2px",height:"14px",background:"#e5e7eb"}}/>}
        </div>
      ))}
    </div>
  );
  const InfoBox = ({label,value,color}:{label:string,value:string,color:string})=>(
    <div style={{flex:1,borderRadius:"10px",border:`1.5px solid ${color}33`,padding:"12px",background:`${color}08`,textAlign:"center" as const}}>
      <div style={{fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase" as const,letterSpacing:".08em",marginBottom:"4px"}}>{label}</div>
      <div style={{fontSize:"16px",fontWeight:900,color}}>{value}</div>
    </div>
  );
  return (
    <>
      {/* Cover */}
      <div className="dc">
        <div className="dc-ey">🌐 TallyPrime Advanced Series</div>
        <div className="dc-t">Tally Prime Multi-Currency Setup</div>
        <div className="dc-s">Beginner to Advanced Learning Guide</div>
        <div className="dc-d">💱 Forex &nbsp;·&nbsp; 🌍 International Business &nbsp;·&nbsp; 📊 Auto Conversion &nbsp;·&nbsp; 📈 Forex Gain/Loss</div>
        <span className="dc-b">COMPLETE LEARNING GUIDE</span>
      </div>

      {/* TOC */}
      <div style={{borderRadius:"12px",border:"1.5px solid #e5e7eb",padding:"16px 20px",marginBottom:"24px",background:"#f9f9fc"}}>
        <div style={{fontWeight:800,fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase" as const,color:"#6b7280",marginBottom:"10px"}}>📑 Table of Contents</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 16px"}}>
          {["1. Introduction","2. Why Use Multi-Currency?","3. Benefits","4. Key Features","5. Prerequisites","6. Enable Multi-Currency","7. Create Foreign Currency","8. Exchange Rate","9. Foreign Customer","10. Foreign Supplier","11. Sales Example","12. Purchase Example","13. Forex Gain/Loss","14. Reports","15. Common Mistakes","16. Advantages","17. Practice Questions","18. MCQs","19. Real-Life Example"].map((t,i)=>(
            <div key={i} style={{fontSize:"12px",color:"#374151",padding:"2px 0",borderBottom:"1px dashed #e5e7eb",display:"flex",gap:"5px"}}>
              <span style={{color:"#e8720c",fontWeight:700,minWidth:"20px"}}>{t.split(".")[0]}.</span>
              <span>{t.split(".").slice(1).join(".")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ch 1 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 1 – Introduction: What is Multi-Currency?</h2>
      <p className="dp"><strong>Multi-Currency</strong> is a feature in TallyPrime that allows businesses to record transactions in more than one currency. Instead of recording only in your home currency (INR / NPR), businesses can also record in:</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["🇺🇸","USD","US Dollar"],["🇪🇺","EUR","Euro"],["🇬🇧","GBP","Pound Sterling"],["🇯🇵","JPY","Japanese Yen"],["🇦🇪","AED","UAE Dirham"],["🇨🇳","CNY","Chinese Yuan"]].map(([flag,code,name])=>(
          <div key={code} style={{display:"flex",alignItems:"center",gap:"10px",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <span style={{fontSize:"20px"}}>{flag}</span>
            <div><div style={{fontWeight:800,fontSize:"13px",color:"#1a3a8f"}}>{code}</div><div style={{fontSize:"11px",color:"#6b7280"}}>{name}</div></div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 2 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 2 – Why Use Multi-Currency?</h2>
      <p className="dp">Many businesses buy and sell products <strong>internationally</strong>. When a supplier sends an invoice in a foreign currency, TallyPrime automatically converts the amount into the company's base currency using the configured exchange rate.</p>
      <div className="dcall">
        <div className="dcall-lb">Real-World Scenario</div>
        <div className="dcall-f">Nepal Company ↔ USA Supplier</div>
        <div className="dcall-b">A company in Nepal purchases goods from a USA supplier. The supplier's invoice is in <strong>USD</strong>. TallyPrime records both the USD amount and the equivalent NPR/INR value automatically — no manual conversion needed.</div>
      </div>

      <hr className="ddiv"/>

      {/* Ch 3 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 3 – Benefits</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["🌍","International Business","Record transactions in any world currency"],["🔄","Auto Conversion","Exchange rates applied automatically"],["📊","Accurate Reports","Financials in both currencies"],["🧮","No Manual Calc","Tally does all the math for you"],["📈","Forex Tracking","Gain/Loss on exchange rate fluctuations"],["⏱️","Saves Time","Faster invoice processing"]].map(([icon,title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <div style={{fontSize:"16px",marginBottom:"3px"}}>{icon}</div>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 4 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 4 – Key Features</h2>
      <ul className="dl">
        {["Unlimited foreign currencies supported","Automatic exchange rate conversion","Exchange rate management (manual or auto)","Forex Gain/Loss auto-calculation","Multi-currency invoices and vouchers","Foreign customer and supplier ledger support","Reports in both base and foreign currency"].map(f=>(
          <li key={f}><span className="dd ddb">▸</span><span className="flex1">{f}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 5 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 5 – Prerequisites</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["✔","Company Created","A company must exist in TallyPrime"],["✔","Base Currency Set","INR, NPR, or your local currency configured"],["✔","TallyPrime Installed","Version 2.0 or later recommended"],["✔","Basic Accounting","Understanding of ledgers and vouchers"]].map(([icon,title,desc])=>(
          <div key={title} style={{display:"flex",gap:"10px",borderRadius:"10px",border:"1.5px solid #1a3a8f22",padding:"10px 12px",background:"#1a3a8f06"}}>
            <span style={{color:"#1a3a8f",fontWeight:900,fontSize:"16px",flexShrink:0}}>{icon}</span>
            <div><div style={{fontWeight:700,fontSize:"12px",color:"#111827"}}>{title}</div><div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div></div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 6 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 6 – Enable Multi-Currency</h2>
      <Flow items={["Gateway of Tally","F11 – Features","Accounting Features","Enable Multi-Currency → Yes","Save (Ctrl + A)"]} color="#e8720c"/>

      <hr className="ddiv"/>

      {/* Ch 7 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 7 – Create a Foreign Currency</h2>
      <Flow items={["Gateway of Tally","Create → Currency","Fill Currency Details","Save"]} color="#1a3a8f"/>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Field</th><th>Example Value</th></tr></thead>
        <tbody>
          {[["Currency Name","US Dollar"],["Symbol","$"],["Formal Name","United States Dollar"],["Suffix Symbol","No"],["Decimal Places","2"],["Decimal Symbol","Cents"]].map(([f,v])=>(
            <tr key={f}><td style={{color:"#1a3a8f",fontWeight:700}}>{f}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 8 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 8 – Exchange Rate Management</h2>
      <p className="dp">Exchange rates tell TallyPrime how much 1 unit of a foreign currency is worth in your base currency. You can set rates manually or update them periodically.</p>
      <div style={{display:"flex",gap:"10px",margin:"12px 0 16px",flexWrap:"wrap" as const}}>
        <InfoBox label="Foreign Amount" value="100 USD" color="#1a3a8f"/>
        <InfoBox label="Exchange Rate" value="1 USD = ₹85" color="#e8720c"/>
        <InfoBox label="Base Amount" value="₹8,500" color="#876a00"/>
      </div>
      <div className="dtip">
        <div className="dtip-t">💡 Rate Update Tip</div>
        <ul>
          <li><span>▸</span><span>Update exchange rates regularly to ensure accurate Forex Gain/Loss calculations.</span></li>
          <li><span>▸</span><span>Go to: <strong>Gateway → Accounts Info → Currencies → Alter → Standard Rates</strong></span></li>
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 9 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 9 – Create a Foreign Customer</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Field</th><th>Value</th></tr></thead>
        <tbody>
          {[["Ledger Name","ABC USA"],["Under (Group)","Sundry Debtors"],["Currency","USD (US Dollar)"],["Country","United States"],["Mailing Address","Optional — fill if needed"]].map(([f,v])=>(
            <tr key={f}><td style={{color:"#1a3a8f",fontWeight:700}}>{f}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 10 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 10 – Create a Foreign Supplier</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Field</th><th>Value</th></tr></thead>
        <tbody>
          {[["Ledger Name","XYZ Trading LLC"],["Under (Group)","Sundry Creditors"],["Currency","AED (UAE Dirham)"],["Country","United Arab Emirates"],["Opening Balance","As applicable"]].map(([f,v])=>(
            <tr key={f}><td style={{color:"#8b0000",fontWeight:700}}>{f}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 11 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 11 – Sales Example (Foreign Customer)</h2>
      <div style={{borderRadius:"12px",border:"2px solid #1a3a8f33",padding:"16px 18px",marginBottom:"16px",background:"#1a3a8f06"}}>
        <div style={{fontWeight:800,fontSize:"13px",color:"#1a3a8f",marginBottom:"12px"}}>🧾 Sales Invoice — ABC USA</div>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap" as const,marginBottom:"12px"}}>
          <InfoBox label="Foreign Amount" value="500 USD" color="#1a3a8f"/>
          <InfoBox label="Exchange Rate" value="1 USD = ₹85" color="#e8720c"/>
          <InfoBox label="Invoice Value" value="₹42,500" color="#876a00"/>
        </div>
        <div className="dtip" style={{margin:0}}>
          <div className="dtip-t">📌 What Tally Stores</div>
          <ul>
            <li><span>▸</span><span>Foreign Currency Amount: <strong>500 USD</strong></span></li>
            <li><span>▸</span><span>Base Currency Amount: <strong>₹42,500</strong></span></li>
            <li><span>▸</span><span>Both values appear in ledger and reports</span></li>
          </ul>
        </div>
      </div>

      <hr className="ddiv"/>

      {/* Ch 12 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 12 – Purchase Example (Foreign Supplier)</h2>
      <div style={{display:"flex",gap:"10px",margin:"12px 0 16px",flexWrap:"wrap" as const}}>
        <InfoBox label="Purchase Amount" value="250 USD" color="#1a3a8f"/>
        <InfoBox label="Exchange Rate" value="₹85 / USD" color="#e8720c"/>
        <InfoBox label="Total (INR)" value="₹21,250" color="#876a00"/>
      </div>

      <hr className="ddiv"/>

      {/* Ch 13 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 13 – Forex Gain / Loss</h2>
      <p className="dp">When a transaction is recorded at one exchange rate and settled at a <strong>different rate</strong>, the difference is called <strong>Forex Gain</strong> or <strong>Forex Loss</strong>.</p>
      <div style={{borderRadius:"12px",border:"2px solid #e8720c33",padding:"16px 18px",marginBottom:"12px",background:"#e8720c06"}}>
        <div style={{fontWeight:800,fontSize:"13px",color:"#e8720c",marginBottom:"10px"}}>📊 Forex Gain Example</div>
        <div className="dtw" style={{margin:"0 0 10px"}}><table className="dt">
          <thead><tr><th>Event</th><th>Rate</th><th>Amount (500 USD)</th></tr></thead>
          <tbody>
            <tr><td>Invoice Raised (Today)</td><td>1 USD = ₹85</td><td style={{color:"#1a3a8f",fontWeight:700}}>₹42,500</td></tr>
            <tr><td>Payment Received (1 month later)</td><td>1 USD = ₹87</td><td style={{color:"#876a00",fontWeight:700}}>₹43,500</td></tr>
          </tbody>
          <tfoot><tr><td>Forex Gain</td><td>₹2 × 500</td><td style={{color:"#1a3a8f"}}>₹1,000 GAIN ✅</td></tr></tfoot>
        </table></div>
      </div>
      <div style={{borderRadius:"12px",border:"2px solid #8b000033",padding:"14px 16px",marginBottom:"16px",background:"#8b000006"}}>
        <div style={{fontWeight:800,fontSize:"13px",color:"#8b0000",marginBottom:"6px"}}>📉 Forex Loss Example</div>
        <p style={{fontSize:"13px",color:"#374151",margin:0}}>If the exchange rate <strong>decreases</strong> (e.g., from ₹85 to ₹83), you receive less INR for the same USD amount — this is recorded as a <strong>Forex Loss</strong>.</p>
      </div>

      <hr className="ddiv"/>

      {/* Ch 14 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 14 – Reports in TallyPrime</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["📋","Outstanding Reports","View pending foreign currency receivables/payables"],["💱","Currency Summary","Summary of all foreign currency transactions"],["📒","Ledger Reports","Individual foreign customer/supplier details"],["⚖️","Balance Sheet","Assets & liabilities in base + foreign currency"],["📈","Profit & Loss","P&L showing Forex Gain/Loss separately"],["📊","Exchange Rate Report","History of exchange rates used"]].map(([icon,title,desc])=>(
          <div key={title} style={{display:"flex",gap:"8px",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <span style={{fontSize:"18px",flexShrink:0}}>{icon}</span>
            <div><div style={{fontWeight:700,fontSize:"12px",color:"#111827"}}>{title}</div><div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div className="dtip">
        <div className="dtip-t">💡 Report Display Option</div>
        <ul>
          <li><span>▸</span><span>All reports can display amounts in <strong>Base Currency</strong> (INR/NPR) or <strong>Foreign Currency</strong> (USD/AED etc.) — toggle using F12 Configuration.</span></li>
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 15 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 15 – Common Mistakes</h2>
      <div className="gnote-warn">
        <div className="dtip-t" style={{color:"#8b0000"}}>❌ Avoid These Errors</div>
        <ul className="dl" style={{marginTop:"6px"}}>
          {["Wrong exchange rate entered — always verify the current market rate","Wrong currency selected in ledger — USD vs AED mix-up","Forgetting to enable Multi-Currency in F11 Features first","Wrong ledger currency — creating USD ledger but selecting INR","Duplicate currencies — creating USD twice with different names","Not updating exchange rates — leads to incorrect Forex Gain/Loss","Using base currency in a foreign voucher accidentally"].map(m=>(
            <li key={m}><span className="dd ddr">✗</span><span className="flex1">{m}</span></li>
          ))}
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 16 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 16 – Advantages</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"8px 0 16px"}}>
        {[["✔ Faster Accounting","No manual currency conversion needed"],["✔ Auto Conversion","Exchange rates applied in real time"],["✔ Better Reporting","Reports in both local and foreign currency"],["✔ Global Support","Handle USD, EUR, GBP, AED, JPY and more"],["✔ Accurate Books","Forex Gain/Loss tracked automatically"],["✔ Saves Time","Reduces hours of manual reconciliation"]].map(([title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1.5px solid #1a3a8f22",padding:"10px 12px",background:"#1a3a8f06"}}>
            <div style={{fontWeight:800,fontSize:"12px",color:"#1a3a8f",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 17 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 17 – Practice Questions</h2>
      <ul className="dl">
        {["What is Multi-Currency in TallyPrime?","Why do businesses use Multi-Currency accounting?","Write the steps to enable Multi-Currency in TallyPrime.","Explain Forex Gain with a numerical example.","Explain Forex Loss with a numerical example.","How do you create a foreign customer ledger in Tally?","How does TallyPrime calculate the base currency equivalent?","What reports does TallyPrime provide for foreign currency transactions?"].map((q,i)=>(
          <li key={i}><span className="dd ddo">{i+1}</span><span className="flex1">{q}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 18 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 18 – MCQs</h2>
      {[
        {q:"1. Multi-Currency in Tally is used for:",opts:["A. Inventory Management","B. Payroll Processing","C. Foreign Currency Transactions ✅","D. GST Filing"]},
        {q:"2. Where do you enable Multi-Currency?",opts:["A. F11 – Features ✅","B. Print Settings","C. Voucher Entry","D. Reports Menu"]},
        {q:"3. Forex Gain occurs when:",opts:["A. Exchange rate increases after transaction ✅","B. Inventory stock decreases","C. Cash balance decreases","D. GST rate increases"]},
        {q:"4. USD stands for:",opts:["A. United States Dollar ✅","B. Universal Standard Dollar","C. United Sales Dollar","D. User System Dollar"]},
        {q:"5. To create a foreign currency go to:",opts:["A. Vouchers","B. Gateway → Create → Currency ✅","C. Reports → Currency","D. F12 Configuration"]},
      ].map(({q,opts})=>(
        <div key={q} style={{borderRadius:"11px",border:"1px solid #e5e7eb",padding:"12px 16px",marginBottom:"10px",background:"#f9f9fc"}}>
          <div style={{fontWeight:800,fontSize:"13px",color:"#111827",marginBottom:"8px"}}>{q}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px"}}>
            {opts.map(o=>(
              <div key={o} style={{fontSize:"12px",padding:"4px 8px",borderRadius:"6px",background:o.includes("✅")?"#e8720c18":"transparent",color:o.includes("✅")?"#c05800":"#374151",fontWeight:o.includes("✅")?700:400,border:o.includes("✅")?"1px solid #e8720c44":"1px solid transparent"}}>{o}</div>
            ))}
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 19 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 19 – Real-Life Example</h2>
      <div style={{borderRadius:"12px",border:"2px solid #e8720c33",padding:"16px 18px",marginBottom:"16px",background:"#e8720c06"}}>
        <div style={{fontWeight:800,fontSize:"13px",color:"#e8720c",marginBottom:"14px"}}>🏢 ABC Traders (Nepal) — Laptop Purchase from Dell USA</div>
        <Flow items={["ABC Traders (Nepal) needs a laptop","Places order with Dell USA","Invoice issued: 1,000 USD","Exchange Rate: 1 USD = ₹85","Tally records: Foreign = 1,000 USD | Base = ₹85,000","One month later — rate changes to 1 USD = ₹87","Difference: ₹2 × 1,000 = ₹2,000","Recorded automatically as Forex Gain/Loss"]} color="#e8720c"/>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap" as const,marginTop:"12px"}}>
          <InfoBox label="Invoice Date Rate" value="₹85 / USD" color="#1a3a8f"/>
          <InfoBox label="Settlement Rate" value="₹87 / USD" color="#e8720c"/>
          <InfoBox label="Forex Difference" value="₹2,000" color="#876a00"/>
        </div>
      </div>

      <div className="dban">
        <div className="bf">🌐 You're Multi-Currency Ready!</div>
        <div className="bn">Master this feature and handle international business transactions in TallyPrime with full confidence.</div>
      </div>
    </>
  );
}

/* ── TALLY KEYBOARD SHORTCUTS full document ── */
function TallyShortcutsDoc() {
  const KBD = ({ k }: { k: string }) => (
    <span style={{display:"inline-block",background:"#1a3a8f",color:"#fff",borderRadius:"6px",padding:"2px 8px",fontFamily:"monospace",fontSize:"11px",fontWeight:800,letterSpacing:".04em",marginRight:"2px"}}>{k}</span>
  );
  const Row = ({ s, f }: { s: string; f: string }) => (
    <tr>
      <td style={{fontFamily:"monospace",fontWeight:800,color:"#1a3a8f",fontSize:"12px",whiteSpace:"nowrap" as const}}><KBD k={s}/></td>
      <td style={{fontSize:"13px",color:"#374151"}}>{f}</td>
    </tr>
  );

  return (
    <>
      {/* Cover */}
      <div className="dc">
        <div className="dc-ey">⌨️ Tally Prime Productivity Series</div>
        <div className="dc-t">Tally Keyboard Shortcuts</div>
        <div className="dc-s">Master Tally Faster with Essential Keyboard Shortcuts</div>
        <div className="dc-d">🚀 Work Faster &nbsp;·&nbsp; ⌛ Save Time &nbsp;·&nbsp; 💼 Look Professional &nbsp;·&nbsp; 🎯 Boost Productivity</div>
        <span className="dc-b">COMPLETE LEARNING GUIDE</span>
      </div>

      {/* TOC */}
      <div style={{borderRadius:"12px",border:"1.5px solid #e5e7eb",padding:"16px 20px",marginBottom:"24px",background:"#f9f9fc"}}>
        <div style={{fontWeight:800,fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase" as const,color:"#6b7280",marginBottom:"10px"}}>📑 Table of Contents</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px"}}>
          {["1. Introduction","2. Navigation","3. Company","4. Vouchers","5. Master Creation","6. Editing","7. Print & Export","8. Reports","9. Function Keys","10. 50+ Shortcuts","11. Memory Tricks","12. Practice Activity"].map((t,i)=>(
            <div key={i} style={{fontSize:"12.5px",color:"#374151",padding:"3px 0",borderBottom:"1px dashed #e5e7eb",display:"flex",gap:"6px"}}>
              <span style={{color:"#1a3a8f",fontWeight:700}}>{t.split(".")[0]}.</span>
              <span>{t.split(".")[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ch 1 */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 1 – Introduction</h2>
      <p className="dp">Keyboard shortcuts are <strong>key combinations</strong> that let you perform tasks in Tally Prime instantly — without touching the mouse. Learning them transforms slow, click-heavy work into fast, fluid accounting.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"12px 0 20px"}}>
        {[["🚀","Faster Work","Cut entry time by up to 60%"],["⌛","Saves Time","No mouse hunting needed"],["💼","Professional","Impress clients & employers"],["🎯","Productivity","Handle more entries per day"],["💯","Interview Ready","Shortcuts are asked in Tally jobs"],["🧠","Less Errors","Muscle memory reduces mistakes"]].map(([icon,title,desc])=>(
          <div key={title} style={{borderRadius:"10px",border:"1px solid #e5e7eb",padding:"10px 12px",background:"#f8f8fc"}}>
            <div style={{fontSize:"18px",marginBottom:"3px"}}>{icon}</div>
            <div style={{fontWeight:800,fontSize:"12px",color:"#111827",marginBottom:"2px"}}>{title}</div>
            <div style={{fontSize:"11px",color:"#6b7280"}}>{desc}</div>
          </div>
        ))}
      </div>

      <hr className="ddiv"/>

      {/* Ch 2 – Navigation */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 2 – Navigation Shortcuts</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Function</th></tr></thead>
        <tbody>
          {[["Alt + G","Go To — jump to any report or menu instantly"],["Esc","Back / Exit current screen"],["Ctrl + M","Switch between open companies"],["Ctrl + N","Open calculator"],["Ctrl + Enter","Alter / Edit a Master"],["Alt + F1","Detailed view of any report"],["Alt + F2","Change period / date range"],["Tab","Move to next field"],["Enter","Accept & move forward"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 3 – Company */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 3 – Company Shortcuts</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Function</th></tr></thead>
        <tbody>
          {[["Alt + K","Company Menu"],["Alt + F3","Company Info / Manage Companies"],["Ctrl + F3","Create New Company"],["Alt + F1","Close Current Company"],["F1","Select Company"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 4 – Vouchers */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 4 – Voucher Shortcuts</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Voucher Type</th></tr></thead>
        <tbody>
          {[["F4","Contra Voucher — Cash ↔ Bank transfers"],["F5","Payment Voucher — Money going out"],["F6","Receipt Voucher — Money coming in"],["F7","Journal Voucher — Adjustments & corrections"],["F8","Sales Voucher — Record a sale"],["F9","Purchase Voucher — Record a purchase"],["F10","Reversing Journal"],["Ctrl + F8","Credit Note — Sales return"],["Ctrl + F9","Debit Note — Purchase return"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 5 – Masters */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 5 – Master Creation</h2>
      <p className="dp">While inside any voucher, press <strong>Alt + C</strong> on a ledger field to instantly create a new master without leaving the voucher screen.</p>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>What it Creates</th></tr></thead>
        <tbody>
          {[["Alt + C","Create Ledger on-the-fly"],["Alt + C","Create Stock Item on-the-fly"],["Alt + C","Create Customer on-the-fly"],["Alt + C","Create Supplier on-the-fly"],["Ctrl + Enter","Open & alter an existing master"]].map(([s,f],i)=><Row key={i} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 6 – Editing */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 6 – Editing Shortcuts</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Function</th></tr></thead>
        <tbody>
          {[["Alt + A","Add a new line in voucher"],["Alt + D","Delete current voucher/entry"],["Alt + I","Insert a new voucher above"],["Ctrl + A","Accept / Save the entry"],["Ctrl + Q","Quit without saving"],["Alt + X","Cancel voucher"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 7 – Print & Export */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 7 – Printing & Export</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Function</th></tr></thead>
        <tbody>
          {[["Alt + P","Print current report or voucher"],["Alt + E","Export report (PDF, Excel, XML)"],["Alt + M","Email report directly from Tally"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 8 – Reports */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 8 – Report Shortcuts</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Shortcut</th><th>Function</th></tr></thead>
        <tbody>
          {[["Alt + F2","Change date / reporting period"],["F1","Select Company"],["F2","Change Date"],["F12","Configuration of report format"],["Alt + F1","Toggle detailed/condensed view"],["Ctrl + B","Basis of Values in reports"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 9 – Function Keys */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 9 – Function Keys Reference</h2>
      <div className="dtw"><table className="dt">
        <thead><tr><th>Key</th><th>Use in Tally Prime</th></tr></thead>
        <tbody>
          {[["F1","Select Company"],["F2","Change Date"],["F3","Company (switch)"],["F4","Contra Voucher"],["F5","Payment Voucher"],["F6","Receipt Voucher"],["F7","Journal Voucher"],["F8","Sales Voucher"],["F9","Purchase Voucher"],["F10","Reversing Journal"],["F11","Features & Configuration"],["F12","Configuration Settings"]].map(([s,f])=><Row key={s} s={s} f={f}/>)}
        </tbody>
      </table></div>

      <hr className="ddiv"/>

      {/* Ch 10 – 50+ shortcuts */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 10 – 50+ Most Useful Shortcuts</h2>
      {([
        ["⬆️ Navigation",["Alt + G → Go To","Esc → Back/Exit","Tab → Next field","Enter → Accept","Ctrl + M → Switch company","Ctrl + N → Calculator","Ctrl + Enter → Alter master","Alt + F1 → Detailed view","Alt + F2 → Change period","Page Up/Down → Scroll"]],
        ["🗂️ Masters",["Alt + C → Create master","Ctrl + Enter → Edit master","Alt + D → Delete master","Alt + E → Export master list","Ctrl + A → Save"]],
        ["🧾 Vouchers",["F4 → Contra","F5 → Payment","F6 → Receipt","F7 → Journal","F8 → Sales","F9 → Purchase","F10 → Reversing Journal","Ctrl + F8 → Credit Note","Ctrl + F9 → Debit Note","Alt + I → Insert voucher","Alt + A → Add line","Alt + D → Delete voucher"]],
        ["📊 Reports",["F1 → Select Company","F2 → Change Date","F12 → Configure","Ctrl + B → Basis of values","Alt + F1 → Toggle detail","Alt + F2 → Change period","Ctrl + C → Copy value"]],
        ["📦 Inventory",["F10 → Stock Vouchers","Alt + F7 → Stock Journal","Alt + F8 → Delivery Note","Alt + F9 → Receipt Note","Alt + F10 → Rejection"]],
        ["🖨️ Print & Export",["Alt + P → Print","Alt + E → Export","Alt + M → Email","Ctrl + P → Print preview"]],
        ["🏦 Banking",["Alt + F4 → Bank Reconciliation","Ctrl + F6 → Post-dated Cheques","Alt + S → Payment advice"]],
      ] as [string, string[]][]).map(([section, items]) => (
        <div key={section} style={{marginBottom:"16px"}}>
          <span className="dh3 h3b">{section}</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px",marginTop:"4px"}}>
            {items.map(item => {
              const [key, desc] = item.split(" → ");
              return (
                <div key={item} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 0",borderBottom:"1px dashed #e5e7eb",fontSize:"12px"}}>
                  <span style={{background:"#1a3a8f",color:"#fff",borderRadius:"5px",padding:"1px 6px",fontFamily:"monospace",fontWeight:800,fontSize:"10px",flexShrink:0,whiteSpace:"nowrap" as const}}>{key?.trim()}</span>
                  <span style={{color:"#374151"}}>{desc?.trim()}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 11 – Memory Tricks */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 11 – Memory Tricks 🧠</h2>
      <p className="dp">Most Tally shortcuts use the <strong>first letter</strong> of the action. Once you know the logic, remembering is effortless.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",margin:"12px 0"}}>
        {[["P","Print — Alt+P"],["E","Export — Alt+E"],["C","Create — Alt+C"],["D","Delete — Alt+D"],["G","Go To — Alt+G"],["M","Mail/Email — Alt+M"],["A","Add line — Alt+A"],["I","Insert — Alt+I"]].map(([letter, action])=>(
          <div key={letter} style={{display:"flex",alignItems:"center",gap:"10px",borderRadius:"10px",border:"1.5px solid #e8720c33",padding:"10px 12px",background:"#e8720c08"}}>
            <span style={{width:"32px",height:"32px",borderRadius:"8px",background:"#e8720c",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"16px",flexShrink:0}}>{letter}</span>
            <span style={{fontSize:"12.5px",color:"#374151",fontWeight:600}}>{action}</span>
          </div>
        ))}
      </div>
      <div className="dtip">
        <div className="dtip-t">💡 Pro Memory Tip</div>
        <ul>
          <li><span>▸</span><span>Function keys <strong>F4–F9</strong> follow the accounting cycle in order: Contra → Payment → Receipt → Journal → Sales → Purchase</span></li>
          <li><span>▸</span><span>Think: <strong>C-P-R-J-S-P</strong> (Can People Really Journal Sales Properly?)</span></li>
        </ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 12 – Practice */}
      <h2 className="dh2"><span className="dh2-bar"/>Ch 12 – Practice Activity</h2>
      {[
        ["Task 1","Create a Sales Voucher using only keyboard",["Press F8 to open Sales Voucher","Use Tab to move between fields","Type party name, press Alt+C if not found","Enter stock item and quantity","Press Ctrl+A to save — no mouse needed!"]],
        ["Task 2","Print a report using shortcut",["Open Balance Sheet (Alt+G → Balance Sheet)","Press Alt+P to open print menu","Select printer settings using Tab","Press Enter to print"]],
        ["Task 3","Export a Balance Sheet",["Open Balance Sheet report","Press Alt+E for Export","Choose format: PDF / Excel / XML","Set file path and press Enter to export"]],
        ["Task 4","Create a Ledger",["Go to Gateway → Masters → Ledgers","Press Alt+C or Create","Fill ledger name, group, opening balance","Press Ctrl+A to save"]],
      ].map(([task, title, steps], i)=>(
        <div key={i} style={{borderRadius:"12px",border:"1.5px solid #1a3a8f22",padding:"14px 16px",marginBottom:"12px",background:"#1a3a8f06"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
            <span style={{background:"#1a3a8f",color:"#fff",borderRadius:"8px",padding:"3px 10px",fontSize:"11px",fontWeight:800}}>{task}</span>
            <span style={{fontWeight:700,fontSize:"13px",color:"#111827"}}>{title as string}</span>
          </div>
          {(steps as string[]).map((s,j)=>(
            <div key={j} style={{display:"flex",gap:"8px",padding:"5px 0",fontSize:"12.5px",color:"#374151",borderBottom:"1px dashed #e5e7eb"}}>
              <span style={{width:"18px",height:"18px",borderRadius:"50%",background:"#e8720c",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontWeight:900,flexShrink:0,marginTop:"1px"}}>{j+1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      ))}

      <div className="dban">
        <div className="bf">⌨️ You're Shortcut Ready!</div>
        <div className="bn">Practise 5 shortcuts a day — in 2 weeks you'll be the fastest Tally user in the room.</div>
      </div>
    </>
  );
}

/* ── JOURNAL ENTRY RULES full document ── */
function JournalDoc() {
  return (
    <>
      {/* Cover */}
      <div className="dc">
        <div className="dc-ey">📘 Accounting Education Series</div>
        <div className="dc-t">Journal Entry Rules</div>
        <div className="dc-s">Beginner to Advanced Guide for Tally & Accounting</div>
        <div className="dc-d">📒 Ledger &nbsp;·&nbsp; 🧮 Calculator &nbsp;·&nbsp; 🧾 Invoice &nbsp;·&nbsp; 💰 Money</div>
        <span className="dc-b">COMPLETE LEARNING GUIDE</span>
      </div>

      {/* Ch 1 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 1: What is a Journal?</h2>
      <p className="dp">A <strong>Journal</strong> is the first book of accounts where every financial transaction is recorded in chronological order (date-wise) before being posted to the ledger. It is also called the <strong>Book of Original Entry</strong> or <strong>Day Book</strong>.</p>
      <span className="dh3 h3b">Why Journal Entries are Important</span>
      <ul className="dl">
        {[
          ["Systematic Record","Every transaction is recorded in a structured format."],
          ["Chronological Order","Entries are made date-wise, ensuring timeline accuracy."],
          ["Basis for Ledger","All ledger postings originate from journal entries."],
          ["Audit Trail","Provides a clear trail for verification and auditing."],
          ["Error Detection","Helps in finding and correcting mistakes early."],
        ].map(([t,d])=>(
          <li key={t}><span className="dd ddb">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>
      <div className="dtip">
        <div className="dtip-t">📌 Real-Life Example</div>
        <ul><li><span>🏪</span><span>Imagine you own a <strong>stationery shop</strong>. Every day, you buy goods, sell products, and pay rent. Before these transactions go into reports, they are first recorded in the <strong>Journal</strong>. The journal captures the raw financial story of your business.</span></li></ul>
      </div>

      <hr className="ddiv"/>

      {/* Ch 2 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 2: What is a Journal Entry?</h2>
      <p className="dp">A <strong>Journal Entry</strong> is the recording of a business transaction in the journal. It is the <strong>first step of accounting</strong> — every transaction enters the books here before anything else.</p>
      <span className="dh3 h3o">Key Characteristics</span>
      <ul className="dl">
        {[
          "It is the first step of the accounting cycle.",
          "Transactions are recorded in chronological (date) order.",
          "Every entry has at least one Debit and one Credit.",
          "Total Debits must always equal total Credits.",
          "A narration (brief explanation) is written below each entry.",
        ].map(p=><li key={p}><span className="dd ddo">▸</span><span className="flex1">{p}</span></li>)}
      </ul>
      <span className="dh3 h3g">Example Journal Entry</span>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>Date</th><th>Particulars</th><th>L.F.</th><th className="tr">Debit (₹)</th><th className="tr">Credit (₹)</th></tr></thead>
          <tbody>
            <tr><td>1 Jan</td><td>Cash A/C &nbsp;<em style={{color:"#1a3a8f"}}>Dr.</em><br/><span style={{paddingLeft:"16px",color:"#555"}}>To Capital A/C</span><br/><em style={{fontSize:"11px",color:"#9ca3af"}}>(Being business started with cash)</em></td><td>—</td><td className="tr" style={{color:"#1a3a8f",fontWeight:800}}>10,000</td><td className="tr" style={{color:"#8b0000",fontWeight:800}}>10,000</td></tr>
          </tbody>
        </table>
      </div>

      <hr className="ddiv"/>

      {/* Ch 3 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 3: Accounting Equation</h2>
      <div className="dcall">
        <div className="dcall-lb">The Fundamental Equation</div>
        <div className="dcall-f">Assets = Liabilities + Capital (Owner's Equity)</div>
        <div className="dcall-b">Every journal entry affects this equation. When you debit an asset, it increases; when you credit a liability, it increases. The equation always stays balanced.</div>
      </div>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>Transaction</th><th>Assets</th><th>Liabilities</th><th>Capital</th></tr></thead>
          <tbody>
            {[
              ["Started business with ₹50,000 cash","↑ Cash +50,000","—","↑ Capital +50,000"],
              ["Bought furniture for ₹10,000 cash","↑ Furniture +10,000 / ↓ Cash −10,000","—","—"],
              ["Took loan of ₹20,000","↑ Cash +20,000","↑ Loan +20,000","—"],
              ["Paid rent ₹5,000","↓ Cash −5,000","—","↓ Capital −5,000"],
            ].map(([t,a,l,c])=>(
              <tr key={t}><td>{t}</td><td style={{color:"#1a3a8f",fontSize:"12px"}}>{a}</td><td style={{color:"#8b0000",fontSize:"12px"}}>{l}</td><td style={{color:"#876a00",fontSize:"12px"}}>{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="ddiv"/>

      {/* Ch 4 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 4: Golden Rules of Accounting ⭐</h2>
      <p className="dp">The three golden rules of accounting form the foundation of every journal entry. You must identify the <strong>type of account</strong> first, then apply the correct rule.</p>

      {/* Personal Account */}
      <div style={{borderRadius:"12px",border:"2px solid #e8720c",padding:"18px 20px",marginBottom:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
          <span style={{background:"#e8720c",color:"#fff",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",fontWeight:800}}>Personal Account</span>
          <span style={{fontSize:"12px",color:"#6b7280"}}>Examples: Ram A/C, Bank A/C, Debtor A/C</span>
        </div>
        <div className="dtw" style={{margin:"0 0 10px"}}>
          <table className="dt"><thead><tr><th>Rule</th><th>When</th></tr></thead>
          <tbody>
            <tr><td style={{color:"#1a3a8f",fontWeight:800}}>Debit the Receiver</td><td>The person/entity receiving benefit</td></tr>
            <tr><td style={{color:"#8b0000",fontWeight:800}}>Credit the Giver</td><td>The person/entity giving benefit</td></tr>
          </tbody></table>
        </div>
        <div className="dtip" style={{margin:0}}>
          <div className="dtip-t">📝 Example</div>
          <ul>
            <li><span>▸</span><span>Ram gives cash ₹5,000 &nbsp;→&nbsp; <strong>Ram A/C Dr. &nbsp; To Cash A/C</strong></span></li>
            <li><span>▸</span><span><em>Debit Ram (receiver of payment from us), Credit Cash (giver)</em></span></li>
          </ul>
        </div>
      </div>

      {/* Real Account */}
      <div style={{borderRadius:"12px",border:"2px solid #1a3a8f",padding:"18px 20px",marginBottom:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
          <span style={{background:"#1a3a8f",color:"#fff",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",fontWeight:800}}>Real Account</span>
          <span style={{fontSize:"12px",color:"#6b7280"}}>Examples: Cash, Land, Building, Furniture</span>
        </div>
        <div className="dtw" style={{margin:"0 0 10px"}}>
          <table className="dt"><thead><tr><th>Rule</th><th>When</th></tr></thead>
          <tbody>
            <tr><td style={{color:"#1a3a8f",fontWeight:800}}>Debit What Comes In</td><td>Asset entering the business</td></tr>
            <tr><td style={{color:"#8b0000",fontWeight:800}}>Credit What Goes Out</td><td>Asset leaving the business</td></tr>
          </tbody></table>
        </div>
        <div className="dtip" style={{margin:0}}>
          <div className="dtip-t">📝 Example</div>
          <ul>
            <li><span>▸</span><span>Bought furniture for cash ₹8,000 &nbsp;→&nbsp; <strong>Furniture A/C Dr. &nbsp; To Cash A/C</strong></span></li>
            <li><span>▸</span><span><em>Debit Furniture (comes in), Credit Cash (goes out)</em></span></li>
          </ul>
        </div>
      </div>

      {/* Nominal Account */}
      <div style={{borderRadius:"12px",border:"2px solid #876a00",padding:"18px 20px",marginBottom:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
          <span style={{background:"#876a00",color:"#fff",borderRadius:"8px",padding:"4px 10px",fontSize:"11px",fontWeight:800}}>Nominal Account</span>
          <span style={{fontSize:"12px",color:"#6b7280"}}>Examples: Salary, Rent, Commission, Interest</span>
        </div>
        <div className="dtw" style={{margin:"0 0 10px"}}>
          <table className="dt"><thead><tr><th>Rule</th><th>When</th></tr></thead>
          <tbody>
            <tr><td style={{color:"#1a3a8f",fontWeight:800}}>Debit All Expenses & Losses</td><td>Money spent or lost</td></tr>
            <tr><td style={{color:"#8b0000",fontWeight:800}}>Credit All Income & Gains</td><td>Money earned or gained</td></tr>
          </tbody></table>
        </div>
        <div className="dtip" style={{margin:0}}>
          <div className="dtip-t">📝 Example</div>
          <ul>
            <li><span>▸</span><span>Paid salary ₹12,000 &nbsp;→&nbsp; <strong>Salary A/C Dr. &nbsp; To Cash A/C</strong></span></li>
            <li><span>▸</span><span><em>Debit Salary (expense), Credit Cash (goes out)</em></span></li>
          </ul>
        </div>
      </div>

      <hr className="ddiv"/>

      {/* Ch 5 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 5: Debit vs Credit</h2>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th style={{background:"#1a3a8f"}}>DEBIT (Dr.) 📥</th><th style={{background:"#8b0000"}}>CREDIT (Cr.) 📤</th></tr></thead>
          <tbody>
            {[
              ["Assets Increase ↑","Assets Decrease ↓"],
              ["Expenses Increase ↑","Income / Revenue Increase ↑"],
              ["Losses Recorded","Gains Recorded"],
              ["Drawings (owner withdrawals)","Capital (owner investment)"],
              ["Liabilities Decrease ↓","Liabilities Increase ↑"],
              ["What comes IN","What goes OUT"],
            ].map(([d,c],i)=>(
              <tr key={i}><td style={{color:"#1a3a8f",fontWeight:600}}>{d}</td><td style={{color:"#8b0000",fontWeight:600}}>{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="ddiv"/>

      {/* Ch 6 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 6: Types of Accounts</h2>
      {([
        ["Personal Account","Relates to persons, firms, companies, banks.",["Ram A/C","Shyam A/C","HDFC Bank A/C","SBI A/C","Creditors A/C","Debtors A/C","Capital A/C","Drawings A/C","Loan A/C","Prepaid Expense A/C"],"#e8720c"],
        ["Real Account","Relates to tangible and intangible assets of the business.",["Cash A/C","Land A/C","Building A/C","Furniture A/C","Machinery A/C","Stock A/C","Goodwill A/C","Patent A/C","Trademark A/C","Vehicle A/C"],"#1a3a8f"],
        ["Nominal Account","Relates to income, expense, gain or loss. Closed at year-end.",["Salary A/C","Rent A/C","Commission A/C","Interest A/C","Discount A/C","Advertisement A/C","Depreciation A/C","Bad Debts A/C","Profit A/C","Loss A/C"],"#876a00"],
      ] as [string,string,string[],string][]).map(([title,desc,examples,color])=>(
        <div key={title} style={{borderRadius:"12px",border:`1.5px solid ${color}22`,background:`${color}09`,padding:"16px 18px",marginBottom:"14px"}}>
          <div style={{fontWeight:800,color,fontSize:"14px",marginBottom:"4px"}}>{title}</div>
          <div style={{fontSize:"12.5px",color:"#6b7280",marginBottom:"10px"}}>{desc}</div>
          <div style={{display:"flex",flexWrap:"wrap" as const,gap:"6px"}}>
            {examples.map(e=><span key={e} style={{background:`${color}18`,color,padding:"3px 9px",borderRadius:"20px",fontSize:"11.5px",fontWeight:700}}>{e}</span>)}
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 7 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 7: Steps to Record Journal Entries</h2>
      {[
        ["Read the Transaction","Understand what has happened in the business."],
        ["Identify the Accounts","Find which accounts are affected (minimum 2)."],
        ["Identify Account Type","Personal / Real / Nominal?"],
        ["Apply the Golden Rule","Which rule applies to each account type?"],
        ["Decide Debit and Credit","Which account gets debited and which gets credited?"],
        ["Write the Journal Entry","Record date, account names, amounts, and narration."],
      ].map(([t,d],i)=>(
        <div className="dstep" key={t}>
          <div className="dstep-n">{i+1}</div>
          <div><div className="dstep-title">{t}</div><div className="dstep-desc">{d}</div></div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 8 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 8: Journal Entry Format</h2>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>Date</th><th>Particulars</th><th>L.F.</th><th className="tr">Debit (₹)</th><th className="tr">Credit (₹)</th></tr></thead>
          <tbody>
            <tr style={{background:"#fffbeb"}}>
              <td style={{fontSize:"11px",color:"#6b7280"}}>Day/Month/Year</td>
              <td style={{fontSize:"11px",color:"#6b7280"}}>Account Dr.<br/>  To Account<br/><em>(Narration)</em></td>
              <td style={{fontSize:"11px",color:"#6b7280"}}>Ledger Folio No.</td>
              <td className="tr" style={{fontSize:"11px",color:"#6b7280"}}>Amount</td>
              <td className="tr" style={{fontSize:"11px",color:"#6b7280"}}>Amount</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="dl">
        {[
          ["Date","The date on which the transaction occurred."],
          ["Particulars","The name of accounts debited and credited, plus a short narration."],
          ["L.F. (Ledger Folio)","The page number of the ledger where this entry is posted."],
          ["Debit (Dr.)","The amount debited to the account."],
          ["Credit (Cr.)","The amount credited to the account."],
        ].map(([t,d])=>(
          <li key={t}><span className="dd ddg">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
        ))}
      </ul>

      <hr className="ddiv"/>

      {/* Ch 9 — 30 entries */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 9: 30 Common Journal Entries</h2>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>#</th><th>Transaction</th><th>Debit A/C</th><th>Credit A/C</th></tr></thead>
          <tbody>
            {[
              ["Started business with cash","Cash A/C","Capital A/C"],
              ["Purchased furniture for cash","Furniture A/C","Cash A/C"],
              ["Bought goods for cash","Purchase A/C","Cash A/C"],
              ["Bought goods on credit from Ram","Purchase A/C","Ram A/C"],
              ["Sold goods for cash","Cash A/C","Sales A/C"],
              ["Sold goods on credit to Shyam","Shyam A/C","Sales A/C"],
              ["Paid rent","Rent A/C","Cash A/C"],
              ["Paid salary","Salary A/C","Cash A/C"],
              ["Received commission","Cash A/C","Commission A/C"],
              ["Received interest","Cash A/C","Interest A/C"],
              ["Paid electricity bill","Electricity A/C","Cash A/C"],
              ["Purchased computer","Computer A/C","Cash A/C"],
              ["Paid insurance premium","Insurance A/C","Cash A/C"],
              ["Owner withdrew cash (drawings)","Drawings A/C","Cash A/C"],
              ["Received bank loan","Bank A/C","Bank Loan A/C"],
              ["Repaid bank loan","Bank Loan A/C","Bank A/C"],
              ["Bad debts written off","Bad Debts A/C","Debtor A/C"],
              ["Charged depreciation on machinery","Depreciation A/C","Machinery A/C"],
              ["GST paid on purchase","Input GST A/C","Cash A/C"],
              ["GST collected on sales","Cash A/C","Output GST A/C"],
              ["Discount allowed to customer","Discount Allowed A/C","Customer A/C"],
              ["Discount received from supplier","Supplier A/C","Discount Received A/C"],
              ["Paid advertising expenses","Advertisement A/C","Cash A/C"],
              ["Cash deposited into bank","Bank A/C","Cash A/C"],
              ["Cash withdrawn from bank","Cash A/C","Bank A/C"],
              ["Purchased goods and paid by cheque","Purchase A/C","Bank A/C"],
              ["Sold goods and received cheque","Bank A/C","Sales A/C"],
              ["Paid carriage on purchases","Carriage A/C","Cash A/C"],
              ["Received rent","Cash A/C","Rent Received A/C"],
              ["Written off preliminary expenses","P&L A/C","Preliminary Expenses A/C"],
            ].map(([t,d,c],i)=>(
              <tr key={i}>
                <td style={{color:"#9ca3af",fontSize:"11px",textAlign:"center"}}>{i+1}</td>
                <td style={{fontSize:"12px"}}>{t}</td>
                <td style={{color:"#1a3a8f",fontWeight:700,fontSize:"12px"}}>{d}</td>
                <td style={{color:"#8b0000",fontWeight:700,fontSize:"12px"}}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="ddiv"/>

      {/* Ch 10 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 10: Tally Prime Examples</h2>
      <p className="dp">In <strong>Tally Prime</strong>, journal entries are recorded using <strong>Vouchers</strong>. Each voucher type maps to a specific kind of transaction.</p>
      {([
        ["Purchase Voucher (F9)","Records all purchase transactions — goods bought for resale or raw materials.","Creditor A/C / Cash A/C","Purchase A/C + GST Input","#e8720c"],
        ["Sales Voucher (F8)","Records all sales transactions — goods sold to customers.","Sales A/C + GST Output","Debtor A/C / Cash A/C","#1a3a8f"],
        ["Payment Voucher (F5)","Records all cash or bank payments made by the business.","Expense/Asset A/C","Cash A/C / Bank A/C","#876a00"],
        ["Receipt Voucher (F6)","Records all cash or bank receipts received by the business.","Cash A/C / Bank A/C","Income/Debtor A/C","#8b0000"],
        ["Contra Voucher (F4)","Records fund transfers between cash and bank accounts.","Bank A/C","Cash A/C (or vice versa)","#1a3a8f"],
        ["Journal Voucher (F7)","Records adjustments, depreciation, bad debts, etc.","Various","Various","#e8720c"],
      ] as [string,string,string,string,string][]).map(([title,desc,dr,cr,color])=>(
        <div key={title} style={{borderRadius:"11px",border:`1.5px solid ${color}33`,padding:"14px 16px",marginBottom:"10px",background:`${color}08`}}>
          <div style={{fontWeight:800,color,marginBottom:"4px",fontSize:"14px"}}>{title}</div>
          <div style={{fontSize:"12.5px",color:"#6b7280",marginBottom:"8px"}}>{desc}</div>
          <div style={{display:"flex",gap:"12px",fontSize:"12px"}}>
            <span><strong style={{color:"#1a3a8f"}}>Dr:</strong> {dr}</span>
            <span><strong style={{color:"#8b0000"}}>Cr:</strong> {cr}</span>
          </div>
        </div>
      ))}

      <hr className="ddiv"/>

      {/* Ch 11 */}
      <h2 className="dh2"><span className="dh2-bar"/>Chapter 11: Practice Questions</h2>
      <p className="dp">Record journal entries for the following 30 transactions. Apply the golden rules for each.</p>
      <div className="dtw">
        <table className="dt">
          <thead><tr><th>#</th><th>Transaction</th><th className="tr">Amount (₹)</th></tr></thead>
          <tbody>
            {[
              ["Bought goods worth on credit from Suresh","25,000"],
              ["Started business with cash","1,00,000"],
              ["Deposited cash into bank","50,000"],
              ["Purchased furniture for cash","15,000"],
              ["Sold goods for cash","30,000"],
              ["Paid rent by cheque","8,000"],
              ["Received commission in cash","5,000"],
              ["Bought computer for office use","40,000"],
              ["Paid salary to staff","18,000"],
              ["Owner withdrew cash for personal use","10,000"],
              ["Received interest from bank","2,500"],
              ["Paid electricity bill in cash","3,200"],
              ["Sold goods on credit to Ramesh","20,000"],
              ["Paid insurance premium","4,000"],
              ["Took loan from SBI Bank","80,000"],
              ["Repaid part of bank loan","20,000"],
              ["Allowed discount to customer","1,500"],
              ["Received discount from supplier","2,000"],
              ["Charged depreciation on vehicle","6,000"],
              ["Written off bad debts","3,500"],
              ["Purchased raw materials on credit","35,000"],
              ["Goods returned to supplier","5,000"],
              ["Customer returned goods","4,000"],
              ["Paid advertising expenses","7,000"],
              ["Received rent from tenant","9,000"],
              ["Paid carriage on goods purchased","1,200"],
              ["Cash withdrawn from bank for petty cash","3,000"],
              ["Goods distributed as free samples","2,000"],
              ["Fire destroyed goods (loss)","8,000"],
              ["Paid advance to supplier","15,000"],
            ].map(([t,a],i)=>(
              <tr key={i}>
                <td style={{color:"#9ca3af",fontSize:"11px",textAlign:"center"}}>{i+1}</td>
                <td>{t}</td>
                <td className="tr" style={{color:"#1a3a8f",fontWeight:700}}>₹{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dban">
        <div className="bf">📘 Keep Practising!</div>
        <div className="bn">Master these 30 entries and you'll handle 90% of real accounting scenarios with confidence.</div>
      </div>
    </>
  );
}

/* ── Generic document renderer for all other notes ── */
function GenericDoc({ note }: { note: typeof notesData[0] }): ReactElement {
  const contentMap: Record<number, ReactElement> = {
    1: (
      <>
        <div className="dmeta">
          <span className="dmeta-item"><Clock size={12}/>{note.date}</span>
          <span className="dmeta-item"><Tag size={12}/>{note.categoryLabel}</span>
          <span className="dmeta-item">📖 {note.readTime}</span>
        </div>
        <h2 className="dh2"><span className="dh2-bar"/>Overview</h2>
        <p className="dp">GST (Goods and Services Tax) return filing is a mandatory process for all registered businesses in India. This guide covers the complete step-by-step process for GSTR-1 and GSTR-3B.</p>
        <span className="dh3 h3b">Types of GST Returns</span>
        <ul className="dl">
          {([["GSTR-1","Details of outward supplies (sales) — due 11th of next month"],["GSTR-3B","Summary return with tax payment — due 20th of next month"],["GSTR-9","Annual return — due 31st December"],["GSTR-9C","Reconciliation statement — due with GSTR-9"]] as [string,string][]).map(([t,d])=>(
            <li key={t}><span className="dd ddb">▸</span><span className="flex1"><strong>{t}:</strong> {d}</span></li>
          ))}
        </ul>
        <h2 className="dh2"><span className="dh2-bar"/>Step-by-Step Filing Process</h2>
        {[["Login to GST Portal","Visit www.gst.gov.in and login with your credentials"],["Select Return Period","Choose the tax period for which you want to file the return"],["Enter Invoice Details","Fill in all invoice details, HSN codes, and tax amounts"],["Review & Reconcile","Match with your books and ensure 100% accuracy"],["Submit & File","Submit the return and file using DSC or EVC"]].map(([title,desc],i)=>(
          <div className="dstep" key={title}><div className="dstep-n">{i+1}</div><div><div className="dstep-title">{title}</div><div className="dstep-desc">{desc}</div></div></div>
        ))}
        <div className="gnote-warn">
          <div className="dtip-t" style={{color:"#8b0000"}}>⚠️ Common Mistakes to Avoid</div>
          <ul className="dl" style={{marginTop:"6px"}}>
            {["Missing invoice entries","Incorrect HSN code selection","Tax calculation errors","Late filing — penalty applicable","Not reconciling with books"].map(m=>(
              <li key={m}><span className="dd ddr">!</span><span className="flex1">{m}</span></li>
            ))}
          </ul>
        </div>
        <div className="dtip">
          <div className="dtip-t">💡 Pro Tips</div>
          <ul>
            {["Maintain proper invoice records in Tally Prime","Use auto-populate feature for faster filing","Set reminders 3 days before deadline","Keep digital copies of all filed returns","Regularly reconcile ITC (Input Tax Credit)"].map(t=>(
              <li key={t}><span>✅</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </>
    ),
    2: (
      <>
        <div className="dmeta">
          <span className="dmeta-item"><Clock size={12}/>{note.date}</span>
          <span className="dmeta-item"><Tag size={12}/>{note.categoryLabel}</span>
          <span className="dmeta-item">📖 {note.readTime}</span>
        </div>
        <h2 className="dh2"><span className="dh2-bar"/>Essential Shortcuts</h2>
        <p className="dp">These keyboard shortcuts will drastically speed up your daily workflow in Tally Prime. Memorise the most-used ones first.</p>
        <span className="dh3 h3o">Navigation</span>
        <ul className="dl">
          {([["Alt+G","Go To — jump to any menu or report"],["Alt+F1","Detailed view of a report"],["Alt+F2","Change date range"],["Ctrl+Home","Go to first entry"],["Ctrl+End","Go to last entry"]] as [string,string][]).map(([k,v])=>(
            <li key={k}><span className="dd ddo">▸</span><span className="flex1"><strong><span className="code">{k}</span></strong> — {v}</span></li>
          ))}
        </ul>
        <span className="dh3 h3b">Create & Edit</span>
        <ul className="dl">
          {([["Alt+C","Create a new master on the fly"],["Alt+D","Delete a voucher or master"],["Alt+E","Export report"],["Alt+P","Print current report"],["Ctrl+A","Accept and save entry"]] as [string,string][]).map(([k,v])=>(
            <li key={k}><span className="dd ddb">▸</span><span className="flex1"><strong><span className="code">{k}</span></strong> — {v}</span></li>
          ))}
        </ul>
        <div className="dtip">
          <div className="dtip-t">💡 Productivity Tip</div>
          <ul><li><span>✦</span><span>Practice 5 shortcuts a day — within a week you'll cut entry time by 40%.</span></li></ul>
        </div>
      </>
    ),
    4: (
      <>
        <div className="dmeta">
          <span className="dmeta-item"><Clock size={12}/>{note.date}</span>
          <span className="dmeta-item"><Tag size={12}/>{note.categoryLabel}</span>
          <span className="dmeta-item">📖 {note.readTime}</span>
        </div>
        <h2 className="dh2"><span className="dh2-bar"/>The Golden Rules</h2>
        <div className="dcall">
          <div className="dcall-lb">Rule 1 — Real Account</div>
          <div className="dcall-f">Debit what comes in · Credit what goes out</div>
        </div>
        <div className="dcall">
          <div className="dcall-lb">Rule 2 — Personal Account</div>
          <div className="dcall-f">Debit the receiver · Credit the giver</div>
        </div>
        <div className="dcall">
          <div className="dcall-lb">Rule 3 — Nominal Account</div>
          <div className="dcall-f">Debit all expenses & losses · Credit all incomes & gains</div>
        </div>
        <h2 className="dh2"><span className="dh2-bar"/>Common Journal Entries</h2>
        <div className="dtw">
          <table className="dt">
            <thead><tr><th>Transaction</th><th>Debit</th><th>Credit</th></tr></thead>
            <tbody>
              {[["Cash received from customer","Cash A/c","Customer A/c"],["Purchased goods for cash","Purchase A/c","Cash A/c"],["Paid rent","Rent A/c","Cash A/c"],["Goods sold on credit","Customer A/c","Sales A/c"],["Depreciation charged","Depreciation A/c","Asset A/c"]].map(([t,d,c])=>(
                <tr key={t}><td>{t}</td><td style={{color:"#1a3a8f",fontWeight:700}}>{d}</td><td style={{color:"#8b0000",fontWeight:700}}>{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  };
  return contentMap[note.id] ?? (
    <div style={{padding:"32px 0",textAlign:"center",color:"#9ca3af"}}>
      <div style={{fontSize:"32px",marginBottom:"12px"}}>📄</div>
      <div style={{fontWeight:700,marginBottom:"6px"}}>{note.title}</div>
      <div style={{fontSize:"13px"}}>{note.description}</div>
    </div>
  );
}

/* ── Main viewer component ── */
function NoteViewer() {
  const navigate  = useNavigate();
  const { noteId } = Route.useParams();
  const id   = parseInt(noteId, 10);
  const note = notesData.find(n => n.id === id);

  if (!note) {
    return (
      <AppShell>
        <div className="pt-20 text-center py-20">
          <p className="text-lg font-bold">Note not found</p>
          <button onClick={() => navigate({ to: "/notes" })} className="mt-4 px-4 py-2 rounded-xl glass text-sm font-semibold">← Back</button>
        </div>
      </AppShell>
    );
  }

  const DocComponent = noteDocuments[id];

  return (
    <AppShell>
      <style>{S}</style>

      {/* Sticky reader toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-3 border-b border-border bg-background/90 backdrop-blur-xl" style={{height:"50px"}}>
        <button onClick={() => navigate({ to: "/notes" })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass hover:bg-accent transition-colors text-sm font-semibold flex-shrink-0">
          <ArrowLeft size={14}/> Notes
        </button>
        <span className="text-sm font-bold text-muted-foreground truncate">{note.title}</span>
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {note.isFavorite && <Star size={14} className="text-yellow-500 fill-yellow-500"/>}
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold hidden sm:block">{note.readTime}</span>
        </div>
      </div>

      {/* Document canvas — paper-like, centered, scrollable */}
      <div className="pt-[50px] min-h-screen" style={{background:"var(--color-background)"}}>
        <div className="max-w-[680px] mx-auto px-5 py-10 doc">
          {DocComponent ? <DocComponent /> : <GenericDoc note={note}/>}
          <div className="dfooter">
            {note.title.toUpperCase()}&nbsp;·&nbsp;{note.categoryLabel.toUpperCase()}&nbsp;·&nbsp;TALLY ACCOUNTING HUB PRO
          </div>
        </div>
      </div>
    </AppShell>
  );
}
