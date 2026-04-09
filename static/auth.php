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

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Database setup
$db = new SQLite3('etherdeck_users.db');
$db->enableExceptions(true);

// Create users table — email column added
$db->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)');

// Migrate existing databases that don't yet have the email column
// NOTE: SQLite ALTER TABLE does not support UNIQUE constraints — add without it
$hasEmail = false;
$tableInfo = $db->query("PRAGMA table_info(users)");
while ($col = $tableInfo->fetchArray(SQLITE3_ASSOC)) {
    if ($col['name'] === 'email') { $hasEmail = true; break; }
}
if (!$hasEmail) {
    $db->exec('ALTER TABLE users ADD COLUMN email TEXT DEFAULT NULL');
}

// Get request data
$data = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? '';

function response($success, $message, $data = null) {
    ob_end_clean();
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ]);
    exit;
}

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────
if ($action === 'register') {
    $username = trim($data['username'] ?? '');
    $email    = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        response(false, 'Username and password are required');
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        response(false, 'A valid email address is required');
    }
    if (strlen($username) < 3) {
        response(false, 'Username must be at least 3 characters');
    }
    if (strlen($password) < 6) {
        response(false, 'Password must be at least 6 characters');
    }

    // Check username taken
    $stmt = $db->prepare('SELECT id FROM users WHERE username = :username');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    if ($stmt->execute()->fetchArray()) {
        response(false, 'Username already registered');
    }

    // Check email taken
    $stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    if ($stmt->execute()->fetchArray()) {
        response(false, 'Email address already registered');
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $stmt->bindValue(':email',    $email,    SQLITE3_TEXT);
    $stmt->bindValue(':password', $hashed,   SQLITE3_TEXT);

    if ($stmt->execute()) {
        response(true, 'Registration successful', [
            'username' => $username,
            'email'    => $email,
            'is_admin' => false
        ]);
    } else {
        response(false, 'Registration failed');
    }
}

// ─────────────────────────────────────────────
// Login — accepts username OR email via login_id
// ─────────────────────────────────────────────
if ($action === 'login') {
    $login_id = trim($data['login_id'] ?? $data['username'] ?? '');
    $password  = $data['password'] ?? '';

    if (empty($login_id) || empty($password)) {
        response(false, 'Username/email and password are required');
    }

    // Match by username (case-sensitive) OR email (case-insensitive)
    $stmt = $db->prepare('SELECT id, username, email, password, is_admin FROM users WHERE username = :login_id OR LOWER(email) = :login_email');
    $stmt->bindValue(':login_id',    $login_id,                SQLITE3_TEXT);
    $stmt->bindValue(':login_email', strtolower($login_id),    SQLITE3_TEXT);
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);

    if (!$user) {
        response(false, 'Invalid username/email or password');
    }

    if (password_verify($password, $user['password'])) {
        response(true, 'Login successful', [
            'username' => $user['username'],
            'email'    => $user['email'],
            'is_admin' => (bool)$user['is_admin']
        ]);
    } else {
        response(false, 'Invalid username/email or password');
    }
}

// ─────────────────────────────────────────────
// Add / update email for existing account
// ─────────────────────────────────────────────
if ($action === 'add_email') {
    $username = trim($data['username'] ?? '');
    $email    = strtolower(trim($data['email'] ?? ''));

    if (empty($username)) {
        response(false, 'Username is required');
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        response(false, 'A valid email address is required');
    }

    // Check email not already on another account
    $stmt = $db->prepare('SELECT id FROM users WHERE email = :email AND username != :username');
    $stmt->bindValue(':email',    $email,    SQLITE3_TEXT);
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    if ($stmt->execute()->fetchArray()) {
        response(false, 'Email address already used by another account');
    }

    $stmt = $db->prepare('UPDATE users SET email = :email WHERE username = :username');
    $stmt->bindValue(':email',    $email,    SQLITE3_TEXT);
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);

    if ($stmt->execute()) {
        response(true, 'Email saved successfully', ['email' => $email]);
    } else {
        response(false, 'Failed to save email');
    }
}

// ─────────────────────────────────────────────
// Check if user exists
// ─────────────────────────────────────────────
if ($action === 'check') {
    $username = trim($data['username'] ?? '');

    $stmt = $db->prepare('SELECT username, email, is_admin FROM users WHERE username = :username');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $user = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

    if ($user) {
        response(true, 'User exists', [
            'username' => $user['username'],
            'email'    => $user['email'],
            'is_admin' => (bool)$user['is_admin']
        ]);
    } else {
        response(false, 'User not found');
    }
}

// ─────────────────────────────────────────────
// Make user admin (dev/setup only)
// ─────────────────────────────────────────────
if ($action === 'make_admin') {
    $username = trim($data['username'] ?? '');

    $stmt = $db->prepare('UPDATE users SET is_admin = 1 WHERE username = :username');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);

    if ($stmt->execute()) {
        response(true, 'User promoted to admin');
    } else {
        response(false, 'Failed to promote user');
    }
}

// ─────────────────────────────────────────────
// Admin helpers
// ─────────────────────────────────────────────
function requireAdmin($requestingUsername) {
    global $db;
    $stmt = $db->prepare('SELECT is_admin FROM users WHERE username = :username');
    $stmt->bindValue(':username', $requestingUsername, SQLITE3_TEXT);
    $user = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

    if (!$user || !$user['is_admin']) {
        response(false, 'Admin access required');
    }
}

// Get all users (admin only)
if ($action === 'get_all_users') {
    $requestingUsername = trim($data['requesting_username'] ?? '');
    requireAdmin($requestingUsername);

    $stmt = $db->query('SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at DESC');
    $users = [];
    while ($user = $stmt->fetchArray(SQLITE3_ASSOC)) {
        $users[] = [
            'id'         => $user['id'],
            'username'   => $user['username'],
            'email'      => $user['email'],
            'is_admin'   => (bool)$user['is_admin'],
            'created_at' => $user['created_at']
        ];
    }
    response(true, 'Users retrieved successfully', $users);
}

// Update user (admin only)
if ($action === 'update_user') {
    $requestingUsername = trim($data['requesting_username'] ?? '');
    requireAdmin($requestingUsername);

    $userId      = (int)($data['user_id'] ?? 0);
    $newUsername = trim($data['new_username'] ?? '');
    $newEmail    = strtolower(trim($data['new_email'] ?? ''));
    $newPassword = $data['new_password'] ?? '';
    $isAdmin     = (bool)($data['is_admin'] ?? false);

    if (empty($newUsername)) {
        response(false, 'Username is required');
    }

    // Check username not taken by another user
    $stmt = $db->prepare('SELECT id FROM users WHERE username = :username AND id != :user_id');
    $stmt->bindValue(':username', $newUsername, SQLITE3_TEXT);
    $stmt->bindValue(':user_id',  $userId,      SQLITE3_INTEGER);
    if ($stmt->execute()->fetchArray()) {
        response(false, 'Username already taken');
    }

    // Check email not taken by another user
    if (!empty($newEmail)) {
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            response(false, 'Invalid email address');
        }
        $stmt = $db->prepare('SELECT id FROM users WHERE email = :email AND id != :user_id');
        $stmt->bindValue(':email',   $newEmail, SQLITE3_TEXT);
        $stmt->bindValue(':user_id', $userId,   SQLITE3_INTEGER);
        if ($stmt->execute()->fetchArray()) {
            response(false, 'Email already taken');
        }
    }

    $updateFields = ['username = :username', 'is_admin = :is_admin', 'email = :email'];
    $params = [
        ':username' => $newUsername,
        ':is_admin' => $isAdmin ? 1 : 0,
        ':email'    => !empty($newEmail) ? $newEmail : null,
        ':user_id'  => $userId
    ];

    if (!empty($newPassword)) {
        if (strlen($newPassword) < 6) {
            response(false, 'Password must be at least 6 characters');
        }
        $updateFields[] = 'password = :password';
        $params[':password'] = password_hash($newPassword, PASSWORD_DEFAULT);
    }

    $sql  = 'UPDATE users SET ' . implode(', ', $updateFields) . ' WHERE id = :user_id';
    $stmt = $db->prepare($sql);
    foreach ($params as $param => $value) {
        if (is_null($value)) {
            $stmt->bindValue($param, null, SQLITE3_NULL);
        } elseif (is_int($value)) {
            $stmt->bindValue($param, $value, SQLITE3_INTEGER);
        } else {
            $stmt->bindValue($param, $value, SQLITE3_TEXT);
        }
    }

    if ($stmt->execute()) {
        response(true, 'User updated successfully');
    } else {
        response(false, 'Failed to update user');
    }
}

// Delete user (admin only)
if ($action === 'delete_user') {
    $requestingUsername = trim($data['requesting_username'] ?? '');
    requireAdmin($requestingUsername);

    $userId = (int)($data['user_id'] ?? 0);
    if ($userId <= 0) {
        response(false, 'Invalid user ID');
    }

    // Prevent self-deletion
    $stmt = $db->prepare('SELECT username FROM users WHERE id = :user_id');
    $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
    $targetUser = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

    if ($targetUser && $targetUser['username'] === $requestingUsername) {
        response(false, 'Cannot delete your own account');
    }

    $stmt = $db->prepare('DELETE FROM users WHERE id = :user_id');
    $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);

    if ($stmt->execute()) {
        response(true, 'User deleted successfully');
    } else {
        response(false, 'Failed to delete user');
    }
}

response(false, 'Invalid action');
?>
