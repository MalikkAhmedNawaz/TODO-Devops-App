// ========================================
// STEP 1: Import required libraries
// ========================================
const express = require('express');           // Web framework
const bodyParser = require('body-parser');    // Parse JSON data
const { Pool } = require('pg');               // PostgreSQL connector

// ========================================
// STEP 2: Create Express app
// ========================================
const app = express();
app.use(bodyParser.json());                   // Let app understand JSON
app.use(express.static('public'));            // Serve HTML files from 'public' folder

// ========================================
// STEP 3: Database connection setup
// ========================================
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',        // Database server address
  port: 5432,                                     // PostgreSQL default port
  user: process.env.DB_USER || 'todouser',        // Database username
  password: process.env.DB_PASSWORD || 'todopass', // Database password
  database: process.env.DB_NAME || 'tododb'       // Database name
});

// ========================================
// STEP 4: Create database table if it doesn't exist
// ========================================
pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing ID
    task TEXT NOT NULL,                 -- The todo text
    completed BOOLEAN DEFAULT false,    -- Is it done?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When was it created?
  )
`).catch(err => console.error('Database initialization error:', err));

// ========================================
// STEP 5: API ROUTES (The endpoints our frontend will call)
// ========================================

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);  // Send todos as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { task } = req.body;  // Get task from request
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task]
    );
    res.json(result.rows[0]);  // Return the created todo
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a todo (mark as complete/incomplete)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// STEP 6: Start the server
// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Todo app available at http://localhost:${PORT}`);
});
