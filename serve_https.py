#!/usr/bin/env python3
"""Serve the built www/ directory over HTTPS with SharedArrayBuffer-safe headers."""

from __future__ import annotations

import argparse
import functools
import http.server
import mimetypes
import pathlib
import ssl


# Errors that mean the client simply hung up — not real server errors.
_CLIENT_DISCONNECT_ERRORS = (
    BrokenPipeError,
    ConnectionResetError,
    ssl.SSLEOFError,
)


class IsolatedRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Keep logs compact and useful in terminal output.
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        super().log_message(format, *args)

    def end_headers(self) -> None:
        # SharedArrayBuffer requires cross-origin isolation.
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "credentialless")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")

        path = self.path.split("?", 1)[0]
        if path in ("/service-worker.js", "/app.webmanifest", "/index.html", "/"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")

        super().end_headers()

    def handle_error(self) -> None:  # type: ignore[override]
        """Swallow expected client-disconnect errors silently."""
        import sys
        exc = sys.exc_info()[1]
        if isinstance(exc, _CLIENT_DISCONNECT_ERRORS):
            return
        super().handle_error()  # type: ignore[call-arg]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default="www", help="Directory to serve")
    parser.add_argument("--host", default="0.0.0.0", help="Address to bind")
    parser.add_argument("--port", type=int, default=8443, help="HTTPS port")
    parser.add_argument("--cert", required=True, help="TLS certificate PEM file")
    parser.add_argument("--key", required=True, help="TLS private key PEM file")
    return parser.parse_args()


def main() -> None:
    mimetypes.add_type("application/manifest+json", ".webmanifest")
    mimetypes.add_type("application/wasm", ".wasm")
    mimetypes.add_type("application/octet-stream", ".pack")

    args = parse_args()
    root = pathlib.Path(args.root).resolve()

    if not root.exists():
        raise SystemExit(f"Root directory does not exist: {root}")

    cert = pathlib.Path(args.cert).resolve()
    key = pathlib.Path(args.key).resolve()

    if not cert.exists():
        raise SystemExit(f"Certificate file does not exist: {cert}")
    if not key.exists():
        raise SystemExit(f"Key file does not exist: {key}")

    handler_cls = functools.partial(IsolatedRequestHandler, directory=str(root))

    class QuietServer(http.server.ThreadingHTTPServer):
        def handle_error(self, request, client_address) -> None:  # type: ignore[override]
            import sys
            exc = sys.exc_info()[1]
            if isinstance(exc, _CLIENT_DISCONNECT_ERRORS):
                return
            super().handle_error(request, client_address)

    httpd = QuietServer((args.host, args.port), handler_cls)

    ssl_ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_ctx.load_cert_chain(certfile=str(cert), keyfile=str(key))
    httpd.socket = ssl_ctx.wrap_socket(httpd.socket, server_side=True)

    print(f"Serving {root} at https://{args.host}:{args.port}")
    print("SAB headers: COOP=same-origin, COEP=require-corp")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
