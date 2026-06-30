export const heroSlides = [
  { 
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
    hasButton: true,
    buttonText: "Enroll Now",
    buttonLink: "/courses"
  },
  { 
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    hasButton: false
  },
  { 
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    hasButton: true,
    buttonText: "Learn More",
    buttonLink: "/learn"
  },
  { 
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    hasButton: false
  },
  { 
    image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=1200&q=80",
    hasButton: true,
    buttonText: "Get Started",
    buttonLink: "/courses"
  },
];

export const quickActions = [
  { label: "Learn Now",     icon: "BookOpen",      to: "/learn",          gradient: "linear-gradient(135deg,#1a3a8f,#0e6b8f)", bg: "#e8f0fe", external: false },
  { label: "Notes",         icon: "FileText",       to: "/notes",          gradient: "linear-gradient(135deg,#ea580c,#f59e0b)", bg: "#fff7ed", external: false },
  { label: "Courses",       icon: "GraduationCap",  to: "/courses",        gradient: "linear-gradient(135deg,#7c3aed,#a855f7)", bg: "#f5f3ff", external: false },
  { label: "Entertainment", icon: "Film",            to: "/entertainment",  gradient: "linear-gradient(135deg,#db2777,#f43f5e)", bg: "#fff1f2", external: false },
  { label: "Live Sports",   icon: "Trophy",          to: "/sports",         gradient: "linear-gradient(135deg,#059669,#10b981)", bg: "#f0fdf4", external: false },
  { label: "Support",       icon: "MessageCircle",   to: "https://wa.me/9823415625?text=Hello%20sir%2C%20i%20need%20some%20help%20with%20Tally", gradient: "linear-gradient(135deg,#16a34a,#22c55e)", bg: "#f0fdf4", external: true },
] as const;

export const learnCategories = [
  { title: "Accounting Basics", duration: "2h 30m", level: "Beginner", desc: "Master the core principles of accounting." },
  { title: "Tally Prime Tutorials", duration: "5h 10m", level: "Intermediate", desc: "Hands-on Tally Prime walkthrough." },
  { title: "GST Learning", duration: "3h 45m", level: "Intermediate", desc: "Understand GST end-to-end." },
  { title: "Business Skills", duration: "4h 00m", level: "All Levels", desc: "Soft skills for modern entrepreneurs." },
  { title: "Computer Skills", duration: "2h 15m", level: "Beginner", desc: "Essential computer literacy." },
  { title: "Excel Tutorials", duration: "6h 20m", level: "All Levels", desc: "From formulas to pivot tables." },
  { title: "Financial Education", duration: "3h 30m", level: "Beginner", desc: "Personal finance & investing." },
  { title: "Digital Skills", duration: "2h 50m", level: "Beginner", desc: "Thrive in the digital era." },
];

export const courses = [
  { title: "Tally Prime Complete Course", instructor: "Anil Sharma", duration: "18h", lessons: 64, rating: 4.9, students: "12,430", progress: 35 },
  { title: "Accounting Mastery", instructor: "Pooja Verma", duration: "22h", lessons: 80, rating: 4.8, students: "9,212", progress: 60 },
  { title: "GST Expert Course", instructor: "Rohan Khadka", duration: "12h", lessons: 42, rating: 4.7, students: "5,890", progress: 0 },
  { title: "Excel Master Course", instructor: "Sneha Rai", duration: "15h", lessons: 55, rating: 4.9, students: "10,001", progress: 12 },
  { title: "Computer Basics", instructor: "Ravi Thapa", duration: "8h", lessons: 30, rating: 4.6, students: "7,420", progress: 0 },
  { title: "Business Skills", instructor: "Maya Joshi", duration: "10h", lessons: 36, rating: 4.8, students: "4,330", progress: 85 },
];

export const cricketMatches = [
  { teamA: "India", teamB: "Nepal", scoreA: "248/6", scoreB: "201/8", status: "LIVE", overs: "42.3 ov" },
  { teamA: "Mumbai", teamB: "Chennai", scoreA: "186/4", scoreB: "—", status: "1st Innings", overs: "18.2 ov" },
  { teamA: "Delhi", teamB: "Kolkata", scoreA: "—", scoreB: "—", status: "Tomorrow 7:30 PM", overs: "" },
];

export const footballMatches = [
  { teamA: "Mohun Bagan", teamB: "Bengaluru FC", scoreA: 2, scoreB: 1, status: "LIVE", time: "78'" },
  { teamA: "Three Star", teamB: "Machhindra", scoreA: 1, scoreB: 1, status: "HT", time: "45'" },
  { teamA: "Kerala Blasters", teamB: "Mumbai City", scoreA: 0, scoreB: 0, status: "Sat 8:00 PM", time: "" },
];

export const movies = [
  { title: "Pathaan",                    genre: "Action",         rating: 8.2, desc: "A spy thriller with breathtaking action sequences across the globe.", year: "2023", duration: "2h 26m", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { title: "3 Idiots",                   genre: "Comedy/Drama",   rating: 9.1, desc: "An iconic story of friendship, dreams and the broken education system.", year: "2009", duration: "2h 50m", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80" },
  { title: "Kabhi Khushi Kabhie Gham",   genre: "Drama",          rating: 8.0, desc: "A family epic that spans generations, love and sacrifice.", year: "2001", duration: "3h 30m", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80" },
  { title: "RRR",                        genre: "Action",         rating: 8.7, desc: "An epic tale of two legendary revolutionaries fighting British rule.", year: "2022", duration: "3h 7m",  poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80" },
  { title: "Loot",                       genre: "Nepali Thriller", rating: 8.5, desc: "Iconic Nepali heist thriller that redefined Nepali cinema.", year: "2012", duration: "2h 10m", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80" },
  { title: "Kabaddi",                    genre: "Nepali Comedy",  rating: 8.1, desc: "Heartwarming village comedy about love and tradition.", year: "2013", duration: "2h 5m",  poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=80" },
  { title: "Dangal",                     genre: "Biography",      rating: 8.4, desc: "A father trains his daughters to become world-class wrestlers.", year: "2016", duration: "2h 41m", poster: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80" },
  { title: "KGF Chapter 2",             genre: "Action",         rating: 8.2, desc: "Rocky's fearsome reputation spreads across the nation.", year: "2022", duration: "2h 48m", poster: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80" },
  { title: "Baahubali 2",               genre: "Epic Action",    rating: 8.5, desc: "The conclusion to an epic saga of power, betrayal and love.", year: "2017", duration: "2h 47m", poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&q=80" },
  { title: "Pashupati Prasad",          genre: "Nepali Drama",   rating: 8.3, desc: "A moving story of hope, dignity and humanity in Kathmandu.", year: "2016", duration: "2h 15m", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" },
];
