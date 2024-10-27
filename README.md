# Bitcoin Explorer

A real-time Bitcoin data visualization and analysis tool built with Rust, Node.js, and React.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Introduction

This Bitcoin Explorer provides real-time insights into both on-chain and off-chain Bitcoin metrics. It continuously ingests data from the Bitcoin network, stores it in a PostgreSQL database, and presents it through an interactive web interface.
[Documentation CodeLabs](https://codelabs-preview.appspot.com/?file_id=1nGuJebyQEeMvaYzBLiP_bFUp9g18bfj34dL1UK5e1CY#0)
## Features

- Real-time data ingestion from Bitcoin APIs
- Visualization of key Bitcoin metrics:
  - Block height
  - Price
  - Transaction fees
  - Peer count
  - Unconfirmed transactions
- Historical data view
- Interactive charts and data tables

## Architecture

The project consists of three main components:

1. **Data Ingestion (Rust)**: Continuously fetches Bitcoin data and stores it in PostgreSQL.
2. **Backend (Typescript)**: Serves data from PostgreSQL to the frontend via a RESTful API.
3. **Frontend (React)**: Presents data in an interactive, user-friendly interface.

   ![image](https://github.com/user-attachments/assets/acb7f49e-ec12-4298-a529-8b6fd33ead19)

## Technologies Used

- **Rust**: For efficient and safe data ingestion
- **Typescript & Express**: For the backend API
- **React**: For the frontend user interface
- **PostgreSQL**: For data storage
- **Chart.js**: For data visualization
- **Styled-components**: For component-based styling

### Directory
<img width="260" alt="Screenshot 2024-10-06 at 2 18 18 PM" src="https://github.com/user-attachments/assets/63a1cb26-ce8b-43a7-b4fd-f275b8a394db">

## Installation

### Prerequisites

- Rust (latest stable version)
- Typescript
- PostgreSQL (v12 or later)
- npm or yarn

### Setup

1. Clone the repository:
git clone https://github.com/your-repo/bitcoin-explorer.git
cd bitcoin-explorer

2. Set up the database:
psql -c "CREATE DATABASE bitcoin_explorer"

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
DATABASE_URL=postgres://username:password@localhost/bitcoin_explorer

4. Install dependencies:
For Rust ingestion
cd ingestion
cargo build
For Typescript backend
cd ../backend
npm install
For React frontend
cd ../frontend
npm install

## Usage

1. Start the Rust ingestion service:
cd ingestion
cargo run

2. Start the Typescript backend:
cd backend
npm start

3. Start the React frontend:
cd frontend
npm start

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoints

- `GET /api/historical`: Fetches historical Bitcoin data
- `GET /api/latest`: Fetches the latest Bitcoin metrics
- `GET /api/block/:height`: Fetches data for a specific block height

For full API documentation, refer to the [API Documentation](./API_DOCS.md) file.

## Contributing

We welcome contributions to the Bitcoin Explorer project! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## Team

- Akshatha Patil
- Sumanayana Konda
- Ruthwik BG

## References

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Typescript Documentation](https://nodejs.org/en/docs/)
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [BlockCypher API Documentation](https://www.blockcypher.com/dev/bitcoin/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
