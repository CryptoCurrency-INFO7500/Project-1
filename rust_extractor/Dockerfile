# FROM rust:latest as builder
# WORKDIR /usr/src/app
# COPY . .
# RUN cargo build --release

# FROM debian:bullseye-slim
# RUN apt-get update && \
#     apt-get update && apt-get install -y libssl3 \
#     apt-get install -y ca-certificates && \
#     rm -rf /var/lib/apt/lists/*
# COPY --from=builder /usr/src/app/target/release/rust_extractor /usr/local/bin/
# CMD ["rust_extractor"]

FROM rust:latest as builder

WORKDIR /usr/src/myapp
COPY . .

RUN cargo build --release

FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/myapp/target/release/rust_extractor /usr/local/bin/rust_extractor

CMD ["rust_extractor"]
