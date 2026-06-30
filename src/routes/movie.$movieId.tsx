import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MOVIES } from "@/lib/moviesData";
import {
  Play, ArrowLeft, Star, Clock, Globe,
  Calendar, User, Film, Users,
} from "lucide-react";

export const Route = createFileRoute("/movie/$movieId")({
  component: MovieDetail,
});

function MovieDetail() {
  const { movieId } = Route.useParams();
  const navigate    = useNavigate();
  const movie       = MOVIES.find(m => m.id === movieId);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#141414" }}>
        <Film className="h-16 w-16 text-gray-600 mb-4" />
        <p className="text-white text-lg font-bold">Movie not found</p>
        <button onClick={() => navigate({ to: "/entertainment" })}
          className="mt-4 px-5 py-2 rounded bg-red-600 text-white text-sm font-bold">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#141414" }}>

      {/* ── Hero thumbnail ── */}
      <div className="relative w-full" style={{ height: "55vw", maxHeight: 320, minHeight: 200 }}>
        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />

        {/* Gradients */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #141414 0%, rgba(20,20,20,0.4) 50%, transparent 80%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(20,20,20,0.7) 0%, transparent 60%)" }} />

        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/entertainment" })}
          className="absolute top-4 left-4 h-9 w-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.65)" }}>
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-black">{movie.rating}</span>
          <span className="text-gray-400 text-[10px]">IMDb</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">

        {/* Genre + year */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-red-500 text-xs font-black uppercase tracking-widest">{movie.genre}</span>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-400 text-xs">{movie.year}</span>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-400 text-xs">{movie.language}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-white leading-tight mb-3">{movie.title}</h1>

        {/* Play Now button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-black text-black mb-4"
          style={{ background: "white" }}
        >
          <Play className="h-5 w-5 fill-black" />
          Play Now
        </motion.button>

        {/* Quick info row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: Clock,    label: "Duration",  value: movie.duration    },
            { icon: Globe,    label: "Language",  value: movie.language    },
            { icon: Calendar, label: "Released",  value: movie.year        },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-3 rounded-xl"
              style={{ background: "#1f1f1f" }}>
              <Icon className="h-4 w-4 text-red-500 mb-1" />
              <p className="text-[10px] text-gray-500 font-semibold">{label}</p>
              <p className="text-xs text-white font-bold text-center">{value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-5">
          <h2 className="text-base font-black text-white mb-2">Storyline</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{movie.desc}</p>
        </div>

        {/* Movie info */}
        <div className="rounded-2xl p-4 mb-5 space-y-3" style={{ background: "#1f1f1f" }}>
          <h2 className="text-base font-black text-white mb-3">Movie Details</h2>

          <div className="flex gap-3">
            <Film className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Director</p>
              <p className="text-sm text-white font-bold">{movie.director}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Release Date</p>
              <p className="text-sm text-white font-bold">{movie.releaseDate}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Globe className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Studio / Production</p>
              <p className="text-sm text-white font-bold">{movie.studio}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Duration</p>
              <p className="text-sm text-white font-bold">{movie.duration}</p>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-black text-white">Cast</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map(actor => (
              <div key={actor}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#1f1f1f" }}>
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#e50914,#b81d24)" }}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-white font-semibold">{actor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* More like this */}
        <div className="mb-4">
          <h2 className="text-base font-black text-white mb-3">More Like This</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {MOVIES.filter(m => m.id !== movie.id && m.genre === movie.genre).slice(0, 4).map(m => (
              <motion.button key={m.id} whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ to: "/movie/$movieId", params: { movieId: m.id } })}
                className="flex-shrink-0 rounded-xl overflow-hidden relative"
                style={{ width: 110, height: 160 }}>
                <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />
              </motion.button>
            ))}
            {MOVIES.filter(m => m.id !== movie.id && m.genre !== movie.genre).slice(0, 2).map(m => (
              <motion.button key={m.id} whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ to: "/movie/$movieId", params: { movieId: m.id } })}
                className="flex-shrink-0 rounded-xl overflow-hidden relative"
                style={{ width: 110, height: 160 }}>
                <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
