Bloxel
======

Bloxel is a browser-based voxel game built on [Minetest / Luanti](https://www.minetest.net/) compiled to WebAssembly via Emscripten. It ships with a self-contained Node.js server that handles HTTPS, authentication, friends/social features, and a built-in WebSocket proxy for multiplayer.


System Requirements
-------------------

Building the WebAssembly game has only been tested on **Ubuntu 20.04+**:

    sudo apt-get install -y build-essential cmake tclsh

Running the server requires **Node.js 18+** and **MySQL 8+** (or MariaDB 10.6+).


Building
--------

A full build compiles all dependencies from source and produces the game assets in `server/public/`:

    ./build_all.sh

This takes 20–40 minutes on a modern machine. Emscripten (emsdk) is downloaded and installed automatically the first time.

If you only changed static files (HTML, JS, CSS, YAML) and the WASM is already compiled, you can skip the full build and just refresh the static assets:

    ./build_www.sh

### Incremental WASM rebuild

To recompile only Minetest without rebuilding all dependencies:

    INCREMENTAL=true ./build_minetest.sh && ./build_www.sh

### Build variants

    BUILD_KIND=debug   ./build_all.sh   # debug symbols, heap checks
    BUILD_KIND=profile ./build_all.sh   # profiling build
    BUILD_KIND=release ./build_all.sh   # default, optimised


Running the Server
------------------

Install dependencies once:

    cd server
    npm install

Create a `.env` file (copy from the example):

    cp .env.example .env
    # edit .env with your database credentials and preferred port

Start the server:

    npm start

The server listens on `https://0.0.0.0:3000` by default (port configurable via `PORT` in `.env`). Open:

    https://localhost:3000

A self-signed TLS certificate is generated automatically in `server/certs/` on first run. Accept the browser warning once for local development.

To test from a phone or another device on the same LAN, open `https://<your-machine-ip>:3000` and trust the certificate on that device.

For production you should place the server behind a reverse proxy (nginx, Caddy) with a real TLS certificate.

### Why HTTPS?

SharedArrayBuffer (required for WASM threads) is only available in cross-origin isolated contexts. The server automatically sets the required headers:

    Cross-Origin-Opener-Policy: same-origin
    Cross-Origin-Embedder-Policy: require-corp


Configuration
-------------

All configuration is via environment variables, read from `server/.env`:

| Variable      | Default     | Description                             |
|---------------|-------------|-----------------------------------------|
| `PORT`        | `3000`      | HTTPS listen port                       |
| `WS_PORT`     | `8888`      | Internal WebSocket proxy port (loopback)|
| `DB_HOST`     | `localhost` | MySQL host                              |
| `DB_PORT`     | `3306`      | MySQL port                              |
| `DB_USER`     | `bloxel`    | MySQL user                              |
| `DB_PASSWORD` | `changeme`  | MySQL password                          |
| `DB_NAME`     | `bloxel`    | MySQL database name                     |

Database tables are created automatically on first start (no manual migration needed).


Architecture
------------

    browser
       │  HTTPS + WSS  (port 3000)
       ▼
    server/index.js          ← Express + HTTPS server
       ├── /api/auth          ← register, login, token auth
       ├── /api/friends       ← friend requests, invites, messages
       ├── /api/panels        ← stream panels
       ├── /api/video-proxy   ← video proxy
       ├── /proxy  (WSS)      ← WebSocket relay → ws://localhost:8888
       └── /*                 ← serves server/public/ (built game)
            │
            ▼
    server/ws/main.js        ← original minetest-wasm proxy (child process)
       ├── MAKEVPN / VPN      ← friend-invite join codes
       └── PROXY TCP/UDP      ← forwards game traffic to Minetest servers


Network Play / Proxy
--------------------

The built-in proxy runs as a child process on `ws://localhost:8888` and is relayed through the main HTTPS server at `wss://<host>/proxy`. No separate proxy setup is required.

The game also ships with fallback proxies in other regions (selectable in the launcher):

| Region           | Address                           |
|------------------|-----------------------------------|
| North America    | wss://na1.dustlabs.io/mtproxy     |
| South America    | wss://sa1.dustlabs.io/mtproxy     |
| Europe           | wss://eu1.dustlabs.io/mtproxy     |
| Asia             | wss://ap1.dustlabs.io/mtproxy     |
| Australia        | wss://ap2.dustlabs.io/mtproxy     |

To add locally-hosted Minetest servers, edit `server/ws/settings.js` and add entries to `DIRECT_PROXY`:

    ['192.168.0.1', '127.0.0.1', 30000],  // [virtualIP, realIP, realPort]

The proxy also passes UDP traffic directly to any IP:port, so players can connect to arbitrary public Minetest servers.


Friends & Social Features
-------------------------

Bloxel includes a built-in social layer:

- **Accounts** — register and log in with username + password
- **Friends** — send/accept friend requests
- **Invites** — invite a friend directly into your world with one click
- **Messages** — send short messages between friends
- **Status** — online presence and current server shown to friends


Servers List
------------

The servers shown in the launcher are defined in `static/servers.yml`. Edit that file and run `./build_www.sh` to update the list without a full rebuild.


Custom Emscripten
-----------------

Emscripten is downloaded and installed automatically into `emsdk/` on the first build. To use an existing installation:

    export EMSDK=/path/to/emsdk
    source $EMSDK/emsdk_env.sh
    ./build_all.sh

An external Emscripten may need to be patched once:

    ./apply_patches.sh /path/to/emsdk


Mobile / PWA
------------

The app is installable as a PWA on Android and can be added to the home screen on iOS. Touch-first controls are not yet implemented — a keyboard, mouse, or controller is still needed for gameplay on most mobile browsers.


VR
--

VR is not supported. The current port uses the standard browser canvas and would require explicit WebXR integration in the engine and render loop.
