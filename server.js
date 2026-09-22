const express = require('express');

const app = express();

const DEFAULT_ORIGIN = 'https://mekaripos-staging-cdn.mekari.io/attachments';
const DEFAULT_TRANSFORM = 'x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg';
const DEFAULT_ALLOWED_ORIGIN_HOSTS = 'mekari.io,mekari.com';
const REDIRECT_CACHE_CONTROL = 'public, max-age=300';

const IMAGE_TRANSFORM = process.env.IMAGE_TRANSFORM || DEFAULT_TRANSFORM;

const ALLOWED_ORIGIN_HOSTS = (
  process.env.ALLOWED_ORIGIN_HOSTS || DEFAULT_ALLOWED_ORIGIN_HOSTS
)
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;

function isAllowedHost(hostname) {
  return ALLOWED_ORIGIN_HOSTS.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

// Returns { origin } on success, or { error } when `rawOrigin` was present but invalid.
function resolveOrigin(rawOrigin) {
  if (rawOrigin === undefined) {
    return { origin: DEFAULT_ORIGIN };
  }

  if (typeof rawOrigin !== 'string' || rawOrigin.trim() === '') {
    return { error: 'origin must be a non-empty string' };
  }

  let parsed;
  try {
    parsed = new URL(rawOrigin);
  } catch {
    return { error: 'origin must be a valid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: 'origin must use http or https' };
  }

  if (!isAllowedHost(parsed.hostname)) {
    return { error: 'origin host is not allowed' };
  }

  return { origin: rawOrigin.replace(/\/+$/, '') };
}

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/:path1/:path2.jpg', (req, res) => {
  const { path1, path2 } = req.params;

  if (!PATH_SEGMENT_PATTERN.test(path1) || !PATH_SEGMENT_PATTERN.test(path2)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const resolved = resolveOrigin(req.query.origin);
  if (resolved.error) {
    return res.status(400).json({ error: resolved.error });
  }

  const url = `${resolved.origin}/${path1}/${path2}?${IMAGE_TRANSFORM}`;
  res.set('Cache-Control', REDIRECT_CACHE_CONTROL);
  res.redirect(302, url);
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
