#!/usr/bin/env python3
"""Generate icon-192.png and icon-512.png from static/icon.svg."""
import subprocess
import sys
import os

SVG = "static/icon.svg"
OUT_192 = "static/icon-192.png"
OUT_512 = "static/icon-512.png"

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def try_rsvg():
    for size, out in [(192, OUT_192), (512, OUT_512)]:
        r = subprocess.run(
            ["rsvg-convert", "-w", str(size), "-h", str(size), SVG, "-o", out],
            capture_output=True)
        if r.returncode != 0:
            return False
    return True

def try_inkscape():
    for size, out in [(192, OUT_192), (512, OUT_512)]:
        r = subprocess.run(
            ["inkscape", f"--export-type=png",
             f"--export-width={size}", f"--export-filename={out}", SVG],
            capture_output=True)
        if r.returncode != 0:
            return False
    return True

def try_convert():
    for size, out in [(192, OUT_192), (512, OUT_512)]:
        r = subprocess.run(
            ["convert", "-background", "none",
             "-resize", f"{size}x{size}", SVG, out],
            capture_output=True)
        if r.returncode != 0:
            return False
    return True

def try_cairosvg():
    try:
        import cairosvg
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "--quiet", "cairosvg"])
        import cairosvg
    for size, out in [(192, OUT_192), (512, OUT_512)]:
        cairosvg.svg2png(url=SVG, write_to=out, output_width=size, output_height=size)
    return True

def write_png_pure(size, out):
    """Generate a minimal PNG approximating the SVG using pure Python."""
    import zlib, struct

    W = H = size
    scale = size / 512.0

    # Build pixel data (RGBA)
    pixels = bytearray(W * H * 4)

    def set_pixel(px, py, r, g, b, a=255):
        if 0 <= px < W and 0 <= py < H:
            idx = (py * W + px) * 4
            pixels[idx]     = r
            pixels[idx + 1] = g
            pixels[idx + 2] = b
            pixels[idx + 3] = a

    def fill_rect(x, y, w, h, r, g, b, a=255, rx=0):
        for py in range(max(0, int(y)), min(H, int(y + h))):
            for px in range(max(0, int(x)), min(W, int(x + w))):
                # Corner rounding (simple box check)
                if rx > 0:
                    dx = min(px - x, x + w - 1 - px)
                    dy = min(py - y, y + h - 1 - py)
                    if dx < rx and dy < rx and (dx - rx)**2 + (dy - rx)**2 > rx**2:
                        continue
                set_pixel(px, py, r, g, b, a)

    # Outer dark rect (full canvas)
    for i in range(W * H):
        pixels[i*4]   = 10
        pixels[i*4+1] = 4
        pixels[i*4+2] = 22
        pixels[i*4+3] = 255

    # Inner gradient rect (purple)
    inner_rx = int(96 * scale)
    for py in range(H):
        t = py / (H - 1)
        r_c = int(0x8b + (0x3b - 0x8b) * t)
        g_c = int(0x5c + (0x07 - 0x5c) * t)
        b_c = int(0xf6 + (0x64 - 0xf6) * t)
        ix0 = int(16 * scale)
        ix1 = int((16 + 480) * scale)
        iy0 = int(16 * scale)
        iy1 = int((16 + 480) * scale)
        for px in range(ix0, ix1):
            # Simple rounded-rect check
            dx = min(px - ix0, ix1 - 1 - px)
            dy = min(py - iy0, iy1 - 1 - py)
            if (iy0 <= py < iy1) and (dx >= inner_rx or dy >= inner_rx or
                    (dx - inner_rx)**2 + (dy - inner_rx)**2 <= inner_rx**2):
                idx = (py * W + px) * 4
                pixels[idx]   = r_c
                pixels[idx+1] = g_c
                pixels[idx+2] = b_c
                pixels[idx+3] = 255

    # White block rects (the B letterform)
    blocks = [
        # Row 0
        (119, 63), (175, 63), (231, 63), (287, 63),
        # Row 1
        (119, 119), (287, 119),
        # Row 2
        (119, 175), (287, 175),
        # Row 3
        (119, 231), (175, 231), (231, 231), (287, 231),
        # Row 4
        (119, 287), (343, 287),
        # Row 5
        (119, 343), (343, 343),
        # Row 6
        (119, 399), (175, 399), (231, 399), (287, 399), (343, 399),
    ]
    for bx, by in blocks:
        fill_rect(bx * scale, by * scale, 50 * scale, 50 * scale,
                  255, 255, 255, 255, rx=int(5 * scale))

    # Encode PNG
    def chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", c)

    ihdr = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)
    # Build IDAT: filter byte 0 before each row
    raw = b""
    for row in range(H):
        raw += b"\x00" + bytes(pixels[row*W*4:(row+1)*W*4])
    idat = zlib.compress(raw, 9)

    png = (b"\x89PNG\r\n\x1a\n" +
           chunk(b"IHDR", ihdr) +
           chunk(b"IDAT", idat) +
           chunk(b"IEND", b""))
    with open(out, "wb") as f:
        f.write(png)

tried = []
success = False

if not success:
    try:
        success = try_rsvg()
        if success:
            tried.append("rsvg-convert")
    except FileNotFoundError:
        pass

if not success:
    try:
        success = try_inkscape()
        if success:
            tried.append("inkscape")
    except FileNotFoundError:
        pass

if not success:
    try:
        success = try_convert()
        if success:
            tried.append("imagemagick-convert")
    except FileNotFoundError:
        pass

if not success:
    try:
        success = try_cairosvg()
        if success:
            tried.append("cairosvg")
    except Exception as e:
        print(f"cairosvg failed: {e}")

if not success:
    print("All external tools failed. Generating approximation with pure Python...")
    write_png_pure(192, OUT_192)
    write_png_pure(512, OUT_512)
    tried.append("pure-python")
    success = True

if success:
    print(f"SUCCESS — tool used: {tried[-1]}")
    for f in [OUT_192, OUT_512]:
        sz = os.path.getsize(f)
        print(f"  {f}: {sz} bytes")
else:
    print("FAILED to generate PNG icons.")
    sys.exit(1)
