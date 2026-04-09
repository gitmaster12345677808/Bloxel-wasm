<?php
ob_start();

set_error_handler(function($errno, $errstr) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $errstr, 'data' => null]);
    exit;
});

set_exception_handler(function($e) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage(), 'data' => null]);
    exit;
});

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); exit;
}

// ── Database ─────────────────────────────────────────────────────────────────
$db = new SQLite3('etherdeck_users.db');
$db->enableExceptions(true);
$db->exec('PRAGMA journal_mode=WAL');

$db->exec('
CREATE TABLE IF NOT EXISTS friendships (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user1      TEXT NOT NULL,
    user2      TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1, user2)
)');

$db->exec('
CREATE TABLE IF NOT EXISTS friend_requests (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    from_username TEXT NOT NULL,
    to_username   TEXT NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_username, to_username)
)');

$db->exec('
CREATE TABLE IF NOT EXISTS messages (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    from_username TEXT NOT NULL,
    to_username   TEXT NOT NULL,
    message       TEXT NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_flag     INTEGER DEFAULT 0
)');

$db->exec('
CREATE TABLE IF NOT EXISTS invites (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    from_username  TEXT NOT NULL,
    to_username    TEXT NOT NULL,
    server_address TEXT NOT NULL,
    server_port    INTEGER NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
)');

$db->exec('
CREATE TABLE IF NOT EXISTS user_status (
    username       TEXT PRIMARY KEY,
    online         INTEGER DEFAULT 0,
    server_address TEXT DEFAULT NULL,
    server_port    INTEGER DEFAULT NULL,
    last_seen      DATETIME DEFAULT CURRENT_TIMESTAMP
)');

// ── Helpers ───────────────────────────────────────────────────────────────────
function response($success, $message, $data = null) {
    ob_end_clean();
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

function areFriends($db, $a, $b) {
    list($u1, $u2) = $a < $b ? [$a, $b] : [$b, $a];
    $s = $db->prepare('SELECT id FROM friendships WHERE user1=:u1 AND user2=:u2');
    $s->bindValue(':u1', $u1, SQLITE3_TEXT);
    $s->bindValue(':u2', $u2, SQLITE3_TEXT);
    return (bool)$s->execute()->fetchArray();
}

function userExists($db, $username) {
    $s = $db->prepare('SELECT id FROM users WHERE username=:u');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    return (bool)$s->execute()->fetchArray();
}

// ── Request data ──────────────────────────────────────────────────────────────
$data   = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? '';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS — update online/offline + server info
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'update_status') {
    $username = trim($data['username'] ?? '');
    $online   = !empty($data['online']) ? 1 : 0;
    $addr     = trim($data['server_address'] ?? '');
    $port     = (int)($data['server_port'] ?? 0);

    if (empty($username)) response(false, 'username required');

    $s = $db->prepare('
        INSERT INTO user_status (username, online, server_address, server_port, last_seen)
        VALUES (:u, :online, :addr, :port, CURRENT_TIMESTAMP)
        ON CONFLICT(username) DO UPDATE SET
            online=excluded.online,
            server_address=excluded.server_address,
            server_port=excluded.server_port,
            last_seen=CURRENT_TIMESTAMP
    ');
    $s->bindValue(':u',      $username, SQLITE3_TEXT);
    $s->bindValue(':online', $online,   SQLITE3_INTEGER);
    $s->bindValue(':addr',   $addr ?: null, $addr ? SQLITE3_TEXT : SQLITE3_NULL);
    $s->bindValue(':port',   $port ?: null, $port ? SQLITE3_INTEGER : SQLITE3_NULL);
    $s->execute();
    response(true, 'Status updated');
}

// ─────────────────────────────────────────────────────────────────────────────
// FRIENDS — send request
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'send_request') {
    $from = trim($data['from_username'] ?? '');
    $to   = trim($data['to_username']   ?? '');

    if (empty($from) || empty($to)) response(false, 'Both usernames required');
    if ($from === $to) response(false, 'Cannot add yourself');
    if (!userExists($db, $to)) response(false, 'User not found');
    if (areFriends($db, $from, $to)) response(false, 'Already friends');

    // Check for reverse request → auto-accept
    $s = $db->prepare('SELECT id FROM friend_requests WHERE from_username=:to AND to_username=:from');
    $s->bindValue(':to',   $to,   SQLITE3_TEXT);
    $s->bindValue(':from', $from, SQLITE3_TEXT);
    if ($s->execute()->fetchArray()) {
        // Accept the reverse request
        $db->prepare('DELETE FROM friend_requests WHERE from_username=:to AND to_username=:from')
           ->bindValue(':to', $to, SQLITE3_TEXT)   // reuse via exec below
        ;
        $stmt = $db->prepare('DELETE FROM friend_requests WHERE from_username=:a AND to_username=:b');
        $stmt->bindValue(':a', $to,   SQLITE3_TEXT);
        $stmt->bindValue(':b', $from, SQLITE3_TEXT);
        $stmt->execute();
        list($u1, $u2) = $from < $to ? [$from, $to] : [$to, $from];
        $ins = $db->prepare('INSERT OR IGNORE INTO friendships (user1, user2) VALUES (:u1, :u2)');
        $ins->bindValue(':u1', $u1, SQLITE3_TEXT);
        $ins->bindValue(':u2', $u2, SQLITE3_TEXT);
        $ins->execute();
        response(true, 'Friend request accepted — you are now friends!');
    }

    $ins = $db->prepare('INSERT OR IGNORE INTO friend_requests (from_username, to_username) VALUES (:from, :to)');
    $ins->bindValue(':from', $from, SQLITE3_TEXT);
    $ins->bindValue(':to',   $to,   SQLITE3_TEXT);
    $ins->execute();
    response(true, 'Friend request sent');
}

// ─────────────────────────────────────────────────────────────────────────────
// FRIENDS — get pending incoming requests
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'get_requests') {
    $username = trim($data['username'] ?? '');
    if (empty($username)) response(false, 'username required');

    $s = $db->prepare('
        SELECT fr.id, fr.from_username, fr.created_at
        FROM friend_requests fr
        WHERE fr.to_username = :u
        ORDER BY fr.created_at DESC
    ');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $rows = [];
    $res  = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) $rows[] = $r;
    response(true, 'ok', $rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// FRIENDS — accept / decline request
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'accept_request') {
    $username = trim($data['username']      ?? '');
    $from     = trim($data['from_username'] ?? '');

    if (empty($username) || empty($from)) response(false, 'Both usernames required');

    $del = $db->prepare('DELETE FROM friend_requests WHERE from_username=:from AND to_username=:to');
    $del->bindValue(':from', $from,     SQLITE3_TEXT);
    $del->bindValue(':to',   $username, SQLITE3_TEXT);
    if (!$del->execute() || $db->changes() === 0) response(false, 'Request not found');

    list($u1, $u2) = $username < $from ? [$username, $from] : [$from, $username];
    $ins = $db->prepare('INSERT OR IGNORE INTO friendships (user1, user2) VALUES (:u1, :u2)');
    $ins->bindValue(':u1', $u1, SQLITE3_TEXT);
    $ins->bindValue(':u2', $u2, SQLITE3_TEXT);
    $ins->execute();
    response(true, 'Friend added');
}

if ($action === 'decline_request') {
    $username = trim($data['username']      ?? '');
    $from     = trim($data['from_username'] ?? '');

    $del = $db->prepare('DELETE FROM friend_requests WHERE from_username=:from AND to_username=:to');
    $del->bindValue(':from', $from,     SQLITE3_TEXT);
    $del->bindValue(':to',   $username, SQLITE3_TEXT);
    $del->execute();
    response(true, 'Request declined');
}

// ─────────────────────────────────────────────────────────────────────────────
// FRIENDS — list friends with status
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'get_friends') {
    $username = trim($data['username'] ?? '');
    if (empty($username)) response(false, 'username required');

    $s = $db->prepare('
        SELECT
            CASE WHEN f.user1 = :u THEN f.user2 ELSE f.user1 END AS friend,
            COALESCE(us.online, 0) AS online,
            us.server_address,
            us.server_port,
            us.last_seen
        FROM friendships f
        LEFT JOIN user_status us
            ON us.username = CASE WHEN f.user1 = :u THEN f.user2 ELSE f.user1 END
        WHERE f.user1 = :u OR f.user2 = :u
        ORDER BY online DESC, friend ASC
    ');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $rows = [];
    $res  = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) {
        $rows[] = [
            'username'       => $r['friend'],
            'online'         => (bool)$r['online'],
            'server_address' => $r['server_address'],
            'server_port'    => $r['server_port'],
            'last_seen'      => $r['last_seen'],
        ];
    }
    response(true, 'ok', $rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// FRIENDS — remove
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'remove_friend') {
    $username = trim($data['username']        ?? '');
    $friend   = trim($data['friend_username'] ?? '');

    list($u1, $u2) = $username < $friend ? [$username, $friend] : [$friend, $username];
    $del = $db->prepare('DELETE FROM friendships WHERE user1=:u1 AND user2=:u2');
    $del->bindValue(':u1', $u1, SQLITE3_TEXT);
    $del->bindValue(':u2', $u2, SQLITE3_TEXT);
    $del->execute();
    response(true, 'Friend removed');
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES — send
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'send_message') {
    $from    = trim($data['from_username'] ?? '');
    $to      = trim($data['to_username']   ?? '');
    $message = trim($data['message']       ?? '');

    if (empty($from) || empty($to) || empty($message)) response(false, 'Missing fields');
    if (!areFriends($db, $from, $to)) response(false, 'Not friends');
    if (mb_strlen($message) > 2000) response(false, 'Message too long (max 2000 chars)');

    $ins = $db->prepare('INSERT INTO messages (from_username, to_username, message) VALUES (:from, :to, :msg)');
    $ins->bindValue(':from', $from,    SQLITE3_TEXT);
    $ins->bindValue(':to',   $to,      SQLITE3_TEXT);
    $ins->bindValue(':msg',  $message, SQLITE3_TEXT);
    $ins->execute();
    response(true, 'Message sent', ['id' => $db->lastInsertRowID()]);
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES — get conversation (optionally since a given id)
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'get_messages') {
    $username = trim($data['username']        ?? '');
    $friend   = trim($data['friend_username'] ?? '');
    $sinceId  = (int)($data['since_id'] ?? 0);

    if (empty($username) || empty($friend)) response(false, 'Missing fields');

    $s = $db->prepare('
        SELECT id, from_username, to_username, message, created_at
        FROM messages
        WHERE ((from_username=:u AND to_username=:f) OR (from_username=:f AND to_username=:u))
          AND id > :since
        ORDER BY id ASC
        LIMIT 100
    ');
    $s->bindValue(':u',     $username, SQLITE3_TEXT);
    $s->bindValue(':f',     $friend,   SQLITE3_TEXT);
    $s->bindValue(':since', $sinceId,  SQLITE3_INTEGER);
    $rows = [];
    $res  = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) $rows[] = $r;

    // Mark as read
    $upd = $db->prepare('UPDATE messages SET read_flag=1 WHERE to_username=:u AND from_username=:f AND read_flag=0');
    $upd->bindValue(':u', $username, SQLITE3_TEXT);
    $upd->bindValue(':f', $friend,   SQLITE3_TEXT);
    $upd->execute();

    response(true, 'ok', $rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES — unread counts (for badge)
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'get_unread_counts') {
    $username = trim($data['username'] ?? '');
    if (empty($username)) response(false, 'username required');

    $s = $db->prepare('
        SELECT from_username, COUNT(*) AS cnt
        FROM messages
        WHERE to_username=:u AND read_flag=0
        GROUP BY from_username
    ');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $rows = [];
    $res  = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) $rows[$r['from_username']] = (int)$r['cnt'];
    response(true, 'ok', $rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// INVITES — send
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'send_invite') {
    $from = trim($data['from_username']  ?? '');
    $to   = trim($data['to_username']    ?? '');
    $addr = trim($data['server_address'] ?? '');
    $port = (int)($data['server_port']   ?? 0);

    if (empty($from) || empty($to) || empty($addr) || !$port) response(false, 'Missing fields');
    if (!areFriends($db, $from, $to)) response(false, 'Not friends');

    // Remove any existing pending invite from this sender to this recipient
    $del = $db->prepare('DELETE FROM invites WHERE from_username=:from AND to_username=:to');
    $del->bindValue(':from', $from, SQLITE3_TEXT);
    $del->bindValue(':to',   $to,   SQLITE3_TEXT);
    $del->execute();

    $ins = $db->prepare('INSERT INTO invites (from_username, to_username, server_address, server_port) VALUES (:from, :to, :addr, :port)');
    $ins->bindValue(':from', $from, SQLITE3_TEXT);
    $ins->bindValue(':to',   $to,   SQLITE3_TEXT);
    $ins->bindValue(':addr', $addr, SQLITE3_TEXT);
    $ins->bindValue(':port', $port, SQLITE3_INTEGER);
    $ins->execute();
    response(true, 'Invite sent', ['id' => $db->lastInsertRowID()]);
}

// ─────────────────────────────────────────────────────────────────────────────
// INVITES — get pending invites for a user
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'get_invites') {
    $username = trim($data['username'] ?? '');
    if (empty($username)) response(false, 'username required');

    // Auto-expire invites older than 30 minutes
    $db->exec("DELETE FROM invites WHERE created_at < datetime('now', '-30 minutes')");

    $s = $db->prepare('
        SELECT id, from_username, server_address, server_port, created_at
        FROM invites WHERE to_username=:u
        ORDER BY created_at DESC
    ');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $rows = [];
    $res  = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) $rows[] = $r;
    response(true, 'ok', $rows);
}

// ─────────────────────────────────────────────────────────────────────────────
// INVITES — respond (accept / decline)
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'respond_invite') {
    $username  = trim($data['username']   ?? '');
    $inviteId  = (int)($data['invite_id'] ?? 0);
    $resp      = trim($data['response']   ?? '');

    if (empty($username) || !$inviteId || !in_array($resp, ['accept', 'decline'])) {
        response(false, 'Missing or invalid fields');
    }

    $sel = $db->prepare('SELECT * FROM invites WHERE id=:id AND to_username=:u');
    $sel->bindValue(':id', $inviteId,  SQLITE3_INTEGER);
    $sel->bindValue(':u',  $username,  SQLITE3_TEXT);
    $invite = $sel->execute()->fetchArray(SQLITE3_ASSOC);

    if (!$invite) response(false, 'Invite not found');

    $del = $db->prepare('DELETE FROM invites WHERE id=:id');
    $del->bindValue(':id', $inviteId, SQLITE3_INTEGER);
    $del->execute();

    if ($resp === 'accept') {
        response(true, 'Invite accepted', [
            'server_address' => $invite['server_address'],
            'server_port'    => $invite['server_port'],
            'from_username'  => $invite['from_username'],
        ]);
    } else {
        response(true, 'Invite declined');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POLL — single endpoint to get all pending data at once (for polling)
// ─────────────────────────────────────────────────────────────────────────────
if ($action === 'poll') {
    $username = trim($data['username'] ?? '');
    if (empty($username)) response(false, 'username required');

    // Auto-expire old invites
    $db->exec("DELETE FROM invites WHERE created_at < datetime('now', '-30 minutes')");

    // Pending friend requests
    $s = $db->prepare('SELECT id, from_username, created_at FROM friend_requests WHERE to_username=:u ORDER BY created_at DESC');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $requests = [];
    $res = $s->execute(); while ($r = $res->fetchArray(SQLITE3_ASSOC)) $requests[] = $r;

    // Pending invites
    $s = $db->prepare('SELECT id, from_username, server_address, server_port, created_at FROM invites WHERE to_username=:u ORDER BY created_at DESC');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $invites = [];
    $res = $s->execute(); while ($r = $res->fetchArray(SQLITE3_ASSOC)) $invites[] = $r;

    // Unread message counts per sender
    $s = $db->prepare('SELECT from_username, COUNT(*) AS cnt FROM messages WHERE to_username=:u AND read_flag=0 GROUP BY from_username');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $unread = [];
    $res = $s->execute(); while ($r = $res->fetchArray(SQLITE3_ASSOC)) $unread[$r['from_username']] = (int)$r['cnt'];

    // Friend list with status
    $s = $db->prepare('
        SELECT
            CASE WHEN f.user1=:u THEN f.user2 ELSE f.user1 END AS friend,
            COALESCE(us.online, 0) AS online,
            us.server_address, us.server_port, us.last_seen
        FROM friendships f
        LEFT JOIN user_status us ON us.username = CASE WHEN f.user1=:u THEN f.user2 ELSE f.user1 END
        WHERE f.user1=:u OR f.user2=:u
        ORDER BY online DESC, friend ASC
    ');
    $s->bindValue(':u', $username, SQLITE3_TEXT);
    $friends = [];
    $res = $s->execute();
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) {
        $friends[] = [
            'username'       => $r['friend'],
            'online'         => (bool)$r['online'],
            'server_address' => $r['server_address'],
            'server_port'    => $r['server_port'],
            'last_seen'      => $r['last_seen'],
        ];
    }

    response(true, 'ok', [
        'friend_requests' => $requests,
        'invites'         => $invites,
        'unread'          => $unread,
        'friends'         => $friends,
    ]);
}

response(false, 'Invalid action');
?>
