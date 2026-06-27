import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  description: string;
  thumbnail: string;
  url: string;
  year: string;
  duration: string;
}

export function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: "1",
      title: "Pathaan",
      genre: "Action",
      rating: 8.2,
      description: "A spy thriller with breathtaking action.",
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      url: "https://example.com/pathaan",
      year: "2023",
      duration: "2h 26m",
    },
    {
      id: "2",
      title: "3 Idiots",
      genre: "Comedy/Drama",
      rating: 9.1,
      description: "An iconic story of friendship and dreams.",
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400",
      url: "https://example.com/3idiots",
      year: "2009",
      duration: "2h 50m",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: 0,
    description: "",
    thumbnail: "",
    url: "",
    year: "",
    duration: "",
  });

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Thriller",
    "Romance",
    "Horror",
    "Sci-Fi",
    "Documentary",
    "Animation",
    "Musical",
  ];

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const newMovie: Movie = {
      id: Date.now().toString(),
      ...formData,
    };
    setMovies([...movies, newMovie]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      description: movie.description,
      thumbnail: movie.thumbnail,
      url: movie.url,
      year: movie.year,
      duration: movie.duration,
    });
  };

  const handleUpdate = () => {
    if (editingMovie) {
      setMovies(movies.map(m => 
        m.id === editingMovie.id ? { ...m, ...formData } : m
      ));
      resetForm();
      setEditingMovie(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      genre: "",
      rating: 0,
      description: "",
      thumbnail: "",
      url: "",
      year: "",
      duration: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl glass border-0"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Add New Movie</DialogTitle>
              <DialogDescription>Add a new movie to the entertainment library</DialogDescription>
            </DialogHeader>
            <MovieForm 
              formData={formData} 
              setFormData={setFormData} 
              genres={genres}
              onSubmit={handleAdd}
              onCancel={() => { setIsAddOpen(false); resetForm(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMovies.map((movie, idx) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl glass shadow-card overflow-hidden group"
          >
            <div className="relative aspect-[2/3] bg-gradient-hero overflow-hidden">
              {movie.thumbnail && (
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white">
                <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" /> {movie.rating}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-[10px] uppercase tracking-widest opacity-80">{movie.genre}</p>
                <h4 className="text-sm font-black leading-tight line-clamp-2">{movie.title}</h4>
                <p className="text-[10px] opacity-70 mt-1">{movie.year} • {movie.duration}</p>
              </div>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handleEdit(movie)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Edit Movie</DialogTitle>
                      <DialogDescription>Update movie information</DialogDescription>
                    </DialogHeader>
                    <MovieForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      genres={genres}
                      onSubmit={handleUpdate}
                      onCancel={() => { setEditingMovie(null); resetForm(); }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-lg"
                  onClick={() => handleDelete(movie.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground line-clamp-2">{movie.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <p className="text-muted-foreground">No movies found</p>
        </div>
      )}
    </div>
  );
}

function MovieForm({ 
  formData, 
  setFormData, 
  genres, 
  onSubmit, 
  onCancel 
}: {
  formData: any;
  setFormData: (data: any) => void;
  genres: string[];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter movie title"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
            <SelectTrigger className="mt-1.5 rounded-xl">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
            className="mt-1.5 rounded-xl"
            placeholder="0.0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="2023"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="2h 26m"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter movie description"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="url">Movie URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={onSubmit} className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
          Save Movie
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl">
          Cancel
        </Button>
      </div>
    </div>
  );
}
