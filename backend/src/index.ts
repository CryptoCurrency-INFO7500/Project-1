import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function initializeDatabase() {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS bitcoin_details (
            id SERIAL PRIMARY KEY,
            height BIGINT NOT NULL,
            hash TEXT NOT NULL,
            time TIMESTAMPTZ NOT NULL,
            latest_url TEXT NOT NULL,
            previous_hash TEXT NOT NULL,
            previous_url TEXT NOT NULL,
            peer_count BIGINT NOT NULL,
            unconfirmed_count BIGINT NOT NULL,
            high_fee_per_kb BIGINT NOT NULL,
            medium_fee_per_kb BIGINT NOT NULL,
            low_fee_per_kb BIGINT NOT NULL,
            last_fork_height BIGINT NOT NULL,
            last_fork_hash TEXT NOT NULL,
            price DOUBLE PRECISION,
            volume_24h DOUBLE PRECISION,
            timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Database initialized successfully');
        return;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Failed to initialize database:', err);
      if (i < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }
}

// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database after multiple retries:', err);
    process.exit(1);
  });




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

