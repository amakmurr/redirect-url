const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server');

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(() => {
  server.close();
});

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${baseUrl}${path}`, (res) => {
        res.resume();
        res.on('end', () => resolve(res));
      })
      .on('error', reject);
  });
}

test('no origin redirects to the default base with 302', async () => {
  const res = await get('/c1/u1.jpg');
  assert.equal(res.statusCode, 302);
  assert.equal(
    res.headers.location,
    'https://mekaripos-staging-cdn.mekari.io/attachments/c1/u1?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg'
  );
});

test('allowed origin (default host) redirects with 302', async () => {
  const res = await get(
    '/c1/u1.jpg?origin=https://mekaripos-staging-cdn.mekari.io/attachments'
  );
  assert.equal(res.statusCode, 302);
});

test('allowed origin (mekari.com subdomain) redirects with 302', async () => {
  const res = await get(
    `/c1/u1.jpg?origin=${encodeURIComponent('https://cdn.mekari.com/attachments')}`
  );
  assert.equal(res.statusCode, 302);
});

test('host that merely ends with the allowed suffix is rejected (400)', async () => {
  const res = await get(
    `/c1/u1.jpg?origin=${encodeURIComponent('https://mekari.io.evil.example/x')}`
  );
  assert.equal(res.statusCode, 400);
});

test('disallowed host is rejected (400)', async () => {
  const res = await get(
    `/c1/u1.jpg?origin=${encodeURIComponent('https://evil.example/x')}`
  );
  assert.equal(res.statusCode, 400);
});

test('non-http(s) scheme is rejected (400)', async () => {
  const res = await get(`/c1/u1.jpg?origin=${encodeURIComponent('javascript:alert(1)')}`);
  assert.equal(res.statusCode, 400);
});

test('malformed origin is rejected (400)', async () => {
  const res = await get(`/c1/u1.jpg?origin=${encodeURIComponent('not a url')}`);
  assert.equal(res.statusCode, 400);
});

test('invalid path segment is rejected (400)', async () => {
  const res = await get('/c%201/u1.jpg');
  assert.equal(res.statusCode, 400);
});
