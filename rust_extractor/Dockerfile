# Build stage
FROM rust:latest as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo build --release

# # Runtime stage
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl-dev \
    ca-certificates \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the built executable from the builder stage
COPY --from=builder /usr/src/myapp/target/release/rust_extractor /usr/local/bin/rust_extractor

# Set the entrypoint
CMD ["rust_extractor"]