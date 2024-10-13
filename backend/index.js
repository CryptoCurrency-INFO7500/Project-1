const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  console.log('Connected to database')
  release()
})

// Root route
app.get('/', (req, res) => {
  res.send('Bitcoin Explorer API');
});

// Get latest Bitcoin data
app.get('/api/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bitcoin_details ORDER BY time DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get historical Bitcoin data
app.get('/api/historical', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  if (isNaN(limit) || limit <= 0 || limit > 1000) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
  }
  try {
    const result = await pool.query('SELECT * FROM bitcoin_details ORDER BY time DESC LIMIT $1', [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific block by height
app.get('/api/block/:height', async (req, res) => {
  const height = parseInt(req.params.height, 10);
  
  if (isNaN(height)) {
    return res.status(400).json({ error: 'Invalid height parameter' });
  }

  try {
    const result = await pool.query('SELECT * FROM bitcoin_details WHERE height = $1', [height]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Block not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get price history
app.get('/api/price-history', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  if (isNaN(limit) || limit <= 0 || limit > 1000) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
  }
  try {
    const result = await pool.query('SELECT time, price FROM bitcoin_details ORDER BY time DESC LIMIT $1', [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total_blocks, MIN(height) as min_height, MAX(height) as max_height FROM bitcoin_details');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
