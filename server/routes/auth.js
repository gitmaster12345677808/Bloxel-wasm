import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db.js';

const router = Router();

function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Match PHP response format: { success, message, data }
function ok(res, message, data = null) { res.json({ success: true, message, data }); }
function fail(res, msg, code = 400)   { res.status(code).json({ success: false, message: msg, data: null }); }

async function requireAdmin(tok) {
  if (!tok) return null;
  const [u] = await query('SELECT * FROM users WHERE auth_token = ?', [tok]);
  return u?.is_admin ? u : null;
}

async function requireAuth(tok) {
  if (!tok) return null;
  const [u] = await query('SELECT * FROM users WHERE auth_token = ?', [tok]);
  return u || null;
}

// POST /api/auth  (action from query string, rest from JSON body)
router.post('/', async (req, res) => {
  const action = req.query.action || req.body.action;

  if (action === 'register') {
    const { username, email, password } = req.body;
    if (!username || !password) return fail(res, 'Username and password are required');
    if (username.length < 3) return fail(res, 'Username must be at least 3 characters');
    if (password.length < 6) return fail(res, 'Password must be at least 6 characters');
    const [exist] = await query('SELECT id FROM users WHERE username = ?', [username]);
    if (exist) return fail(res, 'Username already registered');
    if (email) {
      const [em] = await query('SELECT id FROM users WHERE email = ?', [email]);
      if (em) return fail(res, 'Email address already registered');
    }
    const hash = await bcrypt.hash(password, 10);
    const tok  = genToken();
    await query(
      'INSERT INTO users (username, email, password, auth_token) VALUES (?, ?, ?, ?)',
      [username, email || null, hash, tok]
    );
    const [u] = await query('SELECT id, username, email, is_admin FROM users WHERE auth_token = ?', [tok]);
    return ok(res, 'Registration successful', { id: u.id, username: u.username, email: u.email, is_admin: u.is_admin, token: tok });
  }

  if (action === 'login') {
    const { login_id, password } = req.body;
    if (!login_id || !password) return fail(res, 'Username/email and password are required');
    const [u] = await query(
      'SELECT * FROM users WHERE username = ? OR email = ?', [login_id, login_id]
    );
    if (!u) return fail(res, 'Invalid username/email or password', 401);
    const match = await bcrypt.compare(password, u.password);
    if (!match) return fail(res, 'Invalid username/email or password', 401);
    const tok = genToken();
    await query('UPDATE users SET auth_token = ? WHERE id = ?', [tok, u.id]);
    return ok(res, 'Login successful', { id: u.id, username: u.username, email: u.email, is_admin: !!u.is_admin, token: tok });
  }

  if (action === 'add_email') {
    // Accept token (PHP style) or auth_token
    const tok = req.body.token || req.body.auth_token;
    const { email } = req.body;
    const u = await requireAuth(tok);
    if (!u) return fail(res, 'Authentication required', 401);
    if (!email) return fail(res, 'A valid email address is required');
    const [exist] = await query('SELECT id FROM users WHERE email = ? AND id != ?', [email, u.id]);
    if (exist) return fail(res, 'Email address already used by another account');
    await query('UPDATE users SET email = ? WHERE id = ?', [email, u.id]);
    return ok(res, 'Email saved', { email });
  }

  if (action === 'me') {
    const tok = req.body.token || req.body.auth_token;
    const u = await requireAuth(tok);
    if (!u) return fail(res, 'Authentication required', 401);
    return ok(res, '', { id: u.id, username: u.username, email: u.email, is_admin: !!u.is_admin });
  }

  if (action === 'check') {
    const { username } = req.body;
    const [u] = await query('SELECT username, email, is_admin FROM users WHERE username = ?', [username]);
    if (!u) return fail(res, 'not found', 404);
    return ok(res, '', u);
  }

  if (action === 'make_admin') {
    const tok = req.body.token || req.body.auth_token;
    const { username } = req.body;
    const admin = await requireAdmin(tok);
    if (!admin) return fail(res, 'forbidden', 403);
    await query('UPDATE users SET is_admin = 1 WHERE username = ?', [username]);
    return ok(res, '');
  }

  if (action === 'get_all_users') {
    const tok = req.body.token || req.body.auth_token;
    const admin = await requireAdmin(tok);
    if (!admin) return fail(res, 'forbidden', 403);
    const users = await query('SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at ASC');
    return ok(res, '', { users });
  }

  if (action === 'update_user') {
    const tok = req.body.token || req.body.auth_token;
    const { user_id, username, email, password, is_admin } = req.body;
    const admin = await requireAdmin(tok);
    if (!admin) return fail(res, 'forbidden', 403);
    if (username) await query('UPDATE users SET username = ? WHERE id = ?', [username, user_id]);
    if (email)    await query('UPDATE users SET email = ? WHERE id = ?',    [email,    user_id]);
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await query('UPDATE users SET password = ? WHERE id = ?', [hash, user_id]);
    }
    if (is_admin !== undefined) await query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin ? 1 : 0, user_id]);
    return ok(res, '');
  }

  if (action === 'delete_user') {
    const tok = req.body.token || req.body.auth_token;
    const { user_id } = req.body;
    const admin = await requireAdmin(tok);
    if (!admin) return fail(res, 'forbidden', 403);
    if (admin.id === parseInt(user_id)) return fail(res, 'cannot delete yourself');
    await query('DELETE FROM users WHERE id = ?', [user_id]);
    return ok(res, '');
  }

  return fail(res, 'unknown action');
});

export default router;
