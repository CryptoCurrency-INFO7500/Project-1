import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

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
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  release();
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Bitcoin Explorer API');
});

// Get latest Bitcoin data
app.get('/api/latest', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM bitcoin_details ORDER BY time DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get historical Bitcoin data
app.get('/api/historical', async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string, 10) || 100;
    if (isNaN(limit) || limit <= 0 || limit > 1000) {
      res.status(400).json({ error: 'Invalid limit parameter' });
      return;
    }
    try {
      const result = await pool.query('SELECT * FROM bitcoin_details ORDER BY time DESC LIMIT $1', [limit]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});