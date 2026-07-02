/**
 * ============================================================
 * DATA CONTEXT — Global state with Supabase + localStorage fallback
 *
 * When VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set in .env,
 * all CRUD operations go to Supabase.
 * Without them the app works offline via localStorage (dev mode).
 * ============================================================
 */

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* ─── Types ─────────────────────────────────────────────── */
export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  rating: number;
  students: string;
  description: string;
  thumbnail: string;
  category: string;
  price: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  url: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
  price: string;
}

export interface Sport {
  id: string;
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
  isLive: boolean;
  extraInfo?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  year: string;
  duration: string;
  genre: string;
  rating: number;
  thumbnail: string;
  videoUrl: string;
  language: string;
  director?: string;
  cast?: string[];
}

export interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  pdfUrl: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readingTime: string;
  pageCount: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: "published" | "draft";
}

/* ─── Stats type (for dashboard) ────────────────────────── */
export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalCourses: number;
  totalMovies: number;
  totalNotes: number;
  totalSports: number;
}

/* ─── Context type ───────────────────────────────────────── */
interface DataContextType {
  courses:   Course[];
  videos:    Video[];
  sports:    Sport[];
  movies:    Movie[];
  notes:     Note[];
  stats:     AdminStats;
  isLoading: boolean;

  // Courses
  addCourse:    (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  // Videos
  addVideo:    (video: Omit<Video, "id" | "views" | "uploadDate">) => Promise<void>;
  updateVideo: (id: string, data: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  // Sports
  addSport:    (sport: Omit<Sport, "id">) => Promise<void>;
  updateSport: (id: string, data: Partial<Sport>) => Promise<void>;
  deleteSport: (id: string) => Promise<void>;
  // Movies
  addMovie:    (movie: Omit<Movie, "id">) => Promise<void>;
  updateMovie: (id: string, data: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  // Notes
  addNote:    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  // Refresh
  refresh: () => Promise<void>;
}

/* ─── localStorage helpers ───────────────────────────────── */
const KEYS = {
  COURSES: "tally_courses",
  VIDEOS:  "tally_videos",
  SPORTS:  "tally_sports",
  MOVIES:  "tally_movies",
  NOTES:   "tally_notes",
};

function load<T>(key: string, fallback: T): T {
  try {
    const v = typeof localStorage !== "undefined" && localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function save<T>(key: string, value: T) {
  try { if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* quota exceeded — ignore */ }
}

/* ─── Supabase row ↔ App model mappers ───────────────────── */
function dbVideo(r: any): Video {
  return {
    id: r.id, title: r.title, description: r.description ?? "",
    category: r.category, duration: r.duration ?? "—",
    url: r.url, thumbnail: r.thumbnail ?? "",
    views: r.views ?? 0, uploadDate: r.upload_date ?? "",
    price: r.price ?? "Free",
  };
}
function dbCourse(r: any): Course {
  return {
    id: r.id, title: r.title, instructor: r.instructor,
    description: r.description ?? "", duration: r.duration ?? "—",
    lessons: r.lessons ?? 0, rating: r.rating ?? 0,
    students: r.students ?? "0", thumbnail: r.thumbnail ?? "",
    category: r.category, price: r.price ?? "Free",
  };
}
function dbMovie(r: any): Movie {
  return {
    id: r.id, title: r.title, description: r.description ?? "",
    year: r.year ?? "", duration: r.duration ?? "",
    genre: r.genre, rating: r.rating ?? 0,
    thumbnail: r.poster ?? r.thumbnail ?? "",
    videoUrl: r.video_url ?? "", language: r.language ?? "",
    director: r.director, cast: r.cast,
  };
}
function dbSport(r: any): Sport {
  return {
    id: r.id, sport: r.sport,
    teamA: r.team_a, teamB: r.team_b,
    scoreA: r.score_a ?? "—", scoreB: r.score_b ?? "—",
    status: r.status, isLive: r.is_live ?? false,
    extraInfo: r.extra_info,
  };
}
function dbNote(r: any): Note {
  return {
    id: r.id, title: r.title, description: r.description ?? "",
    category: r.category, thumbnailUrl: r.thumbnail_url ?? "",
    pdfUrl: r.pdf_url, tags: r.tags ?? [],
    difficulty: r.difficulty ?? "Beginner",
    readingTime: r.reading_time ?? "—",
    pageCount: r.page_count ?? 0, author: r.author ?? "",
    createdAt: r.created_at, updatedAt: r.updated_at,
    status: r.status ?? "draft",
  };
}

/* ─── Context ────────────────────────────────────────────── */
const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses,   setCourses]   = useState<Course[]>(() => load(KEYS.COURSES, []));
  const [videos,    setVideos]    = useState<Video[]>(() => load(KEYS.VIDEOS, []));
  const [sports,    setSports]    = useState<Sport[]>(() => load(KEYS.SPORTS, []));
  const [movies,    setMovies]    = useState<Movie[]>(() => load(KEYS.MOVIES, []));
  const [notes,     setNotes]     = useState<Note[]>(() => load(KEYS.NOTES, []));
  const [isLoading, setIsLoading] = useState(false);

  /* ── Derived stats ── */
  const stats: AdminStats = {
    totalUsers:   0,        // fetched separately if needed
    totalVideos:  videos.length,
    totalCourses: courses.length,
    totalMovies:  movies.length,
    totalNotes:   notes.length,
    totalSports:  sports.length,
  };

  /* ── Supabase fetch ── */
  const fetchFromSupabase = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const [vRes, cRes, mRes, sRes, nRes] = await Promise.all([
        supabase.from("videos").select("*").order("created_at", { ascending: false }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("movies").select("*").order("created_at", { ascending: false }),
        supabase.from("sports").select("*").order("created_at", { ascending: false }),
        supabase.from("notes").select("*").order("created_at", { ascending: false }),
      ]);

      if (vRes.data) { const d = vRes.data.map(dbVideo);  setVideos(d);  save(KEYS.VIDEOS,  d); }
      if (cRes.data) { const d = cRes.data.map(dbCourse); setCourses(d); save(KEYS.COURSES, d); }
      if (mRes.data) { const d = mRes.data.map(dbMovie);  setMovies(d);  save(KEYS.MOVIES,  d); }
      if (sRes.data) { const d = sRes.data.map(dbSport);  setSports(d);  save(KEYS.SPORTS,  d); }
      if (nRes.data) { const d = nRes.data.map(dbNote);   setNotes(d);   save(KEYS.NOTES,   d); }
    } catch (e) { console.error("Supabase fetch error:", e); }
    finally { setIsLoading(false); }
  }, []);

  /* ── localStorage sync (offline) ── */
  useEffect(() => { if (!isSupabaseConfigured) { save(KEYS.COURSES, courses); } }, [courses]);
  useEffect(() => { if (!isSupabaseConfigured) { save(KEYS.VIDEOS,  videos);  } }, [videos]);
  useEffect(() => { if (!isSupabaseConfigured) { save(KEYS.SPORTS,  sports);  } }, [sports]);
  useEffect(() => { if (!isSupabaseConfigured) { save(KEYS.MOVIES,  movies);  } }, [movies]);
  useEffect(() => { if (!isSupabaseConfigured) { save(KEYS.NOTES,   notes);   } }, [notes]);

  /* ── On mount: fetch from Supabase if configured ── */
  useEffect(() => { if (isSupabaseConfigured) fetchFromSupabase(); }, [fetchFromSupabase]);

  const refresh = fetchFromSupabase;

  /* ═══════════════════════════════════════════════════════
     CRUD helpers — Supabase first, localStorage fallback
  ═══════════════════════════════════════════════════════ */

  // ── Courses ─────────────────────────────────────────────
  const addCourse = async (data: Omit<Course, "id">) => {
    if (supabase) {
      const { data: row, error } = await supabase.from("courses").insert({
        title: data.title, instructor: data.instructor,
        description: data.description, duration: data.duration,
        lessons: data.lessons, rating: data.rating,
        students: data.students, thumbnail: data.thumbnail,
        category: data.category, price: data.price,
      }).select().single();
      if (!error && row) { setCourses(p => [dbCourse(row), ...p]); return; }
      console.error("Supabase addCourse:", error);
    }
    const item: Course = { id: Date.now().toString(), ...data };
    setCourses(p => [item, ...p]);
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    if (supabase) {
      const { error } = await supabase.from("courses").update({
        ...(data.title        && { title:       data.title }),
        ...(data.instructor   && { instructor:  data.instructor }),
        ...(data.description  !== undefined && { description: data.description }),
        ...(data.duration     && { duration:    data.duration }),
        ...(data.lessons      !== undefined && { lessons:     data.lessons }),
        ...(data.rating       !== undefined && { rating:      data.rating }),
        ...(data.students     && { students:    data.students }),
        ...(data.thumbnail    && { thumbnail:   data.thumbnail }),
        ...(data.category     && { category:    data.category }),
        ...(data.price        && { price:       data.price }),
      }).eq("id", id);
      if (!error) { setCourses(p => p.map(c => c.id === id ? { ...c, ...data } : c)); return; }
      console.error("Supabase updateCourse:", error);
    }
    setCourses(p => p.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCourse = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (!error) { setCourses(p => p.filter(c => c.id !== id)); return; }
      console.error("Supabase deleteCourse:", error);
    }
    setCourses(p => p.filter(c => c.id !== id));
  };

  // ── Videos ──────────────────────────────────────────────
  const addVideo = async (data: Omit<Video, "id" | "views" | "uploadDate">) => {
    if (supabase) {
      const { data: row, error } = await supabase.from("videos").insert({
        title: data.title, description: data.description,
        category: data.category, duration: data.duration,
        url: data.url, thumbnail: data.thumbnail, price: data.price,
      }).select().single();
      if (!error && row) { setVideos(p => [dbVideo(row), ...p]); return; }
      console.error("Supabase addVideo:", error);
    }
    const item: Video = { id: Date.now().toString(), views: 0, uploadDate: new Date().toISOString().split("T")[0], ...data };
    setVideos(p => [item, ...p]);
  };

  const updateVideo = async (id: string, data: Partial<Video>) => {
    if (supabase) {
      const { error } = await supabase.from("videos").update({
        ...(data.title       && { title:      data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category    && { category:   data.category }),
        ...(data.duration    && { duration:   data.duration }),
        ...(data.url         && { url:        data.url }),
        ...(data.thumbnail   && { thumbnail:  data.thumbnail }),
        ...(data.price       && { price:      data.price }),
      }).eq("id", id);
      if (!error) { setVideos(p => p.map(v => v.id === id ? { ...v, ...data } : v)); return; }
      console.error("Supabase updateVideo:", error);
    }
    setVideos(p => p.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVideo = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (!error) { setVideos(p => p.filter(v => v.id !== id)); return; }
      console.error("Supabase deleteVideo:", error);
    }
    setVideos(p => p.filter(v => v.id !== id));
  };

  // ── Sports ──────────────────────────────────────────────
  const addSport = async (data: Omit<Sport, "id">) => {
    if (supabase) {
      const { data: row, error } = await supabase.from("sports").insert({
        sport: data.sport, team_a: data.teamA, team_b: data.teamB,
        score_a: data.scoreA, score_b: data.scoreB,
        status: data.status, is_live: data.isLive, extra_info: data.extraInfo,
      }).select().single();
      if (!error && row) { setSports(p => [dbSport(row), ...p]); return; }
      console.error("Supabase addSport:", error);
    }
    const item: Sport = { id: Date.now().toString(), ...data };
    setSports(p => [item, ...p]);
  };

  const updateSport = async (id: string, data: Partial<Sport>) => {
    if (supabase) {
      const { error } = await supabase.from("sports").update({
        ...(data.sport      && { sport:      data.sport }),
        ...(data.teamA      && { team_a:     data.teamA }),
        ...(data.teamB      && { team_b:     data.teamB }),
        ...(data.scoreA     !== undefined && { score_a: data.scoreA }),
        ...(data.scoreB     !== undefined && { score_b: data.scoreB }),
        ...(data.status     && { status:     data.status }),
        ...(data.isLive     !== undefined && { is_live: data.isLive }),
        ...(data.extraInfo  !== undefined && { extra_info: data.extraInfo }),
      }).eq("id", id);
      if (!error) { setSports(p => p.map(s => s.id === id ? { ...s, ...data } : s)); return; }
      console.error("Supabase updateSport:", error);
    }
    setSports(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSport = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("sports").delete().eq("id", id);
      if (!error) { setSports(p => p.filter(s => s.id !== id)); return; }
      console.error("Supabase deleteSport:", error);
    }
    setSports(p => p.filter(s => s.id !== id));
  };

  // ── Movies ──────────────────────────────────────────────
  const addMovie = async (data: Omit<Movie, "id">) => {
    if (supabase) {
      const { data: row, error } = await supabase.from("movies").insert({
        title: data.title, description: data.description,
        genre: data.genre, rating: data.rating, year: data.year,
        duration: data.duration, language: data.language,
        director: data.director, cast: data.cast,
        poster: data.thumbnail, video_url: data.videoUrl,
      }).select().single();
      if (!error && row) { setMovies(p => [dbMovie(row), ...p]); return; }
      console.error("Supabase addMovie:", error);
    }
    const item: Movie = { id: Date.now().toString(), ...data };
    setMovies(p => [item, ...p]);
  };

  const updateMovie = async (id: string, data: Partial<Movie>) => {
    if (supabase) {
      const { error } = await supabase.from("movies").update({
        ...(data.title        && { title:      data.title }),
        ...(data.description  !== undefined && { description: data.description }),
        ...(data.genre        && { genre:      data.genre }),
        ...(data.rating       !== undefined && { rating:      data.rating }),
        ...(data.year         && { year:       data.year }),
        ...(data.duration     && { duration:   data.duration }),
        ...(data.language     && { language:   data.language }),
        ...(data.director     && { director:   data.director }),
        ...(data.cast         && { cast:       data.cast }),
        ...(data.thumbnail    && { poster:     data.thumbnail }),
        ...(data.videoUrl     && { video_url:  data.videoUrl }),
      }).eq("id", id);
      if (!error) { setMovies(p => p.map(m => m.id === id ? { ...m, ...data } : m)); return; }
      console.error("Supabase updateMovie:", error);
    }
    setMovies(p => p.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMovie = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (!error) { setMovies(p => p.filter(m => m.id !== id)); return; }
      console.error("Supabase deleteMovie:", error);
    }
    setMovies(p => p.filter(m => m.id !== id));
  };

  // ── Notes ───────────────────────────────────────────────
  const addNote = async (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (supabase) {
      const { data: row, error } = await supabase.from("notes").insert({
        title: data.title, description: data.description,
        category: data.category, thumbnail_url: data.thumbnailUrl,
        pdf_url: data.pdfUrl, tags: data.tags,
        difficulty: data.difficulty, reading_time: data.readingTime,
        page_count: data.pageCount, author: data.author, status: data.status,
      }).select().single();
      if (!error && row) { setNotes(p => [dbNote(row), ...p]); return; }
      console.error("Supabase addNote:", error);
    }
    const now = new Date().toISOString();
    const item: Note = { id: Date.now().toString(), createdAt: now, updatedAt: now, ...data };
    setNotes(p => [item, ...p]);
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    if (supabase) {
      const { error } = await supabase.from("notes").update({
        ...(data.title        && { title:         data.title }),
        ...(data.description  !== undefined && { description:  data.description }),
        ...(data.category     && { category:      data.category }),
        ...(data.thumbnailUrl !== undefined && { thumbnail_url: data.thumbnailUrl }),
        ...(data.pdfUrl       && { pdf_url:       data.pdfUrl }),
        ...(data.tags         && { tags:          data.tags }),
        ...(data.difficulty   && { difficulty:    data.difficulty }),
        ...(data.readingTime  !== undefined && { reading_time: data.readingTime }),
        ...(data.pageCount    !== undefined && { page_count:   data.pageCount }),
        ...(data.author       !== undefined && { author:       data.author }),
        ...(data.status       && { status:        data.status }),
      }).eq("id", id);
      if (!error) { setNotes(p => p.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n)); return; }
      console.error("Supabase updateNote:", error);
    }
    setNotes(p => p.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (!error) { setNotes(p => p.filter(n => n.id !== id)); return; }
      console.error("Supabase deleteNote:", error);
    }
    setNotes(p => p.filter(n => n.id !== id));
  };

  return (
    <DataContext.Provider value={{
      courses, videos, sports, movies, notes, stats, isLoading, refresh,
      addCourse, updateCourse, deleteCourse,
      addVideo,  updateVideo,  deleteVideo,
      addSport,  updateSport,  deleteSport,
      addMovie,  updateMovie,  deleteMovie,
      addNote,   updateNote,   deleteNote,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
