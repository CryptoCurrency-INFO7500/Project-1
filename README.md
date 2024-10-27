# Bitcoin Explorer

Bitcoin Explorer is a full-stack application that provides historical Bitcoin price data and analysis. It consists of a React frontend, a TypeScript backend, a Rust data extractor, and a PostgreSQL database.

## Project Structure

The project is composed of four main components:

1. Frontend (React)
2. Backend (TypeScript)
3. Data Extractor (Rust)
4. Database (PostgreSQL)

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)
- Rust (for local development of the extractor)

## Architecture

The project consists of three main components:

1. **Data Ingestion (Rust)**: Continuously fetches Bitcoin data and stores it in PostgreSQL.
2. **Backend (Typescript)**: Serves data from PostgreSQL to the frontend via a RESTful API.
3. **Frontend (React)**: Presents data in an interactive, user-friendly interface.

   ![image](https://github.com/user-attachments/assets/acb7f49e-ec12-4298-a529-8b6fd33ead19)

## Getting Started

To run the entire application stack:

1. Clone the repository:
```
git clone https://github.com/yourusername/bitcoin-explorer.git
cd bitcoin-explorer
```

2. Start the services using Docker Compose:
```
docker-compose up --build
```

3. Access the application at `http://localhost:3000`

## Component Details

### Frontend

- Built with React
- Located in the `./frontend` directory
- Provides a user interface for viewing Bitcoin price data and analysis

#### Development

To run the frontend locally:
```
cd frontend
npm install
npm start
```

### Backend

- Built with TypeScript
- Located in the `./backend` directory
- Provides API endpoints for the frontend to fetch data

#### Development

To run the backend locally:
```
cd backend
npm install
npm run dev
```

### Data Extractor

- Built with Rust
- Located in the `./rust_extractor` directory
- Extracts Bitcoin price data and stores it in the database

#### Development

To run the extractor locally:
```
cd rust_extractor
cargo run
```

### Database

- PostgreSQL database
- Stores historical Bitcoin price data

## API Endpoints

- `GET /api/historical`: Fetches historical Bitcoin price data
- [Add other endpoints as necessary]

## Docker Compose Configuration

The `docker-compose.yml` file defines the following services:

- `frontend`: React frontend application
- `backend`: TypeScript backend API
- `extractor`: Rust data extractor
- `db`: PostgreSQL database

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (used by backend and extractor)
- `PORT`: Port for the backend service (default: 3002)

## Troubleshooting

If you encounter issues with service connectivity:

1. Ensure all services are running: `docker-compose ps`
2. Check service logs: `docker-compose logs [service_name]`
3. Verify network connectivity between services
4. Ensure the backend API is correctly configured to handle CORS

## Contributing

- Sumanayana Konda
- Akshatha Patil
- Ruthwik Bommenahalli Gowda



