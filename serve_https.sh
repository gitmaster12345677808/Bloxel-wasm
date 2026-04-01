#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-www}"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8443}"
CERT_DIR=".certs"
CERT_FILE="$CERT_DIR/localhost.crt"
KEY_FILE="$CERT_DIR/localhost.key"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Missing directory: $ROOT_DIR"
  echo "Build first (or pass another directory), for example:"
  echo "  ./build_www.sh"
  exit 1
fi

mkdir -p "$CERT_DIR"

if [[ ! -f "$CERT_FILE" || ! -f "$KEY_FILE" ]]; then
  echo "Generating self-signed TLS certificate in $CERT_DIR/ ..."
  openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 -nodes \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
fi

echo "Starting HTTPS server on https://localhost:$PORT"
echo "Root: $ROOT_DIR"
echo ""
echo "If testing from another device, use your host IP with this port."
echo "You must trust the self-signed cert on that device/browser."

exec python3 serve_https.py \
  --root "$ROOT_DIR" \
  --host "$HOST" \
  --port "$PORT" \
  --cert "$CERT_FILE" \
  --key "$KEY_FILE"
