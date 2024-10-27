use reqwest::Error as ReqwestError;
use serde::{Deserialize};
use tokio_postgres::{Client, NoTls, Error as PgError};
use chrono::{DateTime, Utc};
use std::time::Duration;

#[derive(Deserialize, Debug)]
struct BlockchainApiResponse {
    name: String,
    height: u64,
    hash: String,
    time: DateTime<Utc>,
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
}

#[derive(Deserialize, Debug)]
struct PriceApiResponse {
    bitcoin: PriceData,
}

#[derive(Deserialize, Debug)]
struct PriceData {
    usd: f64,
    usd_24h_vol: f64,
}

async fn fetch_bitcoin_data(url: &str) -> Result<BlockchainApiResponse, ReqwestError> {
    println!("Fetching Bitcoin data from {}", url);
    let response = reqwest::get(url).await?.json::<BlockchainApiResponse>().await?;
    println!("Bitcoin data fetched successfully");
    Ok(response)
}

async fn fetch_bitcoin_price() -> Result<PriceData, ReqwestError> {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_vol=true";
    println!("Fetching Bitcoin price from {}", url);
    let response = reqwest::get(url).await?.json::<PriceApiResponse>().await?;
    println!("Bitcoin price fetched successfully");
    Ok(response.bitcoin)
}

async fn create_table_if_not_exists(client: &Client) -> Result<(), PgError> {
    println!("Creating table if not exists");
    client.execute(
        "CREATE TABLE IF NOT EXISTS bitcoin_details (
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
        )",
        &[],
    ).await?;
    println!("Table created or already exists");
    Ok(())
}

async fn insert_bitcoin_data(client: &Client, block: &BlockchainApiResponse, price: &PriceData) -> Result<(), PgError> {
    println!("Inserting Bitcoin data into database");
    client.execute(
        "INSERT INTO bitcoin_details (
            height, hash, time, latest_url, previous_hash, previous_url, 
            peer_count, unconfirmed_count, high_fee_per_kb, medium_fee_per_kb, 
            low_fee_per_kb, last_fork_height, last_fork_hash, price, volume_24h
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
        &[
            &(block.height as i64), &block.hash, &block.time, &block.latest_url, 
            &block.previous_hash, &block.previous_url, &block.peer_count, 
            &block.unconfirmed_count, &block.high_fee_per_kb, &block.medium_fee_per_kb, 
            &block.low_fee_per_kb, &block.last_fork_height, &block.last_fork_hash, 
            &price.usd, &price.usd_24h_vol
        ],
    ).await?;
    println!("Data inserted successfully");
    Ok(())
}

async fn add_missing_columns(client: &Client) -> Result<(), PgError> {
    println!("Checking for missing columns");
    let columns_to_check = [
        ("latest_url", "TEXT"),
        ("previous_url", "TEXT"),
    ];

    for (column_name, column_type) in columns_to_check.iter() {
        let query = format!(
            "ALTER TABLE bitcoin_details ADD COLUMN IF NOT EXISTS {} {}",
            column_name, column_type
        );
        client.execute(&query, &[]).await?;
        println!("Added column {} if it didn't exist", column_name);
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting Bitcoin data extractor");
    let blockchain_url = "https://api.blockcypher.com/v1/btc/main";
    let db_url = "host=db port=5432 user=postgres password=postgres dbname=postgres";
    
    println!("Connecting to database: {}", db_url);
    let (client, connection) = tokio_postgres::connect(db_url, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {:?}", e);
        }
    });

    println!("Connected to database successfully");

    if let Err(e) = create_table_if_not_exists(&client).await {
        eprintln!("Error creating table: {:?}", e);
        return Err(e.into());
    }

    if let Err(e) = add_missing_columns(&client).await {
        eprintln!("Error adding missing columns: {:?}", e);
        return Err(e.into());
    }

    println!("Starting main loop");
    loop {
        match fetch_bitcoin_data(blockchain_url).await {
            Ok(block_details) => {
                match fetch_bitcoin_price().await {
                    Ok(price_data) => {
                        println!("Bitcoin data fetched: Height: {}, Price: ${}", block_details.height, price_data.usd);
                        if let Err(e) = insert_bitcoin_data(&client, &block_details, &price_data).await {
                            eprintln!("Error inserting data: {:?}", e);
                        } else {
                            println!("Data inserted successfully.");
                        }
                    },
                    Err(e) => eprintln!("Error fetching price: {:?}", e),
                }
            },
            Err(e) => eprintln!("Error fetching blockchain data: {:?}", e),
        }

        println!("Waiting for 60 seconds before next update");
        tokio::time::sleep(Duration::from_secs(60)).await;
    }
}