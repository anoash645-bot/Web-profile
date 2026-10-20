'use strict';
const fs = require('fs');
const path = require('path');
const profile = require('./data/profile.json');
const { renderHome, render404 } = require('./render');
const { renderCv } = require('./cv');
const siteUrl = require('./site');
const { robots, sitemap } = require('./seo');

const PUBLIC = path.join(__dirname, '..', 'public');
const MIME = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8' };
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};
const hits = new Map();

function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(body), ...SECURITY, ...extra });
  res.end(body);
}
const json = (res, status, obj) => send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store' });

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}
function readJson(req) {
  // Di Vercel, isi permintaan sudah dibaca dan tersedia di req.body.
  if (req.body !== undefined && req.body !== null) {
    try { return Promise.resolve(Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8') || '{}') : typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body); }
    catch { return Promise.reject(new Error('bad json')); }
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 10000) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('bad json')); } });
    req.on('error', reject);
  });
}
const clean = (v, max) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

async function save(entry) {
  let saved = false;
  const file = process.env.MESSAGES_FILE || path.join(__dirname, '..', 'data', 'messages.jsonl');
  try { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.appendFileSync(file, JSON.stringify(entry) + '\n'); saved = true; }
  catch { console.log('PESAN_BARU', JSON.stringify(entry)); }
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chat } = process.env;
  if (token && chat) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text: `Pesan baru dari website\nNama: ${entry.nama}\nPerihal: ${entry.perihal}\n\n${entry.pesan}` }) });
      if (r.ok) saved = true;
    } catch { /* abaikan */ }
  }
  return saved;
}

async function contact(req, res) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return json(res, 429, { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' });
  let d;
  try { d = await readJson(req); } catch { return json(res, 400, { error: 'Data tidak valid.' }); }
  if (d.website) return json(res, 200, { ok: true }); // jebakan bot
  const entry = { nama: clean(d.nama, 80), perihal: clean(d.perihal, 120), pesan: clean(d.pesan, 2000), waktu: new Date().toISOString() };
  if (entry.nama.length < 2 || entry.perihal.length < 3 || entry.pesan.length < 10) return json(res, 400, { error: 'Lengkapi nama, perihal, dan pesan (minimal 10 karakter).' });
  if (!(await save(entry))) return json(res, 503, { error: 'Server belum bisa menyimpan pesan.' });
  json(res, 200, { ok: true });
}

function serveStatic(req, res, pathname) {
  let file;
  try { file = path.normalize(path.join(PUBLIC, decodeURIComponent(pathname))); } catch { return false; }
  if (!file.startsWith(PUBLIC + path.sep)) return false;
  let st;
  try { st = fs.statSync(file); } catch { return false; }
  if (!st.isFile()) return false;
  const body = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'public, max-age=86400', ...SECURITY });
  res.end(req.method === 'HEAD' ? undefined : body);
  return true;
}

async function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');
  const site = siteUrl(req.headers.host);
  if (req.method === 'POST' && pathname === '/api/contact') return contact(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed', 'text/plain', { Allow: 'GET, HEAD, POST' });
  if (pathname === '/') return send(res, 200, renderHome(profile, site), undefined, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
  if (pathname === '/cv' || pathname === '/cv/') return send(res, 200, renderCv(profile, site), undefined, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
  if (pathname === '/robots.txt') return send(res, 200, robots(site), 'text/plain; charset=utf-8');
  if (pathname === '/sitemap.xml') return send(res, 200, sitemap(site), 'application/xml; charset=utf-8');
  if (pathname === '/healthz') return send(res, 200, 'ok', 'text/plain');
  if (serveStatic(req, res, pathname)) return;
  send(res, 404, render404(profile));
}

module.exports = { handler, contact };
