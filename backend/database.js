const sqlite3 = require('sqlite3').verbose();

// Create database
const db = new sqlite3.Database('./student_tracker.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    department TEXT,
    employee_id TEXT,
    qualification TEXT,
    course TEXT,
    year TEXT,
    division TEXT
  )`);
});

module.exports = db;