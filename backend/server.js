const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// PostgreSQL client configuration
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'bitcoin_db',
    password: '1234',
    port: 5432
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Fetch Bitcoin details and emit to frontend
const fetchAndEmitBitcoinData = async () => {
    try {
        const res = await client.query('SELECT * FROM bitcoin_details ORDER BY height DESC LIMIT 1');
        const bitcoinDetails = res.rows[0];
        if (bitcoinDetails) {
            io.emit('bitcoin_data', bitcoinDetails);
            console.log('Emitted Bitcoin data:', bitcoinDetails);
        }
    } catch (err) {
        console.error('Error fetching Bitcoin data:', err);
    }
};

// Set up interval for fetching and emitting data
const dataInterval = setInterval(fetchAndEmitBitcoinData, 10000);

// Flexible port configuration
const PORT = process.env.PORT || 3001;

// Start the server
const startServer = () => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// Error handling for server startup
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying again with port ${PORT + 1}`);
        setTimeout(() => {
            server.close();
            PORT++;
            startServer();
        }, 1000);
    } else {
        console.error('Server error:', error);
    }
});

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    clearInterval(dataInterval);
    io.close(() => {
        console.log('Socket.IO closed');
        server.close(() => {
            console.log('HTTP server closed');
            client.end(() => {
                console.log('PostgreSQL client disconnected');
                process.exit(0);
            });
        });
    });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Bitcoin Data Server is running');
});