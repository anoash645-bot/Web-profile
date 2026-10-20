'use strict';
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
process.env.MESSAGES_FILE = path.join(os.tmpdir(), `pesan-${Date.now()}.jsonl`);
process.env.SITE_URL = 'https://contoh.vercel.app';
const server = require('../server');

let base;
test.before(() => new Promise((ok) => server.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); })));
test.after(() => server.close());
const post = (body) => fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('beranda berisi SEO dasar', async () => {
  const r = await fetch(base + '/'); const html = await r.text();
  assert.equal(r.status, 200);
  for (const s of ['<title>', 'rel="canonical" href="https://contoh.vercel.app/"', 'application/ld+json', 'og:image', 'Smart Absensi']) assert.ok(html.includes(s), s);
});
test('robots dan sitemap memakai SITE_URL', async () => {
  assert.ok((await (await fetch(base + '/robots.txt')).text()).includes('https://contoh.vercel.app/sitemap.xml'));
  assert.ok((await (await fetch(base + '/sitemap.xml')).text()).includes('<loc>https://contoh.vercel.app/</loc>'));
});
test('file statis dilayani dan path traversal ditolak', async () => {
  assert.equal((await fetch(base + '/css/style.css')).status, 200);
  assert.equal((await fetch(base + '/..%2f..%2fetc%2fpasswd')).status, 404);
  assert.equal((await fetch(base + '/tidak-ada')).status, 404);
});
test('form kontak: valid, tidak valid, dan jebakan bot', async () => {
  assert.equal((await post({ nama: 'Budi', perihal: 'Tawaran proyek', pesan: 'Halo, saya ingin membuat website.' })).status, 200);
  assert.equal((await post({ nama: 'B', perihal: 'x', pesan: 'pendek' })).status, 400);
  assert.equal((await post({ website: 'spam', nama: 'Bot', perihal: 'spam', pesan: 'spam spam spam' })).status, 200);
});

test('halaman CV disajikan dari website sendiri dan terhubung ke beranda', async () => {
  const home = await (await fetch(base + '/')).text();
  assert.ok(home.includes('href="/cv"') && !home.includes('claude.ai'));
  const r = await fetch(base + '/cv'); const html = await r.text();
  assert.equal(r.status, 200);
  for (const s of ['href="/">&larr; Kembali ke profil', 'Microsoft Office', 'S.Tr.Kom', 'rel="canonical" href="https://contoh.vercel.app/cv"']) assert.ok(html.includes(s), s);
  assert.ok((await (await fetch(base + '/sitemap.xml')).text()).includes('https://contoh.vercel.app/cv'));
  assert.equal((await fetch(base + '/js/cv.js')).status, 200);
});

test('build menghasilkan halaman statis dengan alamat situs yang benar', () => {
  const { execFileSync } = require('child_process'); const fs = require('fs');
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'build-'));
  execFileSync('node', [path.join(__dirname, '..', 'scripts', 'build.js')], { env: { ...process.env, OUT_DIR: out } });
  for (const f of ['index.html', 'cv.html', '404.html', 'robots.txt', 'sitemap.xml']) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(fs.readFileSync(path.join(out, 'cv.html'), 'utf8').includes('rel="canonical" href="https://contoh.vercel.app/cv"'));
});

test('fungsi Vercel /api/contact menerima req.body yang sudah diparse', async () => {
  const fn = require('../api/contact');
  const run = (req) => new Promise((ok) => { const res = { headers: {}, writeHead(s, h) { this.status = s; Object.assign(this.headers, h); }, setHeader() {}, end(b) { ok({ status: this.status || this.statusCode, body: b }); } }; fn(req, res); });
  const base0 = { headers: {}, socket: { remoteAddress: '9.9.9.9' } };
  assert.equal((await run({ ...base0, method: 'GET' })).status, 405);
  assert.equal((await run({ ...base0, method: 'POST', body: { nama: 'Siti', perihal: 'Kerja sama', pesan: 'Halo, tertarik bekerja sama.' } })).status, 200);
  assert.equal((await run({ ...base0, method: 'POST', body: { nama: 'S' } })).status, 400);
});
