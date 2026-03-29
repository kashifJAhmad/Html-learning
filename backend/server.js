const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from parent directory

// Routes

// Register
app.post('/api/register', (req, res) => {
  const { name, email, phone, password, role, department, employee_id, qualification, course, year, division } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' });
  }
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Email already exists' });
    db.run('INSERT INTO users (name, email, phone, password, role, department, employee_id, qualification, course, year, division) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, password, role, department, employee_id, qualification, course, year, division], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'User registered successfully' });
      });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: row });
  });
});

// Get profile
app.get('/api/profile/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ user: row });
  });
});

// Update profile
app.put('/api/profile/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, department, employee_id, qualification, course, year, division } = req.body;
  db.run('UPDATE users SET name = ?, email = ?, phone = ?, department = ?, employee_id = ?, qualification = ?, course = ?, year = ?, division = ? WHERE id = ?',
    [name, email, phone, department, employee_id, qualification, course, year, division, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'Profile updated successfully' });
    });
});

// Admin: Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ users: rows });
  });
});

// Admin: Delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});

// Admin: Update user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, department, employee_id, qualification, course, year, division } = req.body;
  db.run('UPDATE users SET name = ?, email = ?, phone = ?, role = ?, department = ?, employee_id = ?, qualification = ?, course = ?, year = ?, division = ? WHERE id = ?',
    [name, email, phone, role, department, employee_id, qualification, course, year, division, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User updated successfully' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});