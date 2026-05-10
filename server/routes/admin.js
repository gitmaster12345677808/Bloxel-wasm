import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const router = Router();

// ── Auth middleware ────────────────────────────────────────────────────────
async function requireAdmin(req, res, next) {
  const tok = req.headers['x-admin-token'] || req.query.token;
  if (!tok) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  const [u] = await query(
    'SELECT id, username, is_admin FROM users WHERE auth_token = ? AND is_admin = 1 AND banned = 0',
    [tok]
  );
  if (!u) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  req.admin = u;
  next();
}

// ── Serve panel HTML ───────────────────────────────────────────────────────
router.get('/', (req, res) => res.send(PANEL_HTML));

// ── Login ──────────────────────────────────────────────────────────────────
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ ok: false, error: 'Username and password required' });
  const [u] = await query(
    'SELECT * FROM users WHERE username = ? AND is_admin = 1',
    [username]
  );
  if (!u) return res.status(401).json({ ok: false, error: 'Invalid credentials or not an admin' });
  const match = await bcrypt.compare(password, u.password);
  if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials or not an admin' });
  res.json({ ok: true, token: u.auth_token, username: u.username });
});

// ── Players list ───────────────────────────────────────────────────────────
router.get('/api/players', requireAdmin, async (req, res) => {
  const players = await query(
    `SELECT id, username, email, is_admin, banned, voice_disabled, created_at
     FROM users ORDER BY created_at DESC`
  );
  res.json({ ok: true, players });
});

// ── Online players ─────────────────────────────────────────────────────────
router.get('/api/online', requireAdmin, async (req, res) => {
  const players = await query(
    `SELECT u.id, u.username, s.server_address, s.port,
            DATE_FORMAT(s.last_seen, '%Y-%m-%dT%H:%i:%sZ') AS last_seen
     FROM user_status s JOIN users u ON u.id = s.user_id
     WHERE s.last_seen > NOW() - INTERVAL 20 SECOND
     ORDER BY u.username`
  );
  res.json({ ok: true, players });
});

// ── Change password ────────────────────────────────────────────────────────
router.post('/api/players/:id/password', requireAdmin, async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6)
    return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
  const hash = await bcrypt.hash(password, 10);
  await query('UPDATE users SET password = ? WHERE id = ?', [hash, req.params.id]);
  res.json({ ok: true });
});

// ── Ban / Unban ────────────────────────────────────────────────────────────
router.post('/api/players/:id/ban', requireAdmin, async (req, res) => {
  const [u] = await query('SELECT id FROM users WHERE id = ?', [req.params.id]);
  if (!u) return res.status(404).json({ ok: false, error: 'User not found' });
  const reason = (req.body.reason || '').trim() || 'You have been banned.';
  await query('UPDATE users SET banned = 1, ban_reason = ? WHERE id = ?', [reason, req.params.id]);
  res.json({ ok: true });
});

router.post('/api/players/:id/unban', requireAdmin, async (req, res) => {
  await query('UPDATE users SET banned = 0 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// ── Promote / Demote ───────────────────────────────────────────────────────
router.post('/api/players/:id/promote', requireAdmin, async (req, res) => {
  await query('UPDATE users SET is_admin = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

router.post('/api/players/:id/demote', requireAdmin, async (req, res) => {
  if (String(req.admin.id) === String(req.params.id))
    return res.status(400).json({ ok: false, error: 'Cannot demote yourself' });
  await query('UPDATE users SET is_admin = 0 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// ── Delete player ──────────────────────────────────────────────────────────
router.post('/api/players/:id/delete', requireAdmin, async (req, res) => {
  const id = req.params.id;
  if (String(req.admin.id) === String(id))
    return res.status(400).json({ ok: false, error: 'Cannot delete yourself' });
  await query('DELETE FROM messages    WHERE from_user = ? OR to_user = ?',  [id, id]);
  await query('DELETE FROM invites     WHERE from_user = ? OR to_user = ?',  [id, id]);
  await query('DELETE FROM friend_requests WHERE from_user = ? OR to_user = ?', [id, id]);
  await query('DELETE FROM friendships WHERE user_a = ? OR user_b = ?', [id, id]);
  await query('DELETE FROM user_status WHERE user_id = ?', [id]);
  await query('DELETE FROM users       WHERE id = ?', [id]);
  res.json({ ok: true });
});

// ── Voice disable / enable ─────────────────────────────────────────────────
router.post('/api/players/:id/voice', requireAdmin, async (req, res) => {
  const disabled = req.body.disabled ? 1 : 0;
  await query('UPDATE users SET voice_disabled = ? WHERE id = ?', [disabled, req.params.id]);
  res.json({ ok: true });
});

// ── Announcements ──────────────────────────────────────────────────────────
router.post('/api/announce', requireAdmin, async (req, res) => {
  const { message, target_username } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ ok: false, error: 'Message required' });
  let target_user_id = null;
  if (target_username && target_username.trim()) {
    const [u] = await query('SELECT id FROM users WHERE username = ?', [target_username.trim()]);
    if (!u) return res.status(404).json({ ok: false, error: 'User not found' });
    target_user_id = u.id;
  }
  await query('INSERT INTO announcements (message, target_user_id) VALUES (?, ?)', [message.trim(), target_user_id]);
  res.json({ ok: true });
});

router.get('/api/announcements', requireAdmin, async (req, res) => {
  try {
    const rows = await query('SELECT id, message, target_user_id, created_at FROM announcements ORDER BY id DESC LIMIT 50');
    res.json({ ok: true, announcements: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/api/announcements/:id/delete', requireAdmin, async (req, res) => {
  await query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// ── Chat logs ──────────────────────────────────────────────────────────────
router.get('/api/messages', requireAdmin, async (req, res) => {
  const { user1, user2 } = req.query;
  const lim = Math.min(parseInt(req.query.limit) || 200, 500);
  let rows;
  if (user1 && user2) {
    rows = await query(
      `SELECT m.id, u1.username AS from_username, u2.username AS to_username,
              m.content, DATE_FORMAT(m.created_at,'%Y-%m-%dT%H:%i:%sZ') AS created_at
       FROM messages m
       JOIN users u1 ON u1.id = m.from_user
       JOIN users u2 ON u2.id = m.to_user
       WHERE (u1.username=? AND u2.username=?) OR (u1.username=? AND u2.username=?)
       ORDER BY m.id DESC LIMIT ?`,
      [user1, user2, user2, user1, lim]
    );
  } else if (user1) {
    rows = await query(
      `SELECT m.id, u1.username AS from_username, u2.username AS to_username,
              m.content, DATE_FORMAT(m.created_at,'%Y-%m-%dT%H:%i:%sZ') AS created_at
       FROM messages m
       JOIN users u1 ON u1.id = m.from_user
       JOIN users u2 ON u2.id = m.to_user
       WHERE u1.username=? OR u2.username=?
       ORDER BY m.id DESC LIMIT ?`,
      [user1, user1, lim]
    );
  } else {
    rows = await query(
      `SELECT m.id, u1.username AS from_username, u2.username AS to_username,
              m.content, DATE_FORMAT(m.created_at,'%Y-%m-%dT%H:%i:%sZ') AS created_at
       FROM messages m
       JOIN users u1 ON u1.id = m.from_user
       JOIN users u2 ON u2.id = m.to_user
       ORDER BY m.id DESC LIMIT ?`,
      [lim]
    );
  }
  res.json({ ok: true, messages: rows.reverse() });
});

export default router;

// ── Panel HTML ─────────────────────────────────────────────────────────────
const PANEL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bloxel Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d1117;color:#c9d1d9;min-height:100vh;display:flex;flex-direction:column}
a{color:#58a6ff;text-decoration:none}

/* Login */
#login-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0d1117}
.login-box{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:40px;width:360px}
.login-box h1{font-size:22px;margin-bottom:6px;color:#f0f6fc}
.login-box p{color:#8b949e;font-size:13px;margin-bottom:28px}
.login-box input{width:100%;padding:10px 12px;background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#c9d1d9;font-size:14px;margin-bottom:12px;outline:none}
.login-box input:focus{border-color:#58a6ff}
.login-box button{width:100%;padding:11px;background:#238636;border:none;border-radius:8px;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
.login-box button:hover{background:#2ea043}
.login-err{color:#f85149;font-size:13px;margin-top:10px;display:none}

/* Shell */
#shell{display:none;flex:1;flex-direction:column}
.topbar{background:#161b22;border-bottom:1px solid #30363d;padding:12px 24px;display:flex;align-items:center;gap:16px}
.topbar h1{font-size:17px;font-weight:700;color:#f0f6fc;flex:1}
.topbar span{font-size:13px;color:#8b949e}
.topbar button{padding:6px 14px;background:#21262d;border:1px solid #30363d;border-radius:6px;color:#c9d1d9;font-size:13px;cursor:pointer}
.topbar button:hover{background:#30363d}

.layout{display:flex;flex:1;overflow:hidden}
.sidebar{width:200px;background:#161b22;border-right:1px solid #30363d;padding:16px 0;flex-shrink:0}
.nav-item{padding:9px 20px;font-size:14px;cursor:pointer;border-radius:0;color:#8b949e;transition:background .15s,color .15s;user-select:none}
.nav-item:hover{background:#21262d;color:#c9d1d9}
.nav-item.active{background:#21262d;color:#58a6ff;border-left:3px solid #58a6ff}
.nav-section{padding:16px 20px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#484f58;font-weight:600}

.main{flex:1;overflow-y:auto;padding:24px}
.section{display:none}
.section.active{display:block}

/* Cards */
.card{background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;margin-bottom:20px}
.card h2{font-size:16px;font-weight:600;margin-bottom:16px;color:#f0f6fc}

/* Stats row */
.stats{display:flex;gap:16px;margin-bottom:24px}
.stat{background:#161b22;border:1px solid #30363d;border-radius:10px;padding:16px 24px;flex:1;text-align:center}
.stat .num{font-size:32px;font-weight:700;color:#58a6ff}
.stat .lbl{font-size:12px;color:#8b949e;margin-top:4px}

/* Table */
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:8px 12px;color:#8b949e;font-weight:600;border-bottom:1px solid #30363d;white-space:nowrap}
td{padding:8px 12px;border-bottom:1px solid #21262d;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#1c2128}

/* Badges */
.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}
.badge-green{background:#1a4731;color:#3fb950}
.badge-red{background:#4a1f1f;color:#f85149}
.badge-blue{background:#1b3a6b;color:#58a6ff}
.badge-grey{background:#21262d;color:#8b949e}
.badge-orange{background:#4a2f00;color:#e3b341}

/* Action buttons */
.actions{display:flex;gap:6px;flex-wrap:wrap}
.btn{padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid transparent;white-space:nowrap}
.btn-primary{background:#1f6feb;border-color:#1f6feb;color:#fff}
.btn-primary:hover{background:#388bfd}
.btn-danger{background:#4a1f1f;border-color:#f85149;color:#f85149}
.btn-danger:hover{background:#f85149;color:#fff}
.btn-success{background:#1a4731;border-color:#3fb950;color:#3fb950}
.btn-success:hover{background:#3fb950;color:#fff}
.btn-warning{background:#4a2f00;border-color:#e3b341;color:#e3b341}
.btn-warning:hover{background:#e3b341;color:#000}
.btn-grey{background:#21262d;border-color:#30363d;color:#c9d1d9}
.btn-grey:hover{background:#30363d}

/* Search bar */
.search-row{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
.search-row input{padding:8px 12px;background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#c9d1d9;font-size:13px;flex:1;min-width:140px;outline:none}
.search-row input:focus{border-color:#58a6ff}
.search-row button{padding:8px 16px;background:#238636;border:none;border-radius:8px;color:#fff;font-size:13px;cursor:pointer;font-weight:500}
.search-row button:hover{background:#2ea043}

/* Chat log */
.chat-log{background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:16px;max-height:500px;overflow-y:auto;font-size:13px;display:flex;flex-direction:column;gap:8px}
.chat-msg{padding:8px 12px;border-radius:8px;background:#161b22}
.chat-msg .meta{font-size:11px;color:#8b949e;margin-bottom:4px}
.chat-msg .meta strong{color:#58a6ff}
.chat-msg .body{color:#c9d1d9;line-height:1.5;word-break:break-word}
.chat-empty{color:#484f58;text-align:center;padding:40px;font-size:14px}

/* Online list */
.online-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.online-card{background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:14px}
.online-card .uname{font-weight:600;color:#3fb950;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.online-card .uname::before{content:'';width:8px;height:8px;border-radius:50%;background:#3fb950;display:inline-block}
.online-card .server{font-size:12px;color:#8b949e}

/* Modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:100;display:flex;align-items:center;justify-content:center}
.modal{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:28px;width:380px;max-width:90vw}
.modal h3{font-size:16px;font-weight:600;margin-bottom:16px;color:#f0f6fc}
.modal input{width:100%;padding:10px 12px;background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#c9d1d9;font-size:14px;margin-bottom:12px;outline:none}
.modal input:focus{border-color:#58a6ff}
.modal-btns{display:flex;gap:10px;justify-content:flex-end}
.modal-btns button{padding:8px 18px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:1px solid transparent}
.modal-cancel{background:#21262d;border-color:#30363d;color:#c9d1d9}
.modal-cancel:hover{background:#30363d}
.modal-confirm{background:#238636;border-color:#238636;color:#fff}
.modal-confirm:hover{background:#2ea043}
.modal-err{color:#f85149;font-size:13px;margin-bottom:10px;display:none}

/* Toast */
.toast{position:fixed;bottom:24px;right:24px;background:#238636;color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:200;opacity:0;transition:opacity .2s;pointer-events:none}
.toast.err{background:#b62324}
.toast.show{opacity:1}

#refresh-btn{animation:none}
</style>
</head>
<body>

<!-- Login -->
<div id="login-screen">
  <div class="login-box">
    <h1>&#x1F6E1; Bloxel Admin</h1>
    <p>Sign in with an admin account</p>
    <input id="l-user" type="text" placeholder="Username" autocomplete="username">
    <input id="l-pass" type="password" placeholder="Password" autocomplete="current-password">
    <button onclick="doLogin()">Sign In</button>
    <div class="login-err" id="l-err"></div>
  </div>
</div>

<!-- Shell -->
<div id="shell">
  <div class="topbar">
    <h1>&#x1F6E1; Bloxel Admin</h1>
    <span id="admin-name"></span>
    <button onclick="refreshCurrent()" id="refresh-btn">&#x21BB; Refresh</button>
    <button onclick="doLogout()">Sign Out</button>
  </div>
  <div class="layout">
    <div class="sidebar">
      <div class="nav-section">Overview</div>
      <div class="nav-item active" data-section="dashboard" onclick="nav(this)">&#x1F4CA; Dashboard</div>
      <div class="nav-item" data-section="online" onclick="nav(this)">&#x1F7E2; Online Now</div>
      <div class="nav-section">Management</div>
      <div class="nav-item" data-section="players" onclick="nav(this)">&#x1F465; Players</div>
      <div class="nav-section">Logs</div>
      <div class="nav-item" data-section="chat" onclick="nav(this)">&#x1F4AC; Chat Logs</div>
      <div class="nav-section">Broadcast</div>
      <div class="nav-item" data-section="announce" onclick="nav(this)">&#x1F4E2; Announcements</div>
    </div>
    <div class="main">

      <!-- Dashboard -->
      <div class="section active" id="s-dashboard">
        <div class="stats">
          <div class="stat"><div class="num" id="stat-total">—</div><div class="lbl">Total Players</div></div>
          <div class="stat"><div class="num" id="stat-online">—</div><div class="lbl">Online Now</div></div>
          <div class="stat"><div class="num" id="stat-banned">—</div><div class="lbl">Banned</div></div>
          <div class="stat"><div class="num" id="stat-admins">—</div><div class="lbl">Admins</div></div>
        </div>
        <div class="card">
          <h2>&#x1F7E2; Currently Online</h2>
          <div id="dash-online"><div class="chat-empty">Loading…</div></div>
        </div>
      </div>

      <!-- Online -->
      <div class="section" id="s-online">
        <div class="card">
          <h2>&#x1F7E2; Online Players</h2>
          <div id="online-grid" class="online-grid"><div class="chat-empty">Loading…</div></div>
        </div>
      </div>

      <!-- Players -->
      <div class="section" id="s-players">
        <div class="card">
          <h2>&#x1F465; All Players</h2>
          <div class="search-row">
            <input id="player-search" type="text" placeholder="Filter by username or email…" oninput="filterPlayers()">
          </div>
          <div class="tbl-wrap">
            <table id="players-table">
              <thead><tr>
                <th>ID</th><th>Username</th><th>Email</th>
                <th>Status</th><th>Joined</th><th>Actions</th>
              </tr></thead>
              <tbody id="players-body"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="section" id="s-announce">
        <div class="card">
          <h2>&#x1F4E2; Send Announcement</h2>
          <div style="display:flex;flex-direction:column;gap:12px">
            <textarea id="ann-msg" placeholder="Type your announcement message…" rows="4"
              style="width:100%;padding:10px 12px;background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#c9d1d9;font-size:14px;resize:vertical;outline:none;font-family:inherit"></textarea>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
              <input id="ann-target" type="text" placeholder="Username (leave blank to send to ALL players)"
                style="flex:1;min-width:200px;padding:9px 12px;background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#c9d1d9;font-size:13px;outline:none">
              <button onclick="sendAnnouncement()"
                style="padding:9px 22px;background:#238636;border:none;border-radius:8px;color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap">&#x1F4E4; Send</button>
            </div>
            <div id="ann-err" style="color:#f85149;font-size:13px;display:none"></div>
          </div>
        </div>
        <div class="card">
          <h2>&#x1F4CB; Recent Announcements</h2>
          <div id="ann-list"><div class="chat-empty">Loading…</div></div>
        </div>
      </div>

      <!-- Chat -->
      <div class="section" id="s-chat">
        <div class="card">
          <h2>&#x1F4AC; Chat Logs</h2>
          <div class="search-row">
            <input id="chat-u1" type="text" placeholder="Username (required)">
            <input id="chat-u2" type="text" placeholder="Other username (optional)">
            <button onclick="loadChat()">Search</button>
          </div>
          <div class="chat-log" id="chat-log"><div class="chat-empty">Enter a username above to load messages.</div></div>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal-bg" id="modal" style="display:none" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <h3 id="modal-title">Change Password</h3>
    <div class="modal-err" id="modal-err"></div>
    <input id="modal-input" type="password" placeholder="New password (min 6 chars)">
    <input id="modal-input2" type="text" placeholder="" style="display:none">
    <div class="modal-btns">
      <button class="modal-cancel" onclick="closeModal()">Cancel</button>
      <button class="modal-confirm" id="modal-confirm-btn" onclick="modalConfirm()">Confirm</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
let TOKEN = localStorage.getItem('bloxel_admin_token') || '';
let _players = [];
let _modalAction = null;
let _currentSection = 'dashboard';

// ── Init ────────────────────────────────────────────────────────────────────
if (TOKEN) tryRestoreSession();

async function tryRestoreSession() {
  const r = await api('GET', '/admin/api/online');
  if (r.ok) showShell(localStorage.getItem('bloxel_admin_user') || 'Admin');
  else { TOKEN = ''; localStorage.removeItem('bloxel_admin_token'); }
}

// ── Login ───────────────────────────────────────────────────────────────────
document.getElementById('l-pass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
document.getElementById('l-user').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('l-pass').focus(); });

async function doLogin() {
  const username = document.getElementById('l-user').value.trim();
  const password = document.getElementById('l-pass').value;
  const err = document.getElementById('l-err');
  err.style.display = 'none';
  if (!username || !password) { err.textContent='Fill in both fields'; err.style.display='block'; return; }
  const r = await fetch('/admin/api/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  }).then(x=>x.json()).catch(()=>({ok:false,error:'Network error'}));
  if (!r.ok) { err.textContent = r.error || 'Login failed'; err.style.display='block'; return; }
  TOKEN = r.token;
  localStorage.setItem('bloxel_admin_token', TOKEN);
  localStorage.setItem('bloxel_admin_user', r.username);
  showShell(r.username);
}

function showShell(username) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('shell').style.display = 'flex';
  document.getElementById('admin-name').textContent = username;
  loadSection('dashboard');
}

function doLogout() {
  TOKEN = '';
  localStorage.removeItem('bloxel_admin_token');
  localStorage.removeItem('bloxel_admin_user');
  document.getElementById('shell').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('l-pass').value = '';
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function nav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  _currentSection = el.dataset.section;
  document.getElementById('s-' + _currentSection).classList.add('active');
  loadSection(_currentSection);
}

function refreshCurrent() { loadSection(_currentSection); }

function loadSection(s) {
  if (s === 'dashboard') loadDashboard();
  else if (s === 'online')   loadOnline();
  else if (s === 'players')  loadPlayers();
  else if (s === 'announce') loadAnnouncements();
}

// ── API helper ───────────────────────────────────────────────────────────────
async function api(method, path, body) {
  const opts = { method, headers: { 'x-admin-token': TOKEN, 'Cache-Control': 'no-store' }, cache: 'no-store' };
  if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const url = method === 'GET' ? path + (path.includes('?') ? '&' : '?') + '_t=' + Date.now() : path;
  try {
    const r = await fetch(url, opts);
    const text = await r.text();
    try { return JSON.parse(text); } catch { return { ok: false, error: 'Server returned non-JSON: ' + text.slice(0, 200) }; }
  } catch (e) {
    return { ok: false, error: 'Network error: ' + e.message };
  }
}

// ── Dashboard ────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const [pRes, oRes] = await Promise.all([api('GET','/admin/api/players'), api('GET','/admin/api/online')]);
  if (pRes.ok) {
    const ps = pRes.players;
    document.getElementById('stat-total').textContent  = ps.length;
    document.getElementById('stat-banned').textContent = ps.filter(p=>p.banned).length;
    document.getElementById('stat-admins').textContent = ps.filter(p=>p.is_admin).length;
  }
  if (oRes.ok) {
    document.getElementById('stat-online').textContent = oRes.players.length;
    document.getElementById('dash-online').innerHTML = oRes.players.length
      ? oRes.players.map(p=>\`<span class="badge badge-green">&#x25CF; \${esc(p.username)}\${p.server_address?' — '+esc(p.server_address):''}</span> \`).join(' ')
      : '<div class="chat-empty">No players online right now.</div>';
  }
}

// ── Online ────────────────────────────────────────────────────────────────────
async function loadOnline() {
  const r = await api('GET', '/admin/api/online');
  const el = document.getElementById('online-grid');
  if (!r.ok) { el.innerHTML='<div class="chat-empty">Failed to load.</div>'; return; }
  if (!r.players.length) { el.innerHTML='<div class="chat-empty">No players online.</div>'; return; }
  el.innerHTML = r.players.map(p=>\`
    <div class="online-card">
      <div class="uname">\${esc(p.username)}</div>
      <div class="server">\${p.server_address ? '&#x1F5A5; '+esc(p.server_address)+':'+p.port : 'No server info'}</div>
    </div>
  \`).join('');
}

// ── Players ───────────────────────────────────────────────────────────────────
async function loadPlayers() {
  const r = await api('GET', '/admin/api/players');
  if (!r.ok) return;
  _players = r.players;
  renderPlayers(_players);
}

function filterPlayers() {
  const q = document.getElementById('player-search').value.toLowerCase();
  renderPlayers(q ? _players.filter(p => (p.username+p.email).toLowerCase().includes(q)) : _players);
}

function renderPlayers(list) {
  const tbody = document.getElementById('players-body');
  tbody.innerHTML = list.map(p => {
    const banned    = p.banned == 1;
    const voiceOff  = p.voice_disabled == 1;
    const isAdmin   = p.is_admin == 1;
    const badges = [];
    if (isAdmin)            badges.push('<span class="badge badge-blue">Admin</span>');
    if (banned)             badges.push('<span class="badge badge-red">Banned</span>');
    if (voiceOff)           badges.push('<span class="badge badge-orange">No Voice</span>');
    if (!isAdmin && !banned) badges.push('<span class="badge badge-green">Active</span>');
    const joined    = new Date(p.created_at).toLocaleDateString();
    const promBtn   = \`<button class="btn btn-grey" onclick="promote(\${p.id})">&#x2B06; Promote</button><button class="btn btn-grey" onclick="demote(\${p.id})">&#x2B07; Demote</button>\`;
    const banBtn    = \`<button class="btn btn-warning" onclick="ban(\${p.id})">&#x1F6AB; Ban</button><button class="btn btn-success" onclick="unban(\${p.id})">&#x2714; Unban</button>\`;
    const voiceBtn  = \`<button class="btn btn-warning" onclick="toggleVoice(\${p.id},0)">&#x1F507; Mute</button><button class="btn btn-success" onclick="toggleVoice(\${p.id},1)">&#x1F3A4; Unmute</button>\`;
    return \`<tr>
      <td style="color:#8b949e">\${p.id}</td>
      <td><strong>\${esc(p.username)}</strong></td>
      <td style="color:#8b949e">\${esc(p.email||'—')}</td>
      <td>\${badges.join(' ')}</td>
      <td style="color:#8b949e;white-space:nowrap">\${joined}</td>
      <td><div class="actions">
        <button class="btn btn-primary" onclick="openPasswordModal(\${p.id})">&#x1F512; Password</button>
        \${promBtn}\${banBtn}\${voiceBtn}
        <button class="btn btn-grey"    onclick="viewChatById(\${p.id})">&#x1F4AC; Chat</button>
        <button class="btn btn-danger"  onclick="deletePlayer(\${p.id})">&#x1F5D1; Delete</button>
      </div></td>
    </tr>\`;
  }).join('');
}

// ── Player actions ────────────────────────────────────────────────────────────
function _nameById(id) {
  return _players.find(x => x.id === id)?.username || String(id);
}

function ban(id) {
  const username = _nameById(id);
  document.getElementById('modal-title').textContent = \`Ban \${username}\`;
  document.getElementById('modal-input').style.display = 'none';
  document.getElementById('modal-input2').style.display = 'block';
  document.getElementById('modal-input2').placeholder = 'Ban reason (shown to player)';
  document.getElementById('modal-input2').value = '';
  document.getElementById('modal-err').style.display = 'none';
  document.getElementById('modal-confirm-btn').style.background = '#b62324';
  document.getElementById('modal-confirm-btn').textContent = 'Ban Player';
  _modalAction = async () => {
    const reason = document.getElementById('modal-input2').value.trim() || 'You have been banned.';
    const r = await api('POST', \`/admin/api/players/\${id}/ban\`, { reason });
    if (!r.ok) { showModalErr(r.error); return; }
    closeModal();
    toast(\`\${username} banned\`);
    loadPlayers();
  };
  document.getElementById('modal').style.display = 'flex';
  setTimeout(() => document.getElementById('modal-input2').focus(), 50);
}

async function unban(id) {
  const username = _nameById(id);
  const r = await api('POST', \`/admin/api/players/\${id}/unban\`);
  toast(r.ok ? \`\${username} unbanned\` : r.error, !r.ok);
  if (r.ok) loadPlayers();
}

async function promote(id) {
  const username = _nameById(id);
  if (!confirm(\`Promote \${username} to admin?\`)) return;
  const r = await api('POST', \`/admin/api/players/\${id}/promote\`);
  toast(r.ok ? \`\${username} is now an admin\` : r.error, !r.ok);
  if (r.ok) loadPlayers();
}

async function demote(id) {
  const username = _nameById(id);
  if (!confirm(\`Demote \${username} from admin?\`)) return;
  const r = await api('POST', \`/admin/api/players/\${id}/demote\`);
  toast(r.ok ? \`\${username} demoted\` : r.error, !r.ok);
  if (r.ok) loadPlayers();
}

async function toggleVoice(id, currentlyDisabled) {
  const r = await api('POST', \`/admin/api/players/\${id}/voice\`, { disabled: !currentlyDisabled });
  toast(r.ok ? (currentlyDisabled ? 'Voice enabled' : 'Voice disabled') : r.error, !r.ok);
  if (r.ok) loadPlayers();
}

async function deletePlayer(id) {
  const username = _nameById(id);
  if (!confirm(\`Permanently delete \${username}? This cannot be undone.\`)) return;
  const r = await api('POST', \`/admin/api/players/\${id}/delete\`);
  toast(r.ok ? \`\${username} deleted\` : r.error, !r.ok);
  if (r.ok) loadPlayers();
}

// ── Password modal ────────────────────────────────────────────────────────────
function openPasswordModal(id) {
  const username = _nameById(id);
  document.getElementById('modal-title').textContent = \`Change password — \${username}\`;
  document.getElementById('modal-input').style.display = 'block';
  document.getElementById('modal-input').type = 'password';
  document.getElementById('modal-input').value = '';
  document.getElementById('modal-input2').style.display = 'none';
  document.getElementById('modal-err').style.display = 'none';
  document.getElementById('modal-confirm-btn').style.background = '';
  document.getElementById('modal-confirm-btn').textContent = 'Confirm';
  _modalAction = async () => {
    const pw = document.getElementById('modal-input').value;
    if (pw.length < 6) { showModalErr('Minimum 6 characters'); return; }
    const r = await api('POST', \`/admin/api/players/\${id}/password\`, { password: pw });
    if (!r.ok) { showModalErr(r.error); return; }
    closeModal();
    toast(\`Password changed for \${username}\`);
  };
  document.getElementById('modal').style.display = 'flex';
  setTimeout(() => document.getElementById('modal-input').focus(), 50);
}

function showModalErr(msg) {
  const el = document.getElementById('modal-err');
  el.textContent = msg; el.style.display = 'block';
}
function closeModal() { document.getElementById('modal').style.display = 'none'; _modalAction = null; }
function modalConfirm() { if (_modalAction) _modalAction(); }
document.getElementById('modal-input').addEventListener('keydown', e => { if(e.key==='Enter') modalConfirm(); });

// ── Announcements ─────────────────────────────────────────────────────────────
async function sendAnnouncement() {
  const msg    = document.getElementById('ann-msg').value.trim();
  const target = document.getElementById('ann-target').value.trim();
  const err    = document.getElementById('ann-err');
  err.style.display = 'none';
  if (!msg) { err.textContent = 'Message cannot be empty'; err.style.display = 'block'; return; }
  const body = { message: msg };
  if (target) body.target_username = target;
  const r = await api('POST', '/admin/api/announce', body);
  if (!r.ok) { err.textContent = r.error || 'Failed to send'; err.style.display = 'block'; return; }
  document.getElementById('ann-msg').value = '';
  document.getElementById('ann-target').value = '';
  toast(target ? \`Announcement sent to \${target}\` : 'Announcement sent to all players');
  loadAnnouncements();
}

async function loadAnnouncements() {
  const el = document.getElementById('ann-list');
  el.innerHTML = '<div class="chat-empty">Loading…</div>';
  const r = await api('GET', '/admin/api/announcements');
  if (!r.ok) { el.innerHTML = \`<div class="chat-empty" style="color:#f85149">Error: \${esc(r.error||'Failed to load')}</div>\`; return; }
  const list = Array.isArray(r.announcements) ? r.announcements : [];
  if (!list.length) { el.innerHTML = '<div class="chat-empty">No recent announcements.</div>'; return; }
  el.innerHTML = list.map(a => {
    const t   = a.created_at ? new Date(a.created_at).toLocaleString() : '';
    const targetPlayer = a.target_user_id ? _players.find(p => p.id == a.target_user_id) : null;
    const who = targetPlayer ? \`&#x1F464; \${esc(targetPlayer.username)}\` : (a.target_user_id ? \`&#x1F464; user #\${a.target_user_id}\` : '&#x1F30D; All Players');
    return \`<div class="chat-msg" style="display:flex;align-items:flex-start;gap:12px">
      <div style="flex:1">
        <div class="meta">\${who} &nbsp;·&nbsp; \${t}</div>
        <div class="body">\${esc(a.message)}</div>
      </div>
      <button class="btn btn-danger" style="flex-shrink:0" onclick="deleteAnnouncement(\${a.id})">&#x1F5D1;</button>
    </div>\`;
  }).join('');
}

async function deleteAnnouncement(id) {
  const r = await api('POST', \`/admin/api/announcements/\${id}/delete\`);
  if (r.ok) loadAnnouncements();
}

// ── Chat logs ─────────────────────────────────────────────────────────────────
function viewChatById(id) {
  const p = _players.find(x => x.id === id);
  if (p) viewChat(p.username);
}

function viewChat(username) {
  nav(document.querySelector('[data-section="chat"]'));
  document.getElementById('chat-u1').value = username;
  document.getElementById('chat-u2').value = '';
  loadChat();
}

async function loadChat() {
  const u1 = document.getElementById('chat-u1').value.trim();
  const u2 = document.getElementById('chat-u2').value.trim();
  const log = document.getElementById('chat-log');
  if (!u1) { log.innerHTML = '<div class="chat-empty">Enter a username to search.</div>'; return; }
  log.innerHTML = '<div class="chat-empty">Loading…</div>';
  const params = new URLSearchParams({ user1: u1 });
  if (u2) params.set('user2', u2);
  const r = await api('GET', \`/admin/api/messages?\${params}\`);
  if (!r.ok) { log.innerHTML = '<div class="chat-empty">Error loading messages.</div>'; return; }
  if (!r.messages.length) { log.innerHTML = '<div class="chat-empty">No messages found.</div>'; return; }
  log.innerHTML = r.messages.map(m => {
    const t = m.created_at ? new Date(m.created_at).toLocaleString() : '';
    return \`<div class="chat-msg">
      <div class="meta"><strong>\${esc(m.from_username)}</strong> → <strong>\${esc(m.to_username)}</strong> &nbsp;·&nbsp; \${t}</div>
      <div class="body">\${esc(m.content)}</div>
    </div>\`;
  }).join('');
  log.scrollTop = log.scrollHeight;
}

document.getElementById('chat-u1').addEventListener('keydown', e => { if(e.key==='Enter') loadChat(); });
document.getElementById('chat-u2').addEventListener('keydown', e => { if(e.key==='Enter') loadChat(); });

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let _toastTimer;
function toast(msg, isErr=false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (isErr?' err':'') + ' show';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}
</script>
</body>
</html>`;
