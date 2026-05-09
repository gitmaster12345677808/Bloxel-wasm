import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function ok(res, data)              { res.json({ success: true,  ...data }); }
function fail(res, msg, code = 400) { res.status(code).json({ success: false, message: msg }); }

async function requireAuth(tok) {
  if (!tok) return null;
  const [u] = await query('SELECT id, username FROM users WHERE auth_token = ?', [tok]);
  return u || null;
}

// GET /api/panels
router.get('/', async (req, res) => {
  const panels = await query(
    'SELECT id, user_id, username, title, url, created_at FROM panels WHERE expires_at > NOW() ORDER BY created_at DESC LIMIT 5'
  );
  return ok(res, { panels });
});

// POST /api/panels  { action: 'drop'|'remove', ... }
router.post('/', async (req, res) => {
  const action = req.query.action || req.body.action;
  const auth_token = req.body.auth_token || req.body.token;

  if (action === 'drop') {
    const { url, title } = req.body;
    if (!url) return fail(res, 'url required');
    const me = await requireAuth(auth_token);
    const user_id  = me?.id    || 0;
    const username = me?.username || 'anonymous';
    const expires  = new Date(Date.now() + 60 * 60 * 1000);
    await query(
      `INSERT INTO panels (user_id, username, title, url, expires_at)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), url=VALUES(url), expires_at=VALUES(expires_at), created_at=NOW()`,
      [user_id, username, title || null, url, expires]
    );
    return ok(res, {});
  }

  if (action === 'remove') {
    const { id } = req.body;
    const me = await requireAuth(auth_token);
    if (!me) return fail(res, 'unauthorized', 401);
    await query('DELETE FROM panels WHERE id = ? AND user_id = ?', [id, me.id]);
    return ok(res, {});
  }

  return fail(res, 'unknown action');
});

export default router;
