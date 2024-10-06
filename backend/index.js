const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234', 
    database: 'bitcoin_db',
    port: 5432
});

// Welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the Bitcoin API! Use /api/bitcoin-details to get data.');
});

// Fetch Bitcoin details
app.get('/api/bitcoin-details', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bitcoin_details');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data from PostgreSQL:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
