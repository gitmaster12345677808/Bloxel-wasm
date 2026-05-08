<?php
header('Access-Control-Allow-Origin: *');

$url = isset($_GET['url']) ? trim($_GET['url']) : '';

if (!preg_match('/^https:\/\//i', $url)) {
    http_response_code(400);
    exit('HTTPS URLs only');
}

$host = parse_url($url, PHP_URL_HOST);
if (!$host) {
    http_response_code(400);
    exit('Invalid URL');
}

// SSRF: block private/reserved IPs
$ip = gethostbyname($host);
if (
    !filter_var($ip, FILTER_VALIDATE_IP) ||
    !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)
) {
    http_response_code(403);
    exit('Forbidden');
}

// Derive MIME from extension — never trust upstream Content-Type
$ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION));
$mime_map = array(
    'mp4'  => 'video/mp4',
    'm4v'  => 'video/mp4',
    'webm' => 'video/webm',
    'ogg'  => 'video/ogg',
    'ogv'  => 'video/ogg',
    'mov'  => 'video/quicktime',
    'mkv'  => 'video/x-matroska',
    'avi'  => 'video/x-msvideo',
);
$mime = isset($mime_map[$ext]) ? $mime_map[$ext] : 'video/mp4';

header('Content-Type: ' . $mime);
header('Accept-Ranges: bytes');
header('Cache-Control: public, max-age=3600');

// Forward Range header for seeking support
$req_headers = array('User-Agent: Mozilla/5.0 (compatible; BloxelVideoProxy/1.0)');
if (!empty($_SERVER['HTTP_RANGE'])) {
    $range = preg_replace('/[^\x20-\x7E]/', '', $_SERVER['HTTP_RANGE']);
    $req_headers[] = 'Range: ' . $range;
}

$ch = curl_init($url);
curl_setopt_array($ch, array(
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 3,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT        => 0,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER     => $req_headers,
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_HEADERFUNCTION => function($ch, $line) {
        $lower = strtolower($line);
        // Forward Content-Length and Content-Range for range requests / seeking
        if (strpos($lower, 'content-length:') === 0) {
            header('Content-Length: ' . trim(substr($line, 15)));
        } elseif (strpos($lower, 'content-range:') === 0) {
            header('Content-Range: ' . trim(substr($line, 14)));
            http_response_code(206);
        }
        return strlen($line);
    },
    CURLOPT_WRITEFUNCTION  => function($ch, $data) {
        echo $data;
        if (ob_get_level() > 0) ob_flush();
        flush();
        return strlen($data);
    },
));

curl_exec($ch);
curl_close($ch);
