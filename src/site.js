'use strict';
// Menentukan alamat situs: SITE_URL, lalu alamat produksi Vercel, lalu host permintaan.
module.exports = function siteUrl(host) {
  const e = process.env;
  let u = e.SITE_URL || (e.VERCEL_PROJECT_PRODUCTION_URL ? `https://${e.VERCEL_PROJECT_PRODUCTION_URL}` : '') || (host ? `http://${host}` : 'http://localhost:3000');
  if (!/^https?:\/\//.test(u)) u = `https://${u}`;
  return u.replace(/\/+$/, '');
};
