const express = require('express');

const app = express();

const DEFAULT_ORIGIN = 'https://mekaripos-staging-cdn.mekari.io/attachments';

const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;

function resolveOrigin(rawOrigin) {
  if (!rawOrigin) {
    return DEFAULT_ORIGIN;
  }

  let parsed;
  try {
    parsed = new URL(rawOrigin);
  } catch {
    return DEFAULT_ORIGIN;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return DEFAULT_ORIGIN;
  }

  return rawOrigin.replace(/\/+$/, '');
}

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/:path1/:path2.jpg', (req, res) => {
  const { path1, path2 } = req.params;

  if (!PATH_SEGMENT_PATTERN.test(path1) || !PATH_SEGMENT_PATTERN.test(path2)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const origin = resolveOrigin(req.query.origin);
  const url = `${origin}/${path1}/${path2}?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg`;
  res.redirect(301, url);
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
