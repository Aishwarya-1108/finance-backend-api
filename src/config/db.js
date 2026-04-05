const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./finance.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite DB");
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    status TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    type TEXT,
    category TEXT,
    date TEXT,
    notes TEXT
  )`);
});

module.exports = db;