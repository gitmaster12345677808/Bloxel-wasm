Minetest-wasm
=============

This is an experimental port of Minetest to the web using emscripten/WebAssembly.


System Requirements
-------------------
This has only been tested on Ubuntu 20.04.

* Ubuntu: apt-get install -y build-essential cmake tclsh

Building
---------

    cd minetest-wasm
    ./build_all.sh

Installation
------------

If the build completes successfully, the www/ directory will contain the entire application. This 
includes an `.htaccess` file which sets headers that are required (by browsers) to load the app. 
If your webserver does not recognize `.htaccess` files, you may need to set the headers in
another way.

Mobile / PWA Support
--------------------

The generated site is installable as a web app on Android and can be added to the home screen on
iOS. The launcher now uses mobile-safe viewport sizing and caps the native canvas resolution so the
render target does not grow beyond reasonable limits on phones and tablets.

Gameplay on mobile browsers still depends on available input methods. Touch-first controls are not
implemented in this repository, so a keyboard, mouse, or controller may still be needed depending
on the browser and device.

VR / headset support is not implemented. The current port uses the existing browser canvas path and
would need explicit WebXR integration in the engine and render loop to support immersive VR.

Local HTTPS Testing (SharedArrayBuffer)
---------------------------------------

SharedArrayBuffer requires cross-origin isolation. For this app that means HTTPS plus these headers
on the document and assets:

* `Cross-Origin-Opener-Policy: same-origin`
* `Cross-Origin-Embedder-Policy: require-corp`

This repository includes a local HTTPS server that sets those headers automatically.

From the repository root:

    ./build_www.sh
    bash ./serve_https.sh

Then open:

    https://localhost:8443

Notes:

* `serve_https.sh` creates a self-signed certificate in `.certs/` on first run.
* If your browser warns about the certificate, accept/trust it for local testing.
* To test from another device on your LAN, run with host/port overrides:

      HOST=0.0.0.0 PORT=8443 bash ./serve_https.sh

  and open `https://<your-machine-ip>:8443` on the device.

Network Play
------------

By default, the proxy server is set to `wss://minetest.dustlabs.io/proxy` (see static/launcher.js).
This is necessary for network play, since websites cannot open normal TCP/UDP sockets. This proxy
is located in California. There are regional proxies which may perform better depending on your
location:

North America (Dallas) - wss://na1.dustlabs.io/mtproxy
South America (Sao Paulo) - wss://sa1.dustlabs.io/mtproxy
Europe (Frankfurt) - wss://eu1.dustlabs.io/mtproxy
Asia (Singapore) - wss://ap1.dustlabs.io/mtproxy
Australia (Melbourne) - wss://ap2.dustlabs.io/mtproxy

You could also roll your own own custom proxy server. The client code is here:

https://github.com/paradust7/webshims/blob/main/src/emsocket/proxy.js

Custom Emscripten
-----------------
The Emscripten SDK (emsdk) will be downloaded and installed the first time you build. To provide
your own instead, set $EMSDK before building (e.g. using `emsdk_env.sh`). An external Emscripten
may need to be patched by running this exactly once:

    ./apply_patches.sh /path/to/emsdk
