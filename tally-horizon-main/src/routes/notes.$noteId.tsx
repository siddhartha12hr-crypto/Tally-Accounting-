import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { 
  ArrowLeft, Star, Share2, Download, Edit, Trash2, 
  Clock, Tag, Bookmark, MoreVertical, Copy, Printer
} from "lucide-react";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteViewer,
});

function NoteViewer() {
  const navigate = useNavigate();
  const { noteId } = Route.useParams();

  // Sample note content with rich HTML
  const noteContent = `
    <div class="note-content">
      <h2 class="note-title">GST Return Filing Process</h2>
      
      <div class="note-meta">
        <span class="meta-item">📅 Created: June 20, 2026</span>
        <span class="meta-item">⏱️ Last Updated: 2 days ago</span>
        <span class="meta-item">📖 5 min read</span>
      </div>

      <div class="note-section">
        <h3>📋 Overview</h3>
        <p>GST (Goods and Services Tax) return filing is a mandatory process for all registered businesses in India. This guide covers the complete step-by-step process.</p>
      </div>

      <div class="note-section">
        <h3>🔢 Types of GST Returns</h3>
        <ul class="note-list">
          <li><strong>GSTR-1:</strong> Details of outward supplies (sales)</li>
          <li><strong>GSTR-3B:</strong> Summary return with tax payment</li>
          <li><strong>GSTR-9:</strong> Annual return</li>
          <li><strong>GSTR-9C:</strong> Reconciliation statement</li>
        </ul>
      </div>

      <div class="note-section highlight-box">
        <h4>⚡ Important Deadlines</h4>
        <table class="note-table">
          <tr>
            <td><strong>GSTR-1</strong></td>
            <td>11th of next month</td>
          </tr>
          <tr>
            <td><strong>GSTR-3B</strong></td>
            <td>20th of next month</td>
          </tr>
          <tr>
            <td><strong>GSTR-9</strong></td>
            <td>31st December (Annual)</td>
          </tr>
        </table>
      </div>

      <div class="note-section">
        <h3>📝 Step-by-Step Filing Process</h3>
        
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Login to GST Portal</h4>
            <p>Visit <code>www.gst.gov.in</code> and login with credentials</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Select Return Period</h4>
            <p>Choose the tax period for which you want to file the return</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Enter Invoice Details</h4>
            <p>Fill in all invoice details, HSN codes, and tax amounts</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>Review & Reconcile</h4>
            <p>Match with your books and ensure 100% accuracy</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">5</div>
          <div class="step-content">
            <h4>Submit & File</h4>
            <p>Submit the return and file using DSC or EVC</p>
          </div>
        </div>
      </div>

      <div class="note-section">
        <h3>⚠️ Common Mistakes to Avoid</h3>
        <div class="warning-box">
          <ul class="note-list">
            <li>Missing invoice entries</li>
            <li>Incorrect HSN code selection</li>
            <li>Tax calculation errors</li>
            <li>Late filing (penalty applicable)</li>
            <li>Not reconciling with books</li>
          </ul>
        </div>
      </div>

      <div class="note-section">
        <h3>💡 Pro Tips</h3>
        <div class="tip-box">
          <p>✅ Maintain proper invoice records in Tally Prime</p>
          <p>✅ Use auto-populate feature for faster filing</p>
          <p>✅ Set reminders 3 days before deadline</p>
          <p>✅ Keep digital copies of all filed returns</p>
          <p>✅ Regularly reconcile ITC (Input Tax Credit)</p>
        </div>
      </div>

      <div class="note-section">
        <h3>🔗 Related Topics</h3>
        <div class="related-links">
          <a href="#" class="related-link">GST Registration Process</a>
          <a href="#" class="related-link">Input Tax Credit Rules</a>
          <a href="#" class="related-link">Reverse Charge Mechanism</a>
          <a href="#" class="related-link">E-Way Bill Generation</a>
        </div>
      </div>

      <div class="note-footer">
        <p><strong>Tags:</strong> GST, Returns, Filing, Tax, Compliance</p>
        <p><strong>Category:</strong> GST & Tax</p>
      </div>
    </div>
  `;

  return (
    <AppShell>
      <div className="pt-20 pb-6">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate({ to: "/notes" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-accent transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl glass hover:bg-accent transition-colors flex items-center justify-center">
              <Star className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-xl glass hover:bg-accent transition-colors flex items-center justify-center">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-xl glass hover:bg-accent transition-colors flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-xl glass hover:bg-accent transition-colors flex items-center justify-center">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Note Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 shadow-elegant mb-6"
        >
          <div 
            dangerouslySetInnerHTML={{ __html: noteContent }}
            className="prose prose-slate dark:prose-invert max-w-none"
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-accent transition-colors font-bold">
            <Edit className="h-5 w-5" />
            Edit Note
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-accent transition-colors font-bold">
            <Download className="h-5 w-5" />
            Download
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-accent transition-colors font-bold">
            <Printer className="h-5 w-5" />
            Print
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-accent transition-colors font-bold">
            <Copy className="h-5 w-5" />
            Duplicate
          </button>
        </div>

        {/* Delete Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass hover:bg-destructive/10 transition-colors font-bold text-destructive">
          <Trash2 className="h-5 w-5" />
          Delete Note
        </button>
      </div>

      {/* Custom Styles for Note Content */}
      <style>{`
        .note-content {
          color: var(--color-foreground);
        }

        .note-title {
          font-size: 1.75rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: var(--gradient-hero);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .note-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .meta-item {
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          font-weight: 600;
        }

        .note-section {
          margin-bottom: 2rem;
        }

        .note-section h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }

        .note-section h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .note-section p {
          line-height: 1.7;
          margin-bottom: 1rem;
          color: var(--color-foreground);
        }

        .note-list {
          list-style: none;
          padding: 0;
        }

        .note-list li {
          padding: 0.75rem 0;
          padding-left: 1.5rem;
          position: relative;
          border-bottom: 1px solid var(--color-border);
        }

        .note-list li:before {
          content: "▸";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: bold;
        }

        .note-list li strong {
          color: var(--color-primary);
        }

        code {
          background: var(--color-muted);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: var(--color-primary);
        }

        .highlight-box {
          background: linear-gradient(135deg, oklch(0.78 0.18 60 / 0.1), oklch(0.6 0.22 35 / 0.1));
          border-left: 4px solid var(--color-primary);
          padding: 1.5rem;
          border-radius: 1rem;
        }

        .warning-box {
          background: linear-gradient(135deg, oklch(0.55 0.22 28 / 0.1), oklch(0.5 0.22 25 / 0.05));
          border-left: 4px solid var(--color-destructive);
          padding: 1.5rem;
          border-radius: 1rem;
        }

        .tip-box {
          background: linear-gradient(135deg, oklch(0.88 0.14 90 / 0.15), oklch(0.72 0.17 65 / 0.1));
          border-left: 4px solid var(--color-gold);
          padding: 1.5rem;
          border-radius: 1rem;
        }

        .tip-box p {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .note-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .note-table tr {
          border-bottom: 1px solid var(--color-border);
        }

        .note-table td {
          padding: 0.75rem;
        }

        .note-table td:first-child {
          font-weight: 600;
        }

        .step-card {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 1rem;
          background: var(--gradient-glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--color-border);
        }

        .step-number {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          background: var(--gradient-saffron);
          color: white;
          font-weight: 900;
          font-size: 1.125rem;
        }

        .step-content h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .step-content p {
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin: 0;
        }

        .related-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .related-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          background: var(--gradient-glass);
          border: 1px solid var(--color-border);
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .related-link:hover {
          background: var(--color-primary);
          color: white;
          transform: translateY(-2px);
        }

        .note-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid var(--color-border);
        }

        .note-footer p {
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
          margin-bottom: 0.5rem;
        }

        .note-footer strong {
          color: var(--color-foreground);
        }
      `}</style>
    </AppShell>
  );
}
