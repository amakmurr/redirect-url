const express = require('express');

const app = express();

const IMAGE_REDIRECT_URL =
  'https://mekaripos-staging-cdn.mekari.io/attachments/18b508ac-4dd5-46fc-984d-3405a8e65d69/5a74a94b-99ab-4dd0-8728-fb91ad5f13d6?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg';

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/image.jpg', (req, res) => {
  res.redirect(301, IMAGE_REDIRECT_URL);
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
