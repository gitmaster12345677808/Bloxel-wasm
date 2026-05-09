#!/usr/bin/env bash
# Copy static files into server/public with %__RELEASE_UUID__% substituted.
# Use this after editing HTML/JS/CSS without wanting a full WASM rebuild.
set -euo pipefail

BASE_DIR="$(dirname -- "$(readlink -f -- "$0")")"
PUBLIC_DIR="$BASE_DIR/server/public"

# Find the existing release directory (12-char hex hash)
UUID=$(ls "$PUBLIC_DIR" | grep -E '^[a-f0-9]{12}$' | head -1)
if [[ -z "$UUID" ]]; then
  echo "No release directory found in $PUBLIC_DIR — run build_www.sh (or build_all.sh) first."
  exit 1
fi

RELEASE_DIR="$PUBLIC_DIR/$UUID"
echo "Release UUID: $UUID"

apply() {
  local src="$BASE_DIR/static/$1"
  local dst="$2"
  sed "s/%__RELEASE_UUID__%/$UUID/g" "$src" > "$dst"
  echo "  $1 → $dst"
}

apply index.html        "$PUBLIC_DIR/index.html"
apply launcher.js       "$RELEASE_DIR/launcher.js"
apply worker.js         "$RELEASE_DIR/worker.js"
apply app.webmanifest   "$PUBLIC_DIR/app.webmanifest"
apply service-worker.js "$PUBLIC_DIR/service-worker.js"

echo "Done."
