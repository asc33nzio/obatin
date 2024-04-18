const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/auth') {
      res.writeHead(302, { Location: '/auth/login' });
      res.end();
      return;
    }

    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    const port = process.env.PORT;
    if (isNaN(port) || port === '')
      throw new Error('Please assign a designated port number in the env');
    if (err) throw err;

    console.log(`
    ▲ Next.js 14.1.4
    - Local:        http://localhost:${port}
    `);
  });
});
