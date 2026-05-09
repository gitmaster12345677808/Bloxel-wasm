import 'dotenv/config';
import { createServer }              from 'https';
import { readFileSync, writeFileSync,
         existsSync, mkdirSync }      from 'fs';
import { fileURLToPath }              from 'url';
import { dirname, join }              from 'path';
import { spawn }                      from 'child_process';
import selfsigned                     from 'selfsigned';
import express                        from 'express';
import cors                           from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { SERVER_PORT, WS_PROXY_PORT } from './config.js';
import { getPool }                    from './db.js';
import authRouter                     from './routes/auth.js';
import friendsRouter                  from './routes/friends.js';
import panelsRouter                   from './routes/panels.js';
import videoProxyRouter               from './routes/videoProxy.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Self-signed TLS cert (generated once, reused) ──────────────────────────
function loadCerts() {
  const certsDir = join(__dirname, 'certs');
  const keyPath  = join(certsDir, 'key.pem');
  const certPath = join(certsDir, 'cert.pem');

  if (!existsSync(keyPath) || !existsSync(certPath)) {
    console.log('[bloxel] Generating self-signed TLS certificate...');
    mkdirSync(certsDir, { recursive: true });
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems  = selfsigned.generate(attrs, { days: 3650, keySize: 2048 });
    writeFileSync(keyPath,  pems.private);
    writeFileSync(certPath, pems.cert);
    console.log('[bloxel] Cert saved to server/certs/');
  }

  return {
    key:  readFileSync(keyPath),
    cert: readFileSync(certPath),
  };
}

// ── Express app ────────────────────────────────────────────────────────────
const app = express();

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy',   'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth',        authRouter);
app.use('/api/friends',     friendsRouter);
app.use('/api/panels',      panelsRouter);
app.use('/api/video-proxy', videoProxyRouter);
app.get('/health', (_, res) => res.json({ ok: true }));

// Serve built game from server/public/
const publicDir = join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback — send index.html for any non-API, non-file request
app.get('*', (req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

// ── HTTPS server ───────────────────────────────────────────────────────────
const creds  = loadCerts();
const server = createServer(creds, app);

// ── Spawn original proxy (unchanged) on its own port ──────────────────────
const PROXY_PORT = WS_PROXY_PORT;
const proxyDir   = join(__dirname, 'ws');
const proxyProc  = spawn(process.execPath, ['main.js'], {
  cwd: proxyDir,
  stdio: 'inherit',
});
proxyProc.on('exit', code => console.log(`[proxy] process exited (${code})`));

// ── WSS relay: browser → wss://.../proxy → ws://localhost:8888 ────────────
const wss = new WebSocketServer({ server, path: '/proxy' });
wss.on('connection', (browser, request) => {
  const clientIp = request.socket.remoteAddress || '127.0.0.1';
  const upstream = new WebSocket(`ws://localhost:${PROXY_PORT}`, {
    headers: { 'x-forwarded-for': clientIp },
  });
  const queue = [];
  upstream.on('open', () => {
    for (const [data, binary] of queue) upstream.send(data, { binary });
    queue.length = 0;
  });
  upstream.on('message', (data, isBinary) => {
    if (browser.readyState === WebSocket.OPEN) browser.send(data, { binary: isBinary });
  });
  upstream.on('close', () => browser.close());
  upstream.on('error', () => browser.close());
  browser.on('message', (data, isBinary) => {
    if (upstream.readyState === WebSocket.OPEN) upstream.send(data, { binary: isBinary });
    else queue.push([data, isBinary]);
  });
  browser.on('close', () => upstream.close());
  browser.on('error', () => upstream.close());
});

// ── Start ──────────────────────────────────────────────────────────────────
server.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`[bloxel] Listening on https://0.0.0.0:${SERVER_PORT}`);
  console.log(`[bloxel] WS proxy at   wss://0.0.0.0:${SERVER_PORT}/proxy`);
});

getPool()
  .then(() => console.log('[bloxel] DB connected'))
  .catch(e  => { console.error('[bloxel] DB failed:', e.message); process.exit(1); });
