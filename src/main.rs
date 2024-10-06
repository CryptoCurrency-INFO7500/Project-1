use reqwest::Error as ReqwestError;
use serde::{Deserialize};
use tokio_postgres::{Client, NoTls, Error as PgError};

#[derive(Deserialize, Debug)]
struct ApiResponse {
    name: String,
    height: u64,
    hash: String,
    // Add any other fields you might want to store
}

async fn fetch_bitcoin_data(url: &str) -> Result<ApiResponse, ReqwestError> {
    let response = reqwest::get(url).await?.json::<ApiResponse>().await?;
    Ok(response)
}

async fn insert_bitcoin_data(client: &Client, details: &ApiResponse) -> Result<(), PgError> {
    let height = details.height as i64; // Convert u64 to i64

    client.execute(
        "INSERT INTO bitcoin_details (height, hash) VALUES ($1, $2)",
        &[&height, &details.hash],
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
