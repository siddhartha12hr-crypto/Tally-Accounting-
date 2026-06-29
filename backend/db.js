/**
 * Pure JSON file-based store — no native modules required.
 * Data persists in backend/data/users.json
 */

const fs   = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const dbFile  = path.join(dataDir, "users.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dbFile))  fs.writeFileSync(dbFile, JSON.stringify({ users: [] }, null, 2));

function read() {
  try {
    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
  } catch {
    return { users: [] };
  }
}

function write(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

const db = {
  findByUsername(username) {
    const { users } = read();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  findByEmail(email) {
    if (!email) return null;
    const { users } = read();
    return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findByPhone(phone) {
    if (!phone) return null;
    const { users } = read();
    return users.find(u => u.phone === phone) || null;
  },

  findById(id) {
    const { users } = read();
    const u = users.find(u => u.id === id);
    if (!u) return null;
    const { passwordHash, ...safe } = u;
    return safe;
  },

  create(userData) {
    const data = read();
    const user = {
      id:           require("uuid").v4(),
      fullName:     userData.fullName,
      username:     userData.username.toLowerCase(),
      email:        userData.email  ? userData.email.toLowerCase()  : null,
      phone:        userData.phone  || null,
      passwordHash: userData.passwordHash,
      avatar:       null,
      createdAt:    new Date().toISOString(),
    };
    data.users.push(user);
    write(data);
    const { passwordHash, ...safe } = user;
    return safe;
  },

  usernameExists(username) {
    return !!db.findByUsername(username);
  },

  emailExists(email) {
    return !!db.findByEmail(email);
  },

  phoneExists(phone) {
    return !!db.findByPhone(phone);
  },
};

module.exports = db;
