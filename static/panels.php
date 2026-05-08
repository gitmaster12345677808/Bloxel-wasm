<?php
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); ob_end_clean(); exit; }

$db = new SQLite3('etherdeck_users.db');
$db->enableExceptions(true);

$db->exec('CREATE TABLE IF NOT EXISTS panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    dropped_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
)');

function jsonOut($data) {
    ob_end_clean();
    echo json_encode($data);
    exit;
}

function verifyToken($db, $username, $token) {
    if (empty($username) || empty($token)) return false;
    $s = $db->prepare('SELECT id FROM users WHERE username=:u AND auth_token=:t');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $s->bindValue(':t', $token,    SQLITE3_TEXT);
    return (bool)$s->execute()->fetchArray();
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($action === 'list') {
    $res = $db->query("SELECT id, url, title, dropped_by, created_at FROM panels WHERE expires_at IS NULL OR expires_at > datetime('now') ORDER BY created_at DESC LIMIT 5");
    $panels = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) $panels[] = $row;
    jsonOut(['panels' => $panels]);
}

if ($action === 'drop' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $url   = trim($_POST['url']   ?? '');
    $title = trim($_POST['title'] ?? '') ?: $url;
    $user  = trim($_POST['username'] ?? '');
    $tok   = trim($_POST['token'] ?? '');

    if (!preg_match('/^https?:\/\//i', $url)) jsonOut(['success' => false, 'message' => 'Invalid URL']);

    // Replace existing panel from same user so they don't pile up
    if ($user) {
        $s = $db->prepare('DELETE FROM panels WHERE dropped_by=:u');
        $s->bindValue(':u', $user, SQLITE3_TEXT);
        $s->execute();
    }

    $s = $db->prepare("INSERT INTO panels (url, title, dropped_by, expires_at) VALUES (:url, :title, :by, datetime('now', '+1 hour'))");
    $s->bindValue(':url',   $url,   SQLITE3_TEXT);
    $s->bindValue(':title', $title, SQLITE3_TEXT);
    $s->bindValue(':by',    $user ?: 'anonymous', SQLITE3_TEXT);
    $s->execute();

    jsonOut(['success' => true, 'id' => $db->lastInsertRowID()]);
}

if ($action === 'remove' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id   = (int)($_POST['id']       ?? 0);
    $user = trim($_POST['username']  ?? '');
    $tok  = trim($_POST['token']     ?? '');

    if (!$id) jsonOut(['success' => false, 'message' => 'No id']);

    if ($user && $tok) {
        if (!verifyToken($db, $user, $tok)) jsonOut(['success' => false, 'message' => 'Authentication failed']);
        $s = $db->prepare('DELETE FROM panels WHERE id=:id AND dropped_by=:u');
        $s->bindValue(':id', $id, SQLITE3_INTEGER);
        $s->bindValue(':u',  $user, SQLITE3_TEXT);
        $s->execute();
    }

    jsonOut(['success' => true]);
}

jsonOut(['success' => false, 'message' => 'Unknown action']);
