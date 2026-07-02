import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Radio, Search } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import type { Sport } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type FormState = {
  sport: "cricket" | "football";
  teamA: string; teamB: string;
  scoreA: string; scoreB: string;
  status: string; isLive: boolean; extraInfo: string;
};

const EMPTY: FormState = {
  sport: "cricket", teamA: "", teamB: "",
  scoreA: "", scoreB: "", status: "",
  isLive: false, extraInfo: "",
};

export function AdminSports() {
  const { sports, addSport, updateSport, deleteSport } = useData();

  const [search,       setSearch]       = useState("");
  const [filterSport,  setFilterSport]  = useState<"all" | "cricket" | "football">("all");
  const [isAddOpen,    setIsAddOpen]    = useState(false);
  const [editMatch,    setEditMatch]    = useState<Sport | null>(null);
  const [form,         setForm]         = useState<FormState>({ ...EMPTY });

  const filtered = sports.filter(m => {
    const q = search.toLowerCase();
    return (m.teamA.toLowerCase().includes(q) || m.teamB.toLowerCase().includes(q))
      && (filterSport === "all" || m.sport === filterSport);
  });

  const reset = () => { setForm({ ...EMPTY }); setEditMatch(null); };

  const handleAdd = async () => {
    if (!form.teamA.trim() || !form.teamB.trim()) { toast.error("Enter both team names"); return; }
    await addSport({ ...form, status: form.status || "Upcoming" });
    toast.success("Match added!"); reset(); setIsAddOpen(false);
  };

  const openEdit = (m: Sport) => {
    setEditMatch(m);
    setForm({ sport: m.sport as any, teamA: m.teamA, teamB: m.teamB,
      scoreA: m.scoreA, scoreB: m.scoreB, status: m.status,
      isLive: m.isLive, extraInfo: m.extraInfo || "" });
  };

  const handleUpdate = async () => {
    if (!editMatch) return;
    await updateSport(editMatch.id, { ...form });
    toast.success("Match updated!"); reset();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this match?")) return;
    await deleteSport(id); toast.success("Match deleted.");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search teams…" value={search}
            onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl glass border-0" />
        </div>
        <Select value={filterSport} onValueChange={(v: any) => setFilterSport(v)}>
          <SelectTrigger className="w-[130px] rounded-xl glass border-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="cricket">Cricket</SelectItem>
            <SelectItem value="football">Football</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddOpen} onOpenChange={o => { setIsAddOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
              <Plus className="h-4 w-4 mr-1.5" /> Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Add Match</DialogTitle>
              <DialogDescription>Add a new sports fixture</DialogDescription>
            </DialogHeader>
            <MatchForm form={form} setForm={setForm} onSubmit={handleAdd}
              onCancel={() => { setIsAddOpen(false); reset(); }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total",    value: sports.length,                     color: "text-primary" },
          { label: "Live",     value: sports.filter(s => s.isLive).length, color: "text-destructive" },
          { label: "Cricket",  value: sports.filter(s => s.sport === "cricket").length, color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl glass p-3 text-center shadow-card">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Match cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 rounded-2xl glass">
          <p className="font-bold text-muted-foreground">No matches found</p>
          <p className="text-xs text-muted-foreground mt-1">Add a match using the button above.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((match, idx) => (
            <motion.div key={match.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {match.sport === "cricket" ? "🏏" : "⚽"} {match.sport}
                </span>
                <div className="flex items-center gap-2">
                  {match.isLive
                    ? <span className="flex items-center gap-1 text-[10px] font-bold text-destructive"><Radio className="h-3 w-3 animate-pulse" /> LIVE</span>
                    : <span className="text-[10px] font-bold text-muted-foreground">{match.status}</span>
                  }
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg"
                        onClick={() => openEdit(match)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black">Edit Match</DialogTitle>
                        <DialogDescription>Update match info</DialogDescription>
                      </DialogHeader>
                      <MatchForm form={form} setForm={setForm} onSubmit={handleUpdate}
                        onCancel={() => reset()} />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="ghost"
                    className="h-7 w-7 p-0 rounded-lg text-destructive hover:text-destructive"
                    onClick={() => handleDelete(match.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                  <p className="text-sm font-black">{match.teamA}</p>
                  <p className="text-lg font-black text-gradient">{match.scoreA || "—"}</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground">VS</span>
                <div className="text-right">
                  <p className="text-sm font-black">{match.teamB}</p>
                  <p className="text-lg font-black text-gradient">{match.scoreB || "—"}</p>
                </div>
              </div>
              {match.extraInfo && (
                <p className="mt-2 text-center text-[11px] text-muted-foreground">{match.extraInfo}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchForm({ form, setForm, onSubmit, onCancel }: {
  form: FormState; setForm: (f: FormState) => void;
  onSubmit: () => void; onCancel: () => void;
}) {
  const f = form;
  const s = (p: Partial<FormState>) => setForm({ ...f, ...p });
  return (
    <div className="space-y-4">
      <div>
        <Label>Sport</Label>
        <Select value={f.sport} onValueChange={v => s({ sport: v as any })}>
          <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cricket">🏏 Cricket</SelectItem>
            <SelectItem value="football">⚽ Football</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Team A</Label><Input value={f.teamA} onChange={e => s({ teamA: e.target.value })} className="mt-1.5 rounded-xl" placeholder="India" /></div>
        <div><Label>Team B</Label><Input value={f.teamB} onChange={e => s({ teamB: e.target.value })} className="mt-1.5 rounded-xl" placeholder="Nepal" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Score A</Label><Input value={f.scoreA} onChange={e => s({ scoreA: e.target.value })} className="mt-1.5 rounded-xl" placeholder="248/6" /></div>
        <div><Label>Score B</Label><Input value={f.scoreB} onChange={e => s({ scoreB: e.target.value })} className="mt-1.5 rounded-xl" placeholder="201/8" /></div>
      </div>
      <div><Label>Status</Label><Input value={f.status} onChange={e => s({ status: e.target.value })} className="mt-1.5 rounded-xl" placeholder="LIVE / Upcoming / HT" /></div>
      <div><Label>Extra Info</Label><Input value={f.extraInfo} onChange={e => s({ extraInfo: e.target.value })} className="mt-1.5 rounded-xl" placeholder="42.3 ov  or  78'" /></div>
      <div className="flex items-center justify-between rounded-xl glass p-3">
        <Label className="cursor-pointer">Live Match</Label>
        <Switch checked={f.isLive} onCheckedChange={v => s({ isLive: v })} />
      </div>
      <div className="flex gap-2 pt-1">
        <Button onClick={onSubmit} className="flex-1 rounded-xl gradient-hero text-white shadow-glow">Save Match</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl">Cancel</Button>
      </div>
    </div>
  );
}
