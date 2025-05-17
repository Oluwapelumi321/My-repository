const db = require('../database');

// Get all users
exports.getAllUsers = (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
};

// Get user by ID
exports.getUserById = (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// Create new user
exports.createUser = (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const result = stmt.run(name, email, password);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newUser);
};

// Update user
exports.updateUser = (req, res) => {
  const { name, email, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const newPassword = password || user.password;
  db.prepare('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?')
    .run(name, email, newPassword, req.params.id);

  const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  res.json(updatedUser);
};

// Delete user
exports.deleteUser = (req, res) => {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
};
