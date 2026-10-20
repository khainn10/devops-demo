'use strict';

const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const VERSION = process.env.APP_VERSION || 'dev';

// Doc loi chao tu tep greeting.txt (de thay doi noi dung ma khong sua ma nguon)
function readGreeting() {
  return fs.readFileSync(path.join(__dirname, 'greeting.txt'), 'utf8').trim();
}

// Thong tin tra ve cho nguoi goi: loi chao, phien ban va ten may (container)
function buildInfo() {
  return { greeting: readGreeting(), version: VERSION, hostname: os.hostname() };
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      return sendJson(res, 200, { status: 'ok' });
    }
    if (req.url === '/' || req.url === '/api/info') {
      return sendJson(res, 200, buildInfo());
    }
    return sendJson(res, 404, { error: 'not found' });
  });
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`devops-demo ${VERSION} dang chay tai cong ${PORT}`);
  });
}

module.exports = { createServer, buildInfo };
