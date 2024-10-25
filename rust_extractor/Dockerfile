# Use the official Rust image as a build environment
FROM rust:latest AS builder

WORKDIR /usr/src/app

# Copy the entire project into the container
COPY . .

# Build for release
RUN cargo build --release

# Use a smaller base image for running the application
FROM debian:buster-slim

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/app/target/release/bitcoin_explorer .

# Make sure the binary is executable
RUN chmod +x /app/bitcoin_explorer

# Set the startup command to run your binary
CMD ["./bitcoin_explorer"]
