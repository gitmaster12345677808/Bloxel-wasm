import { Router } from 'express';
import { get as httpsGet } from 'https';
import { lookup } from 'dns/promises';
import net from 'net';

const router = Router();

const MIME = {
  mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm',
  ogg: 'video/ogg', ogv: 'video/ogg', mov: 'video/quicktime',
  mkv: 'video/x-matroska', avi: 'video/x-msvideo',
};

function isPrivateIP(ip) {
  // Block private/loopback/link-local ranges
  return net.isIPv4(ip) && (
    /^10\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^127\./.test(ip) ||
    /^169\.254\./.test(ip) ||
    /^0\./.test(ip)
  );
}

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('url required');

  let parsed;
  try { parsed = new URL(url); } catch { return res.status(400).send('invalid url'); }
  if (parsed.protocol !== 'https:') return res.status(400).send('https only');

  // SSRF protection
  try {
    const { address } = await lookup(parsed.hostname);
    if (isPrivateIP(address)) return res.status(403).send('forbidden');
  } catch { return res.status(400).send('dns resolution failed'); }

  const ext  = parsed.pathname.split('.').pop().toLowerCase();
  const mime = MIME[ext] || 'video/mp4';
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  if (req.headers.range) headers['Range'] = req.headers.range;

  const proxyReq = httpsGet(url, { headers }, (upstream) => {
    const status = upstream.statusCode || 200;
    const outHeaders = { 'Content-Type': mime, 'Accept-Ranges': 'bytes' };
    if (upstream.headers['content-length'])  outHeaders['Content-Length']  = upstream.headers['content-length'];
    if (upstream.headers['content-range'])   outHeaders['Content-Range']   = upstream.headers['content-range'];
    res.writeHead(status, outHeaders);
    upstream.pipe(res);
  });

  proxyReq.on('error', () => res.status(502).send('upstream error'));
  req.on('close', () => proxyReq.destroy());
});

export default router;
