<?php
ob_start();

set_error_handler(function($errno, $errstr) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $errstr]);
    exit;
});
set_exception_handler(function($e) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── Database ─────────────────────────────────────────────────────────────────
$db = new SQLite3('etherdeck_users.db');
$db->enableExceptions(true);
$db->exec('PRAGMA journal_mode=WAL');

$db->exec('
CREATE TABLE IF NOT EXISTS videos_global (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    url          TEXT NOT NULL,
    title        TEXT NOT NULL DEFAULT "",
    submitted_by TEXT NOT NULL DEFAULT "",
    status       TEXT NOT NULL DEFAULT "pending",
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
)');

$db->exec('
CREATE TABLE IF NOT EXISTS videos_shared (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    url        TEXT NOT NULL,
    title      TEXT NOT NULL DEFAULT "",
    shared_by  TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)');

// ── Helpers ───────────────────────────────────────────────────────────────────
function resp($success, $data = null, $msg = '') {
    ob_end_clean();
    $out = ['success' => $success, 'message' => $msg];
    if ($data !== null) $out = array_merge($out, $data);
    echo json_encode($out);
    exit;
}

function getUsername($db) {
    // Accept username from POST body (FormData), GET param, or JSON body
    $raw = json_decode(file_get_contents('php://input'), true) ?? [];
    $u = trim($_POST['username'] ?? $_POST['token'] ?? $_GET['username'] ?? $raw['username'] ?? '');
    return $u;
}

function isAdmin($db, $username) {
    if (empty($username)) return false;
    $s = $db->prepare('SELECT is_admin FROM users WHERE username=:u');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $row = $s->execute()->fetchArray(SQLITE3_ASSOC);
    return $row && (int)$row['is_admin'] === 1;
}

function areFriends($db, $a, $b) {
    list($u1, $u2) = $a < $b ? [$a, $b] : [$b, $a];
    $s = $db->prepare('SELECT id FROM friendships WHERE user1=:u1 AND user2=:u2');
    $s->bindValue(':u1', $u1, SQLITE3_TEXT);
    $s->bindValue(':u2', $u2, SQLITE3_TEXT);
    return (bool)$s->execute()->fetchArray();
}

function sanitiseUrl($url) {
    $url = trim($url);
    if (!preg_match('#^https?://#i', $url)) return null;
    return $url;
}

$action   = $_GET['action'] ?? ($_POST['action'] ?? '');
$postData = $_POST;          // FormData comes through $_POST

// ── GET: global approved videos ───────────────────────────────────────────────
if ($action === 'global') {
    $res = $db->query("SELECT id, url, title, submitted_by FROM videos_global WHERE status='approved' ORDER BY created_at DESC LIMIT 100");
    $videos = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $videos[] = ['id' => $row['id'], 'url' => $row['url'], 'title' => $row['title'], 'sharedBy' => $row['submitted_by']];
    }
    resp(true, ['videos' => $videos]);
}

// ── GET: friend-shared videos for a user ─────────────────────────────────────
if ($action === 'friend_videos') {
    $username = getUsername($db);
    $videos   = [];
    $is_admin = false;

    if (!empty($username)) {
        $is_admin = isAdmin($db, $username);

        // Get all friends
        $s = $db->prepare("
            SELECT CASE WHEN user1=:u THEN user2 ELSE user1 END AS friend
            FROM friendships WHERE user1=:u OR user2=:u
        ");
        $s->bindValue(':u', $username, SQLITE3_TEXT);
        $res = $s->execute();
        $friends = [];
        while ($row = $res->fetchArray(SQLITE3_ASSOC)) $friends[] = $row['friend'];

        if ($friends) {
            $placeholders = implode(',', array_fill(0, count($friends), '?'));
            $stmt = $db->prepare("SELECT id, url, title, shared_by FROM videos_shared WHERE shared_by IN ($placeholders) ORDER BY created_at DESC LIMIT 50");
            foreach ($friends as $i => $f) $stmt->bindValue($i + 1, $f, SQLITE3_TEXT);
            $res2 = $stmt->execute();
            while ($row = $res2->fetchArray(SQLITE3_ASSOC)) {
                $videos[] = ['id' => $row['id'], 'url' => $row['url'], 'title' => $row['title'], 'sharedBy' => $row['shared_by']];
            }
        }
    }

    resp(true, ['videos' => $videos, 'is_admin' => $is_admin]);
}

// ── GET: pending submissions (admin only) ─────────────────────────────────────
if ($action === 'pending') {
    $username = getUsername($db);
    if (!isAdmin($db, $username)) { resp(false, null, 'Forbidden'); }
    $res = $db->query("SELECT id, url, title, submitted_by FROM videos_global WHERE status='pending' ORDER BY created_at ASC LIMIT 100");
    $videos = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $videos[] = ['id' => $row['id'], 'url' => $row['url'], 'title' => $row['title'], 'submitted_by' => $row['submitted_by']];
    }
    resp(true, ['videos' => $videos]);
}

// ── POST: submit a video to the global queue ──────────────────────────────────
if ($action === 'submit_global') {
    $username = trim($postData['username'] ?? $postData['token'] ?? '');
    $url      = sanitiseUrl($postData['url'] ?? '');
    $title    = trim(substr($postData['title'] ?? '', 0, 200));

    if (!$url) resp(false, null, 'Invalid URL');
    if (empty($title)) $title = $url;

    $s = $db->prepare('INSERT INTO videos_global (url, title, submitted_by, status) VALUES (:url, :title, :by, "pending")');
    $s->bindValue(':url',   $url,      SQLITE3_TEXT);
    $s->bindValue(':title', $title,    SQLITE3_TEXT);
    $s->bindValue(':by',    $username, SQLITE3_TEXT);
    $s->execute();
    resp(true, null, 'Submitted for admin review');
}

// ── POST: share a video with friends ──────────────────────────────────────────
if ($action === 'share_with_friends') {
    $username = trim($postData['username'] ?? $postData['token'] ?? '');
    $url      = sanitiseUrl($postData['url'] ?? '');
    $title    = trim(substr($postData['title'] ?? '', 0, 200));

    if (!$url) resp(false, null, 'Invalid URL');
    if (empty($username)) resp(false, null, 'Not logged in');
    if (empty($title)) $title = $url;

    // Remove any previous share by this user (only keep the latest)
    $s = $db->prepare('DELETE FROM videos_shared WHERE shared_by=:u');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $s->execute();

    $s = $db->prepare('INSERT INTO videos_shared (url, title, shared_by) VALUES (:url, :title, :by)');
    $s->bindValue(':url',   $url,      SQLITE3_TEXT);
    $s->bindValue(':title', $title,    SQLITE3_TEXT);
    $s->bindValue(':by',    $username, SQLITE3_TEXT);
    $s->execute();
    resp(true, null, 'Shared');
}

// ── POST: admin approve / reject ──────────────────────────────────────────────
if ($action === 'approve_video' || $action === 'reject_video') {
    $username = trim($postData['username'] ?? $postData['token'] ?? '');
    if (!isAdmin($db, $username)) resp(false, null, 'Forbidden');

    $id     = (int)($postData['id'] ?? 0);
    $status = ($action === 'approve_video') ? 'approved' : 'rejected';
    $s = $db->prepare('UPDATE videos_global SET status=:s WHERE id=:id');
    $s->bindValue(':s',  $status, SQLITE3_TEXT);
    $s->bindValue(':id', $id,     SQLITE3_INTEGER);
    $s->execute();
    resp(true, null, ucfirst($status));
}

resp(false, null, 'Unknown action');
