import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function ok(res, message, data = null) { res.json({ success: true, message, data }); }
function fail(res, msg, code = 400)   { res.status(code).json({ success: false, message: msg, data: null }); }

async function requireAuth(username, token) {
  if (!username || !token) return null;
  const [u] = await query('SELECT id, username FROM users WHERE username = ? AND auth_token = ?', [username, token]);
  return u || null;
}

async function getUserByName(username) {
  if (!username) return null;
  const [u] = await query('SELECT id, username FROM users WHERE username = ?', [username]);
  return u || null;
}

async function areFriends(idA, idB) {
  const lo = Math.min(idA, idB), hi = Math.max(idA, idB);
  const [r] = await query('SELECT id FROM friendships WHERE user_a = ? AND user_b = ?', [lo, hi]);
  return !!r;
}

async function makeFriends(idA, idB) {
  const lo = Math.min(idA, idB), hi = Math.max(idA, idB);
  await query('INSERT IGNORE INTO friendships (user_a, user_b) VALUES (?, ?)', [lo, hi]);
}

router.post('/', async (req, res) => {
  const action   = req.query.action || req.body.action;
  const username = req.body.username;
  const token    = req.body.token || req.body.auth_token;

  if (action === 'update_status') {
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const { online, server_address, server_port } = req.body;
    // When going offline explicitly, back-date last_seen so the recency check
    // immediately shows the user as offline without waiting for the timeout.
    const lastSeenExpr = online ? 'NOW()' : "'2000-01-01 00:00:00'";
    await query(
      `INSERT INTO user_status (user_id, online, server_address, port, last_seen)
       VALUES (?, ?, ?, ?, ${lastSeenExpr})
       ON DUPLICATE KEY UPDATE online=VALUES(online), server_address=VALUES(server_address),
         port=VALUES(port), last_seen=${lastSeenExpr}`,
      [me.id, online ? 1 : 0, server_address || null, server_port || null]
    );
    return ok(res, 'Status updated');
  }

  if (action === 'send_request') {
    const from_username = req.body.from_username || username;
    const { to_username } = req.body;
    const me = await requireAuth(from_username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    if (!to_username) return fail(res, 'Both usernames required');
    if (from_username === to_username) return fail(res, 'Cannot add yourself');
    const target = await getUserByName(to_username);
    if (!target) return fail(res, 'User not found', 404);
    if (await areFriends(me.id, target.id)) return fail(res, 'Already friends');

    const [rev] = await query(
      'SELECT id FROM friend_requests WHERE from_user = ? AND to_user = ?', [target.id, me.id]
    );
    if (rev) {
      await query('DELETE FROM friend_requests WHERE from_user = ? AND to_user = ?', [target.id, me.id]);
      await makeFriends(me.id, target.id);
      return ok(res, 'Friend request accepted — you are now friends!');
    }
    await query('INSERT IGNORE INTO friend_requests (from_user, to_user) VALUES (?, ?)', [me.id, target.id]);
    return ok(res, 'Friend request sent');
  }

  if (action === 'accept_request') {
    const from_username = req.body.from_username;
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const from = await getUserByName(from_username);
    if (!from) return fail(res, 'User not found', 404);
    const [row] = await query(
      'SELECT id FROM friend_requests WHERE from_user = ? AND to_user = ?', [from.id, me.id]
    );
    if (!row) return fail(res, 'Request not found', 404);
    await query('DELETE FROM friend_requests WHERE from_user = ? AND to_user = ?', [from.id, me.id]);
    await makeFriends(me.id, from.id);
    return ok(res, 'Friend added');
  }

  if (action === 'decline_request') {
    const from_username = req.body.from_username;
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const from = await getUserByName(from_username);
    if (!from) return ok(res, 'Request declined');
    await query('DELETE FROM friend_requests WHERE from_user = ? AND to_user = ?', [from.id, me.id]);
    return ok(res, 'Request declined');
  }

  if (action === 'get_friends') {
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const rows = await query(
      `SELECT u.username,
              CASE WHEN s.last_seen > NOW() - INTERVAL 20 SECOND THEN 1 ELSE 0 END AS online,
              s.server_address, s.port AS server_port, s.last_seen
       FROM friendships f
       JOIN users u ON u.id = IF(f.user_a = ?, f.user_b, f.user_a)
       LEFT JOIN user_status s ON s.user_id = u.id
       WHERE f.user_a = ? OR f.user_b = ?
       ORDER BY online DESC, s.last_seen DESC`,
      [me.id, me.id, me.id]
    );
    return ok(res, 'ok', rows);
  }

  if (action === 'remove_friend') {
    const friend_username = req.body.friend_username;
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const friend = await getUserByName(friend_username);
    if (!friend) return ok(res, 'Friend removed');
    const lo = Math.min(me.id, friend.id), hi = Math.max(me.id, friend.id);
    await query('DELETE FROM friendships WHERE user_a = ? AND user_b = ?', [lo, hi]);
    return ok(res, 'Friend removed');
  }

  if (action === 'send_message') {
    const from_username = req.body.from_username || username;
    const { to_username, message } = req.body;
    const me = await requireAuth(from_username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    if (!message || message.length > 2000) return fail(res, 'Missing fields');
    const target = await getUserByName(to_username);
    if (!target) return fail(res, 'User not found', 404);
    if (!await areFriends(me.id, target.id)) return fail(res, 'Not friends');
    const result = await query(
      'INSERT INTO messages (from_user, to_user, content) VALUES (?, ?, ?)',
      [me.id, target.id, message]
    );
    return ok(res, 'Message sent', { id: result.insertId });
  }

  if (action === 'get_messages') {
    const friend_username = req.body.friend_username;
    const since_id = parseInt(req.body.since_id) || 0;
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const friend = await getUserByName(friend_username);
    if (!friend) return fail(res, 'User not found', 404);
    if (!await areFriends(me.id, friend.id)) return fail(res, 'Not friends');
    const rows = await query(
      `SELECT id,
              (SELECT username FROM users WHERE id = m.from_user) AS from_username,
              (SELECT username FROM users WHERE id = m.to_user)   AS to_username,
              content AS message, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at
       FROM messages m
       WHERE ((from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?))
         AND id > ?
       ORDER BY id ASC LIMIT 100`,
      [me.id, friend.id, friend.id, me.id, since_id]
    );
    await query(
      'UPDATE messages SET is_read = 1 WHERE from_user = ? AND to_user = ? AND is_read = 0',
      [friend.id, me.id]
    );
    return ok(res, 'ok', rows);
  }

  if (action === 'send_invite') {
    const from_username = req.body.from_username || username;
    const { to_username, server_address, server_port } = req.body;
    const me = await requireAuth(from_username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    if (!server_address) return fail(res, 'Missing fields');
    const target = await getUserByName(to_username);
    if (!target) return fail(res, 'User not found', 404);
    if (!await areFriends(me.id, target.id)) return fail(res, 'Not friends');
    await query(
      `INSERT INTO invites (from_user, to_user, server_address, port, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', NOW())
       ON DUPLICATE KEY UPDATE server_address=VALUES(server_address), port=VALUES(port),
         status='pending', created_at=NOW()`,
      [me.id, target.id, server_address, server_port || 30000]
    );
    return ok(res, 'Invite sent');
  }

  if (action === 'get_invites') {
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    await query("DELETE FROM invites WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)");
    const rows = await query(
      `SELECT i.id, u.username AS from_username, i.server_address, i.port AS server_port, i.created_at
       FROM invites i JOIN users u ON u.id = i.from_user
       WHERE i.to_user = ? AND i.status = 'pending'`, [me.id]
    );
    return ok(res, 'ok', rows);
  }

  if (action === 'respond_invite') {
    const { invite_id, response } = req.body;
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);
    const resp = response === 'accept' || response === 'accepted' ? 'accepted' : 'declined';
    const [inv] = await query('SELECT * FROM invites WHERE id = ? AND to_user = ?', [invite_id, me.id]);
    if (!inv) return fail(res, 'Invite not found', 404);
    await query('DELETE FROM invites WHERE id = ?', [invite_id]);
    if (resp === 'accepted') {
      const [fromUser] = await query('SELECT username FROM users WHERE id = ?', [inv.from_user]);
      return ok(res, 'Invite accepted', {
        server_address: inv.server_address,
        server_port: inv.port,
        from_username: fromUser?.username,
      });
    }
    return ok(res, 'Invite declined');
  }

  if (action === 'poll') {
    const me = await requireAuth(username, token);
    if (!me) return fail(res, 'Authentication required', 401);

    // Heartbeat — keeps last_seen fresh; ON DUPLICATE preserves server_address/port
    await query(
      `INSERT INTO user_status (user_id, online, server_address, port, last_seen)
       VALUES (?, 1, NULL, NULL, NOW())
       ON DUPLICATE KEY UPDATE last_seen=NOW(), online=1`,
      [me.id]
    );

    await query("DELETE FROM invites WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)");

    const [friend_requests, invites, unreadRows, friendRows] = await Promise.all([
      query(`SELECT fr.id, u.username AS from_username, fr.created_at
             FROM friend_requests fr JOIN users u ON u.id = fr.from_user
             WHERE fr.to_user = ? ORDER BY fr.created_at DESC`, [me.id]),
      query(`SELECT i.id, u.username AS from_username, i.server_address,
                    i.port AS server_port, i.created_at
             FROM invites i JOIN users u ON u.id = i.from_user
             WHERE i.to_user = ? AND i.status = 'pending'`, [me.id]),
      query(`SELECT u.username AS from_username, COUNT(*) AS cnt
             FROM messages m JOIN users u ON u.id = m.from_user
             WHERE m.to_user = ? AND m.is_read = 0 GROUP BY m.from_user`, [me.id]),
      query(`SELECT u.username,
                    CASE WHEN s.last_seen > NOW() - INTERVAL 20 SECOND THEN 1 ELSE 0 END AS online,
                    s.server_address, s.port AS server_port, s.last_seen
             FROM friendships f
             JOIN users u ON u.id = IF(f.user_a = ?, f.user_b, f.user_a)
             LEFT JOIN user_status s ON s.user_id = u.id
             WHERE f.user_a = ? OR f.user_b = ?
             ORDER BY online DESC, s.last_seen DESC`,
            [me.id, me.id, me.id]),
    ]);

    // Convert unread to { username: count } map (matching PHP format)
    const unread = unreadRows.reduce((m, r) => { m[r.from_username] = Number(r.cnt); return m; }, {});

    return ok(res, 'ok', { friend_requests, invites, unread, friends: friendRows });
  }

  return fail(res, 'Invalid action');
});

export default router;
