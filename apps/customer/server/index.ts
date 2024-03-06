import express, { Express } from 'express';
import compression from 'compression';
import { getInitialConfigState, serverRenderer } from './renderer';
import { getAxiosInstance } from './utils';
import { ConfigState } from '../src/configs/configSlice';

const PORT = process.env.PORT || 3006;
// eslint-disable-next-line
const app: Express = express();
// Compress all HTTP responses
// eslint-disable-next-line
app.use(compression());
// Ignore favicon
app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  next();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/sitemap.xml', async (req, res) => {
  const axios = getAxiosInstance(req);
  let config: ConfigState | undefined = undefined;
  try {
    config = await getInitialConfigState(axios);
    // eslint-disable-next-line no-empty
  } catch (err) {}

  if (config) {
    try {
      const sitemap = await axios.get(
        `https://velamy.s3.amazonaws.com/public/sitemaps/${config.siteId}/sitemap.xml`
      );
      // Set content type otherwise the sitemap will be considered invalid
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemap.data);
    } catch (error) {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
});
// eslint-disable-next-line
app.use(express.static('./build', { index: false }));
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-argument
app.get('/college-essay-topics/*', (req, res) => {
  const segments = req.url.trim().split('/');
  const slug = segments[segments.length - 1];
  res.set('location', `${req.protocol}://${req.headers.host}/blog/${slug}`);
  res.status(301).send();
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-argument, sonarjs/no-identical-functions
app.get('/college-essay-examples/*', (req, res) => {
  const segments = req.url.trim().split('/');
  const slug = segments[segments.length - 1];
  res.set('location', `${req.protocol}://${req.headers.host}/blog/${slug}`);
  res.status(301).send();
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-argument
app.get('*', serverRenderer);
app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
