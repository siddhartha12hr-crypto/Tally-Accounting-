require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("./db");

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "tally_fallback_secret_key_2024";

/* ── Middleware ───────────────────────────────────────── */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true,
}));
app.use(express.json());

/* ── Helpers ──────────────────────────────────────────── */
function makeToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

/* ── Health check ─────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Tally Auth Backend is running 🚀" });
});

/* ── SIGNUP ───────────────────────────────────────────── */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { fullName, username, email, phone, password } = req.body;

    if (!fullName || !fullName.trim())
      return res.status(400).json({ success: false, message: "Full name is required" });
    if (!username || !username.trim())
      return res.status(400).json({ success: false, message: "Username is required" });
    if (username.trim().length < 3)
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    if (!password || !password.trim())
      return res.status(400).json({ success: false, message: "Password is required" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if ((!email || !email.trim()) && (!phone || !phone.trim()))
      return res.status(400).json({ success: false, message: "Email or phone number is required" });

    if (db.usernameExists(username.trim()))
      return res.status(409).json({ success: false, message: "Username already taken. Please choose another." });
    if (email && email.trim() && db.emailExists(email.trim()))
      return res.status(409).json({ success: false, message: "Email already registered. Please login instead." });
    if (phone && phone.trim() && db.phoneExists(phone.trim()))
      return res.status(409).json({ success: false, message: "Phone number already registered. Please login instead." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = db.create({
      fullName:     fullName.trim(),
      username:     username.trim(),
      email:        email && email.trim()  ? email.trim()  : null,
      phone:        phone && phone.trim()  ? phone.trim()  : null,
      passwordHash,
    });

    const token = makeToken(user);
    console.log("✅ Signup:", user.username, user.email || user.phone);
    res.status(201).json({ success: true, message: "Account created successfully! Welcome 🎉", token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

/* ── LOGIN ────────────────────────────────────────────── */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log("Login attempt:", identifier);

    if (!identifier || !identifier.trim())
      return res.status(400).json({ success: false, message: "Username, email or phone is required" });
    if (!password || !password.trim())
      return res.status(400).json({ success: false, message: "Password is required" });

    const id = identifier.trim();

    // Try username → email → phone
    const raw = db.findByUsername(id) || db.findByEmail(id) || db.findByPhone(id);

    console.log("User found:", raw ? raw.username : "NOT FOUND");

    if (!raw) {
      return res.status(401).json({
        success: false,
        message: "❌ No account found with that username, email or phone. Please sign up first."
      });
    }

    const match = await bcrypt.compare(password, raw.passwordHash);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "❌ Incorrect password. Please check and try again."
      });
    }

    // Strip hash before sending
    const { passwordHash, ...user } = raw;
    const token = makeToken(user);
    console.log("✅ Login success:", user.username);
    res.json({ success: true, message: "Login successful! Welcome back 👋", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

/* ── ME (protected) ───────────────────────────────────── */
app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

/* ── LOGOUT ───────────────────────────────────────────── */
app.post("/api/auth/logout", requireAuth, (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

/* ── Start ────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n✅  Tally Auth Backend → http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Users:  backend/data/users.json\n`);
});
