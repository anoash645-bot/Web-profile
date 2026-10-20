'use strict';
// Fungsi serverless Vercel untuk form kontak: POST /api/contact
const { contact } = require('../src/handler');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Method Not Allowed');
  }
  return contact(req, res).catch((err) => { console.error(err); res.statusCode = 500; res.end('Terjadi kesalahan server'); });
};
