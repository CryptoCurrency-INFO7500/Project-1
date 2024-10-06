# Bitcoin Explorer Project

## Introduction

The Bitcoin Explorer Project is a web application designed to provide real-time information about Bitcoin blocks. It demonstrates an end-to-end flow from user interface to database, including data ingestion from the Bitcoin network.

## Architecture

The project consists of three main components:

- **Frontend**: A React.js application that provides a user-friendly interface to display Bitcoin block data.
- **Backend**: A Node.js server using Express.js to handle API requests and interact with the database.
- **Data Layer**: A Rust-based program for extracting Bitcoin data and storing it in a PostgreSQL database.

## Features

- Real-time Bitcoin block data retrieval
- Interactive user interface with animated elements
- Efficient data storage and retrieval using PostgreSQL

## How to Run the Application

### Prerequisites

- Node.js
- Rust
- PostgreSQL

### Setup Instructions

1. **Database Setup**:
   - Install PostgreSQL.
   - Create a database named `postgres`.
   - Create a table named `bitcoin_details` with columns `height` (integer) and `hash` (text).

2. **Run the Rust Extractor**:
   - Navigate to the Rust project directory.
   - Run `cargo run` to start the data extraction process.

3. **Start the Backend**:
   - Navigate to the backend directory.
   - Run `npm install` to install dependencies.
   - Start the server with `node server.js`.

4. **Launch the Frontend**:
   - Navigate to the frontend directory.
   - Run `npm install` to install dependencies.
   - Start the React app with `npm start`.

## Technologies Used

- **React.js**: For building the user interface.
- **Node.js**: For handling backend logic and API requests.
- **Rust**: For efficient data extraction from the Bitcoin network.
- **PostgreSQL**: For storing and retrieving block data.

## Project Flow

1. The Rust program extracts Bitcoin data from an API and stores it in PostgreSQL.
2. The Node.js backend serves this data through an API endpoint.
3. The React frontend fetches and displays the data in an interactive format.

## Contributors

- Aakshatha Patil
- Sumanayana Konda
- Ruthwik BG

## References

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [BlockCypher API Documentation](https://www.blockcypher.com/dev/bitcoin/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
