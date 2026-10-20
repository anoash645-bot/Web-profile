'use strict';
const { esc } = require('./render');

function renderCv(p, site) {
  const c = p.cv;
  const s = esc(site);
  const title = `CV ${p.shortName} Longdong, ${p.degree} | ${p.role}`;
  const desc = `Curriculum vitae ${p.name}, ${p.degree}. ${p.role} dari ${p.city}, lulusan D-4 Teknik Informatika Politeknik Negeri Manado.`;
  const experience = c.experience.map((e) => `<div class="item"><div class="top"><b>${esc(e.role)}</b><time>${esc(e.time)}</time></div><div class="sub">${esc(e.place)}</div><p>${esc(e.desc)}</p></div>`).join('');
  const projects = c.projects.map((j) => `<div class="item"><div class="top"><b>${esc(j.title)}${j.tag ? `<span class="tag">${esc(j.tag)}</span>` : ''}</b></div><p>${esc(j.desc)}${j.url ? ` <a href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : ''}</p></div>`).join('');
  const education = p.education.map((e) => `<div class="item"><div class="top"><b>${esc(e.title)}</b><time>${esc(e.time)}</time></div>${e.desc ? `<div class="sub">${esc(e.desc)}</div>` : ''}</div>`).join('');
  const cert = p.certifications.map((x) => `<b>${esc(x.title)}</b><span>${esc(x.desc)}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${s}/cv">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="profile"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${s}/cv"><meta property="og:image" content="${s}/images/og-image.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/cv.css">
</head>
<body>
<div class="toolbar"><a class="back" href="/">&larr; Kembali ke profil</a><button type="button" id="print">Cetak / Simpan PDF</button></div>
<div class="sheet">
<aside>
<img class="photo" src="/images/richo-cv.jpg" alt="Foto ${esc(p.name)}">
<section><h2>KONTAK</h2><ul class="ct">
<li><small>Email</small><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>
<li><small>WhatsApp</small><a href="https://wa.me/${esc(p.whatsapp)}">${esc(p.whatsappLabel)}</a></li>
<li><small>Instagram</small><a href="https://www.instagram.com/${esc(p.instagram)}">@${esc(p.instagram)}</a></li>
<li><small>Facebook</small><a href="${esc(p.facebook)}">Richo Ashano</a></li>
<li><small>Lokasi</small><span>${esc(p.city)}, ${esc(p.region)}</span></li>
</ul></section>
<section><h2>KEAHLIAN</h2><p class="sg">Pemrograman dan web</p><ul class="sk">${p.skills.map((k) => `<li>${esc(k.name)}</li>`).join('')}</ul><p class="sg" style="margin-top:12px">Microsoft Office</p><ul class="sk">${c.office.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></section>
<section class="cert"><h2>SERTIFIKASI</h2>${cert}</section>
<section><h2>KEUNGGULAN</h2><ul class="ad">${c.strengths.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></section>
</aside>
<main>
<h1>${esc(p.name)}, ${esc(p.degree)}</h1>
<p class="role">${esc(p.role)}</p>
<section><h2>PROFIL</h2><p>${esc(c.summary)}</p></section>
<section><h2>PENGALAMAN</h2>${experience}</section>
<section><h2>PROYEK</h2>${projects}</section>
<section><h2>PENDIDIKAN</h2>${education}</section>
</main>
</div>
<script src="/js/cv.js" defer></script>
</body>
</html>`;
}

module.exports = { renderCv };
