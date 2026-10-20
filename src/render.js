'use strict';
const icons = require('./icons');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const timeline = (items) => `<ol class="tl">${items.map((i) => `<li><time>${esc(i.time)}</time><h3>${esc(i.title)}</h3>${i.desc ? `<p>${esc(i.desc)}</p>` : ''}</li>`).join('')}</ol>`;
const section = (id, title, lead, body) => `<section id="${id}"><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}${body}</section>`;

function contacts(p) {
  const list = [
    ['whatsapp', 'WhatsApp', `https://wa.me/${p.whatsapp}`, 'Chat WhatsApp'],
    ['instagram', 'Instagram', `https://www.instagram.com/${p.instagram}`, 'Buka Instagram'],
    ['facebook', 'Facebook', p.facebook, 'Buka Facebook'],
    ['email', 'Email', `mailto:${p.email}`, 'Kirim email'],
  ];
  return `<ul class="cl">${list.map(([k, n, href, label]) => `<li><a href="${esc(href)}" target="_blank" rel="noopener" aria-label="${label}"><div class="ic" style="${icons[k].style}">${icons[k].svg}</div><div class="tx"><b>${n}</b></div></a></li>`).join('')}</ul>`;
}

function project(j) {
  return `<div class="card proj real"><h3>${esc(j.title)}</h3><p>${esc(j.desc)}</p><div class="tags">${j.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>${j.url ? `<a class="plink" href="${esc(j.url)}" target="_blank" rel="noopener">Buka website &rarr;</a>` : ''}</div>`;
}

function renderHome(p, site) {
  const title = `${p.shortName} Longdong, ${p.degree} | ${p.role} di ${p.city}`;
  const desc = `${p.shortName} Longdong, ${p.role} dari ${p.city}. Lulusan D-4 Teknik Informatika Politeknik Negeri Manado dengan sertifikasi BNSP. Lihat proyek, pengalaman, dan cara menghubungi.`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Person', name: p.name, honorificSuffix: p.degree, jobTitle: p.role,
    url: site, image: `${site}/images/richo.jpg`, email: `mailto:${p.email}`,
    address: { '@type': 'PostalAddress', addressLocality: p.city, addressRegion: p.region, addressCountry: 'ID' },
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Politeknik Negeri Manado' }],
    knowsAbout: p.skills.map((s) => s.name),
    sameAs: [`https://www.instagram.com/${p.instagram}`, p.facebook],
  };
  const s = esc(site);
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(p.name)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0A2533">
<link rel="canonical" href="${s}/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website"><meta property="og:locale" content="id_ID"><meta property="og:site_name" content="${esc(p.shortName)} Longdong">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${s}/">
<meta property="og:image" content="${s}/images/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
<header class="top"><div class="wrap">
<a class="logo" href="/"><img class="mono" src="/images/richo.jpg" alt="Foto ${esc(p.shortName)}">${esc(p.shortName)} Longdong</a>
<nav><a href="#keahlian">Keahlian</a><a href="#sertifikasi">Sertifikasi</a><a href="#pengalaman">Pengalaman</a><a href="#pendidikan">Pendidikan</a><a href="#proyek">Proyek</a><a href="${esc(p.cvUrl)}">CV</a><a class="cta" href="#kontak">Hubungi saya</a></nav>
</div></header>
<main class="wrap">
<div class="hero">
<div>
<div class="status"><span class="dot"></span>Terbuka untuk proyek dan kolaborasi</div>
<h1>${esc(p.tagline)}</h1>
<p>${esc(p.intro)}</p>
<div class="btns"><a class="btn main" href="#kontak">Kirim pesan</a><a class="btn wa" href="https://wa.me/${p.whatsapp}?text=Halo%20Richo%2C%20saya%20melihat%20website%20profil%20Anda." target="_blank" rel="noopener">Chat via WhatsApp</a><a class="btn" href="#proyek">Lihat proyek</a><a class="btn" href="${esc(p.cvUrl)}">Lihat CV</a></div>
</div>
<aside class="card profile" aria-label="Ringkasan profil">
<div class="head"><img class="avatar" src="/images/richo.jpg" alt="Foto ${esc(p.name)}" width="68" height="68"><div><h3>${esc(p.shortName)} Longdong, ${esc(p.degree)}</h3><span>${esc(p.role)}</span></div></div>
<ul class="facts"><li><span>Lokasi</span><span>${esc(p.city)}, Indonesia</span></li><li><span>Sertifikasi</span><span>BNSP, Junior Web Developer</span></li><li><span>Fokus</span><span>JavaScript, HTML, CSS</span></li><li><span>Status</span><span>Tersedia</span></li></ul>
</aside>
</div>
${section('keahlian', 'Keahlian', 'Teknologi yang saya pakai untuk membangun dan merapikan website.', `<div class="skills">${p.skills.map((k) => `<div class="card skill"><i>${esc(k.icon)}</i><h3>${esc(k.name)}</h3><p>${esc(k.desc)}</p></div>`).join('')}</div>`)}
${section('sertifikasi', 'Sertifikasi', 'Kemampuan saya diuji dan diakui secara resmi.', p.certifications.map((c) => `<div class="card cert"><div class="seal">${esc(c.badge)}</div><div><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p></div></div>`).join(''))}
${section('pengalaman', 'Pengalaman', 'Pengalaman kerja nyata di instansi pemerintah.', timeline(p.experience))}
${section('pendidikan', 'Pendidikan', 'Perjalanan belajar saya, dari sekolah dasar sampai perguruan tinggi.', timeline(p.education))}
${section('proyek', 'Proyek', 'Karya yang pernah saya bangun.', `<div class="projects">${p.projects.map(project).join('')}</div>`)}
<section id="kontak" class="contact">
<div><h2>Mari bekerja sama</h2><p class="lead">Tulis nama dan keperluan Anda, pesan akan langsung sampai ke saya dan saya balas secepatnya.</p></div>
<form id="f" class="card" data-email="${esc(p.email)}" novalidate>
<label>Nama Anda<input id="nama" name="nama" autocomplete="name" maxlength="80" placeholder="Contoh: Budi Santoso" required></label>
<label>Perihal<input id="perihal" name="perihal" maxlength="120" placeholder="Contoh: Tawaran pembuatan website" required></label>
<label>Pesan<textarea id="pesan" name="pesan" maxlength="2000" placeholder="Tulis keperluan Anda di sini" required></textarea></label>
<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<p class="err" id="status" role="status"></p>
<div class="fbtns"><button type="submit" class="btn main">Kirim pesan</button><a class="btn" id="alt" href="mailto:${esc(p.email)}">Kirim lewat email</a></div>
</form>
</section>
</main>
<footer><div class="wrap"><h2 class="kt">Kontak saya</h2><p class="ks">Pilih salah satu cara di bawah untuk menghubungi saya.</p>${contacts(p)}<p class="copy">&copy; ${new Date().getFullYear()} ${esc(p.name)}. Dibuat di ${esc(p.city)}.</p></div></footer>
<script src="/js/app.js" defer></script>
</body>
</html>`;
}

const render404 = (p) => `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Halaman tidak ditemukan | ${esc(p.shortName)} Longdong</title><link rel="stylesheet" href="/css/style.css"></head><body><main class="wrap" style="padding:96px 0"><h1>404</h1><p class="lead">Halaman yang Anda cari tidak ada.</p><a class="btn main" href="/">Kembali ke beranda</a></main></body></html>`;

module.exports = { renderHome, render404, esc };
