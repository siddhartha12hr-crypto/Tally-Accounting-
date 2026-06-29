/**
 * ============================================
 * DATA CONTEXT - GLOBAL STATE MANAGEMENT
 * Shares data between admin panel and user-facing pages
 * ============================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
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
  title: string;
  teams: string;
  date: string;
  time: string;
  streamUrl: string;
  thumbnail: string;
  status: 'live' | 'upcoming' | 'ended';
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
}

export interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  pdfUrl: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  pageCount: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

interface DataContextType {
  courses: Course[];
  videos: Video[];
  sports: Sport[];
  movies: Movie[];
  notes: Note[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  addSport: (sport: Sport) => void;
  updateSport: (id: string, sport: Partial<Sport>) => void;
  deleteSport: (id: string) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

// Initial data
const initialCourses: Course[] = [
  {
    id: "1",
    title: "Tally Prime Complete Course",
    instructor: "Anil Sharma",
    duration: "18h",
    lessons: 64,
    rating: 4.9,
    students: "12,430",
    description: "Master Tally Prime from basics to advanced features",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
    category: "Tally Prime",
    price: "₹4,999",
  },
  {
    id: "2",
    title: "Accounting Mastery",
    instructor: "Pooja Verma",
    duration: "22h",
    lessons: 80,
    rating: 4.8,
    students: "9,212",
    description: "Complete accounting fundamentals and practical applications",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    category: "Accounting",
    price: "₹5,999",
  },
];

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Tally Prime Complete Tutorial",
    description: "Learn Tally Prime from scratch with this comprehensive guide",
    category: "Tally Prime Tutorials",
    duration: "5h 30m",
    url: "https://youtube.com/watch?v=example1",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
    views: 45230,
    uploadDate: "2026-01-15",
    price: "₹999",
  },
  {
    id: "2",
    title: "GST Filing Made Easy",
    description: "Step by step guide to GST filing in India",
    category: "GST Learning",
    duration: "3h 15m",
    url: "https://youtube.com/watch?v=example2",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    views: 32150,
    uploadDate: "2026-01-10",
    price: "Free",
  },
];

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  COURSES: 'tally_courses',
  VIDEOS: 'tally_videos',
  SPORTS: 'tally_sports',
  MOVIES: 'tally_movies',
  NOTES: 'tally_notes',
};

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    if (typeof localStorage === "undefined") return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  // Load data from localStorage or use initial data
  const [courses, setCourses] = useState<Course[]>(() => 
    loadFromStorage(STORAGE_KEYS.COURSES, initialCourses)
  );
  const [videos, setVideos] = useState<Video[]>(() => 
    loadFromStorage(STORAGE_KEYS.VIDEOS, initialVideos)
  );
  const [sports, setSports] = useState<Sport[]>(() => 
    loadFromStorage(STORAGE_KEYS.SPORTS, [])
  );
  const [movies, setMovies] = useState<Movie[]>(() => 
    loadFromStorage(STORAGE_KEYS.MOVIES, [])
  );
  const [notes, setNotes] = useState<Note[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTES, [])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VIDEOS, videos);
  }, [videos]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SPORTS, sports);
  }, [sports]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MOVIES, movies);
  }, [movies]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  // Course operations
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  // Video operations
  const addVideo = (video: Video) => {
    setVideos(prev => [...prev, video]);
  };

  const updateVideo = (id: string, updatedVideo: Partial<Video>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updatedVideo } : video
    ));
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  // Sport operations
  const addSport = (sport: Sport) => {
    setSports(prev => [...prev, sport]);
  };

  const updateSport = (id: string, updatedSport: Partial<Sport>) => {
    setSports(prev => prev.map(sport => 
      sport.id === id ? { ...sport, ...updatedSport } : sport
    ));
  };

  const deleteSport = (id: string) => {
    setSports(prev => prev.filter(sport => sport.id !== id));
  };

  // Movie operations
  const addMovie = (movie: Movie) => {
    setMovies(prev => [...prev, movie]);
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies(prev => prev.map(movie => 
      movie.id === id ? { ...movie, ...updatedMovie } : movie
    ));
  };

  const deleteMovie = (id: string) => {
    setMovies(prev => prev.filter(movie => movie.id !== id));
  };

  // Note operations
  const addNote = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const value: DataContextType = {
    courses,
    videos,
    sports,
    movies,
    notes,
    addCourse,
    updateCourse,
    deleteCourse,
    addVideo,
    updateVideo,
    deleteVideo,
    addSport,
    updateSport,
    deleteSport,
    addMovie,
    updateMovie,
    deleteMovie,
    addNote,
    updateNote,
    deleteNote,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
