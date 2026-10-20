'use strict';

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { createServer } = require('../src/server');

function get(port, urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: urlPath }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      })
      .on('error', reject);
  });
}

test('GET /health tra ve 200 va status ok', async () => {
  const server = createServer().listen(0);
  const { port } = server.address();
  const res = await get(port, '/health');
  server.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(JSON.parse(res.body).status, 'ok');
});

test('GET /api/info tra ve loi chao, phien ban va hostname', async () => {
  const server = createServer().listen(0);
  const { port } = server.address();
  const res = await get(port, '/api/info');
  server.close();
  const info = JSON.parse(res.body);
  assert.strictEqual(res.status, 200);
  assert.ok(info.greeting.length > 0);
  assert.ok(info.version.length > 0);
  assert.ok(info.hostname.length > 0);
});

test('Duong dan khong ton tai tra ve 404', async () => {
  const server = createServer().listen(0);
  const { port } = server.address();
  const res = await get(port, '/khong-co');
  server.close();
  assert.strictEqual(res.status, 404);
});
