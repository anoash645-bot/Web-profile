'use strict';
// Membuat halaman statis (index, cv, 404, robots, sitemap) ke folder public untuk di-host di Vercel.
const fs = require('fs');
const path = require('path');
const profile = require('../src/data/profile.json');
const { renderHome, render404 } = require('../src/render');
const { renderCv } = require('../src/cv');
const { robots, sitemap } = require('../src/seo');
const site = require('../src/site')();

const out = process.env.OUT_DIR || path.join(__dirname, '..', 'public');
fs.mkdirSync(out, { recursive: true });
const files = {
  'index.html': renderHome(profile, site),
  'cv.html': renderCv(profile, site),
  '404.html': render404(profile),
  'robots.txt': robots(site),
  'sitemap.xml': sitemap(site),
};
for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(out, name), content);
console.log(`Build selesai (${site}): ${Object.keys(files).join(', ')}`);
