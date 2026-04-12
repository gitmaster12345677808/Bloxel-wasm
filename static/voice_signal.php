<?php
/**
 * voice_signal.php — WebRTC signaling via SQLite polling
 *
 * Actions (POST JSON or query-string):
 *   join    room_id, user_id  → {ok:true, peers:[...user_ids]}
 *   leave   room_id, user_id  → {ok:true}
 *   signal  room_id, from, to, type, payload → {ok:true}
 *   poll    room_id, user_id  → {ok:true, signals:[{id,from,type,payload}], peers:[...user_ids]}
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── Parameters ───────────────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$p = array_merge($_GET, $_POST, $body);

$action  = trim($p['action']  ?? '');
$room_id = trim($p['room_id'] ?? '');
$user_id = trim($p['user_id'] ?? '');

// Sanitise: allow only word chars, hyphens, dots, colons, up to 120 chars
function sanitise(string $s, int $max = 120): string {
    return substr(preg_replace('/[^\w\-.:@]/', '', $s), 0, $max);
}
$action  = sanitise($action, 32);
$room_id = sanitise($room_id);
$user_id = sanitise($user_id, 64);

if (!$action || !$room_id || !$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// ── Database ─────────────────────────────────────────────────────────────────
$db_path = __DIR__ . '/voice_signal.db';
$db = new SQLite3($db_path);
$db->exec('PRAGMA journal_mode=WAL');
$db->exec('PRAGMA synchronous=NORMAL');
$db->exec('PRAGMA busy_timeout=3000');

$db->exec('
    CREATE TABLE IF NOT EXISTS voice_sessions (
        room_id   TEXT NOT NULL,
        user_id   TEXT NOT NULL,
        last_seen INTEGER NOT NULL,
        PRIMARY KEY (room_id, user_id)
    )
');
$db->exec('
    CREATE TABLE IF NOT EXISTS voice_signals (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id    TEXT    NOT NULL,
        from_user  TEXT    NOT NULL,
        to_user    TEXT    NOT NULL,
        type       TEXT    NOT NULL,
        payload    TEXT    NOT NULL,
        created_at INTEGER NOT NULL,
        consumed   INTEGER NOT NULL DEFAULT 0
    )
');
$db->exec('CREATE INDEX IF NOT EXISTS idx_signals_to ON voice_signals (room_id, to_user, consumed)');

// ── Helpers ───────────────────────────────────────────────────────────────────
$now = time();
$SESSION_TTL = 30;   // seconds without heartbeat → considered offline
$SIGNAL_TTL  = 60;   // seconds before old signals are purged

function cleanup(SQLite3 $db, string $room_id, int $now, int $session_ttl, int $signal_ttl): void {
    $cutoff_session = $now - $session_ttl;
    $cutoff_signal  = $now - $signal_ttl;
    $db->exec("DELETE FROM voice_sessions WHERE room_id='" . SQLite3::escapeString($room_id) . "' AND last_seen < $cutoff_session");
    $db->exec("DELETE FROM voice_signals  WHERE room_id='" . SQLite3::escapeString($room_id) . "' AND created_at < $cutoff_signal");
}

function get_peers(SQLite3 $db, string $room_id, string $exclude, int $now, int $session_ttl): array {
    $cutoff = $now - $session_ttl;
    $stmt = $db->prepare('SELECT user_id FROM voice_sessions WHERE room_id=:r AND user_id!=:u AND last_seen>=:c');
    $stmt->bindValue(':r', $room_id, SQLITE3_TEXT);
    $stmt->bindValue(':u', $exclude,  SQLITE3_TEXT);
    $stmt->bindValue(':c', $cutoff,   SQLITE3_INTEGER);
    $res = $stmt->execute();
    $peers = [];
    while ($row = $res->fetchArray(SQLITE3_NUM)) $peers[] = $row[0];
    return $peers;
}

function heartbeat(SQLite3 $db, string $room_id, string $user_id, int $now): void {
    $stmt = $db->prepare('INSERT OR REPLACE INTO voice_sessions (room_id,user_id,last_seen) VALUES (:r,:u,:t)');
    $stmt->bindValue(':r', $room_id, SQLITE3_TEXT);
    $stmt->bindValue(':u', $user_id, SQLITE3_TEXT);
    $stmt->bindValue(':t', $now,     SQLITE3_INTEGER);
    $stmt->execute();
}

// ── Actions ───────────────────────────────────────────────────────────────────
switch ($action) {

    case 'join':
        cleanup($db, $room_id, $now, $SESSION_TTL, $SIGNAL_TTL);
        heartbeat($db, $room_id, $user_id, $now);
        $peers = get_peers($db, $room_id, $user_id, $now, $SESSION_TTL);
        echo json_encode(['ok' => true, 'peers' => $peers]);
        break;

    case 'leave':
        $stmt = $db->prepare('DELETE FROM voice_sessions WHERE room_id=:r AND user_id=:u');
        $stmt->bindValue(':r', $room_id, SQLITE3_TEXT);
        $stmt->bindValue(':u', $user_id, SQLITE3_TEXT);
        $stmt->execute();
        echo json_encode(['ok' => true]);
        break;

    case 'signal':
        $to      = sanitise(trim($p['to']      ?? ''), 64);
        $type    = sanitise(trim($p['type']    ?? ''), 32);
        $payload = $p['payload'] ?? null;
        if (!$to || !$type || $payload === null) {
            http_response_code(400); echo json_encode(['error' => 'Missing to/type/payload']); break;
        }
        // Re-encode payload to ensure it's valid JSON stored as text
        $payloadStr = is_string($payload) ? $payload : json_encode($payload);
        if (strlen($payloadStr) > 65536) {
            http_response_code(413); echo json_encode(['error' => 'Payload too large']); break;
        }
        $stmt = $db->prepare('INSERT INTO voice_signals (room_id,from_user,to_user,type,payload,created_at) VALUES (:r,:f,:t,:ty,:p,:c)');
        $stmt->bindValue(':r',  $room_id,   SQLITE3_TEXT);
        $stmt->bindValue(':f',  $user_id,   SQLITE3_TEXT);
        $stmt->bindValue(':t',  $to,        SQLITE3_TEXT);
        $stmt->bindValue(':ty', $type,      SQLITE3_TEXT);
        $stmt->bindValue(':p',  $payloadStr,SQLITE3_TEXT);
        $stmt->bindValue(':c',  $now,       SQLITE3_INTEGER);
        $stmt->execute();
        echo json_encode(['ok' => true]);
        break;

    case 'poll':
        cleanup($db, $room_id, $now, $SESSION_TTL, $SIGNAL_TTL);
        heartbeat($db, $room_id, $user_id, $now);
        // Fetch unread signals for this user
        $stmt = $db->prepare('SELECT id,from_user,type,payload FROM voice_signals WHERE room_id=:r AND to_user=:u AND consumed=0 ORDER BY id ASC LIMIT 50');
        $stmt->bindValue(':r', $room_id, SQLITE3_TEXT);
        $stmt->bindValue(':u', $user_id, SQLITE3_TEXT);
        $res = $stmt->execute();
        $signals = [];
        $ids = [];
        while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
            $signals[] = ['id' => (int)$row['id'], 'from' => $row['from_user'], 'type' => $row['type'], 'payload' => $row['payload']];
            $ids[] = (int)$row['id'];
        }
        // Mark them consumed
        if ($ids) {
            $db->exec('UPDATE voice_signals SET consumed=1 WHERE id IN (' . implode(',', $ids) . ')');
        }
        $peers = get_peers($db, $room_id, $user_id, $now, $SESSION_TTL);
        echo json_encode(['ok' => true, 'signals' => $signals, 'peers' => $peers]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
}

$db->close();
