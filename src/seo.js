'use strict';
const robots = (site) => `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;
const sitemap = (site) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url><url><loc>${site}/cv</loc><changefreq>monthly</changefreq><priority>0.8</priority></url></urlset>\n`;
module.exports = { robots, sitemap };
