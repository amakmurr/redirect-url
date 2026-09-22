const express = require('express');

const app = express();

const IMAGE_REDIRECT_URL =
  'https://mekaripos-staging-cdn.mekari.io/attachments/18b508ac-4dd5-46fc-984d-3405a8e65d69/5a74a94b-99ab-4dd0-8728-fb91ad5f13d6?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg';

const IMAGE2_REDIRECT_URL =
  'https://mekaripos-staging-cdn.mekari.io/attachments/18b508ac-4dd5-46fc-984d-3405a8e65d69/c45cb40c-438f-4780-a7df-59128bc2af16?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg';

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/image.jpg', (req, res) => {
  res.redirect(301, IMAGE_REDIRECT_URL);
});

app.get('/image2.jpg', (req, res) => {
  res.redirect(301, IMAGE2_REDIRECT_URL);
});

const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;

app.get('/:path1/:path2.jpg', (req, res) => {
  const { path1, path2 } = req.params;

  if (!PATH_SEGMENT_PATTERN.test(path1) || !PATH_SEGMENT_PATTERN.test(path2)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const url = `https://mekaripos-staging-cdn.mekari.io/attachments/${path1}/${path2}?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg`;
  res.redirect(301, url);
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
