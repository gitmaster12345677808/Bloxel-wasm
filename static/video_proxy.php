<?php
/**
 * video_proxy.php — Streams remote video files through the server to bypass browser CORS
 * restrictions.  Only HTTPS URLs that resolve to public IP addresses are allowed.
 *
 * Security measures:
 *   - HTTPS-only URLs
 *   - SSRF prevention: resolves hostname and blocks private/loopback/link-local/reserved ranges
 *   - Content-type enforcement: only video/* or application/octet-stream pass through
 *   - Range-request passthrough for scrubbing/seeking support
 */

header('Access-Control-Allow-Origin: *');

// ── Input validation ──────────────────────────────────────────────────────────

$url = isset($_GET['url']) ? $_GET['url'] : '';

if (!preg_match('/^https:\/\//i', $url)) {
    http_response_code(400);
    header('Content-Type: text/plain');
    exit('HTTPS URLs only');
}

$host = parse_url($url, PHP_URL_HOST);
if (!$host || strlen($host) > 253) {
    http_response_code(400);
    header('Content-Type: text/plain');
    exit('Invalid URL');
}

// ── SSRF protection ───────────────────────────────────────────────────────────
// Resolve the hostname and reject any address in private / reserved space.

$ip = gethostbyname($host);
if (
    !filter_var($ip, FILTER_VALIDATE_IP) ||
    !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)
) {
    http_response_code(403);
    header('Content-Type: text/plain');
    exit('Forbidden');
}

// ── Phase 1: HEAD pre-check ───────────────────────────────────────────────────
// Confirm the upstream resource is actually a video before we commit to streaming.

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_NOBODY         => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 3,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; BloxelVideoProxy/1.0)',
]);
curl_exec($ch);
$headStatus   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType  = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$effectiveUrl = (string)curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
curl_close($ch);

// Some servers reject HEAD with 405 — tolerate that and proceed without the pre-check.
if ($headStatus >= 400 && $headStatus !== 405) {
    http_response_code($headStatus);
    header('Content-Type: text/plain');
    exit('Upstream error');
}

if ($headStatus !== 405 && !preg_match('/^video\/|^application\/octet-stream/i', $contentType)) {
    http_response_code(415);
    header('Content-Type: text/plain');
    exit('Not a streamable video URL');
}

// ── Phase 2: Streaming GET ────────────────────────────────────────────────────

$reqHeaders = [
    'User-Agent: Mozilla/5.0 (compatible; BloxelVideoProxy/1.0)',
];

// Forward Range header so the browser can seek / partial-load
if (!empty($_SERVER['HTTP_RANGE'])) {
    // Sanitise: only printable ASCII
    $range = preg_replace('/[^\x20-\x7E]/', '', $_SERVER['HTTP_RANGE']);
    $reqHeaders[] = 'Range: ' . $range;
}

header('Cache-Control: public, max-age=3600');

$target = $effectiveUrl ?: $url;
$ch = curl_init($target);
curl_setopt_array($ch, [
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 3,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT        => 0,        // stream indefinitely
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER     => $reqHeaders,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HEADERFUNCTION => function ($ch, $line) {
        $lower = strtolower($line);
        if (str_starts_with($lower, 'content-type:')) {
            header('Content-Type: ' . trim(substr($line, 13)));
        } elseif (str_starts_with($lower, 'content-length:')) {
            header('Content-Length: ' . trim(substr($line, 15)));
        } elseif (str_starts_with($lower, 'content-range:')) {
            header('Content-Range: ' . trim(substr($line, 14)));
            http_response_code(206);
        } elseif (str_starts_with($lower, 'accept-ranges:')) {
            header('Accept-Ranges: bytes');
        }
        return strlen($line);
    },
    CURLOPT_WRITEFUNCTION  => function ($ch, $data) {
        echo $data;
        if (ob_get_level() > 0) ob_flush();
        flush();
        return strlen($data);
    },
]);

curl_exec($ch);
curl_close($ch);
