'use strict';
const http = require('http');
const { handler } = require('./src/handler');

const server = http.createServer((req, res) => handler(req, res).catch((err) => { console.error(err); res.writeHead(500); res.end('Terjadi kesalahan server'); }));
if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
}
module.exports = server;
