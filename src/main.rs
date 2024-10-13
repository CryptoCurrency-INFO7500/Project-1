use reqwest::Error as ReqwestError;
use serde::{Deserialize};
use tokio_postgres::{Client, NoTls, Error as PgError};

#[derive(Deserialize, Debug)]
struct ApiResponse {
    name: String,
    height: u64,
    hash: String,
    time: String,
    latest_url: String,
    previous_hash: String,
    previous_url: String,
    peer_count: i64,
    unconfirmed_count: i64,
    high_fee_per_kb: i64,
    medium_fee_per_kb: i64,
    low_fee_per_kb: i64,
    last_fork_height: i64,
    last_fork_hash: String,


    // Add any other fields you might want to store
}

async fn fetch_bitcoin_data(url: &str) -> Result<ApiResponse, ReqwestError> {
    let response = reqwest::get(url).await?.json::<ApiResponse>().await?;
    Ok(response)
}

async fn insert_bitcoin_data(client: &Client, details: &ApiResponse) -> Result<(), PgError> {
    let height = details.height as i64; // Convert u64 to i64

    client.execute(
        "INSERT INTO bitcoin_details (height, hash,time,latest_url,previous_hash,previous_url,peer_count,
            unconfirmed_count,
            high_fee_per_kb,
            medium_fee_per_kb,
            low_fee_per_kb,
            last_fork_height,
            last_fork_hash) VALUES ($1, $2, $3 ,$4 ,$5 ,$6, $7, $8 ,$9 ,$10 ,$11 ,$12 ,$13)",
        &[&height, &details.hash, &details.time, &details.latest_url, &details.previous_hash, &details.previous_url ,&details.peer_count ,&details.unconfirmed_count,
        &details.high_fee_per_kb, &details.medium_fee_per_kb, &details.low_fee_per_kb, &details.last_fork_height, &details.last_fork_hash],
    ).await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = "https://api.blockcypher.com/v1/btc/main"; // API endpoint
    let (client, connection) = tokio_postgres::connect("host=localhost port=5432 user=postgres password=1234 dbname=bitcoin_db", NoTls).await?;

    // Spawn the connection to run in the background
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {:?}", e);
        }
    });

    // Fetch Bitcoin data from the API
    match fetch_bitcoin_data(url).await {
        Ok(details) => {
            println!("Bitcoin data fetched: {:?}", details);
            // Insert data into PostgreSQL
            if let Err(e) = insert_bitcoin_data(&client, &details).await {
                eprintln!("Error inserting data: {:?}", e);
            } else {
                println!("Data inserted successfully.");
            }
        },
        Err(e) => {
            eprintln!("Error fetching data: {:?}", e);
        }
    }

    Ok(())
}
