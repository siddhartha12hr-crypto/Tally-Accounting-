import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Radio, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Match {
  id: string;
  sport: "cricket" | "football";
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
  isLive: boolean;
  extraInfo?: string;
}

export function AdminSports() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      sport: "cricket",
      teamA: "India",
      teamB: "Nepal",
      scoreA: "248/6",
      scoreB: "201/8",
      status: "LIVE",
      isLive: true,
      extraInfo: "42.3 ov",
    },
    {
      id: "2",
      sport: "cricket",
      teamA: "Mumbai",
      teamB: "Chennai",
      scoreA: "186/4",
      scoreB: "—",
      status: "1st Innings",
      isLive: true,
      extraInfo: "18.2 ov",
    },
    {
      id: "3",
      sport: "football",
      teamA: "Mohun Bagan",
      teamB: "Bengaluru FC",
      scoreA: "2",
      scoreB: "1",
      status: "LIVE",
      isLive: true,
      extraInfo: "78'",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState<"all" | "cricket" | "football">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    sport: "cricket" as "cricket" | "football",
    teamA: "",
    teamB: "",
    scoreA: "",
    scoreB: "",
    status: "",
    isLive: false,
    extraInfo: "",
  });

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.teamB.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = filterSport === "all" || match.sport === filterSport;
    return matchesSearch && matchesSport;
  });

  const handleAdd = () => {
    const newMatch: Match = {
      id: Date.now().toString(),
      ...formData,
    };
    setMatches([...matches, newMatch]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      sport: match.sport,
      teamA: match.teamA,
      teamB: match.teamB,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
      status: match.status,
      isLive: match.isLive,
      extraInfo: match.extraInfo || "",
    });
  };

  const handleUpdate = () => {
    if (editingMatch) {
      setMatches(matches.map(m => 
        m.id === editingMatch.id ? { ...m, ...formData } : m
      ));
      resetForm();
      setEditingMatch(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this match?")) {
      setMatches(matches.filter(m => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      sport: "cricket",
      teamA: "",
      teamB: "",
      scoreA: "",
      scoreB: "",
      status: "",
      isLive: false,
      extraInfo: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl glass border-0"
          />
        </div>
        <Select value={filterSport} onValueChange={(value: any) => setFilterSport(value)}>
          <SelectTrigger className="w-[140px] rounded-xl glass border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="cricket">Cricket</SelectItem>
            <SelectItem value="football">Football</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Add New Match</DialogTitle>
              <DialogDescription>Add a new sports match or fixture</DialogDescription>
            </DialogHeader>
            <MatchForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleAdd}
              onCancel={() => { setIsAddOpen(false); resetForm(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Matches List */}
      <div className="grid gap-3">
        {filteredMatches.map((match, idx) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl glass p-4 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                {match.sport === "cricket" ? "🏏" : "⚽"} {match.sport}
              </span>
              <div className="flex items-center gap-2">
                {match.isLive && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive">
                    <Radio className="h-3 w-3 animate-pulse" /> {match.status}
                  </span>
                )}
                {!match.isLive && (
                  <span className="text-[10px] font-bold text-muted-foreground">{match.status}</span>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 rounded-lg"
                      onClick={() => handleEdit(match)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Edit Match</DialogTitle>
                      <DialogDescription>Update match information</DialogDescription>
                    </DialogHeader>
                    <MatchForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSubmit={handleUpdate}
                      onCancel={() => { setEditingMatch(null); resetForm(); }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded-lg text-destructive hover:text-destructive"
                  onClick={() => handleDelete(match.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <p className="text-sm font-black">{match.teamA}</p>
                <p className="text-lg font-black text-gradient">{match.scoreA}</p>
              </div>
              <span className="text-xs font-bold text-muted-foreground">VS</span>
              <div className="text-right">
                <p className="text-sm font-black">{match.teamB}</p>
                <p className="text-lg font-black text-gradient">{match.scoreB}</p>
              </div>
            </div>

            {match.extraInfo && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground">{match.extraInfo}</p>
            )}
          </motion.div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      )}
    </div>
  );
}

function MatchForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sport">Sport</Label>
        <Select value={formData.sport} onValueChange={(value: any) => setFormData({ ...formData, sport: value })}>
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cricket">Cricket</SelectItem>
            <SelectItem value="football">Football</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="teamA">Team A</Label>
          <Input
            id="teamA"
            value={formData.teamA}
            onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="Team A"
          />
        </div>
        <div>
          <Label htmlFor="teamB">Team B</Label>
          <Input
            id="teamB"
            value={formData.teamB}
            onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="Team B"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="scoreA">Score A</Label>
          <Input
            id="scoreA"
            value={formData.scoreA}
            onChange={(e) => setFormData({ ...formData, scoreA: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="248/6 or 2"
          />
        </div>
        <div>
          <Label htmlFor="scoreB">Score B</Label>
          <Input
            id="scoreB"
            value={formData.scoreB}
            onChange={(e) => setFormData({ ...formData, scoreB: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="201/8 or 1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="LIVE, Upcoming, Completed, etc."
        />
      </div>
      <div>
        <Label htmlFor="extraInfo">Extra Info (Optional)</Label>
        <Input
          id="extraInfo"
          value={formData.extraInfo}
          onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="42.3 ov or 78'"
        />
      </div>
      <div className="flex items-center justify-between rounded-xl glass p-3">
        <Label htmlFor="isLive" className="cursor-pointer">Live Match</Label>
        <Switch
          id="isLive"
          checked={formData.isLive}
          onCheckedChange={(checked) => setFormData({ ...formData, isLive: checked })}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={onSubmit} className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
          Save Match
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl">
          Cancel
        </Button>
      </div>
    </div>
  );
}
